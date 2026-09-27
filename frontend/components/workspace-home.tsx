'use client';
import Link from 'next/link';
import { useAuth } from './auth-provider';
import { Icon } from './icons';

export function WorkspaceHome() {
  const { session } = useAuth();
  return <main className="workspace-content"><p className="eyebrow muted">BẮT ĐẦU MỘT NGÀY KẾT NỐI</p><h1>Xin chào, {session?.user.name}.</h1><p className="page-description">Bạn đã vào không gian thử nghiệm dành cho đội ngũ hỗ trợ.</p><section className="welcome-card"><span className="welcome-icon"><Icon name="check" /></span><h2>Đăng nhập giao diện thành công</h2><p>Bạn có thể thử tải lại trang, đăng xuất và chuyển giữa tài khoản nhân viên hoặc quản trị viên. Hộp thư và tài khoản WhatsApp chưa được kết nối.</p><div className="session-details"><div><small>TÀI KHOẢN MẪU</small><span>{session?.user.email}</span></div><div><small>VAI TRÒ</small><span>{session?.user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên hỗ trợ'}</span></div></div></section><section className="upcoming"><h2>Các bước tiếp theo</h2><div className="upcoming-grid"><article><Icon name="chat" /><h3>Hộp thư chung</h3><p>Tìm kiếm và xem thông tin hội thoại mẫu.</p><Link className="text-button" href="/workspace/inbox">Mở hộp thư mẫu →</Link></article><article><Icon name="shield" /><h3>Xác thực thật</h3><p>Phiên đăng nhập và quyền do backend xác minh.</p><span>Đang tạm dừng backend</span></article></div></section></main>;
}
