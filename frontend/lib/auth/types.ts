export type StaffRole = 'agent' | 'admin';
export type StaffUser = { id: string; name: string; email: string; role: StaffRole; workspace: string };
export type StaffSession = { user: StaffUser; expiresAt: number };

// FE port only. A real adapter must rely on server-validated HttpOnly sessions.
export interface AuthAdapter {
  restore(): Promise<StaffSession | null>;
  signIn(email: string, password: string): Promise<StaffSession>;
  signOut(): Promise<void>;
}
export class AuthError extends Error {
  constructor(public readonly code: 'credentials' | 'storage' | 'unconfigured') { super(code); }
}
export const AUTH_MESSAGES = {
  credentials: 'Email hoặc mật khẩu chưa đúng. Vui lòng thử lại.',
  storage: 'Trình duyệt không thể lưu phiên thử nghiệm. Hãy cho phép lưu trữ trang và thử lại.',
  unconfigured: 'Đăng nhập thực chưa được kết nối. Chế độ thử nghiệm hiện đang tắt.',
  unknown: 'Chưa thể đăng nhập lúc này. Vui lòng thử lại.',
};
export function safeReturnPath(value: string | null): string {
  if (value === '/workspace/inbox') return value;
  if (value?.startsWith('/workspace/inbox?')) {
    const url = new URL(value, 'https://local.invalid');
    const id = url.searchParams.get('conversation');
    if (id && id.length <= 200) return `/workspace/inbox?conversation=${encodeURIComponent(id)}`;
    return '/workspace/inbox';
  }
  return value === '/workspace/access' ? value : '/workspace';
}
