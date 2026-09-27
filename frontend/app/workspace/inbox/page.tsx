import { Suspense } from 'react';
import { InboxScreen } from '../../../components/inbox-screen';
export default function InboxPage() { return <Suspense fallback={<p role="status">Đang mở hộp thư…</p>}><InboxScreen /></Suspense>; }
