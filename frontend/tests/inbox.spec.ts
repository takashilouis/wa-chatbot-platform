import { test, expect, type Page } from '@playwright/test';

async function enter(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: /Nhân viên linh/ }).click();
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.getByRole('link', { name: 'Hộp thư chung' }).click();
  await expect(page.getByText('12 hội thoại · 6 đang hiển thị')).toBeVisible();
}
test('signed-out conversation link returns to its detail after demo login', async ({ page }) => {
  await page.goto('/workspace/inbox?conversation=demo-1');
  await expect(page).toHaveURL(/\/login\?next=/);
  await page.getByRole('button', { name: /Nhân viên linh/ }).click();
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Nguyễn Thảo An' })).toBeVisible();
});
test('inbox filters, pagination and selection survive a refresh', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'Tải thêm hội thoại' }).click();
  await expect(page.getByText('12 hội thoại · 12 đang hiển thị')).toBeVisible();
  await page.getByRole('button', { name: 'Chờ nhân viên', exact: true }).click();
  await expect(page.getByText('3 hội thoại · 3 đang hiển thị')).toBeVisible();
  await page.getByRole('button', { name: /Nguyễn Thảo An/ }).click();
  await expect(page.getByRole('heading', { name: 'Nguyễn Thảo An' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Nguyễn Thảo An' })).toBeVisible();
  await page.getByRole('button', { name: 'Tất cả', exact: true }).click();
  await page.getByLabel('Tìm hội thoại').fill('hoang yen');
  await expect(page.getByText('1 hội thoại · 1 đang hiển thị')).toBeVisible();
  await expect(page.getByRole('button', { name: /Lê Hoàng Yến/ })).toBeVisible();
  await page.getByLabel('Tìm hội thoại').fill('');
  await page.getByRole('combobox', { name: 'Số WhatsApp', exact: true }).selectOption('demo-care');
  await expect(page.getByText('6 hội thoại · 6 đang hiển thị')).toBeVisible();
  await page.getByLabel('Chưa đọc', { exact: true }).check();
  await expect(page.getByRole('heading', { name: 'Không có hội thoại' })).toBeVisible();
});
test('loading, empty, failure and retry states work', async ({ page }) => {
  await enter(page);
  await page.getByText('Công cụ kiểm tra giao diện', { exact: true }).click();
  await page.getByLabel('Kịch bản').selectOption('empty');
  await expect(page.getByRole('heading', { name: 'Không có hội thoại' })).toBeVisible();
  await page.getByLabel('Kịch bản').selectOption('error');
  await expect(page.getByRole('heading', { name: 'Chưa thể tải hộp thư' })).toBeVisible();
  await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(page.getByText('12 hội thoại · 6 đang hiển thị')).toBeVisible();
});
test('events refresh list and detail; reconnect reloads state', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: /Nguyễn Thảo An/ }).click();
  await page.getByText('Công cụ kiểm tra giao diện', { exact: true }).click();
  await page.getByRole('button', { name: 'Mô phỏng tin mới' }).click();
  await expect(page.locator('blockquote')).toContainText('Tin nhắn mô phỏng mới #2');
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.getByText('Trình duyệt ngoại tuyến', { exact: true })).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(page.getByText('Dữ liệu mô phỏng', { exact: true })).toBeVisible();
  await expect(page.locator('blockquote')).toContainText('Tin nhắn mô phỏng mới #2');
});
test('unknown conversation shows not-found and mobile can return to list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enter(page);
  await page.getByRole('button', { name: /Nguyễn Thảo An/ }).click();
  await expect(page.getByRole('heading', { name: 'Nguyễn Thảo An' })).toBeVisible();
  await page.getByRole('button', { name: '← Về danh sách' }).click();
  await expect(page.getByLabel('Tìm hội thoại')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/inbox-mobile.png', fullPage: true });
  await page.goto('/workspace/inbox?conversation=missing');
  await expect(page.getByRole('heading', { name: 'Không tìm thấy hội thoại' })).toBeVisible();
});
test('desktop preview and health identify FE-only deployment', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await enter(page);
  await page.getByRole('button', { name: /Nguyễn Thảo An/ }).click();
  await expect(page.getByRole('heading', { name: 'Nguyễn Thảo An' })).toBeVisible();
  await page.screenshot({ path: 'test-results/inbox-desktop.png', fullPage: true });
  const health = await request.get('/health');
  expect(await health.json()).toMatchObject({ scope: 'process', backend: 'not_connected', authMode: 'demo', build: expect.any(String) });
});
