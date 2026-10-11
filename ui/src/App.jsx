'use client'

import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8000/api'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
  :root { --ink: #172923; --muted: #718078; --green: #176b4a; --green-dark: #10553a; --line: #e6ebe6; --paper: #f6f8f4; --lime: #d9f27e; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'DM Sans', sans-serif; }
  button, input { font: inherit; }
  .fair-app { min-height: 100vh; overflow: hidden; }
  .topbar { height: 66px; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; background: #fff; border-bottom: 1px solid var(--line); }
  .brand { display: flex; align-items: center; gap: 10px; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -.04em; }
  .brand-mark { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; color: #fff; background: var(--green); }
  .brand-mark svg { width: 17px; height: 17px; }
  .topbar-note { color: #69766f; font-size: 12px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; }
  .main-wrap { max-width: 1040px; margin: 0 auto; padding: 42px 26px 64px; }
  .hero { position: relative; overflow: hidden; min-height: 238px; display: flex; align-items: center; padding: 38px 44px; border-radius: 24px; color: white; background: #173d31; }
  .hero:after { content: ''; position: absolute; width: 320px; height: 320px; right: 6%; top: -160px; border: 1px solid rgba(255,255,255,.12); border-radius: 50%; box-shadow: 0 0 0 34px rgba(255,255,255,.035), 0 0 0 68px rgba(255,255,255,.03), 0 0 0 102px rgba(255,255,255,.025); }
  .hero-copy { position: relative; z-index: 1; max-width: 585px; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px; color: var(--lime); font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  .eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 0 4px rgba(217,242,126,.14); }
  .hero h1 { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(34px, 5vw, 50px); line-height: 1.08; letter-spacing: -.055em; font-weight: 800; }
  .hero p { max-width: 450px; margin: 14px 0 0; color: rgba(255,255,255,.73); font-size: 14px; line-height: 1.65; }
  .content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 330px; gap: 22px; margin-top: 26px; align-items: start; }
  .section-head { display: flex; align-items: end; justify-content: space-between; margin: 2px 2px 14px; }
  .section-head h2 { margin: 0; font-family: 'Manrope', sans-serif; font-size: 21px; letter-spacing: -.04em; }
  .session-count { color: var(--muted); font-size: 12px; }
  .session-list { display: grid; gap: 12px; }
  .session-card { position: relative; display: flex; align-items: flex-start; gap: 14px; width: 100%; padding: 19px 18px; text-align: left; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 16px; cursor: pointer; transition: border-color .18s, box-shadow .18s, transform .18s; }
  .session-card:hover { transform: translateY(-1px); border-color: #a7c3ad; }
  .session-card.selected { border-color: var(--green); box-shadow: 0 0 0 2px rgba(23,107,74,.1); }
  .session-card:focus-visible, .register-button:focus-visible, .student-input:focus-visible, .retry-button:focus-visible { outline: 3px solid #a7d6b4; outline-offset: 3px; }
  .time-block { width: 60px; min-width: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 9px 5px; border-radius: 11px; text-align: center; background: #f0f5ef; color: var(--green); }
  .time-label { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 17px; line-height: 1.1; }
  .time-caption { margin-top: 3px; color: #75867b; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
  .session-details { flex: 1; min-width: 0; }
  .company-name { margin: 1px 0 8px; font-size: 15px; font-weight: 700; line-height: 1.35; }
  .session-meta { display: flex; align-items: center; gap: 6px; color: #77847d; font-size: 12px; }
  .availability { display: inline-flex; align-items: center; gap: 6px; margin-top: 13px; font-size: 11px; font-weight: 700; color: var(--green); }
  .availability-dot { width: 6px; height: 6px; border-radius: 50%; background: #40a675; }
  .availability.full { color: #a05243; }
  .availability.full .availability-dot { background: #cb715e; }
  .registered-badge { display: inline-flex; align-items: center; gap: 5px; margin-top: 10px; padding: 5px 8px; border-radius: 999px; color: #176b4a; background: #eaf4ec; font-size: 10px; font-weight: 800; }
  .demo-notice { margin: 0 0 12px; padding: 11px 13px; border: 1px solid #eadab0; border-radius: 12px; color: #73591d; background: #fff9e9; font-size: 12px; line-height: 1.5; }
  .selected-check { width: 20px; height: 20px; flex: none; display: grid; place-items: center; margin-top: 2px; border: 1px solid #dce4dc; border-radius: 50%; color: transparent; }
  .selected .selected-check { background: var(--green); color: white; border-color: var(--green); }
  .state-card { padding: 24px; border: 1px solid var(--line); border-radius: 16px; background: #fff; text-align: center; }
  .state-card h3 { margin: 12px 0 6px; font-family: 'Manrope', sans-serif; font-size: 16px; }
  .state-card p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.55; }
  .state-symbol { width: 42px; height: 42px; display: grid; place-items: center; margin: 0 auto; border-radius: 14px; color: var(--green); background: #edf5ed; font-size: 20px; font-weight: 700; }
  .state-symbol.error { color: #a05243; background: #fbefed; }
  .retry-button { margin-top: 16px; padding: 9px 14px; border: 1px solid #dbe5dc; border-radius: 10px; color: var(--green); background: white; font-size: 12px; font-weight: 700; cursor: pointer; }
  .register-panel { position: sticky; top: 20px; padding: 23px; border: 1px solid var(--line); border-radius: 18px; background: white; box-shadow: 0 8px 24px rgba(24,48,34,.035); }
  .panel-kicker { margin-bottom: 7px; color: var(--green); font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
  .register-panel h2 { margin: 0; font-family: 'Manrope', sans-serif; font-size: 20px; letter-spacing: -.04em; }
  .panel-description { margin: 8px 0 19px; color: var(--muted); font-size: 12px; line-height: 1.55; }
  .selected-summary { padding: 13px; margin-bottom: 18px; border-radius: 12px; background: #f4f7f2; }
  .summary-label { color: #849087; font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
  .summary-value { margin-top: 5px; font-size: 13px; font-weight: 700; line-height: 1.45; }
  .summary-time { margin-top: 3px; color: #66746b; font-size: 11px; }
  .field-label { display: block; margin-bottom: 7px; font-size: 12px; font-weight: 700; }
  .student-input { width: 100%; height: 44px; padding: 0 12px; border: 1px solid #dce4dc; border-radius: 10px; outline: none; color: var(--ink); background: white; font-size: 14px; }
  .student-input::placeholder { color: #a1aaa3; }
  .register-button { width: 100%; min-height: 46px; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 13px; padding: 11px 14px; border: 0; border-radius: 11px; color: white; background: var(--green); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .18s, transform .18s; }
  .register-button:not(:disabled):hover { background: var(--green-dark); transform: translateY(-1px); }
  .register-button:disabled { cursor: not-allowed; opacity: .55; }
  .register-button.success { background: #eaf4ec; color: var(--green); cursor: default; }
  .form-error { margin: 10px 0 0; color: #a05243; font-size: 12px; line-height: 1.45; }
  .privacy-note { display: flex; align-items: flex-start; gap: 7px; margin: 14px 1px 0; color: #8a948c; font-size: 10px; line-height: 1.5; }
  .panel-empty { padding: 17px 12px; border: 1px dashed #d8e1d8; border-radius: 12px; color: #758179; font-size: 12px; line-height: 1.5; text-align: center; }
  .footer-note { padding-top: 25px; color: #8a948c; font-size: 11px; text-align: center; }
  @media (max-width: 700px) {
    .topbar { height: 58px; padding: 0 17px; }
    .topbar-note { font-size: 9px; }
    .main-wrap { padding: 19px 14px 36px; }
    .hero { min-height: 206px; padding: 26px 22px; border-radius: 19px; }
    .hero:after { right: -180px; top: -135px; }
    .hero h1 { max-width: 300px; font-size: 37px; }
    .hero p { max-width: 290px; margin-top: 12px; font-size: 13px; }
    .eyebrow { margin-bottom: 13px; font-size: 10px; }
    .content-grid { grid-template-columns: 1fr; gap: 18px; margin-top: 25px; }
    .section-head { margin-bottom: 12px; }
    .section-head h2 { font-size: 19px; }
    .session-card { gap: 11px; padding: 15px 13px; border-radius: 14px; }
    .time-block { width: 55px; min-width: 55px; }
    .company-name { font-size: 14px; }
    .register-panel { position: static; padding: 20px 18px; }
    .footer-note { padding-top: 20px; }
  }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; } }
`

const SAMPLE_SESSIONS = [
  { ma_phien: 'P001', gio: '08:30', doanh_nghiep: 'FPT Software', con_cho: 12 },
  { ma_phien: 'P002', gio: '09:30', doanh_nghiep: 'VNG Corporation', con_cho: 8 },
  { ma_phien: 'P003', gio: '10:30', doanh_nghiep: 'Bosch Global Software', con_cho: 5 },
  { ma_phien: 'P004', gio: '13:30', doanh_nghiep: 'Viettel Digital', con_cho: 0 },
  { ma_phien: 'P005', gio: '14:30', doanh_nghiep: 'Shopee Vietnam', con_cho: 3 },
]

function normalizeSessions(payload) {
  const sessions = Array.isArray(payload) ? payload : payload?.data
  if (!Array.isArray(sessions)) throw new Error('Dữ liệu phiên chưa đúng định dạng.')
  return sessions.filter((session) => session && session.ma_phien != null)
}

function App() {
  const [sessions, setSessions] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [selectedId, setSelectedId] = useState(null)
  const [studentId, setStudentId] = useState('')
  const [registrationState, setRegistrationState] = useState('idle')
  const [registeredSessionIds, setRegisteredSessionIds] = useState([])
  const [usingSampleSessions, setUsingSampleSessions] = useState(false)
  const [formError, setFormError] = useState('')

  async function loadSessions(signal) {
    setLoadState('loading')
    try {
      const response = await fetch(`${API_URL}/phien`, { signal })
      if (!response.ok) throw new Error('Không thể tải danh sách phiên. Vui lòng thử lại.')
      const data = normalizeSessions(await response.json())
      setSessions(data)
      setUsingSampleSessions(false)
      setSelectedId((current) => data.some((session) => String(session.ma_phien) === String(current)) ? current : data[0]?.ma_phien ?? null)
      setLoadState(data.length ? 'ready' : 'empty')
    } catch (error) {
      if (error.name === 'AbortError') return
      setSessions(SAMPLE_SESSIONS)
      setSelectedId((current) => current ?? SAMPLE_SESSIONS[0].ma_phien)
      setUsingSampleSessions(true)
      setLoadState('ready')
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadSessions(controller.signal)
    return () => controller.abort()
  }, [])

  const selectedSession = sessions.find((session) => String(session.ma_phien) === String(selectedId))
  const hasAvailability = (session) => Number(session?.con_cho) > 0
  const selectedIsFull = selectedSession && !hasAvailability(selectedSession)
  const selectedIsRegistered = selectedSession && registeredSessionIds.includes(String(selectedSession.ma_phien))

  async function handleRegister(event) {
    event.preventDefault()
    if (!selectedSession || selectedIsFull || registrationState === 'submitting') return
    const cleanStudentId = studentId.trim()
    if (!cleanStudentId) {
      setFormError('Vui lòng nhập mã sinh viên để đăng ký.')
      return
    }

    setFormError('')
    setRegistrationState('submitting')
    try {
      const response = await fetch(`${API_URL}/dang-ky`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ma_sv: cleanStudentId, ma_phien: selectedSession.ma_phien }),
      })
      if (!response.ok) {
        let message = 'Đăng ký chưa thành công. Vui lòng thử lại.'
        if (response.status === 409) {
          message = 'Bạn đã đăng ký phiên này'
        } else if (response.status === 410) {
          message = 'Phiên này vừa hết chỗ. Hãy chọn phiên khác.'
        }
        else {
          try {
            const result = await response.json()
            if (result?.message) message = result.message
          } catch {}
        }
        throw new Error(message)
      }
      setRegisteredSessionIds((current) => [...new Set([...current, String(selectedSession.ma_phien)])])
      setSessions((current) => current.map((session) => String(session.ma_phien) === String(selectedSession.ma_phien)
        ? { ...session, con_cho: Math.max(0, Number(session.con_cho) - 1) }
        : session))
      setRegistrationState('registered')
    } catch (error) {
      setFormError(error.message || 'Không kết nối được máy chủ. Vui lòng thử lại.')
      setRegistrationState('idle')
    }
  }

  function chooseSession(session) {
    setSelectedId(session.ma_phien)
    setRegistrationState(registeredSessionIds.includes(String(session.ma_phien)) ? 'registered' : 'idle')
    setFormError('')
  }

  return (
    <div className="fair-app">
      <style>{styles}</style>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 17.5 9.2 6.8a1 1 0 0 1 1.8 0l2.2 4.5 1.2-2.4a1 1 0 0 1 1.8 0l3.8 8.6H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M7 17.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </span>
          <span>Career Connect</span>
        </div>
        <div className="topbar-note">Cơ hội bắt đầu từ đây</div>
      </header>

      <main className="main-wrap">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> Kết nối tương lai của bạn</div>
            <h1 id="page-title">Ngày hội<br />việc làm</h1>
            <p>Chọn khung giờ phù hợp, gặp gỡ doanh nghiệp và mở ra cơ hội nghề nghiệp tiếp theo.</p>
          </div>
        </section>

        <div className="content-grid">
          <section aria-labelledby="sessions-title">
            <div className="section-head">
              <h2 id="sessions-title">Chọn phiên tham gia</h2>
              {loadState === 'ready' && <span className="session-count">{sessions.length} phiên</span>}
            </div>

            {loadState === 'ready' && usingSampleSessions && (
              <div className="demo-notice" role="status">Không kết nối được danh sách từ máy chủ. Đang hiển thị 5 phiên minh họa; gửi đăng ký vẫn dùng API thật.</div>
            )}
            {loadState === 'loading' && (
              <div className="state-card" role="status" aria-live="polite">
                <div className="state-symbol" aria-hidden="true">…</div>
                <h3>Đang tải phiên</h3>
                <p>Đang cập nhật lịch gặp gỡ doanh nghiệp.</p>
              </div>
            )}
            {loadState === 'error' && (
              <div className="state-card" role="alert">
                <div className="state-symbol error" aria-hidden="true">!</div>
                <h3>Chưa thể tải danh sách</h3>
                <p>Máy chủ đang bận hoặc chưa kết nối được. Bạn có thể thử lại.</p>
                <button className="retry-button" type="button" onClick={() => loadSessions()}>Tải lại danh sách</button>
              </div>
            )}
            {loadState === 'empty' && (
              <div className="state-card" role="status">
                <div className="state-symbol" aria-hidden="true">—</div>
                <h3>Chưa có phiên đăng ký</h3>
                <p>Danh sách phiên sẽ xuất hiện tại đây khi được cập nhật.</p>
              </div>
            )}
            {loadState === 'ready' && (
              <div className="session-list">
                {sessions.map((session) => {
                  const available = hasAvailability(session)
                  const selected = String(session.ma_phien) === String(selectedId)
                  const registered = registeredSessionIds.includes(String(session.ma_phien))
                  return (
                    <button
                      className={`session-card${selected ? ' selected' : ''}`}
                      type="button"
                      key={session.ma_phien}
                      aria-pressed={selected}
                      onClick={() => chooseSession(session)}
                    >
                      <span className="time-block">
                        <span className="time-label">{session.gio || '—'}</span>
                        <span className="time-caption">Bắt đầu</span>
                      </span>
                      <span className="session-details">
                        <span className="company-name">{session.doanh_nghiep || 'Doanh nghiệp'}</span>
                        <span className="session-meta">Mã phiên: {session.ma_phien}</span>
                        <span className={`availability${available ? '' : ' full'}`}>
                          <span className="availability-dot" />
                          {available ? `Còn ${session.con_cho} chỗ` : 'Đã hết chỗ'}
                        </span>
                        {registered && <span className="registered-badge" aria-label="Bạn đã đăng ký phiên này">✓ Đã đăng ký</span>}
                      </span>
                      <span className="selected-check" aria-hidden="true">✓</span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <aside className="register-panel" aria-labelledby="register-title">
            <div className="panel-kicker">Đăng ký tham gia</div>
            <h2 id="register-title">Giữ chỗ cho bạn</h2>
            <p className="panel-description">Nhập mã sinh viên và xác nhận phiên bạn muốn tham gia.</p>

            {selectedSession ? (
              <form onSubmit={handleRegister}>
                <div className="selected-summary" aria-live="polite">
                  <div className="summary-label">Phiên đã chọn</div>
                  <div className="summary-value">{selectedSession.doanh_nghiep || 'Doanh nghiệp'}</div>
                  <div className="summary-time">{selectedSession.gio || 'Chưa cập nhật giờ'} · Mã phiên {selectedSession.ma_phien}</div>
                </div>
                <label className="field-label" htmlFor="student-id">Mã sinh viên</label>
                <input
                  className="student-input"
                  id="student-id"
                  name="ma_sv"
                  autoComplete="username"
                  placeholder="Ví dụ: 22123456"
                  value={studentId}
                  onChange={(event) => { setStudentId(event.target.value); setFormError(''); if (registrationState === 'registered') setRegistrationState('idle') }}
                  required
                  disabled={registrationState === 'registered'}
                />
                <button
                  className={`register-button${selectedIsRegistered ? ' success' : ''}`}
                  type="submit"
                  disabled={registrationState === 'submitting' || Boolean(selectedIsFull)}
                >
                  {registrationState === 'submitting' ? 'Đang gửi đăng ký…' : selectedIsRegistered ? '✓ Đã đăng ký thành công' : selectedIsFull ? 'Phiên đã hết chỗ' : 'Đăng ký ngay'}
                  {registrationState !== 'submitting' && !selectedIsFull && !selectedIsRegistered && <span aria-hidden="true">→</span>}
                </button>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="privacy-note"><span aria-hidden="true">i</span><span>Mã sinh viên chỉ được sử dụng để xác nhận đăng ký tham gia.</span></div>
              </form>
            ) : (
              <div className="panel-empty">{loadState === 'loading' ? 'Đang tải phiên để bạn lựa chọn…' : 'Chọn một phiên còn chỗ để bắt đầu đăng ký.'}</div>
            )}
          </aside>
        </div>
        <div className="footer-note">Ngày hội việc làm · Kết nối sinh viên với nhà tuyển dụng</div>
      </main>
    </div>
  )
}

export default App
