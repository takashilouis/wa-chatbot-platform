# S1-006 implementation and verification

Date: 2026-09-25. Scope: application scaffold and reproducible local setup only.

Current status: **S1-006 resumed and completed on 2026-09-29**. The installed Docker engine now supports verified PostgreSQL/Redis runtime and persistence checks. See [current evidence and manual tests](16-s1-006-backend-manual-tests.md). The remainder below preserves the 2026-09-25 historical evidence and its then-outstanding limitations. This is historical scaffold evidence; paths below predate the move from `apps/web` to `frontend`, and `apps/api` / `apps/worker` to `backend/api` / `backend/worker`. See [current setup](09-development-setup.md) and [S1-008 FE](11-s1-008-frontend.md). Docker/WSL2 will not be installed on this laptop.

## Implemented

- pnpm workspace with exact direct dependency versions and `pnpm-lock.yaml`.
- Node 24 baseline, pinned pnpm executable and shared strict TypeScript configuration.
- Next.js/React web application with a clearly labeled Vietnamese foundation page and process-health route.
- NestJS API with process-health controller, configurable loopback listener and shutdown hooks.
- Separate Node/TypeScript worker with process health and shutdown handling; no pretend job processing.
- Shared root environment example, non-overwriting setup script and ignored local secrets/build outputs.
- PostgreSQL and Redis Compose services with health checks, loopback bindings and persistent named volumes.
- Development watchers, production build/start, lint/type checks, live application smoke check and explicit infrastructure check commands.
- [Development guide](09-development-setup.md) and updated project/task status. Existing design exports and plans retained.

## Checks executed

| Check | Result | Evidence / practical limit |
|---|---|---|
| Pinned dependency install | Passed | pnpm 10.32.1 installed all workspace dependencies and produced the lockfile |
| Frozen offline reinstall | Passed | Existing lockfile accepted without dependency re-resolution; uses the populated local package cache |
| `pnpm setup` twice | Passed | First invocation created `.env`; second preserved it |
| Script syntax checks | Passed | Node parsed setup, Next launcher and application smoke scripts |
| `pnpm check` | Passed | Final ESLint 10 configuration, all three type checks and production builds succeeded |
| `pnpm start` then `pnpm smoke` | Passed | Real local HTTP requests reached web/API/worker and rendered Vietnamese page |
| `pnpm dev` then `pnpm smoke` | Passed | All development servers/watchers started; TypeScript reported zero errors; process smoke passed |
| Browser desktop/mobile check | Passed | Headless Edge, 1280px and 390px viewport widths; expected heading visible, no horizontal overflow or page exceptions |
| Visual inspection | Passed | Desktop screenshot reviewed for readable labels and honest unimplemented-feature states |
| Compose YAML structure | Passed | Parsed services, health checks and loopback port bindings; this is not Docker Compose runtime validation |
| PostgreSQL `SELECT 1` and Redis `PING` | Not verified | Docker executable/Desktop is absent on this host; infrastructure check correctly reports failure |

Local verification invoked the pinned pnpm JavaScript entry point because the host's global pnpm was a different major version. Project scripts themselves resolve the pinned workspace pnpm. Standard installations can use the documented `pnpm` commands after activating 10.32.1.

Sandbox process-launch restrictions required running build/server/browser checks with the allowed elevated tool execution path. Checks then passed; this is a host execution detail, not a project runtime dependency.

## Remaining acceptance evidence

On a Docker-enabled development machine, run:

```text
pnpm install --frozen-lockfile
pnpm setup
pnpm infra:up
pnpm infra:check
pnpm check
pnpm dev
```

In a second terminal, run `pnpm smoke`. Confirm both containers are healthy, `SELECT 1`/`PING` pass and data volumes remain after `pnpm infra:down`. This completes the outstanding local infrastructure validation. It does not complete S1-007 database models or S1-011 queue integration.

S1-006 is left **in review**, not checked off, to preserve the backlog rule that acceptance evidence must exist before completion. No request for additional approval is needed to run these checks in an environment with Docker.

## Not claimed

No authenticated staff inbox, migrations, WhatsApp connection, AI provider, business workflow, BullMQ consumer, staging deployment, paid cloud resource or production readiness is implemented by this task. `/health` means process liveness only. No real customer data or credentials were introduced.
