# Decisions, assumptions and open questions

Baseline: 2026-09-24. Record new decisions below with date, owner and reason. Do not represent a recommendation as user approval.

## Decision register

2026-09-29: User resumed backend implementation and specifically authorized S1-006. The already-installed Docker engine is functional; local infrastructure runtime acceptance is complete. This supersedes the blanket backend pause for S1-006 only. No VPS deployment, paid service, or later backend feature task was performed. [Evidence/manual tests](16-s1-006-backend-manual-tests.md).

2026-09-27: User authorized S1-009, S1-016 and S1-017 frontend implementation, signed in to Vercel and requested deployment to continue. Frontend staging is live at https://wa-chatbot-platform-staging.vercel.app in the existing Hobby workspace. The separate staging project uses Vercel's Production slot for `main`, with explicit demo mode and only public synthetic data. No paid upgrade was selected. Backend pause remains in force; real authentication, messaging and persistence are outstanding. See [delivery evidence](15-frontend-staging-and-inbox-verification.md).

| ID | Topic | Status | Decision / rationale |
|---|---|---|---|
| DEC-01 | Work authorization | Confirmed, updated 2026-09-25 | User temporarily stopped S1-006 and backend implementation due to GA laptop restrictions; authorized explicit frontend/backend separation and S1-008 FE now |
| DEC-02 | Primary language | Confirmed | Vietnamese-first; multilingual support remains relevant |
| DEC-03 | Functional flowchart | Accepted direction | User said the high-level flowchart was fine and requested a functional-block architecture |
| DEC-04 | User interfaces | Proposed design explained | Customers stay in WhatsApp; staff work in a separate website |
| DEC-05 | Messaging transport | Recommended | Official WhatsApp Cloud API for both bot and staff replies |
| DEC-06 | Handoff | Proposed core behavior | Explicit ownership, paused bot, staff queue and explicit resume |
| DEC-07 | Business domain | Unresolved | Screenshot says not product sales; retail research is a reference, not a confirmed domain change |
| DEC-08 | Delivery phases | Confirmed | Working demo, friend feedback interval, then refinement/completion |
| DEC-09 | Sprint duration | Planning assumption | Two 10-working-day sprints with a 3–5-day pilot between them; conditional on staffing and access |
| DEC-10 | Demo workflow | Provisional | Consultation intake with persisted case reference unless owner selects another bounded workflow |
| DEC-11 | Multiple numbers | Confirmed target; phased proposal | One live number for demo, at least two for complete-phase validation; actual target capacity unknown |
| DEC-12 | Tech stack | Foundation selected | pnpm workspace, Next.js/React web, NestJS API and standalone TypeScript worker implemented in S1-006; PostgreSQL/Redis Compose provided. BullMQ, database integration and messaging remain later tasks. No AWS commitment |
| DEC-13 | AI provider/model | Provisional | Gemini Flash evaluation candidate; exact model selected through Vietnamese tests, not vendor claims |
| DEC-14 | Knowledge and visual editor | Scope refinement proposal | Curated knowledge and persisted fixed workflow for demo; retrieval/editor sophistication added only as needed |
| DEC-15 | Closing authority | Recommended | Explicit confirmation and verified business outcome; staff approval for exceptions |
| DEC-16 | Documentation | Confirmed | Important discussions and the upcoming plan must be retained in Markdown |
| DEC-17 | Local infrastructure | Confirmed 2026-09-25 | Do not install Docker/WSL2 on the GA laptop. Remote environments are recommendations only; none provisioned |
| DEC-18 | FE development boundary | Confirmed scope; implementation choice | Separate `frontend/` and `backend/` in one workspace. Default dev/start launches FE only. Public synthetic accounts allow UI testing while real auth remains paused |
| DEC-19 | UI working title | Provisional | “Liên kết” is a preview label, not an approved product name |

## Inputs required before dependent work

| Question | Needed by | Why it matters | Working assumption |
|---|---|---|---|
| What business/service is this, and what exactly counts as “chốt khách”? | Workflow design/build | Determines fields, knowledge, eligibility and completion | Consultation request received; no claimed booking |
| Which information must be collected and which actions need staff approval? | Workflow acceptance | Prevents arbitrary or unauthorized commitments | Minimum case data plus explicit confirmation |
| Is a WhatsApp Business account/number already available, and who can administer it? | Transport setup | Can block all live demonstrations | No account access assumed |
| Are numbers owned by one business or several independent businesses? | Account model and permissions | Changes onboarding and isolation needs | Keep workspace/account separation in the design |
| How many engineers and working days are available? | Sprint commitment | Two-sprint estimate depends on capacity | Two engineers plus owner/testing support |
| Who monitors staff handoffs and during what hours? | Demo/pilot | Human handoff requires an actual operator | Named staff during published testing windows |
| Is an external CRM/booking/order system mandatory for demo? | Scope freeze | Can materially extend the critical path | Internal persisted case is sufficient for intake demo |
| What number count, conversation load and languages are required at release? | Phase-two scope freeze | Determines scale and test coverage | Two-number proof, Vietnamese/English; load target provisional |
| What monthly and pilot spending caps apply? | Provisioning | Avoids unapproved service commitments | No paid subscription or spending authorized by this plan |
| Where may customer data be hosted, and how long retained? | Real-customer release | Affects deployment, access and deletion procedures | Synthetic pilot data, restricted access |

## Change log

- 2026-09-24: Consolidated the conversation into Markdown. Added two delivery phases, readiness gates, demo acceptance, a friend pilot and feedback-driven scope selection. Technology remains provisional. No features have been implemented or verified yet.
- 2026-09-25: Implemented S1-006 following explicit user instruction. Used a local environment without resolving unrelated business/onboarding questions. Build, lint, types and application smoke checks passed. Infrastructure runtime acceptance awaits Docker. See [verification evidence](10-s1-006-verification.md).
