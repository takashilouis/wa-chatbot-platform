# Backend foundation

S1-006 resumed and completed on 2026-09-29. `api/` is a NestJS process; `worker/` is a separate TypeScript process. Docker PostgreSQL and Redis run locally with persistent named volumes. This skeleton does not yet connect application data, consume jobs, authenticate staff, or call WhatsApp/AI.

From the repository root, after installing pinned workspace dependencies:

```powershell
.\backend.cmd setup
.\backend.cmd infra-up
.\backend.cmd check
.\backend.cmd test
.\backend.cmd
```

In a second terminal: `.\backend.cmd smoke` checks the running API/worker; `.\backend.cmd infra-check` checks PostgreSQL/Redis independently. Defaults are loopback ports 3001/3002. `/health` returns process liveness only, with no credentials or connection details. Stop processes with Ctrl+C (and answer Y to the Windows batch prompt).

`backend.cmd build` followed by `backend.cmd start` runs the compiled services without watchers. `backend.cmd infra-down` removes containers but retains their data volumes. No Docker installation is attempted by these commands.

Cross-platform equivalents: `pnpm run setup`, `pnpm infra:up`, `pnpm check:backend`, `pnpm test:backend`, `pnpm dev:backend`, `pnpm smoke:backend`, `pnpm infra:check`. Root `dev` and `start` remain frontend-only. Shared pnpm dependencies are expected at repository root.

Read [manual test cases and verification](../docs/16-s1-006-backend-manual-tests.md), [development setup](../docs/09-development-setup.md) and [sprint status](../docs/08-sprint-1-tasks.md).
