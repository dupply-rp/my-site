import { useCallback, useState } from 'react'
import { buildFallbackReport } from '../fallbackReport'
import { fetchDiagnosticoFromApi } from '../fetchDiagnosticoApi'
import { allQuestions, TOTAL_QUESTIONS } from '../questions'
import { calcPillars, calcScore, getScoreInfo } from '../scoring'
import type { Answers, DiagnosticoReport, DiagnosticoScreen } from '../types'
import { validateContactFields } from '../validateContact'

export function useDiagnostico() {
  const [screen, setScreen] = useState<DiagnosticoScreen>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [report, setReport] = useState<DiagnosticoReport | null>(null)

  const currentQuestion = allQuestions[currentIndex]
  const progressPct = Math.round((currentIndex / TOTAL_QUESTIONS) * 100)

  const generateReport = useCallback(async (finalAnswers: Answers) => {
    setScreen('loading')

    const apiResult = await fetchDiagnosticoFromApi(finalAnswers)

    if (apiResult) {
      setReport({
        score: apiResult.score,
        scoreInfo: apiResult.scoreInfo,
        pillars: apiResult.pillars,
        reportHtml: apiResult.reportHtml,
        aiGenerated: apiResult.aiGenerated,
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
    setReport(null)
    setScreen('quiz')
  }, [])

  const restartQuiz = useCallback(() => {
    setScreen('intro')
    setCurrentIndex(0)
    setAnswers({})
    setFieldErrors({})
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

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((index) => index + 1)
      return
    }

    void generateReport(answers)
  }, [answers, currentIndex, generateReport])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setFieldErrors({})
      setCurrentIndex((index) => index - 1)
    }
  }, [currentIndex])

  return {
    screen,
    currentIndex,
    currentQuestion,
    totalQuestions: TOTAL_QUESTIONS,
    progressPct,
    answers,
    fieldErrors,
    report,
    startQuiz,
    restartQuiz,
    setAnswer,
    toggleMulti,
    goNext,
    goPrev,
  }
}
