import { useCallback, useMemo, useRef, useState } from 'react'
import {
  buildFallbackReport,
  calcPillars,
  calcScore,
  createRandomTestAnswers,
  getScoreInfo,
} from '@dupply/diagnostico'
import type { Answers, DiagnosticoReport } from '../types'
import { fetchDiagnosticoFromApi } from '../fetchDiagnosticoApi'
import { IS_TURNSTILE_ENABLED } from '../turnstileConfig'

type TestScreen = 'gate' | 'loading' | 'report' | 'error'

export function useDiagnosticoTest() {
  const [screen, setScreen] = useState<TestScreen>('gate')
  const [answers] = useState<Answers>(() => createRandomTestAnswers())
  const [report, setReport] = useState<DiagnosticoReport | null>(null)
  const [securityError, setSecurityError] = useState<string | null>(null)
  const runningRef = useRef(false)

  const previewCompany = useMemo(() => String(answers.nome ?? ''), [answers.nome])

  const runTest = useCallback(
    async (turnstileToken?: string | null) => {
      if (runningRef.current) return
      runningRef.current = true

      setScreen('loading')
      setSecurityError(null)

      const apiResult = await fetchDiagnosticoFromApi(answers, turnstileToken ?? undefined, {
        testMode: true,
      })

      runningRef.current = false

      if (!apiResult.ok) {
        if (!apiResult.showFallback) {
          setSecurityError(apiResult.error)
          setScreen('gate')
          return
        }

        const score = calcScore(answers)
        const scoreInfo = getScoreInfo(score)
        const pillars = calcPillars(answers)
        const reportHtml = buildFallbackReport(answers, scoreInfo)

        setReport({ score, scoreInfo, pillars, reportHtml, aiGenerated: false, testMode: true })
        setScreen('report')
        return
      }

      const { data } = apiResult
      setReport({
        score: data.score,
        scoreInfo: data.scoreInfo,
        pillars: data.pillars,
        reportHtml: data.reportHtml,
        aiGenerated: data.aiGenerated,
        emailDispatched: false,
        testMode: true,
      })
      setScreen('report')
    },
    [answers],
  )

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setSecurityError(null)
      void runTest(token)
    },
    [runTest],
  )

  const handleTurnstileExpire = useCallback(() => {
    if (screen === 'gate') {
      setSecurityError('A verificação expirou. Confirme novamente para gerar o teste.')
    }
    runningRef.current = false
  }, [screen])

  const runWithoutTurnstile = useCallback(() => {
    void runTest(null)
  }, [runTest])

  const restart = useCallback(() => {
    runningRef.current = false
    window.location.reload()
  }, [])

  return {
    screen,
    answers,
    report,
    previewCompany,
    securityError,
    isTurnstileEnabled: IS_TURNSTILE_ENABLED,
    handleTurnstileToken,
    handleTurnstileExpire,
    runWithoutTurnstile,
    restart,
  }
}
