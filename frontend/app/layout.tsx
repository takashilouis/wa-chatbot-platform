import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/auth-provider';

export const metadata: Metadata = {
  title: 'Liên kết — Không gian hỗ trợ WhatsApp',
  description: 'Nền tảng trợ lý WhatsApp dành cho đội ngũ hỗ trợ khách hàng Việt Nam.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
