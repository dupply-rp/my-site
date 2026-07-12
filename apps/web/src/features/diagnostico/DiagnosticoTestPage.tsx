import { Link } from 'react-router-dom'
import '../../styles/landing.css'
import { LoadingScreen } from './components/LoadingScreen'
import { ReportScreen } from './components/ReportScreen'
import { TurnstileWidget } from './components/TurnstileWidget'
import { useDiagnosticoTest } from './hooks/useDiagnosticoTest'
import { TURNSTILE_SITE_KEY } from './turnstileConfig'
import './diagnostico.css'

export function DiagnosticoTestPage() {
  const {
    screen,
    answers,
    report,
    previewCompany,
    securityError,
    isTurnstileEnabled,
    handleTurnstileToken,
    handleTurnstileExpire,
    runWithoutTurnstile,
    restart,
  } = useDiagnosticoTest()

  return (
    <div className="diag-app diag-test-app">
      <Link to="/diagnostico" className="diag-back-link">
        ← Diagnóstico real
      </Link>

      {screen === 'gate' ? (
        <div className="diag-test-gate">
          <span className="diag-test-eyebrow">Fase A.2 · Modo teste</span>
          <h1 className="diag-test-title">Prévia do relatório cliente</h1>
          <p className="diag-test-sub">
            Esta URL gera um diagnóstico com <strong>dados aleatórios</strong>, salva no console com prefixo{' '}
            <code>TC_</code> e exibe apenas a <strong>versão cliente</strong> do relatório (sem ferramentas nem
            roadmap interno).
          </p>

          <div className="diag-test-preview">
            <p className="diag-test-preview-label">Empresa deste teste</p>
            <p className="diag-test-preview-value">{previewCompany}</p>
          </div>

          {isTurnstileEnabled ? (
            <>
              <p className="diag-test-captcha-hint">
                Confirme o captcha abaixo. O relatório será gerado automaticamente em seguida.
              </p>
              <div className="diag-turnstile-wrap diag-test-turnstile">
                <TurnstileWidget
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={handleTurnstileToken}
                  onExpire={handleTurnstileExpire}
                  onError={handleTurnstileExpire}
                />
              </div>
            </>
          ) : (
            <>
              <p className="diag-test-captcha-hint">
                Captcha desativado neste ambiente. Clique para gerar o relatório de teste.
              </p>
              <button type="button" className="btn btn-primary diag-btn-lg" onClick={runWithoutTurnstile}>
                Gerar relatório de teste
              </button>
            </>
          )}

          {securityError ? (
            <p className="diag-security-error" role="alert">
              {securityError}
            </p>
          ) : null}

          <p className="diag-test-footnote">Não enviamos e-mail ao concluir testes com prefixo <code>TC_</code>.</p>
        </div>
      ) : null}

      {screen === 'loading' ? <LoadingScreen /> : null}

      {screen === 'report' && report ? (
        <ReportScreen answers={answers} report={report} onRestart={restart} />
      ) : null}
    </div>
  )
}
