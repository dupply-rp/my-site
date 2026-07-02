import { useCallback, useState } from 'react'
import { buildFallbackReport } from '../fallbackReport'
import { fetchDiagnosticoFromApi } from '../fetchDiagnosticoApi'
import { allQuestions, TOTAL_QUESTIONS } from '../questions'
import { calcPillars, calcScore, getScoreInfo } from '../scoring'
import { IS_TURNSTILE_ENABLED } from '../turnstileConfig'
import type { Answers, DiagnosticoReport, DiagnosticoScreen } from '../types'
import { validateContactFields } from '../validateContact'
import { validateTextareaField } from '../validateTextarea'

export function useDiagnostico() {
  const [screen, setScreen] = useState<DiagnosticoScreen>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [securityError, setSecurityError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [report, setReport] = useState<DiagnosticoReport | null>(null)

  const currentQuestion = allQuestions[currentIndex]
  const progressPct = Math.round((currentIndex / TOTAL_QUESTIONS) * 100)

  const generateReport = useCallback(async (finalAnswers: Answers, token?: string | null) => {
    setScreen('loading')
    setSecurityError(null)

    const apiResult = await fetchDiagnosticoFromApi(finalAnswers, token ?? undefined)

    if (!apiResult.ok) {
      if (!apiResult.showFallback) {
        setSecurityError(apiResult.error)
        setTurnstileToken(null)
        setScreen('quiz')
        return
      }
    } else {
      const { data } = apiResult
      setReport({
        score: data.score,
        scoreInfo: data.scoreInfo,
        pillars: data.pillars,
        reportHtml: data.reportHtml,
        aiGenerated: data.aiGenerated,
      })
      setAnswers(finalAnswers)
      setScreen('report')
      return
    }

    const score = calcScore(finalAnswers)
    const scoreInfo = getScoreInfo(score)
    const pillars = calcPillars(finalAnswers)
    const reportHtml = buildFallbackReport(finalAnswers, scoreInfo)

    setReport({ score, scoreInfo, pillars, reportHtml, aiGenerated: false })
    setAnswers(finalAnswers)
    setScreen('report')
  }, [])

  const startQuiz = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    setFieldErrors({})
    setSecurityError(null)
    setTurnstileToken(null)
    setReport(null)
    setScreen('quiz')
  }, [])

  const restartQuiz = useCallback(() => {
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

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setSecurityError(null)
      setCurrentIndex((index) => index + 1)
      return
    }

    if (IS_TURNSTILE_ENABLED && !turnstileToken) {
      setSecurityError('Confirme a verificação de segurança antes de gerar o relatório.')
      return
    }

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
    answers,
    fieldErrors,
    securityError,
    turnstileToken,
    report,
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
