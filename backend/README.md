# Backend — temporarily paused

Paused 2026-09-25 at the user's request because Docker/WSL2 cannot be installed on the GA laptop.

`api/` retains the NestJS application scaffold. `worker/` retains the separate TypeScript process scaffold. Neither implements authentication, persistence, messaging, AI or queue processing. The existing Compose configuration is retained at the repository root for a future approved environment.

Frontend development is independent in `../frontend/`. Default root `dev` and `start` run only frontend. `pnpm dev:backend` is retained for later resumption, not part of the current FE workflow.

See [sprint status](../docs/08-sprint-1-tasks.md) and [remote environment options](../docs/12-remote-docker-options.md).
