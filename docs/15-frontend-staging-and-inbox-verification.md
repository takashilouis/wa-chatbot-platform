# S1-009, S1-016 and S1-017 frontend delivery

Date: 2026-09-27. Scope authorized: frontend only. Backend remains paused.

## Status

- S1-009-FE: deployment configuration and runbook prepared; live staging pending Vercel account/project access. The available browser is signed out; no linked Vercel project or CLI credentials were found. No deployment URL is claimed.
- S1-016-FE: typed contracts, cancellable demo adapter, events and reload behavior implemented. Backend authorization and a protected real-time channel remain outstanding.
- S1-017-FE: Vietnamese inbox shell/list and selected-conversation summary implemented with synthetic data. Live data integration remains outstanding.

## Vercel staging setup

Use the existing repository `takashilouis/wa-chatbot-platform`. Import a dedicated **staging** project into the user's selected Vercel team; no team/paid subscription is assumed.

| Setting | Value |
|---|---|
| Framework | Next.js |
| Root directory | `frontend` |
| Include files outside root in build | Enabled (shared scripts, TypeScript config and workspace lockfile) |
| Node version | 24.x; repository currently requires at least 24.19.0 |
| Package manager | pnpm 10.32.1, root packageManager field |
| Install | `cd .. && pnpm install --frozen-lockfile` |
| Build | `pnpm build` (frontend package context) |
| Output directory | Framework default `.next` |
| NEXT_PUBLIC_AUTH_MODE | `demo` for this isolated synthetic staging project |

`frontend/vercel.json` stores framework/build/install settings. Vercel settings must still select the correct root and allow outside-root build files. Never upload local `.env`, database passwords or Meta/AI keys. Vercel environments must be configured independently. The real production project should leave demo sign-in disabled until genuine auth is implemented. Public demo fixtures are not an access-control mechanism; use only synthetic data here. Vercel's plan must be appropriate for the intended business use.

`/health` reports process liveness, build ID, deployment environment, auth mode and `backend: not_connected`. Build ID uses Vercel commit SHA (first 12 chars), explicit APP_BUILD_ID, or `local`. No environment dump or credentials are returned. A healthy frontend must not be reported as healthy database/queue/WhatsApp infrastructure. Public noindex metadata already discourages indexing; it is not access protection.

After deployment, record the exact URL, commit and environment. Verify HTTPS, health metadata, login/logout, inbox filters and selection, direct-route refresh and mobile layout at that URL. If a deployment fails, preserve the error and correct it; local build success alone does not complete S1-009. Roll back using the prior known-good staging deployment and recheck its health/build ID.

References: [Vercel monorepos](https://vercel.com/docs/monorepos), [outside-root files](https://vercel.com/docs/monorepos/monorepo-faq), [Node 24 support](https://vercel.com/changelog/node-js-24-lts-is-now-generally-available-for-builds-and-functions).

## Local review

Run `frontend.cmd`, sign in with a public demo account, then choose **Hộp thư chung**. Use **Công cụ kiểm tra giao diện** for empty/error scenarios and a simulated incoming event. These controls never contact Meta. `frontend.cmd check` runs lint/types/build; `frontend.cmd test` runs login, inbox, contract and disabled-auth checks. The proposed API contract is documented in [S1-016 contract](14-inbox-frontend-contract.md).

Verification: `frontend.cmd check` passed lint with zero warnings, TypeScript and the production build. `frontend.cmd test` passed 19 demo/browser/contract cases plus 1 disabled-auth case. Coverage includes existing auth regressions, direct conversation links through login, list pagination, accent-insensitive search, combined filters, empty/error/retry, event refresh, reconnect, unknown IDs, mobile back navigation, cursor uniqueness, abort and subscription cleanup. Desktop 1440px and mobile 390px screenshots were inspected. A failing initial test used an overly strict label lookup for the business selector; the accessible combobox locator passed on rerun. Screenshot capture now waits for hydration before modifying input caret styles.

No backend tests, real authorization, Vercel deployment or live WhatsApp acceptance are implied by these frontend results. Code and documentation are local changes; no automatic GitHub push was performed in this task.

Production preview verified at `http://127.0.0.1:3200/workspace/inbox` (3000 was occupied). Deep-link login, selection and 320px layout passed with no page exceptions. Browser reports a missing optional `/favicon.ico`; this does not affect the tested flows and remains a cosmetic follow-up. Screenshots: [desktop](../exports/s1-017-inbox-desktop.png), [mobile](../exports/s1-017-inbox-mobile.png).
