# S1-016 frontend inbox contract (proposed v1)

Date: 2026-09-27. FE implementation is independent of paused backend tasks. Source: `frontend/lib/inbox/contracts.ts`. The in-memory adapter is a synthetic test double; it does not provide authentication, authorization, persistence or a real event channel.

## Resources and proposed transport

| Operation | Proposed HTTP contract | FE type |
|---|---|---|
| List | `GET /v1/conversations?search=&handling=&businessId=&unreadOnly=&cursor=&limit=` | `Page<Conversation>` |
| Detail | `GET /v1/conversations/:id` | `Conversation` |
| Transcript (later UI) | `GET /v1/conversations/:id/messages?cursor=&limit=` | `Page<Message>` |
| Events | Authenticated connection; invalidate on event, reload on reconnect | `InboxEvent` |

Use opaque IDs, UTC ISO timestamps and stable ordering by latest-message time descending, with ID as a tie-breaker. Return explicit `nextCursor: null` at the end. Real server cursors must bind filters, account scope and the snapshot to avoid skips/duplicates during live updates. The demo uses offset cursors solely to test the shape; it is not a production pagination implementation. The current screen expands a bounded first-page limit when loading more, and reloads that visible snapshot on events. A scalable cursor-based cache can replace this for large datasets.

Conversations include workspace, business-number identity, customer display reference, last-message preview/kind/time, unread count, assignee, version, and optional case reference/stage. Handling state (`bot`, `waiting`, `staff`, `completed`) is separate from case stage (`intake`, `pending`, `confirmed`, `closed`). Outbound message status distinguishes provider acceptance from delivery, and uncertain sends from known failures. No media download URLs or bearer credentials are embedded in this contract.

Normalize transport failures to `unauthenticated`, `forbidden`, `not_found`, `unavailable`, or `invalid_cursor`. The future HTTP adapter must validate response bodies at runtime, handle non-2xx responses and honor AbortSignal; a TypeScript assertion alone is insufficient. The current demo adapter validates cursors and supports cancellation, but is not an HTTP client. Nonexistent or inaccessible IDs must not leak records. Messages and the full transcript belong to S1-018 onward; S1-016 only defines their type boundary.

## Events and reconnect

Events carry an event ID, workspace ID, optional conversation ID, record/event version and a type (`conversation.changed`, `message.status`, `resync.required`). They are invalidation hints, not the only copy of data. The FE subscribes on mount, unsubscribes on unmount, cancels obsolete loads and reloads list/detail snapshots after an event. Browser reconnect also triggers reload. In the demo, a clearly labeled button changes a fixture and emits an event; there is no socket connected to WhatsApp.

The real adapter must authenticate the connection, detect transport reconnects (not only browser online events), request resync when a sequence gap is detected, and prevent old versions overwriting newer state. The backend must derive permitted accounts/rooms from the server session; never trust a client-provided role/workspace. Validate authorization on every list/detail/message/media operation and reconnect. D19 and cross-account isolation are outstanding BE acceptance criteria.

## Demo behavior

Twelve synthetic Vietnamese contacts and two clearly labeled fake business identities cover four handling states. The second identity exercises filtering and does not expand the Phase 1 live-number scope. Search ignores Vietnamese accents, filters compose, and selected IDs are reflected in the URL. Opening the summary does not claim to mark messages read or acquire ownership. Reload resets fixture mutations by design. A real unread/claim mutation will need explicit server semantics and concurrency checks later.

The UI includes loading, no results, empty mailbox, request failure/retry, unknown detail ID and offline notices. Test controls stay visibly labeled as simulation. The list and detail panes collapse to one pane on mobile with a back button. Only a last-message preview is shown; no fake send or takeover controls are provided.
