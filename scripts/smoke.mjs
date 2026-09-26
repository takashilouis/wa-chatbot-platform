import assert from 'node:assert/strict';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

try { loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url))); }
catch (error) { if (error.code !== 'ENOENT') throw error; }

const urls = {
  web: `http://${process.env.WEB_HOST || '127.0.0.1'}:${process.env.WEB_PORT || '3000'}`,
  api: `http://${process.env.API_HOST || '127.0.0.1'}:${process.env.API_PORT || '3001'}`,
  worker: `http://${process.env.WORKER_HOST || '127.0.0.1'}:${process.env.WORKER_PORT || '3002'}`,
};
for (const [service, base] of Object.entries(urls)) {
  if (process.argv.includes('--frontend-only') && service !== 'web') continue;
  const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(10000) });
  assert.equal(response.status, 200, `${service} health status`);
  const health = await response.json();
  assert.equal(health.service, service);
  assert.equal(health.status, 'ok');
  assert.equal(health.scope, 'process');
  console.log(`PASS ${service} process health`);
}
const page = await fetch(urls.web, { signal: AbortSignal.timeout(10000) });
assert.equal(page.status, 200);
assert.equal(new URL(page.url).pathname, '/login');
// Production HTML may contain the Suspense fallback before browser hydration.
assert.match(await page.text(), /Đăng nhập|Đang tải đăng nhập|Chế độ thử nghiệm/);
console.log('PASS Vietnamese login route/HTML; browser tests verify the hydrated UI. No backend readiness implied.');
