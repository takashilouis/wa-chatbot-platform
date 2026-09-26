'use client';
import Link from 'next/link';
import { useAuth } from './auth-provider';
import { DEMO_ACCOUNTS } from '../lib/auth/demo-adapter';
import { Icon } from './icons';

export function AccessPanel() {
  const { session } = useAuth();
  if (session?.user.role !== 'admin') return <main className="workspace-content"><section className="welcome-card"><Icon name="lock" /><h1>Bạn không có quyền truy cập</h1><p>Màn hình thử nghiệm này chỉ dành cho quản trị viên.</p><Link className="primary-button inline-button" href="/workspace">Về tổng quan</Link></section></main>;
  return <main className="workspace-content"><p className="eyebrow muted">QUẢN LÝ KHÔNG GIAN</p><h1>Quyền truy cập</h1><p className="page-description">Hai danh tính mẫu để kiểm tra hiển thị theo vai trò. Đây không phải danh sách nhân viên thật.</p><section className="welcome-card"><h2>Tài khoản thử nghiệm</h2><ul className="access-list">{DEMO_ACCOUNTS.map(account => <li key={account.id}><span className="small-avatar">{account.name.charAt(0)}</span><div><strong>{account.name}</strong><p>{account.email}</p></div><span className="role-label">{account.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span></li>)}</ul><p className="session-hint">Quản lý thành viên và xác minh quyền phía máy chủ thuộc S1-008 BE, hiện đang tạm dừng.</p></section></main>;
}
