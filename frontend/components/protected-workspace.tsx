'use client';
import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Icon } from './icons';

export function ProtectedWorkspace({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (auth.status === 'signed-out') router.replace(`/login?next=${encodeURIComponent(pathname + window.location.search)}`); }, [auth.status, pathname, router]);
  if (auth.status !== 'signed-in' || !auth.session) return <main className="session-loading" role="status"><span className="spinner" /> Đang kiểm tra phiên thử nghiệm…</main>;
  const user = auth.session.user;
  return <div className="workspace-shell">
    <aside className="sidebar"><Link className="brand" href="/workspace"><span className="brand-mark"><Icon name="chat" /></span>Liên<span className="brand-light">kết</span></Link><p className="sidebar-label">KHÔNG GIAN LÀM VIỆC</p><nav aria-label="Điều hướng chính"><Link className={pathname === '/workspace' ? 'active' : ''} href="/workspace"><Icon name="home" />Tổng quan</Link><Link className={pathname.startsWith('/workspace/inbox') ? 'active' : ''} href="/workspace/inbox"><Icon name="chat" />Hộp thư chung</Link>{user.role === 'admin' && <Link className={pathname === '/workspace/access' ? 'active' : ''} href="/workspace/access"><Icon name="shield" />Quyền truy cập</Link>}</nav><div className="sidebar-note">Bản thử nghiệm giao diện<br /><span>Chưa kết nối WhatsApp</span></div></aside>
    <div className="workspace-body"><header className="workspace-header"><span>{user.workspace}</span><div className="staff-menu"><span className="small-avatar">{user.name.charAt(0)}</span><span>{user.name}<small>{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên hỗ trợ'}</small></span><button className="secondary-button" onClick={async () => { await auth.signOut(); router.replace('/login'); }}><Icon name="logout" />Đăng xuất</button></div></header><div className="demo-banner" role="note"><strong>Chế độ thử nghiệm</strong><span>Phiên và quyền truy cập được mô phỏng trong trình duyệt. Không sử dụng dữ liệu thật.</span></div>{children}</div>
  </div>;
}
