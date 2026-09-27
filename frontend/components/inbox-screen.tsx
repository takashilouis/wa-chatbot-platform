'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BUSINESSES, createDemoInbox } from '../lib/inbox/demo-client';
import { HANDLING_LABELS, InboxError, type Conversation, type HandlingState } from '../lib/inbox/contracts';
import { Icon } from './icons';

const time = (value: string) => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
export function InboxScreen() {
  const client = useMemo(() => createDemoInbox(), []);
  const router = useRouter();
  const params = useSearchParams();
  const selectedId = params.get('conversation');
  const [search, setSearch] = useState('');
  const [handling, setHandling] = useState<HandlingState | 'all'>('all');
  const [businessId, setBusinessId] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [limit, setLimit] = useState(6);
  const [revision, setRevision] = useState(0);
  const [rows, setRows] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [more, setMore] = useState(false);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [detailState, setDetailState] = useState('loading');
  const [online, setOnline] = useState(true);
  const [scenario, setScenario] = useState<'normal' | 'empty' | 'error'>('normal');
  const [synced, setSynced] = useState('');
  useEffect(() => client.subscribe(() => setRevision(value => value + 1)), [client]);
  useEffect(() => {
    const reconnect = () => { setOnline(true); setRevision(value => value + 1); };
    const disconnect = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener('online', reconnect); window.addEventListener('offline', disconnect);
    return () => { window.removeEventListener('online', reconnect); window.removeEventListener('offline', disconnect); };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    void client.list({ search, handling, businessId, unreadOnly, limit }, controller.signal).then(page => {
      setRows(page.items); setTotal(page.total); setMore(Boolean(page.nextCursor)); setState('ready'); setSynced(time(new Date().toISOString()));
    }).catch(error => { if (error.name !== 'AbortError') { setRows([]); setState('error'); } });
    return () => controller.abort();
  }, [client, search, handling, businessId, unreadOnly, limit, revision]);
  useEffect(() => {
    const controller = new AbortController(); setSelected(null); setDetailState('loading');
    if (selectedId) void client.get(selectedId, controller.signal).then(row => { setSelected(row); setDetailState('ready'); }).catch(error => {
      if (error.name !== 'AbortError') setDetailState(error instanceof InboxError && error.code === 'not_found' ? 'missing' : 'error');
    });
    return () => controller.abort();
  }, [client, selectedId, revision]);
  const open = (id: string | null) => router.push(id ? `/workspace/inbox?conversation=${encodeURIComponent(id)}` : '/workspace/inbox', { scroll: false });
  function resetFilters() { setSearch(''); setHandling('all'); setBusinessId(''); setUnreadOnly(false); setLimit(6); }
  return <main className="inbox-page">
    <div className="inbox-title"><div><p className="eyebrow muted">KHÔNG BỎ LỠ MỘT CUỘC TRÒ CHUYỆN</p><h1>Hộp thư chung</h1><p>Tiếp nhận, phân loại và đồng hành cùng khách hàng.</p></div><span className={`connection-pill ${online ? '' : 'offline'}`}>{online ? 'Dữ liệu mô phỏng' : 'Trình duyệt ngoại tuyến'}</span></div>
    <details className="inbox-demo-tools"><summary>Công cụ kiểm tra giao diện</summary><div><label>Kịch bản <select value={scenario} onChange={e => { const value = e.target.value as typeof scenario; setScenario(value); client.setScenario(value); setLimit(6); setRevision(v => v + 1); }}><option value="normal">Bình thường</option><option value="empty">Hộp thư trống</option><option value="error">Lỗi tải dữ liệu</option></select></label><button className="secondary-button" disabled={scenario !== 'normal'} onClick={() => client.simulateMessage()}>Mô phỏng tin mới</button><span>Không gửi hoặc nhận WhatsApp thật. Hai số mẫu chỉ để kiểm tra bộ lọc.</span></div></details>
    {!online && <p role="status" className="form-error">Bạn đang ngoại tuyến. Dữ liệu bên dưới là bản mẫu; khi có mạng, giao diện sẽ tải lại trạng thái.</p>}
    <div className={`inbox-layout ${selectedId ? 'has-selection' : ''}`}>
      <section className="inbox-list-panel" aria-label="Danh sách hội thoại">
        <div className="inbox-filters"><label className="search-field">Tìm hội thoại<input type="search" placeholder="Tên khách, mã hoặc nội dung…" value={search} onChange={e => { setSearch(e.target.value); setLimit(6); }} /></label>
          <div className="filter-row"><label>Số WhatsApp<select value={businessId} onChange={e => { setBusinessId(e.target.value); setLimit(6); }}><option value="">Tất cả số mẫu</option>{BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label className="unread-filter"><input type="checkbox" checked={unreadOnly} onChange={e => { setUnreadOnly(e.target.checked); setLimit(6); }} />Chưa đọc</label></div>
          <div className="inbox-tabs" aria-label="Trạng thái xử lý">{(['all', 'waiting', 'bot', 'staff', 'completed'] as const).map(value => <button key={value} aria-pressed={handling === value} onClick={() => { setHandling(value); setLimit(6); }}>{value === 'all' ? 'Tất cả' : HANDLING_LABELS[value]}</button>)}</div>
        </div>
        <div className="list-meta"><span role="status">{state === 'loading' ? 'Đang tải hội thoại…' : state === 'error' ? 'Chưa tải được dữ liệu' : `${total} hội thoại · ${rows.length} đang hiển thị`}</span><button className="text-button" onClick={() => setRevision(v => v + 1)}>Làm mới</button></div>
        {state === 'loading' ? <div className="inbox-state" aria-label="Đang tải"><span className="spinner" /><p>Đang tải danh sách…</p></div> : state === 'error' ? <div className="inbox-state" role="alert"><h2>Chưa thể tải hộp thư</h2><p>Vui lòng kiểm tra kết nối và thử lại.</p><button className="secondary-button" onClick={() => { client.setScenario('normal'); setScenario('normal'); setRevision(v => v + 1); }}>Thử lại</button></div> : rows.length === 0 ? <div className="inbox-state"><Icon name="chat" /><h2>Không có hội thoại</h2><p>Chưa có dữ liệu hoặc không có kết quả phù hợp bộ lọc.</p><button className="secondary-button" onClick={resetFilters}>Xóa bộ lọc</button></div> : <ul className="conversation-list">{rows.map(row => <li key={row.id}><button className={`conversation-row ${selectedId === row.id ? 'selected' : ''}`} onClick={() => open(row.id)} aria-current={selectedId === row.id ? 'true' : undefined}>
          <span className="customer-avatar">{row.customer.name.split(' ').slice(-1)[0]?.slice(0, 1)}</span><span className="row-content"><span className="row-heading"><strong>{row.customer.name}</strong><time dateTime={row.lastMessage.at}>{time(row.lastMessage.at)}</time></span><span className="business-label">{row.business.name}</span><span className="message-preview">{row.lastMessage.kind === 'document' ? '📎 ' : ''}{row.lastMessage.preview}</span><span className="row-footer"><span className={`handling-badge ${row.handling}`}>{HANDLING_LABELS[row.handling]}</span><span className="owner-label">{row.assignee?.name ?? 'Chưa phân công'}</span>{row.unreadCount > 0 && <span className="unread-badge" aria-label={`${row.unreadCount} tin chưa đọc`}>{row.unreadCount}</span>}</span></span>
        </button></li>)}</ul>}
        {state === 'ready' && more && <button className="load-more" onClick={() => setLimit(value => value + 6)}>Tải thêm hội thoại</button>}
        {synced && <p className="sync-caption">Lần tải mẫu: {synced} · Giờ Việt Nam</p>}
      </section>
      <section className="conversation-detail" aria-label="Chi tiết hội thoại"><button className="text-button back-to-list" onClick={() => open(null)}>← Về danh sách</button>
        {!selectedId ? <div className="detail-placeholder"><span className="welcome-icon"><Icon name="chat" /></span><h2>Mỗi cuộc trò chuyện đều quan trọng</h2><p>Chọn một hội thoại để xem thông tin khách hàng và trạng thái xử lý.</p><span>12 hội thoại mẫu · Không có dữ liệu khách hàng thật</span></div> : detailState === 'loading' ? <p role="status">Đang mở hội thoại…</p> : !selected ? <div className="inbox-state" role="alert"><h2>{detailState === 'missing' ? 'Không tìm thấy hội thoại' : 'Chưa thể mở hội thoại'}</h2><button className="secondary-button" onClick={() => open(null)}>Về hộp thư</button></div> : <>
          <div className="detail-header"><span className="customer-avatar">{selected.customer.name.slice(0, 1)}</span><div><p className="eyebrow muted">HỘI THOẠI MẪU</p><h2>{selected.customer.name}</h2><p>{selected.customer.reference}</p></div></div>
          <span className={`handling-badge ${selected.handling}`}>{HANDLING_LABELS[selected.handling]}</span>
          <dl className="conversation-facts"><div><dt>Số tiếp nhận</dt><dd>{selected.business.name}<small>{selected.business.displayNumber}</small></dd></div><div><dt>Nhân viên phụ trách</dt><dd>{selected.assignee?.name ?? 'Chưa phân công'}</dd></div><div><dt>Mã yêu cầu</dt><dd>{selected.case?.reference ?? 'Chưa tạo yêu cầu'}</dd></div><div><dt>Tin chưa đọc</dt><dd>{selected.unreadCount} · Mở bản mẫu không đánh dấu đã đọc</dd></div></dl>
          <div className="last-message-card"><p>TIN NHẮN GẦN NHẤT</p><blockquote>{selected.lastMessage.preview}</blockquote><time dateTime={selected.lastMessage.at}>{time(selected.lastMessage.at)}</time></div>
          <p className="detail-boundary">Thông tin tổng quan từ dữ liệu mẫu. Lịch sử đầy đủ, gửi tin và tiếp quản sẽ được triển khai ở các tác vụ tiếp theo.</p>
        </>}
      </section>
    </div>
  </main>;
}
