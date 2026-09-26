'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DEMO_ENABLED, useAuth } from './auth-provider';
import { Icon } from './icons';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../lib/auth/demo-adapter';
import { AUTH_MESSAGES, AuthError, safeReturnPath } from '../lib/auth/types';

export function LoginScreen() {
  const auth = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const destination = safeReturnPath(params.get('next'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<{ email?: string; password?: string }>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  useEffect(() => { if (auth.status === 'signed-in') router.replace(destination); }, [auth.status, destination, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    const nextFields = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : 'Nhập địa chỉ email hợp lệ.',
      password: password ? undefined : 'Nhập mật khẩu của bạn.',
    };
    setFields(nextFields);
    if (nextFields.email || nextFields.password) { (nextFields.email ? emailRef : passwordRef).current?.focus(); return; }
    submitting.current = true;
    setBusy(true);
    try { await auth.signIn(email, password); setPassword(''); router.replace(destination); }
    catch (cause) { setError(cause instanceof AuthError ? AUTH_MESSAGES[cause.code] : AUTH_MESSAGES.unknown); passwordRef.current?.focus(); }
    finally { submitting.current = false; setBusy(false); }
  }

  return (
    <main className="login-page">
      <section className="brand-panel" aria-label="Giới thiệu không gian hỗ trợ">
        <div className="brand"><span className="brand-mark"><Icon name="chat" /></span>Liên<span className="brand-light">kết</span><span className="brand-tag">WHATSAPP WORKSPACE</span></div>
        <div className="brand-story">
          <p className="eyebrow">KẾT NỐI TỪNG CUỘC TRÒ CHUYỆN</p>
          <h1>Gần khách hàng hơn.<br /><span>Cùng nhau.</span></h1>
          <p className="brand-description">Một không gian cho đội ngũ của bạn tiếp nhận, tư vấn và chăm sóc khách hàng bằng tiếng Việt.</p>
          <div className="conversation-illustration" aria-label="Minh họa hội thoại, không phải tin nhắn thật">
            <div className="illustration-heading"><span className="small-avatar">L</span><div>Đội ngũ hỗ trợ<small>Minh họa trải nghiệm</small></div><span className="connection-dot" /></div>
            <p className="bubble customer-bubble">Mình cần tư vấn thêm một chút ạ.</p>
            <p className="bubble team-bubble">Chào bạn, mình là Linh.<br />Mình sẵn sàng hỗ trợ bạn nhé! <span>✓✓</span></p>
            <div className="handoff-caption"><Icon name="check" /> Từ trợ lý đến nhân viên, liền mạch.</div>
          </div>
        </div>
        <div className="brand-footer"><span className="avatar-stack"><i>L</i><i>A</i><i>M</i></span><span>Được thiết kế cho cách đội ngũ Việt làm việc.</span></div>
      </section>
      <section className="login-panel" aria-labelledby="login-title">
        <div className="preview-tag"><span /> {DEMO_ENABLED ? 'Chế độ thử nghiệm · Frontend' : 'Frontend · Chưa kết nối đăng nhập'}</div>
        <div className="login-content">
          <span className="welcome-icon"><Icon name="lock" /></span>
          <p className="eyebrow muted">CHÀO MỪNG TRỞ LẠI</p>
          <h2 id="login-title">Đăng nhập vào không gian<br className="desktop-break" /> của bạn</h2>
          <p className="login-description">Tiếp tục đồng hành cùng khách hàng và đội ngũ.</p>
          <form onSubmit={submit} noValidate aria-busy={busy}>
            <div className="field"><label htmlFor="email">Email công việc</label><input ref={emailRef} id="email" name="email" type="email" autoComplete="username" placeholder="ban@congty.vn" value={email} onChange={e => setEmail(e.target.value)} disabled={busy} aria-invalid={Boolean(fields.email)} aria-describedby={fields.email ? 'email-error' : undefined} />{fields.email && <p className="field-error" id="email-error">{fields.email}</p>}</div>
            <div className="field"><label htmlFor="password">Mật khẩu</label><div className="password-input"><input ref={passwordRef} id="password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} disabled={busy} aria-invalid={Boolean(fields.password)} aria-describedby={fields.password ? 'password-error' : undefined} /><button className="reveal-button" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={visible}><Icon name={visible ? 'eye-off' : 'eye'} /></button></div>{fields.password && <p className="field-error" id="password-error">{fields.password}</p>}</div>
            <p className="session-hint">Phiên thử nghiệm duy trì trong tab này tối đa 30 phút.</p>
            {(error || !DEMO_ENABLED) && <p role="alert" className="form-error">{error || AUTH_MESSAGES.unconfigured}</p>}
            <button className="primary-button sign-in" type="submit" disabled={busy || auth.status !== 'signed-out' || !DEMO_ENABLED}>{busy ? 'Đang đăng nhập…' : auth.status === 'loading' ? 'Đang kiểm tra phiên…' : 'Đăng nhập'}{busy ? <span className="spinner" /> : <Icon name="arrow" />}</button>
          </form>
          {DEMO_ENABLED && <div className="demo-accounts"><div className="demo-heading"><span>Tài khoản dùng thử</span><span>Không cần backend</span></div><div className="account-buttons">{DEMO_ACCOUNTS.map(account => <button key={account.id} type="button" disabled={busy} onClick={() => { setEmail(account.email); setPassword(DEMO_PASSWORD); setFields({}); setError(''); emailRef.current?.focus(); }}><Icon name={account.role === 'admin' ? 'shield' : 'chat'} /><span>{account.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}<small>{account.email}</small></span><span className="account-arrow">↗</span></button>)}</div><p>Mật khẩu mẫu: <code>{DEMO_PASSWORD}</code>. Chỉ dùng dữ liệu giả để thử giao diện.</p></div>}
          <details className="login-help"><summary>Cần hỗ trợ đăng nhập?</summary><p>Chọn một tài khoản dùng thử ở trên rồi nhấn Đăng nhập. Tài khoản thật và đặt lại mật khẩu sẽ được bổ sung khi backend hoạt động.</p></details>
        </div>
        <footer className="login-footer"><Icon name="shield" /><span>Giao diện thử nghiệm. Chưa xác thực tài khoản thật.</span></footer>
      </section>
    </main>
  );
}
