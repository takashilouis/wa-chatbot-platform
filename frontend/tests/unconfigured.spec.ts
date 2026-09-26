import { test, expect } from '@playwright/test';

test('unconfigured auth refuses sign-in even with a forged demo session', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('wachatbot.demo-session.v1', JSON.stringify({ accountId: 'demo-admin', expiresAt: Date.now() + 60000 })));
  await page.goto('/workspace/access');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('form').getByRole('alert')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: /Quản trị viên admin/ })).toHaveCount(0);
});
