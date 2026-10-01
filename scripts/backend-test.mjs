import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

async function reservePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, port: server.address().port };
}

function launch(service, port) {
  const prefix = service.toUpperCase();
  // Deliberately do not load .env: tests use only synthetic process configuration.
  const child = spawn(process.execPath, [`backend/${service}/dist/main.js`], {
    cwd: root,
    env: { ...process.env, [`${prefix}_HOST`]: '127.0.0.1', [`${prefix}_PORT`]: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  // Consume output without echoing potential environment details into test reports.
  child.stdout.resume();
  child.stderr.resume();
  const exited = once(child, 'exit');
  return { child, exited };
}

async function stop(running) {
  if (running.child.exitCode === null && running.child.signalCode === null) running.child.kill();
  await running.exited;
}

async function health(base, running) {
  for (let attempt = 0; attempt < 300; attempt++) {
    if (running.child.exitCode !== null) throw new Error('Service exited before becoming live');
    try { return await fetch(`${base}/health`, { signal: AbortSignal.timeout(500) }); }
    catch { await delay(100); }
  }
  throw new Error('Service did not become live within the test deadline');
}

for (const service of ['api', 'worker']) {
  test(`${service}: real HTTP health, unsupported routes and restart`, { timeout: 90000 }, async () => {
    const reserved = await reservePort();
    await new Promise(resolve => reserved.server.close(resolve));
    const base = `http://127.0.0.1:${reserved.port}`;
    for (let restart = 0; restart < 2; restart++) {
      const running = launch(service, reserved.port);
      try {
        const response = await health(base, running);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.deepEqual(await response.json(), { service, status: 'ok', scope: 'process' });
        for (const [path, method] of [['/missing', 'GET'], ['/health', 'POST']]) {
          assert.equal((await fetch(`${base}${path}`, { method, signal: AbortSignal.timeout(2000) })).status, 404);
        }
      } finally { await stop(running); }
    }
  });

  test(`${service}: rejects invalid ports`, { timeout: 15000 }, async () => {
    for (const port of ['bad', '0', '65536']) {
      const running = launch(service, port);
      try {
        const [code] = await running.exited;
        assert.equal(code, 1);
      } finally { await stop(running); }
    }
  });

  test(`${service}: occupied port fails without stopping its owner`, { timeout: 15000 }, async () => {
    const reserved = await reservePort();
    const running = launch(service, reserved.port);
    try {
      const [code] = await running.exited;
      assert.equal(code, 1);
      assert.equal(reserved.server.listening, true);
    } finally {
      await stop(running);
      await new Promise(resolve => reserved.server.close(resolve));
    }
  });
}
