# S1-006 backend foundation — manual test guide

Updated 2026-09-29. S1-006 backend work resumed at the user's request. These cases test the application skeleton and local infrastructure, not authentication, WhatsApp, AI, database models or job processing.

## Start here

Use PowerShell in the repository root. Prerequisites: Node 24.19.0+, within major 24; pnpm 10.32.1; running Docker Desktop with Linux containers. Docker was already installed and running when this task resumed. No Docker/WSL installation was performed.

For a fresh checkout, first run `pnpm install --frozen-lockfile` with the pinned tools on PATH. For the installed checkout:

```powershell
.\backend.cmd setup
.\backend.cmd infra-up
.\backend.cmd check
.\backend.cmd test
.\backend.cmd
```

Leave the final command running in terminal A. It builds and starts API/worker with TypeScript and Node watchers. Open terminal B in the same directory for the cases below. Defaults: API `http://127.0.0.1:3001`, worker `http://127.0.0.1:3002`. The frontend does not need to run. `backend.cmd` resolves an installed Node even when your terminal PATH is stale. Unknown launcher commands return exit code 1.

Root `.env` is loaded by each backend process; shell environment overrides it. To use other ports, set `$env:API_PORT='3301'` and `$env:WORKER_PORT='3302'` in **both** terminals before launching/checking, and use those ports in requests. Remove overrides with `Remove-Item Env:API_PORT, Env:WORKER_PORT -ErrorAction SilentlyContinue` after stopping the processes.

## 1. Setup preserves local settings

```powershell
$before = (Get-FileHash .env).Hash
.\backend.cmd setup
$before -eq (Get-FileHash .env).Hash
```

Expected: `Existing .env preserved.` and `True`. The command does not print credentials. If `.env` is absent on a fresh checkout, setup creates it from `.env.example`. Always use `pnpm run setup` if invoking pnpm directly: `pnpm setup` is a different, built-in pnpm command.

## 2. API and worker process health

```powershell
.\backend.cmd smoke
Invoke-RestMethod http://127.0.0.1:3001/health
Invoke-RestMethod http://127.0.0.1:3002/health
(Invoke-WebRequest http://127.0.0.1:3001/health).Headers['Cache-Control']
```

Expected: two `PASS` lines; each response has its own `service` (`api` / `worker`), `status=ok`, `scope=process`; header `no-store`. This only proves that the process is alive. Neither process connects to PostgreSQL or consumes Redis jobs yet.

## 3. Unimplemented routes are not fake successes

```powershell
curl.exe -i http://127.0.0.1:3001/missing
curl.exe -i -X POST http://127.0.0.1:3001/health
curl.exe -i http://127.0.0.1:3002/missing
curl.exe -i -X POST http://127.0.0.1:3002/health
```

Expected: HTTP 404 for all four requests. API may return a JSON error body; worker's 404 body is empty. There is no login/message endpoint in S1-006.

## 4. Database and Redis are genuinely running

```powershell
.\backend.cmd infra-status
.\backend.cmd infra-check
```

Expected: both containers healthy, bound to `127.0.0.1`, and `PASS PostgreSQL SELECT 1` / `PASS Redis PING`. The check executes commands inside the Compose containers. It does **not** validate a remote `DATABASE_URL`, application credentials, migrations or a queue consumer.

## 5. Dependency outage is reported separately

Only do this against this local development Compose project:

```powershell
docker compose stop
.\backend.cmd infra-check
$LASTEXITCODE
.\backend.cmd smoke
.\backend.cmd infra-up
.\backend.cmd infra-check
```

Expected while stopped: two infrastructure `FAIL` messages and exit code 1; process smoke still passes. After restore: infrastructure passes again. This distinction is intentional for the skeleton. There is no dependency-readiness endpoint yet.

## 6. Data survives container recreation

This uses a dedicated synthetic probe schema/key. If the schema already exists, clean up only your previous probe using the commands at the end before repeating. SQL errors stop the SQL command. Never add `--volumes` or `-v` to `down` for this test.

