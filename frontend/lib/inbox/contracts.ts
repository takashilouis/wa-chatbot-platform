/** Proposed v1 transport contract. All IDs are opaque; timestamps are UTC ISO 8601. */
export type HandlingState = 'bot' | 'waiting' | 'staff' | 'completed';
export type BusinessIdentity = { id: string; name: string; displayNumber: string };
export type Conversation = {
  id: string; workspaceId: string; business: BusinessIdentity;
  customer: { name: string; reference: string }; handling: HandlingState;
  assignee: { id: string; name: string } | null;
  lastMessage: { preview: string; at: string; kind: 'text' | 'image' | 'document' };
  unreadCount: number; version: number;
  case: { reference: string; stage: 'intake' | 'pending' | 'confirmed' | 'closed' } | null;
};
export type InboxQuery = { search: string; handling: HandlingState | 'all'; businessId: string; unreadOnly: boolean; cursor?: string; limit: number };
export type Page<T> = { items: T[]; nextCursor: string | null; total: number; snapshotVersion: string };
export type Message = { id: string; conversationId: string; direction: 'inbound' | 'outbound'; text: string | null; kind: 'text' | 'image' | 'document'; at: string; status: 'received' | 'pending' | 'accepted' | 'delivered' | 'read' | 'failed' | 'uncertain'; mediaId?: string };
export type InboxEvent = { id: string; workspaceId: string; conversationId?: string; version: number; type: 'conversation.changed' | 'message.status' | 'resync.required' };
export type InboxErrorCode = 'unauthenticated' | 'forbidden' | 'not_found' | 'unavailable' | 'invalid_cursor';
export class InboxError extends Error { constructor(public code: InboxErrorCode) { super(code); } }
export interface InboxClient {
  list(query: InboxQuery, signal?: AbortSignal): Promise<Page<Conversation>>;
  get(id: string, signal?: AbortSignal): Promise<Conversation>;
  messages(id: string, cursor?: string, signal?: AbortSignal): Promise<Page<Message>>;
  /** Events invalidate cached state. Reconnect must reload authoritative snapshots. */
  subscribe(listener: (event: InboxEvent) => void): () => void;
}
export const HANDLING_LABELS: Record<HandlingState, string> = { bot: 'Bot đang xử lý', waiting: 'Chờ nhân viên', staff: 'Nhân viên xử lý', completed: 'Đã hoàn tất' };
