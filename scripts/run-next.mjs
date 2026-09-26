import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const rootEnv = fileURLToPath(new URL('../.env', import.meta.url));
try { loadEnvFile(rootEnv); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const mode = process.argv[2];
if (!['dev', 'start', 'build', 'typegen'].includes(mode)) throw new Error('Unsupported Next.js command');
const args = [require.resolve('next/dist/bin/next'), mode];
if (mode === 'dev' || mode === 'start') {
  args.push('--hostname', process.env.WEB_HOST || '127.0.0.1', '--port', process.env.WEB_PORT || '3000');
}
const child = spawn(process.execPath, args, {
  cwd: fileURLToPath(new URL('../frontend', import.meta.url)),
  env: process.env,
  stdio: 'inherit',
});
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });
