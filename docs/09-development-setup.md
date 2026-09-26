# Development setup — frontend first

Updated 2026-09-25. S1-006 and backend implementation are temporarily paused at the user's request. Docker/WSL2 are unavailable on the GA laptop. Neither is required for current frontend work.

## Start on this Windows laptop

From the repository root:

```powershell
.\frontend.cmd
```

Open http://127.0.0.1:3000/login. Select a public demo account, then click **Đăng nhập**. Ctrl+C stops the frontend. The launcher resolves an existing Node installation even when a terminal has stale PATH; it changes PATH only for its child process. It does not install software or change corporate settings. Set `NODE_EXE` to an approved Node executable if automatic detection fails.

```powershell
.\frontend.cmd check
.\frontend.cmd test
.\frontend.cmd build
.\frontend.cmd start
```

`check` runs frontend lint, TypeScript and production build. `test` launches a separate FE dev server on port 3100 and runs browser tests with installed Microsoft Edge on Windows. On Linux, install the matching Playwright Chromium browser before testing. `start` serves the production build; stop the dev server first.

## Fresh checkout

Use Node 24.19.0 and pnpm 10.32.1, pinned in the manifests. With these approved tools on PATH:

```text
pnpm install --frozen-lockfile
pnpm setup
pnpm dev:frontend
```

`setup` creates root `.env` only if missing. Ensure `NEXT_PUBLIC_AUTH_MODE=demo` is set for this UI preview. Existing `.env` files are never overwritten by setup. Process environment takes precedence over root `.env`. Public Next variables are included in the frontend bundle; rebuild after changing them. `unconfigured` disables demo login. Never put secrets under `NEXT_PUBLIC_`.

On this already-installed checkout, `frontend.cmd install` refreshes dependencies with the frozen lockfile. It needs the local pinned pnpm package from the initial installation.

## Separate applications

```text
frontend/       Next.js staff website, frontend auth adapters and browser tests
backend/api/    NestJS scaffold, paused
backend/worker/ TypeScript worker scaffold, paused
scripts/        Shared setup/launch/check utilities
compose.yaml    Retained PostgreSQL/Redis configuration; not running here
```

These are separate packages and processes in one pnpm workspace, sharing a lockfile and common lint/TypeScript settings. They are not separate repositories. The FE does not import backend code or need a backend process.

| Command | Scope |
|---|---|
| `pnpm dev` / `pnpm dev:frontend` | Frontend only |
| `pnpm start` / `pnpm start:frontend` | Built frontend only |
| `pnpm check:frontend` | FE lint, typecheck and build |
| `pnpm test:frontend` | FE browser tests |
| `pnpm smoke` | Running frontend page and process health |
| `pnpm check` / `pnpm build` | Whole-workspace checks/builds; retained for future integration |
| `pnpm dev:backend` | Explicit API/worker runner; paused, do not use for current FE work |
| `pnpm smoke:all` | All three processes; only useful when BE resumes |

Frontend health is http://127.0.0.1:3000/health and reports process liveness only. Paused API and worker default to ports 3001 and 3002. PostgreSQL, Redis, Meta and AI readiness are not implied by a green health response.

## Current limits and troubleshooting

- Public demo accounts and browser sessionStorage are only for synthetic UI testing. They provide no real authentication or server-side authorization.
- The inbox, real staff identities, database, queue, WhatsApp and AI are not connected.
- If port 3000 is occupied, stop the owned FE process or change `WEB_PORT` in root `.env`.
- A `node` command-not-found error happens before any OpenAI call. This FE does not call OpenAI or validate any API key. API credentials will be checked when an actual backend integration is authorized.
- No Docker/WSL install is required or attempted. See [remote environment options](12-remote-docker-options.md).
- Dependencies and generated files are ignored; do not remove the lockfile to resolve a version mismatch.

See [S1-008 FE evidence](11-s1-008-frontend.md) for the implemented scope, test results and future integration contract.
