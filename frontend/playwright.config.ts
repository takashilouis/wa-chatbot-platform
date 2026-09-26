import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'auth.spec.ts',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3100', channel: process.platform === 'win32' ? 'msedge' : undefined, trace: 'retain-on-failure' },
  webServer: {
    command: 'node ../scripts/run-next.mjs dev',
    url: 'http://127.0.0.1:3100/health',
    env: { WEB_PORT: '3100', NEXT_PUBLIC_AUTH_MODE: 'demo' },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