```powershell
docker compose exec -T postgres sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE SCHEMA s1006_manual_probe; CREATE TABLE s1006_manual_probe.persistence_probe (value text NOT NULL); INSERT INTO s1006_manual_probe.persistence_probe VALUES (''manual-ok'');"'
docker compose exec -T redis redis-cli SET s1006:manual:probe manual-ok NX
.\backend.cmd infra-down
.\backend.cmd infra-up
docker compose exec -T postgres sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT value FROM s1006_manual_probe.persistence_probe"'
docker compose exec -T redis redis-cli GET s1006:manual:probe
```

Expected: Redis `SET` initially returns `OK`; both final reads return `manual-ok`. Clean up only these probes:

```powershell
docker compose exec -T postgres sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "DROP TABLE s1006_manual_probe.persistence_probe; DROP SCHEMA s1006_manual_probe;"'
docker compose exec -T redis redis-cli DEL s1006:manual:probe
```

Expected: `DROP TABLE`, `DROP SCHEMA`, and Redis result `1`.

## 7. Bad configuration fails clearly

In another terminal, with Node on PATH (or set `NODE_EXE` to your approved Node path):

```powershell
$env:API_PORT='not-a-port'
node backend/api/dist/main.js
$LASTEXITCODE
Remove-Item Env:API_PORT
$env:WORKER_PORT='65536'
node backend/worker/dist/main.js
$LASTEXITCODE
Remove-Item Env:WORKER_PORT
```

Expected: startup error and exit code 1 for each, without exposing environment values or credentials. `0` is also rejected. If Node is not on PATH, replace `node` with `& "$env:LOCALAPPDATA\Programs\nodejs\node.exe"`. These direct commands do not load `.env`.

## 8. Port conflict does not terminate the original service

Keep terminal A running; in terminal B run `.\backend.cmd start` with the same ports. Expected: the second runner fails and stops its own sibling process. The original terminal A services remain healthy when you run `.\backend.cmd smoke`. Do not kill an unrelated process to free a port; choose alternative test ports instead.

## 9. Stop, restart and production build

Stop terminal A with Ctrl+C; answer `Y` if Windows asks to terminate the batch job. Confirm health requests now fail to connect. Then:

```powershell
.\backend.cmd build
.\backend.cmd start
```

In terminal B, `.\backend.cmd smoke` should pass again. Production start requires the build and has no watchers. Stop it with Ctrl+C when done. `.\backend.cmd infra-down` stops/removes this project's containers and keeps data volumes.

## Automated and observed evidence

- `backend.cmd check`: ESLint, API/worker TypeScript and both production builds passed.
- `backend.cmd test`: six real-process test cases covering both services' HTTP responses, restart, invalid ports and occupied-port ownership. No mocked database/queue success.
- Production and development runners: both services started and backend-only smoke passed on dedicated test ports 3301/3302; development watchers reported zero errors and restarted the compiled processes.
- Docker Compose configuration validated; PostgreSQL `SELECT 1`, Redis `PING`, dependency outage/recovery and named-volume persistence across `down`/`up` passed. Synthetic probes removed afterward.
- Frozen offline dependency reinstall accepted the existing lockfile; this checks reproducibility with an already-populated package cache, not first-time network availability.
- Setup invoked twice preserved `.env`. During testing the older launcher revealed a `pnpm setup` collision; pnpm's built-in command added its user `PNPM_HOME`/PATH entry. Both launchers now use `pnpm run` for project scripts, preventing that side effect. No existing PATH entries were intentionally removed.
- First API test run exceeded the original startup allowance; a diagnostic API started successfully and the rerun passed. Startup allowance was increased for cold starts. Final `backend.cmd check` and `backend.cmd test` passed: six tests, zero failures. Temporary API/worker verification processes were stopped; PostgreSQL/Redis were left healthy for manual testing.

S1-006 does not deploy the backend to a VPS, connect the Vercel UI, implement business tables or migrations, or provide real auth/WhatsApp/AI/queue processing. Those remain subsequent tasks.
