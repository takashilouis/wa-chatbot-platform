import { spawnSync } from 'node:child_process';

const checks = [
  {
    name: 'PostgreSQL SELECT 1',
    args: ['compose', 'exec', '-T', 'postgres', 'sh', '-c', 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1"'],
    expected: '1',
  },
  { name: 'Redis PING', args: ['compose', 'exec', '-T', 'redis', 'redis-cli', 'ping'], expected: 'PONG' },
];
for (const check of checks) {
  const result = spawnSync('docker', check.args, { encoding: 'utf8', timeout: 15000 });
  if (result.error || result.status !== 0 || result.stdout.trim() !== check.expected) {
    console.error(`FAIL ${check.name}. Ensure Docker is running and run pnpm infra:up first.`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${check.name}`);
  }
}
