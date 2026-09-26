import type { CSSProperties, ReactNode } from 'react';
type IconName = 'chat' | 'arrow' | 'lock' | 'eye' | 'eye-off' | 'logout' | 'shield' | 'home' | 'check';
const paths: Record<IconName, ReactNode> = {
  chat: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-9.5A8.5 8.5 0 0 1 10.5 4H13a8 8 0 0 1 8 7.5Z"/><path d="M7 10h9M7 14h6"/></>,
  arrow: <path d="M4 12h16M14 6l6 6-6 6"/>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
  'eye-off': <path d="m3 3 18 18M10 5a10 10 0 0 1 12 7 17 17 0 0 1-3 4M6 6a17 17 0 0 0-4 6s3 7 10 7a12 12 0 0 0 5-1"/>,
  logout: <path d="M9 4H4v16h5M10 12h11m-5-5 5 5-5 5"/>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></>,
  home: <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
};
export function Icon({ name, style }: { name: IconName; style?: CSSProperties }) {
  return <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>{paths[name]}</svg>;
}
