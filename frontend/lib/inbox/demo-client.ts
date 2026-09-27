import { InboxError, type Conversation, type InboxClient, type InboxEvent } from './contracts';

export const BUSINESSES = [
  { id: 'demo-consulting', name: 'Tư vấn • Số mẫu A', displayNumber: 'Số WhatsApp giả lập A' },
  { id: 'demo-care', name: 'Chăm sóc • Số mẫu B', displayNumber: 'Số WhatsApp giả lập B' },
];
const names = ['Nguyễn Thảo An', 'Trần Minh Quân', 'Lê Hoàng Yến', 'Phạm Gia Huy', 'Võ Ngọc Mai', 'Đặng Thanh Hà', 'Bùi Anh Thư', 'Nguyễn Khánh Linh', 'Trần Đức Anh', 'Lý Minh Châu', 'Phan Quỳnh Như', 'Đỗ Tuấn Kiệt'];
const previews = ['Mình muốn được tư vấn thêm về quy trình và thời gian chuẩn bị hồ sơ ạ.', 'Bạn có thể giúp mình kiểm tra lại thông tin đã gửi hôm qua không?', 'Cảm ơn bạn, mình đã nhận được thông tin rồi nhé!', 'Mình muốn nói chuyện trực tiếp với nhân viên tư vấn.', 'Mình gửi tài liệu để đội ngũ xem giúp.', 'Cho mình hỏi các bước tiếp theo là gì ạ?'];
function fixtures(): Conversation[] {
  return names.map((name, index) => {
    const handling = (['waiting', 'staff', 'completed', 'bot'] as const)[index % 4]!;
    return { id: `demo-${index + 1}`, workspaceId: 'demo-workspace', business: BUSINESSES[index % 2]!, customer: { name, reference: `KH-MAU-${String(index + 1).padStart(3, '0')}` }, handling,
      assignee: handling === 'staff' ? { id: 'demo-linh', name: 'Nguyễn Linh' } : null,
      lastMessage: { preview: previews[index % previews.length]!, at: new Date(Date.UTC(2026, 8, 27, 8, 30 - index * 6)).toISOString(), kind: index === 4 ? 'document' : 'text' },
      unreadCount: handling === 'waiting' ? index + 1 : 0, version: 1,
      case: index % 3 === 0 ? { reference: `YC-MAU-${index + 1}`, stage: 'intake' } : null };
  });
}
function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
async function delay(signal?: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, 350);
    signal?.addEventListener('abort', abort, { once: true });
  });
}
export function createDemoInbox(): InboxClient & { setScenario(value: 'normal' | 'empty' | 'error'): void; simulateMessage(): void } {
  let records = fixtures();
  let scenario = 'normal';
  let revision = 1;
  const listeners = new Set<(event: InboxEvent) => void>();
  function check() { if (scenario === 'error') throw new InboxError('unavailable'); }
  return {
    async list(query, signal) {
      await delay(signal); check();
      const needle = normalize(query.search.trim());
      const matches = (scenario === 'empty' ? [] : records).filter(row =>
        (query.handling === 'all' || row.handling === query.handling) &&
        (!query.businessId || row.business.id === query.businessId) &&
        (!query.unreadOnly || row.unreadCount > 0) &&
        normalize(`${row.customer.name} ${row.customer.reference} ${row.lastMessage.preview}`).includes(needle))
        .sort((a, b) => b.lastMessage.at.localeCompare(a.lastMessage.at) || a.id.localeCompare(b.id));
      const offset = query.cursor ? Number(query.cursor.replace(/^demo:/, '')) : 0;
      if (!Number.isInteger(offset) || offset < 0 || (query.cursor && !/^demo:\d+$/.test(query.cursor))) throw new InboxError('invalid_cursor');
      const limit = Math.min(100, Math.max(1, query.limit));
      return { items: structuredClone(matches.slice(offset, offset + limit)), nextCursor: offset + limit < matches.length ? `demo:${offset + limit}` : null, total: matches.length, snapshotVersion: String(revision) };
    },
    async get(id, signal) { await delay(signal); check(); const row = scenario === 'empty' ? undefined : records.find(row => row.id === id); if (!row) throw new InboxError('not_found'); return structuredClone(row); },
    // Transcript transport is a future task; never report fake successful history.
    async messages(_id, _cursor, signal) { await delay(signal); throw new InboxError('unavailable'); },
    subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    setScenario(value) { scenario = value; },
    simulateMessage() {
      revision++;
      records = records.map((row, index) => index === 0 ? { ...row, version: row.version + 1, unreadCount: row.unreadCount + 1, lastMessage: { ...row.lastMessage, preview: `Tin nhắn mô phỏng mới #${revision}: Mình cần hỗ trợ thêm ạ.`, at: new Date().toISOString() } } : row);
      listeners.forEach(listener => listener({ id: `demo-event-${revision}`, type: 'conversation.changed', workspaceId: 'demo-workspace', conversationId: 'demo-1', version: revision }));
    },
  };
}
