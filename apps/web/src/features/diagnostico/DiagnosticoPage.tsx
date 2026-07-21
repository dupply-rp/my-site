import { PageMeta } from '../../components/seo/PageMeta'
import { DIAGNOSTICO_PATH } from '../../constants/links'
import { DIAGNOSTICO_DESCRIPTION, DIAGNOSTICO_TITLE } from '../../constants/site'
import { DiagnosticoTopbar } from './components/DiagnosticoTopbar'
import { IntroScreen } from './components/IntroScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { QuizScreen } from './components/QuizScreen'
import { ReportScreen } from './components/ReportScreen'
import { useDiagnostico } from './hooks/useDiagnostico'
import '../../styles/landing.css'
import './diagnostico.css'

export function DiagnosticoPage() {
  const {
    screen,
    currentIndex,
    currentQuestion,
    totalQuestions,
    progressPct,
    sectionMeta,
    answers,
    fieldErrors,
    securityError,
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
  } = useDiagnostico()

  return (
    <div className="diag-app">
      <PageMeta
        title={DIAGNOSTICO_TITLE}
        description={DIAGNOSTICO_DESCRIPTION}
        path={DIAGNOSTICO_PATH}
      />
      <DiagnosticoTopbar showBack={screen !== 'quiz'} />

      {screen === 'intro' && (
        <IntroScreen
          hasDraft={hasDraft}
          draftProgressPct={draftProgressPct}
          onStart={() => startQuiz('fresh')}
          onResume={() => startQuiz('resume')}
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          progressPct={progressPct}
          sectionLabel={sectionMeta.sectionLabel}
          sectionIndex={sectionMeta.sectionIndex}
          sectionCount={sectionMeta.sectionCount}
          answers={answers}
          fieldErrors={fieldErrors}
          securityError={securityError}
          onAnswer={setAnswer}
          onToggleMulti={toggleMulti}
          onNext={goNext}
          onPrev={goPrev}
          onTurnstileToken={handleTurnstileToken}
          onTurnstileExpire={handleTurnstileExpire}
        />
      )}

      {screen === 'loading' && <LoadingScreen />}

      {screen === 'report' && report && (
        <ReportScreen answers={answers} report={report} onRestart={restartQuiz} />
      )}
    </div>
  )
}
