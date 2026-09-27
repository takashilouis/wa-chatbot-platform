import { test, expect } from '@playwright/test';
import { createDemoInbox } from '../lib/inbox/demo-client';
import type { InboxQuery } from '../lib/inbox/contracts';
const query: InboxQuery = { search: '', handling: 'all', businessId: '', unreadOnly: false, limit: 6 };
test('cursor pages contain unique records and filters are deterministic', async () => {
  const client = createDemoInbox();
  const first = await client.list(query);
  const second = await client.list({ ...query, cursor: first.nextCursor! });
  expect(new Set([...first.items, ...second.items].map(row => row.id)).size).toBe(12);
  expect(second.nextCursor).toBeNull();
  expect((await client.list({ ...query, search: 'nguyen thao an' })).items[0]?.id).toBe('demo-1');
  await expect(client.list({ ...query, cursor: 'bad' })).rejects.toMatchObject({ code: 'invalid_cursor' });
});
test('cancellation, missing records and subscription cleanup', async () => {
  const client = createDemoInbox();
  const controller = new AbortController();
  controller.abort();
  await expect(client.list(query, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  await expect(client.get('missing')).rejects.toMatchObject({ code: 'not_found' });
  await expect(client.messages('demo-1')).rejects.toMatchObject({ code: 'unavailable' });
  let events = 0;
  const stop = client.subscribe(() => { events++; });
  client.simulateMessage(); stop(); client.simulateMessage();
  expect(events).toBe(1);
  expect((await client.get('demo-1')).unreadCount).toBe(3);
});
