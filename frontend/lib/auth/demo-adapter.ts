import { AuthError, type AuthAdapter, type StaffSession, type StaffUser } from './types';

export const DEMO_SESSION_KEY = 'wachatbot.demo-session.v1';
export const DEMO_PASSWORD = 'Demo@2026'; // Public fixture, never a real credential.
export const DEMO_ACCOUNTS: readonly StaffUser[] = [
  { id: 'demo-linh', name: 'Nguyễn Linh', email: 'linh@demo.local', role: 'agent', workspace: 'Không gian thử nghiệm' },
  { id: 'demo-admin', name: 'Minh Anh', email: 'admin@demo.local', role: 'admin', workspace: 'Không gian thử nghiệm' },
];
const SESSION_TTL_MS = 30 * 60 * 1000;
function clear() {
  try { window.sessionStorage.removeItem(DEMO_SESSION_KEY); }
  catch { /* Sign-out remains possible with storage disabled. */ }
}
export const demoAdapter: AuthAdapter = {
  async restore() {
    try {
      const value: unknown = JSON.parse(window.sessionStorage.getItem(DEMO_SESSION_KEY) ?? 'null');
      if (!value || typeof value !== 'object' || !('accountId' in value) || !('expiresAt' in value)) { clear(); return null; }
      const user = DEMO_ACCOUNTS.find(account => account.id === value.accountId);
      const expiresAt = value.expiresAt;
      if (!user || typeof expiresAt !== 'number' || !Number.isFinite(expiresAt) || expiresAt <= Date.now() || expiresAt > Date.now() + SESSION_TTL_MS) { clear(); return null; }
      return { user, expiresAt };
    } catch { clear(); return null; }
  },
  async signIn(email, password) {
    await new Promise(resolve => setTimeout(resolve, 450));
    const user = DEMO_ACCOUNTS.find(account => account.email === email.trim().toLowerCase());
    if (!user || password !== DEMO_PASSWORD) throw new AuthError('credentials');
    const session: StaffSession = { user, expiresAt: Date.now() + SESSION_TTL_MS };
    try { window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ accountId: user.id, expiresAt: session.expiresAt })); }
    catch { throw new AuthError('storage'); }
    return session;
  },
  async signOut() { clear(); },
};
export const unavailableAdapter: AuthAdapter = {
  async restore() { return null; },
  async signIn() { throw new AuthError('unconfigured'); },
  async signOut() { clear(); },
};
