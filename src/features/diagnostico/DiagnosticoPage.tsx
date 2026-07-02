import { Link } from 'react-router-dom'
import '../../styles/landing.css'
import { IntroScreen } from './components/IntroScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { QuizScreen } from './components/QuizScreen'
import { ReportScreen } from './components/ReportScreen'
import { useDiagnostico } from './hooks/useDiagnostico'
import './diagnostico.css'

export function DiagnosticoPage() {
  const {
    screen,
    currentIndex,
    currentQuestion,
    totalQuestions,
    progressPct,
    answers,
    fieldErrors,
    securityError,
    report,
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
      {screen !== 'quiz' && (
        <Link to="/" className="diag-back-link">
          ← Voltar ao site
        </Link>
      )}

      {screen === 'intro' && <IntroScreen onStart={startQuiz} />}

      {screen === 'quiz' && (
        <QuizScreen
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          progressPct={progressPct}
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
