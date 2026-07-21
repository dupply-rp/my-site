import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildFallbackReport,
  allQuestions,
  TOTAL_QUESTIONS,
  calcPillars,
  calcScore,
  getScoreInfo,
} from '@dupply/diagnostico'
import { fetchDiagnosticoFromApi } from '../fetchDiagnosticoApi'
import { IS_TURNSTILE_ENABLED } from '../turnstileConfig'
import type { Answers, DiagnosticoReport, DiagnosticoScreen } from '../types'
import { trackConversion, trackEvent } from '../../../lib/analytics'
import { clearDiagnosticoDraft, loadDiagnosticoDraft, saveDiagnosticoDraft } from '../draftStorage'
import { getQuestionSectionMeta } from '../sectionMeta'
import { validateContactFields } from '../validateContact'
import { validateTextareaField } from '../validateTextarea'

export function useDiagnostico() {
  const initialDraft = useMemo(() => loadDiagnosticoDraft(), [])
  const [screen, setScreen] = useState<DiagnosticoScreen>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [securityError, setSecurityError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [report, setReport] = useState<DiagnosticoReport | null>(null)
  const [hasDraft, setHasDraft] = useState(() => Boolean(initialDraft))

  const currentQuestion = allQuestions[currentIndex]
  const progressPct = Math.round((currentIndex / TOTAL_QUESTIONS) * 100)
  const sectionMeta = getQuestionSectionMeta(currentIndex)
  const draftProgressPct = initialDraft
    ? Math.round((initialDraft.currentIndex / TOTAL_QUESTIONS) * 100)
    : 0

  useEffect(() => {
    if (screen !== 'quiz') return
    saveDiagnosticoDraft({ currentIndex, answers })
    setHasDraft(true)
  }, [screen, currentIndex, answers])

  useEffect(() => {
    if (screen !== 'quiz') return
    const meta = getQuestionSectionMeta(currentIndex)
    trackEvent('diagnostico_step_view', {
      step_index: currentIndex + 1,
      step_id: meta.questionId,
      section: meta.sectionLabel,
      section_index: meta.sectionIndex,
      progress_pct: Math.round((currentIndex / TOTAL_QUESTIONS) * 100),
      test_mode: false,
    })
  }, [screen, currentIndex])

  const generateReport = useCallback(async (finalAnswers: Answers, token?: string | null) => {
    setScreen('loading')
    setSecurityError(null)

    const apiResult = await fetchDiagnosticoFromApi(finalAnswers, token ?? undefined)

    if (!apiResult.ok) {
      if (!apiResult.showFallback) {
        trackEvent('diagnostico_error', { error_type: 'api', test_mode: false })
        setSecurityError(apiResult.error)
        setTurnstileToken(null)
        setScreen('quiz')
        return
      }
    } else {
      const { data } = apiResult
      clearDiagnosticoDraft()
      setHasDraft(false)
      trackConversion('diagnostico_complete', {
        score: data.score,
        ai_generated: Boolean(data.aiGenerated),
        email_dispatched: Boolean(data.emailDispatched),
        test_mode: false,
      })
      trackConversion('generate_lead', {
        method: 'diagnostico',
        score: data.score,
      })
      setReport({
        score: data.score,
        scoreInfo: data.scoreInfo,
        pillars: data.pillars,
        reportHtml: data.reportHtml,
        aiGenerated: data.aiGenerated,
        emailDispatched: data.emailDispatched,
        emailTo: data.emailTo,
      })
      setAnswers(finalAnswers)
      setScreen('report')
      return
    }

    const score = calcScore(finalAnswers)
    const scoreInfo = getScoreInfo(score)
    const pillars = calcPillars(finalAnswers)
    const reportHtml = buildFallbackReport(finalAnswers, scoreInfo)

    clearDiagnosticoDraft()
    setHasDraft(false)
    trackConversion('diagnostico_complete', {
      score,
      ai_generated: false,
      email_dispatched: false,
      test_mode: false,
      fallback: true,
    })
    trackConversion('generate_lead', {
      method: 'diagnostico_fallback',
      score,
    })
    setReport({ score, scoreInfo, pillars, reportHtml, aiGenerated: false })
    setAnswers(finalAnswers)
    setScreen('report')
  }, [])

  const startQuiz = useCallback((mode: 'fresh' | 'resume' = 'fresh') => {
    setFieldErrors({})
    setSecurityError(null)
    setTurnstileToken(null)
    setReport(null)

    if (mode === 'resume') {
      const draft = loadDiagnosticoDraft()
      if (draft) {
        trackEvent('diagnostico_resume', {
          step_index: draft.currentIndex + 1,
          progress_pct: Math.round((draft.currentIndex / TOTAL_QUESTIONS) * 100),
          test_mode: false,
        })
        setCurrentIndex(Math.min(Math.max(draft.currentIndex, 0), TOTAL_QUESTIONS - 1))
        setAnswers(draft.answers)
        setScreen('quiz')
        return
      }
    }

    clearDiagnosticoDraft()
    setHasDraft(false)
    trackEvent('diagnostico_start', { test_mode: false, resumed: false })
    setCurrentIndex(0)
    setAnswers({})
    setScreen('quiz')
  }, [])

  const restartQuiz = useCallback(() => {
    clearDiagnosticoDraft()
    setHasDraft(false)
    setScreen('intro')
    setCurrentIndex(0)
    setAnswers({})
    setFieldErrors({})
    setSecurityError(null)
    setTurnstileToken(null)
    setReport(null)
  }, [])

  const setAnswer = useCallback((questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    setFieldErrors((prev) => {
      if (!prev[questionId]) return prev
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }, [])

  const toggleMulti = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? [...(prev[questionId] as string[])] : []
      const index = current.indexOf(value)
      if (index > -1) current.splice(index, 1)
      else current.push(value)
      return { ...prev, [questionId]: current }
    })
  }, [])

  const goNext = useCallback(() => {
    const question = allQuestions[currentIndex]
    const meta = getQuestionSectionMeta(currentIndex)

    if (question.type === 'contact') {
      const errors = validateContactFields(question.fields, answers)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }
    }

    if (question.type === 'textarea') {
      const error = validateTextareaField(question, String(answers[question.id] ?? ''))
      if (error) {
        setFieldErrors({ [question.id]: error })
        return
      }
    }

    if (question.type === 'select' && !String(answers[question.id] ?? '').trim()) {
      setFieldErrors({ [question.id]: 'Selecione uma opção para continuar' })
      return
    }

    trackEvent('diagnostico_step_complete', {
      step_index: currentIndex + 1,
      step_id: meta.questionId,
      section: meta.sectionLabel,
      section_index: meta.sectionIndex,
      progress_pct: Math.round(((currentIndex + 1) / TOTAL_QUESTIONS) * 100),
      test_mode: false,
    })

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setSecurityError(null)
      setCurrentIndex((index) => index + 1)
      return
    }

    if (IS_TURNSTILE_ENABLED && !turnstileToken) {
      setSecurityError('Confirme a verificação de segurança antes de gerar o relatório.')
      return
    }

    trackEvent('diagnostico_submit', { test_mode: false })
    void generateReport(answers, turnstileToken)
  }, [answers, currentIndex, generateReport, turnstileToken])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setFieldErrors({})
      setSecurityError(null)
      setCurrentIndex((index) => index - 1)
    }
  }, [currentIndex])

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token)
    setSecurityError(null)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  return {
    screen,
    currentIndex,
    currentQuestion,
    totalQuestions: TOTAL_QUESTIONS,
    progressPct,
    sectionMeta,
    answers,
    fieldErrors,
    securityError,
    turnstileToken,
    report,
    hasDraft,
    draftProgressPct,
    startQuiz,
    restartQuiz,
    setAnswer,
    toggleMulti,
    goNext,
    goPrev,
    handleTurnstileToken,
    handleTurnstileExpire,
  }
}
