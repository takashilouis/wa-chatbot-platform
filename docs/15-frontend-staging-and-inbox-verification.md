# S1-009, S1-016 and S1-017 frontend delivery

Date: 2026-09-27. Scope authorized: frontend only. Backend remains paused.

## Status

- S1-009-FE: complete. Dedicated Vercel staging project deployed and live HTTPS smoke checks passed on 2026-09-27 (2026-09-28 in Vietnam). Backend acceptance remains paused.
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

No backend tests, real authorization or live WhatsApp acceptance are implied by these frontend results. Frontend source and the initial documentation were committed and pushed as `3763fa600986ff2a549f7d7e4e48e83efda797dd` before the Vercel import.

Production preview verified at `http://127.0.0.1:3200/workspace/inbox` (3000 was occupied). Deep-link login, selection and 320px layout passed with no page exceptions. Browser reports a missing optional `/favicon.ico`; this does not affect the tested flows and remains a cosmetic follow-up. Screenshots: [desktop](../exports/s1-017-inbox-desktop.png), [mobile](../exports/s1-017-inbox-mobile.png).

## Live staging delivery

- Public demo: https://wa-chatbot-platform-staging.vercel.app
- Project: https://vercel.com/takashilouis-projects/wa-chatbot-platform-staging
- Verified deployment: https://vercel.com/takashilouis-projects/wa-chatbot-platform-staging/GEBVvJZSMTd2RWJ9QvABY33DMWXq
- Immutable deployment hostname: `wa-chatbot-platform-staging-ejx5l89ii-takashilouis-projects.vercel.app` (Vercel protection may apply to deployment-specific URLs).
- Source: `main`, commit `3763fa600986ff2a549f7d7e4e48e83efda797dd`; Vercel status **Ready**.
- Account: existing `takashilouis' projects` Hobby workspace. No plan upgrade or paid add-on selected.
- Verified settings: Next.js, root `frontend`, outside-root files enabled, Node 24.x. Repository `vercel.json` supplies build/install overrides. Unaffected-project build skipping is enabled.
- `NEXT_PUBLIC_AUTH_MODE=demo` set for Production and Preview in this dedicated project. Vercel calls its main-branch slot **Production**; this project's business purpose is staging, and it contains only synthetic fixtures.

### Live acceptance evidence

`GET https://wa-chatbot-platform-staging.vercel.app/health` returned HTTP 200:

```json
{"service":"web","status":"ok","scope":"process","build":"3763fa600986","environment":"production","authMode":"demo","backend":"not_connected"}
```

Browser checks passed: public HTTPS login, employee demo sign-in, inbox navigation, accent-insensitive `nguyen` search (two matches), selected conversation `demo-1`, direct-route reload retaining the demo session and selection, unread + waiting-for-staff filters (three matches), mobile detail/back navigation, logout, and redirect to login with the original conversation URL preserved. Mobile viewport requested at 390 × 844; measured content and scroll widths both 375px, with no horizontal overflow. No browser errors were captured in the live smoke test. Screenshots: [live inbox](../exports/s1-009-vercel-live-inbox.png), [live mobile](../exports/s1-009-vercel-live-mobile.png).

Use the login page's **Nhân viên** or **Quản trị viên** demo preset and then **Đăng nhập**. Public fixture password is `Demo@2026`. Do not enter customer data. Login is still browser-only simulation; sending WhatsApp messages, full message history, real staff authorization, persistent storage and backend readiness are not implemented here.

### Updating and recovery

Push application changes to `main` for the connected Vercel project, inspect deployment status, and verify `/health` against the new commit. Documentation-only changes may be skipped by the enabled unaffected-project setting. Environment-variable changes require a new deployment. Keep `frontend` as root and outside-root files enabled.

The first verified deployment above is the initial known-good recovery target; there was no older staging deployment to rehearse a rollback against. For a failed later release, use Vercel's project **Rollback** control to select that known-good deployment, then recheck `/health` and demo login. Rollback execution itself has not been tested. S1-009's parent task stays open until API/worker deployment and persistent infrastructure acceptance are completed after backend work resumes.
