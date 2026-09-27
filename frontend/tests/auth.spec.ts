import { test, expect, type Page } from '@playwright/test';

const key = 'wachatbot.demo-session.v1';
async function login(page: Page, admin = false) {
  await page.goto('/login');
  await page.getByRole('button', { name: admin ? /Quản trị viên admin/ : /Nhân viên linh/ }).click();
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/workspace$/);
}

test('signed-out routes redirect and validation is accessible', async ({ page }) => {
  await page.goto('/workspace');
  await expect(page).toHaveURL(/\/login\?next=/);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByLabel('Email công việc')).toBeFocused();
  await expect(page.getByText('Nhập địa chỉ email hợp lệ.')).toBeVisible();
  await expect(page.getByText('Nhập mật khẩu của bạn.')).toBeVisible();
});

test('wrong credentials fail and password visibility can be toggled', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email công việc').fill('linh@demo.local');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('incorrect');
  await page.getByRole('button', { name: 'Hiện mật khẩu' }).click();
  await expect(page.getByLabel('Mật khẩu', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('session survives refresh, contains no password, and logout blocks return', async ({ page }) => {
  await login(page);
  const stored = await page.evaluate(k => sessionStorage.getItem(k), key);
  expect(Object.keys(JSON.parse(stored!)).sort()).toEqual(['accountId', 'expiresAt']);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Xin chào, Nguyễn Linh.' })).toBeVisible();
  await page.getByRole('button', { name: 'Đăng xuất' }).click();
  await page.goto('/workspace');
  await expect(page).toHaveURL(/\/login/);
});

test('agent cannot view admin screen; admin can', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('link', { name: 'Quyền truy cập' })).toHaveCount(0);
  await page.goto('/workspace/access');
  await expect(page.getByRole('heading', { name: 'Bạn không có quyền truy cập' })).toBeVisible();
  await page.getByRole('button', { name: 'Đăng xuất' }).click();
  await login(page, true);
  await page.getByRole('link', { name: 'Quyền truy cập' }).click();
  await expect(page.getByRole('heading', { name: 'Tài khoản thử nghiệm' })).toBeVisible();
});

test('external redirect is rejected', async ({ page }) => {
  await page.goto('/login?next=https://example.com');
  await page.getByRole('button', { name: /Nhân viên linh/ }).click();
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:3100/workspace');
});

for (const value of ['not-json', JSON.stringify({ accountId: 'demo-admin', expiresAt: 1 })]) {
  test(`invalid or expired stored session is discarded: ${value}`, async ({ page }) => {
    await page.addInitScript(({ key, value }) => sessionStorage.setItem(key, value), { key, value });
    await page.goto('/workspace');
    await expect(page).toHaveURL(/\/login/);
  });
}

test('active session expires without refresh', async ({ page }) => {
  await page.clock.install();
  await login(page);
  await page.clock.fastForward(30 * 60 * 1000 + 1000);
  await expect(page).toHaveURL(/\/login/);
});

test('blocked storage reports failure instead of claiming success', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  await page.goto('/login');
  await page.getByRole('button', { name: /Nhân viên linh/ }).click();
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('mobile layout and keyboard login work without backend requests', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const backendRequests: string[] = [];
  page.on('request', request => { if (/:(3001|3002)\b|api\.openai|graph\.facebook/.test(request.url())) backendRequests.push(request.url()); });
  await page.goto('/login');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeEnabled();
  await page.screenshot({ path: 'test-results/login-mobile.png', fullPage: true });
  await page.getByRole('button', { name: /Nhân viên linh/ }).click();
  await page.getByLabel('Mật khẩu', { exact: true }).press('Enter');
  await expect(page).toHaveURL(/\/workspace$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(backendRequests).toEqual([]);
});

test('desktop preview', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeEnabled();
  await page.screenshot({ path: 'test-results/login-desktop.png', fullPage: true });
});
