# Vietnamese WhatsApp Assistant — Design and Delivery Plan

Status (2026-09-27): S1-008-FE, S1-009-FE, S1-016-FE and S1-017-FE are complete for frontend scope. [Open the live staging demo](https://wa-chatbot-platform-staging.vercel.app). Select a demo account on the login page, then click **Đăng nhập**. S1-006 and backend implementation remain paused because the GA laptop cannot install Docker/WSL2. Real authentication, WhatsApp messaging and persistent storage remain outstanding. See [verification and deployment details](docs/15-frontend-staging-and-inbox-verification.md).

Applications are separated into `frontend/` (Next.js website) and `backend/api/` / `backend/worker/` (retained scaffolds). They share a pnpm workspace. The user approved the high-level flowchart as a design direction; that does not mean every business rule is finalized.

## Run locally

Use Node 24.19.0 and pnpm 10.32.1. See the [development setup guide](docs/09-development-setup.md) for prerequisites, commands and troubleshooting.

```powershell
.\frontend.cmd
```

Open http://127.0.0.1:3000/login. Choose a demo account, then click **Đăng nhập**. No Docker/backend/API key is required. The Windows launcher resolves Node even in a terminal with stale PATH. Run `.\frontend.cmd check` for FE lint/types/build and `.\frontend.cmd test` for browser tests. On a fresh checkout, install pinned dependencies and run setup first as described in the [setup guide](docs/09-development-setup.md). Root `pnpm dev` and `pnpm start` now run FE only.

## Start here

1. [Two-phase delivery plan](docs/04-delivery-plan.md) — scope, sequencing, estimates, dependencies and release gates.
2. [Product requirements](docs/01-product-requirements.md) — agreed needs, assumptions and exclusions.
3. [Functional architecture and handoff](docs/02-architecture.md) — application boundaries, data flow and conversation ownership.
4. [Vietnamese market research](docs/03-market-research.md) — prior research, sources and design implications.
5. [Test and friend-pilot plan](docs/05-test-and-pilot-plan.md) — concrete scenarios and acceptance criteria.
6. [Decisions and open questions](docs/06-decisions-and-questions.md) — confirmed directions, provisional choices and unresolved inputs.
7. [Feedback register](docs/07-feedback-register.md) — template for recording pilot findings and phase-two priorities.
8. [Sprint 1 task backlog](docs/08-sprint-1-tasks.md) — 48 actionable tasks with owners, dependencies, deliverables, acceptance checks and a completion log.
9. [Development setup](docs/09-development-setup.md) — reproducible local application and infrastructure startup.
10. [S1-006 verification](docs/10-s1-006-verification.md) — implemented scope, executed checks and outstanding Docker validation.
11. [S1-008 frontend](docs/11-s1-008-frontend.md) — implemented UI scope, demo accounts, verification and future auth integration.
12. [Remote Docker options](docs/12-remote-docker-options.md) — cloud development and staging recommendations for a restricted laptop.
13. [Git, workspace dependencies and Vietnam VPS](docs/13-git-workspace-and-vietnam-vps.md) — repository setup, why root node_modules is correct, sizing and provider shortlist.
14. [Inbox frontend contract](docs/14-inbox-frontend-contract.md) — types, pagination, events and backend obligations.
15. [Frontend staging and inbox verification](docs/15-frontend-staging-and-inbox-verification.md) — Vercel setup and S1-009/016/017 scope and evidence.

## Architecture exports

- [High-resolution PNG](exports/whatsapp-architecture.png)
- [High-resolution JPG](exports/whatsapp-architecture.jpg)
- [Editable Mermaid diagram](exports/architecture.mmd)

The diagram is a functional architecture, not an AWS deployment commitment. Its blocks may share one application and database initially.

## Document maintenance

Update these documents when a decision changes. Record the decision and reason in the decision log; update the affected requirements, plan and tests together. Keep credentials and private customer conversations out of this repository. Link to redacted evidence rather than committing raw personal data.

Initial documentation baseline: 2026-09-24, based on the design conversation and research performed earlier in this task.
