# Frontend

Next.js staff website. Run from the repository root with `.\frontend.cmd` on Windows or `pnpm dev:frontend` with Node/pnpm on PATH. Open http://127.0.0.1:3000/login.

The public fixtures are `linh@demo.local` (agent) and `admin@demo.local` (admin), both using `Demo@2026`. Buttons fill these values. This is a simulated browser session, not real authentication. Do not use real credentials or customer data.

Run `.\frontend.cmd check` and `.\frontend.cmd test` from the root. Node 24.19.0 and pnpm 10.32.1 are required; initial installation is `pnpm install --frozen-lockfile` and `pnpm setup`. Browser tests use installed Edge on Windows. No Docker, database, API key or backend server is required.

Source: `app/` contains routes, `components/` the Vietnamese UI and session provider, `lib/auth/` the replaceable adapter contract and public fixtures, `tests/` the browser suite.

See [setup](../docs/09-development-setup.md) and [S1-008 FE scope](../docs/11-s1-008-frontend.md).
