# S1-008-FE — Vietnamese staff login

Implemented 2026-09-25 following the user's request to focus on frontend while backend is paused.

## Scope and status

S1-008-FE supplies a working UI for login, logout and session/role presentation without Docker, WSL2, database, API or OpenAI/Meta credentials. The parent S1-008 remains incomplete: browser checks do not enforce real security. Real accounts, server sessions, membership/resource authorization and D19 acceptance are deferred to S1-008-BE.

The website is for staff. Customers will continue using WhatsApp when messaging is implemented. No inbox or messages are connected in this task. “Liên kết” is a working preview title.

## Delivered behavior

- Vietnamese login screen with responsive desktop/mobile layout, labels, keyboard submit, focus handling, password reveal, required/email validation, pending state and errors.
- Public agent/admin account shortcuts that fill the form; the user explicitly submits it.
- A replaceable `AuthAdapter` contract with `restore`, `signIn`, and `signOut`. Current adapter is a synthetic in-browser implementation.
- Per-tab sessionStorage containing only a fixture account ID and expiration timestamp; no stored password or real token. Session expires after 30 minutes, including an active-tab timer and focus/visibility checks after inactivity.
- Reload restores valid sessions. Malformed, unknown and expired sessions are discarded. Storage write failure prevents sign-in and shows an error.
- Signed-out workspace navigation redirects to login. Return paths are allowlisted to `/workspace` and `/workspace/access`.
- Staff see overview only; administrators see a sample access page. Direct staff navigation to that page shows a denial screen. These are UI behaviors, not authorization boundaries; all fixtures are public and modifiable.
- Explicit `NEXT_PUBLIC_AUTH_MODE=demo` enables preview sign-in. Missing/other values disable sign-in and show that authentication is unconfigured. This public setting is fixed at build time for production.
- Logout clears the demo session and redirects to login. No real identity or customer data is used.

| Fixture email | Role | Public fixture password |
|---|---|---|
| `linh@demo.local` | Agent | `Demo@2026` |
| `admin@demo.local` | Admin | `Demo@2026` |

These are deliberately public test values, not credentials to any service. They must not become real seeded accounts or be reused as production passwords.

## Source organization

| Path | Responsibility |
|---|---|
| `frontend/app/login/` | Suspense-wrapped login route |
| `frontend/app/workspace/` | Workspace routes and client session gate |
| `frontend/components/` | Login, role screens, session provider and responsive shell |
| `frontend/lib/auth/` | Auth contract, safe return paths, public fixture adapter |
| `frontend/tests/auth.spec.ts` | Browser-level behavior checks |
| `frontend/playwright.config.ts` | Isolated FE test server on port 3100 |
| `frontend.cmd` | Windows launcher with local Node resolution |
| `backend/api/`, `backend/worker/` | Preserved, paused backend scaffolds |

Root dev/start now run FE only. Packages remain independently runnable inside one workspace; a shared lockfile ensures reproducible dependency versions.

## Verification

**Result: S1-008-FE complete for frontend-only scope.** Verified 2026-09-25 on Windows with Node 24.19.0, pnpm 10.32.1 and installed Microsoft Edge. Tests use synthetic fixtures and cannot establish production authentication, cross-account isolation or WhatsApp functionality.

| Check | Result |
|---|---|
| Workspace dependency install and lockfile refresh | Passed; package importers now point to `frontend`, `backend/api`, `backend/worker` |
| `frontend.cmd check` | ESLint zero warnings, TypeScript and production Next build passed |
| Launcher with PATH restricted to Windows system directories | Passed; resolves approved existing user Node installation without permanent PATH edits |
| Demo browser suite | 11/11 passed: route redirect, validation/focus, wrong password, visibility toggle, refresh/logout, role presentation, external redirect rejection, malformed/expired session, active expiry, blocked storage, mobile keyboard flow and desktop capture |
| Unconfigured-mode suite | 1/1 passed; injected demo session ignored, sign-in disabled, fixture buttons absent |
| Production browser check at port 3000 | Agent sign-in, workspace and logout passed with zero page errors |
| Production HTTP smoke | Web health and redirected Vietnamese login HTML passed; hydrated behavior checked separately in browser |
| Visual review | Desktop 1440px and mobile 390px PNGs inspected; 320px width checked without horizontal overflow |
| Running services | Only FE port 3000 listening; API 3001, worker 3002 and test server 3100 stopped |

During verification, the disabled-mode test selector was narrowed to the form because Next also has a route-announcer alert. The production HTTP smoke check was updated to accept the legitimate Vietnamese Suspense fallback. Both affected checks passed on rerun. No failed case is counted as a pass.

Reproduce with `frontend.cmd check`, then `frontend.cmd test` (runs both suites sequentially). Run `pnpm smoke` while FE is running. No independent reviewer has signed off yet.

Review screenshots: [Desktop login](../exports/s1-008-login-desktop.png), [Mobile login](../exports/s1-008-login-mobile.png), [Workspace](../exports/s1-008-workspace.png).

## Proposed backend integration contract (not implemented)

Replace the demo adapter with a server-backed adapter that obtains a staff session from a maintained auth system. A proposed UI-facing contract is `GET /auth/session`, `POST /auth/login`, and `POST /auth/logout`, with normalized unauthenticated, invalid-credentials, unavailable and forbidden errors. Routes and auth provider are provisional until BE selection.

The server must verify identity and workspace membership, use an appropriate Secure/HttpOnly cookie/session design, expire/revoke sessions, protect cookie mutations against CSRF, and validate authorization on every resource request. Never trust the UI's role or a submitted workspace ID. Do not transfer auth tokens into localStorage/sessionStorage. Next server routes and API access must be protected before any real data is returned; the current client gate only hides synthetic presentation.

When connecting BE, remove public account shortcuts from the real sign-in flow, fail closed if auth is unavailable, add server authorization and cross-account tests, and keep a deliberately separate synthetic development mode. Integrate through the adapter without redesigning form states. Password recovery, member management and real inbox access require additional implementation.

## OpenAI key question

No OpenAI requests are made by this frontend or the retained scaffold, so no API-key validity result is available. The earlier `node` command-not-found error is a local executable/PATH problem and happens before an API request. A provider authentication error would require an actual API response, such as HTTP 401; see [OpenAI error codes](https://developers.openai.com/api/docs/guides/error-codes). Do not paste real keys into this UI, docs or chat.
