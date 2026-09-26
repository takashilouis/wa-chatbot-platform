'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { demoAdapter, unavailableAdapter } from '../lib/auth/demo-adapter';
import type { StaffSession } from '../lib/auth/types';

export const DEMO_ENABLED = process.env.NEXT_PUBLIC_AUTH_MODE === 'demo';
const adapter = DEMO_ENABLED ? demoAdapter : unavailableAdapter;
type AuthState = { status: 'loading' | 'signed-out' | 'signed-in'; session: StaffSession | null };
type AuthContextValue = AuthState & { signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', session: null });
  useEffect(() => {
    let active = true;
    void adapter.restore().then(session => { if (active) setState({ status: session ? 'signed-in' : 'signed-out', session }); });
    return () => { active = false; };
  }, []);
  const signOut = useCallback(async () => {
    await adapter.signOut();
    setState({ status: 'signed-out', session: null });
  }, []);
  useEffect(() => {
    if (!state.session) return;
    const expiresAt = state.session.expiresAt;
    const expire = () => { if (Date.now() >= expiresAt) void signOut(); };
    const timer = setTimeout(expire, Math.max(0, expiresAt - Date.now()));
    window.addEventListener('focus', expire);
    document.addEventListener('visibilitychange', expire);
    return () => { clearTimeout(timer); window.removeEventListener('focus', expire); document.removeEventListener('visibilitychange', expire); };
  }, [state.session, signOut]);
  async function signIn(email: string, password: string) {
    const session = await adapter.signIn(email, password);
    setState({ status: 'signed-in', session });
  }
  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is missing');
  return value;
}
