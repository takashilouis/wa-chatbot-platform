import { Suspense } from 'react';
import { LoginScreen } from '../../components/login-screen';
export default function LoginPage() {
  return <Suspense fallback={<main className="session-loading">Đang tải đăng nhập…</main>}><LoginScreen /></Suspense>;
}
