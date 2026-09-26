# Phase 1 / Sprint 1 — Working demo task backlog

Created: 2026-09-25. Updated: S1-006 temporarily paused at the user's request because GA laptop constraints prevent Docker/WSL2. S1-008 frontend work proceeds independently using synthetic demo sessions; backend implementation is paused.

Parent documents: [delivery plan](04-delivery-plan.md), [requirements](01-product-requirements.md), [architecture](02-architecture.md), [acceptance scenarios D01–D24](05-test-and-pilot-plan.md).

## Sprint goal

A customer sends real WhatsApp messages, receives useful Vietnamese replies, completes one explicitly confirmed intake workflow and receives a persistent case reference. When needed, a staff member takes over from the website and replies in the same WhatsApp conversation while the bot stays paused.

The demo must run in a shared staging environment and be ready for the friend pilot. A local-only prototype, simulated messaging path or video does not meet this goal.

## Planning rules

- Check a task only after its acceptance criteria pass and evidence is linked. S1-006 remains unchecked while infrastructure runtime evidence is outstanding.
- Owners below are roles, not assigned people: **PO** = product owner; **BE** = backend/integration engineer; **FE** = frontend engineer; **QA** = tester/Vietnamese reviewer. One person may cover multiple roles.
- Dependencies identify prerequisites for completion; UI scaffolding and test design may begin against agreed contracts earlier.
- Proposed duration is 10 working days with two engineers plus owner/QA support. External onboarding and readiness tasks may precede the sprint. Validate capacity after assigning people; task count is not an effort estimate.
- Unless explicitly conditional, every task is required for the demo. Remove optional polish before weakening correctness or handoff behavior.
- The user subsequently authorized S1-006 implementation on 2026-09-25. No paid provisioning or production deployment is part of that task.
- For each task, record implementation reference, reviewer, test/evidence link and any remaining limitation in the completion log at the end.

## Scope boundary

**Included:** one connected number, real text messaging, basic media display/fallback, Vietnamese-first and basic English conversation, curated knowledge, one intake workflow, persistent cases, staff authentication/inbox/replies, manual handoff, errors, recovery and demo verification.

**Excluded:** visual workflow builder, broad integrations, payment collection, campaigns, automated follow-up reminders, autonomous discounts, voice calls, AI image/voice interpretation, advanced reports and live multi-number operation. Keep the data model account-aware so phase two does not require unsafe record merging.

Default business slice, subject to PO confirmation: consultation intake. A saved request is not a confirmed appointment. If a different workflow is selected, update the required fields, completion rule and tests before implementing it.

## Sequence and milestones

| Window | Main tasks | Milestone |
|---|---|---|
| Readiness / before dependent work | S1-001–005 | Business scope, knowledge, access and demo criteria available |
| Days 1–2 | S1-006–015, minimum persistence | M1: real phone → backend → real phone; persisted evidence |
| Days 2–4 | S1-016–022; begin S1-023–025 | M2: authenticated inbox and real staff reply |
| Days 3–6 | S1-023–031 | M3: grounded Vietnamese conversation and verified case creation |
| Days 5–7 | S1-032–036 | M4: complete handoff with exclusive reply ownership |
| Days 7–8 | S1-037–041; tests throughout | M5: failures, restarts and duplicate events handled |
| Days 9–10 | S1-042–048 | M6: acceptance gate, rehearsal and pilot handover |

Testing starts with the feature it verifies; days 9–10 are for integrated acceptance and fixes. No optional additions in the last two days. A failed milestone prompts a scope/schedule review, not a hidden shortcut.

## A. Readiness and business definition

### S1-001 — Freeze the demo workflow

- [ ] **Owner:** PO + BE. **Dependencies:** none.
- **Work:** Confirm the business/service, one successful customer outcome, required fields, validation rules, escalation triggers and actions requiring staff approval. Write one happy-path transcript and three exception examples. Confirm whether an external integration is essential; if it is, re-estimate before committing the sprint.
- **Deliverable:** Reviewed demo workflow specification and updated decision register.
- **Acceptance:** The team can objectively distinguish interested, confirmed, pending, completed and failed. Unknown business details are labeled assumptions, not invented facts.

### S1-002 — Prepare approved knowledge and Vietnamese wording

- [ ] **Owner:** PO + QA. **Dependencies:** S1-001.
- **Work:** Supply 20–40 reviewed FAQ/service answers, permitted commitments, unknown-answer responses, handoff wording and forms of address. Add basic English equivalents for critical messages. Define how corrections to content are reviewed.
- **Deliverable:** Versioned knowledge/configuration files with owner and revision.
- **Acceptance:** No conflicting business rules or unsupported claims; every demo FAQ has an approved answer or escalation path.

### S1-003 — Establish WhatsApp account and tester readiness

- [ ] **Owner:** PO + BE. **Dependencies:** account administrator availability.
- **Work:** Identify the business account/number, permissions and eligible sender setup; obtain authorized server-side credentials. Register eligible tester recipients if required. Record production versus test-sender restrictions. Recheck current provider setup requirements.
- **Deliverable:** Account-readiness checklist with credential locations, never secret values.
- **Acceptance:** The chosen sender can send to and receive from an eligible phone using the official platform. Any production onboarding dependency is visible. Webhook/application proof is completed in S1-015.

### S1-004 — Agree environment, access and spending boundaries

- [ ] **Owner:** PO + BE. **Dependencies:** none.
- **Work:** Select staging hosting, public HTTPS endpoint, database, queue, private media storage and AI access. Agree spending caps, access owners and secret storage. Identify two staff accounts and a staff monitor for testing.
- **Deliverable:** Environment/access checklist and ownership table.
- **Acceptance:** Required access is available or explicitly blocked; no assumed paid subscription, exposed token or production customer data.

### S1-005 — Freeze demo acceptance and test fixtures

- [ ] **Owner:** QA + PO. **Dependencies:** S1-001–002.
- **Work:** Prepare at least 30 labeled Vietnamese/basic-English cases; map the workflow to D01–D24. Select three phone testers for acceptance and synthetic customer details. Define latency measurement boundaries and the five-conversation demo load.
- **Deliverable:** Reviewed test fixtures and demo script.
- **Acceptance:** Each case has expected intent, fields, allowed facts/actions and pass/fail criteria. All critical cases are mandatory regardless of aggregate language score.

## B. Application foundation

### S1-006 — Scaffold application and reproducible development setup

- [ ] **Owner:** BE + FE. **Dependencies:** S1-004.
- **Status: TEMPORARILY PAUSED (2026-09-25, user direction).** Existing scaffold is retained in `frontend/` and `backend/`. GA laptop constraints prevent Docker/WSL2; PostgreSQL/Redis runtime acceptance remains unverified. Resume only when backend work is authorized with a suitable environment. No local Docker/WSL installation will be attempted. [Setup](09-development-setup.md) · [Historical evidence](10-s1-006-verification.md).
- **Work:** Set up the proposed TypeScript web/API/worker structure, pinned dependencies, environment example without secrets, local database/queue startup and basic build/lint/type checks. Retain existing design documentation and exports.
- **Deliverable:** Reproducible setup instructions and application skeleton.
- **Acceptance:** A fresh authorized development environment can start the services and run checks from documented commands.

### S1-007 — Create persistence model and migrations

- [ ] **Owner:** BE. **Dependencies:** S1-001, S1-006.
- **Work:** Implement workspaces, memberships, connected number, customer, conversation, message, webhook event, case, workflow run/version, assignment, outbound attempt and audit records. Add uniqueness constraints and transaction boundaries for deduplication and confirmation.
- **Deliverable:** Migrations and synthetic demo seed data.
- **Acceptance:** Migrations work on an empty database; records are account-scoped; duplicate event/action identifiers cannot create duplicate logical results; ownership and case stage are separate.

### S1-008 — Implement staff authentication and authorization

- [ ] **Owner:** BE + FE. **Dependencies:** S1-006–007.
- **Current split:** S1-008-FE is complete for the authorized frontend-only scope (2026-09-25). S1-008-BE is temporarily paused. The parent task stays unchecked until real authentication, protected server sessions and membership checks pass; demo UI does not satisfy D19.
- [x] **S1-008-FE:** Vietnamese login/logout, form validation, loading/error states, mock session restore/expiry, staff/admin presentation, responsive layout and browser tests. Lint/types/build passed; 11 demo browser tests plus 1 disabled-auth test passed, and production UI checked. [Implementation and evidence](11-s1-008-frontend.md).
- [ ] **S1-008-BE — paused:** Real identities, server sessions, authorization for every resource, CSRF protection where applicable and cross-account access tests.
- **Work:** Use a maintained authentication approach, staff login/logout, protected sessions and backend membership checks for every conversation/case/media action. Seed two authorized staff identities securely. Protect cookie-based mutations against CSRF where applicable.
- **Deliverable:** Protected website/API and access tests.
- **Acceptance:** Unauthenticated and unauthorized requests fail; changing a record ID cannot expose another account's data. Tokens remain server-side. Covers D19.

### S1-009 — Deploy an early staging skeleton

- [ ] **Owner:** BE + FE. **Dependencies:** S1-004, S1-006–008.
- **Work:** Deploy website, API and worker with HTTPS, persistent database/queue, secrets and health/readiness checks. Separate staging configuration and data from future production. Record build/version identification.
- **Deliverable:** Staging URL and reproducible deployment procedure.
- **Acceptance:** Staff can log in remotely; restarts use persistent data; readiness reports unavailable dependencies accurately. Update this deployment throughout the sprint.

## C. WhatsApp transport and durable processing

### S1-010 — Implement verified webhook intake

- [ ] **Owner:** BE. **Dependencies:** S1-003, S1-007, S1-009.
- **Work:** Handle provider verification and signed event validation; parse relevant messages/statuses; identify business number; persist accepted events before acknowledgment. Reject invalid requests and safely ignore irrelevant supported event types.
- **Deliverable:** Public webhook receiver and verification tests.
- **Acceptance:** Valid live events are stored, invalid signatures are rejected, and database failure does not falsely acknowledge durable acceptance. Covers D19.

### S1-011 — Implement durable queue, deduplication and recovery

- [ ] **Owner:** BE. **Dependencies:** S1-010.
- **Work:** Bridge persisted events to queue jobs using an outbox/recovery approach; prevent duplicate scheduling effects; serialize processing per conversation; distinguish status events from new customer messages.
- **Deliverable:** Event processor and replay/recovery tests.
- **Acceptance:** Repeated webhook delivery has one logical effect. A crash between persistence and enqueue recovers. Delivery receipts cannot trigger chatbot replies. Covers D14–D15.

### S1-012 — Implement outbound sender and attempt tracking

- [ ] **Owner:** BE. **Dependencies:** S1-003, S1-007.
- **Work:** Send text through the original business-number identity; store outbound intent, provider message ID and attempt/result. Establish a shared path used by staff and bot, with caller and ownership metadata. Never expose tokens to the browser.
- **Deliverable:** Server-side sender plus controlled send-failure test.
- **Acceptance:** A real reply reaches the eligible phone; a rejected request is visible as failed; an ambiguous timeout remains uncertain until reconciled. Accepted does not mean delivered. Covers D10, D17.

### S1-013 — Enforce outbound eligibility

- [ ] **Owner:** BE. **Dependencies:** S1-010, S1-012.
- **Work:** Track the last customer-message timestamp; enforce the applicable messaging window for both bot and staff; block disallowed free-form sends with a clear reason. If an approved suitable template is available, implement that bounded path; otherwise disclose the demo limitation. Do not add campaigns.
- **Deliverable:** Shared outbound policy guard and clock-boundary tests.
- **Acceptance:** Expired-window tests block both senders; failed eligibility cannot be bypassed by the website. Live template testing is conditional on template availability. Covers D18.

### S1-014 — Process delivery statuses and failure feedback

- [ ] **Owner:** BE. **Dependencies:** S1-010–012.
- **Work:** Correlate status events with outbound records; handle duplicates and out-of-order updates; expose meaningful sent/delivered/read/failed state and error details appropriate for staff.
- **Deliverable:** Message-status projection and API fields.
- **Acceptance:** Replayed or older events do not incorrectly regress message state; unavailable receipts are not fabricated. Covers D17.

### S1-015 — Prove the live transport milestone

- [ ] **Owner:** BE + QA. **Dependencies:** S1-009–014.
- **Work:** Send from a tester phone, inspect stored inbound event/message, send a backend reply and verify arrival on the same thread. Capture redacted evidence, number alias and deployment version.
- **Deliverable:** M1 evidence and known sender restrictions.
- **Acceptance:** Real phone → webhook → storage → outbound service → real phone passes. Do not proceed toward a claimed live demo using only simulated transport.

## D. Staff website

### S1-016 — Define inbox APIs and live-update contracts

- [ ] **Owner:** BE + FE. **Dependencies:** S1-007–008.
- **Work:** Agree paginated conversation/message APIs, case fields, ownership state, status events and errors. Authenticate real-time subscriptions and authorize each account/room. Support loading missed state after reconnect.
- **Deliverable:** Typed interface contracts and protected live-update channel.
- **Acceptance:** Only permitted records/events reach a staff session; the UI can reload authoritative state without relying on delivery of every socket event.

### S1-017 — Build conversation list and application shell

- [ ] **Owner:** FE. **Dependencies:** S1-008, S1-016.
- **Work:** Create Vietnamese navigation and list states: bot handling, waiting, staff handling and completed. Show business identity, last message, unread state and assigned owner. Include loading, empty and failure states.
- **Deliverable:** Usable staff inbox entry screen.
- **Acceptance:** Staff can locate and open an active or waiting conversation without direct database access; long Vietnamese text does not break the layout.

### S1-018 — Build transcript and safe message rendering

- [ ] **Owner:** FE. **Dependencies:** S1-014, S1-016–017.
- **Work:** Display ordered customer/bot/staff messages, timestamps and send state. Render customer text safely; avoid executing embedded markup. Load older messages and incoming updates without duplicated entries.
- **Deliverable:** Conversation transcript.
- **Acceptance:** Original wording is preserved and sender identity is clear; reload/reconnect shows persisted history. Covers D22–D23.

### S1-019 — Build staff reply composer

- [ ] **Owner:** FE + BE. **Dependencies:** S1-012–013, S1-016–018.
- **Work:** Submit staff text through the shared outbound path with request deduplication; show pending/failed/uncertain states, eligibility restrictions and ownership restrictions. Wire final takeover controls after S1-033.
- **Deliverable:** Website-to-WhatsApp reply interface.
- **Acceptance:** Authorized owner sends a real message; repeated clicks do not create duplicate logical sends; unauthorized/non-owner attempts fail on the server, not just the UI. Covers D10, D17–D18.

### S1-020 — Build case and workflow context panel

- [ ] **Owner:** FE + BE. **Dependencies:** S1-016–018, workflow field contract from S1-001.
- **Work:** Display current stage, collected fields, missing fields, case reference, owner and handoff reason. Connect updates from S1-028–031; retain a clear distinction between pending intake and completed outcome.
- **Deliverable:** Staff context panel.
- **Acceptance:** Staff can understand the customer's request and outstanding step without asking all questions again; no false completed status.

### S1-021 — Support private media display and unsupported-input fallback

- [ ] **Owner:** BE + FE. **Dependencies:** S1-004, S1-010–011, S1-016–018.
- **Work:** Fetch supported inbound images/audio/documents safely, impose configured type/size limits, store privately and authorize staff access. Preserve captions. For unsupported/failed media, show an explicit status and route to staff rather than pretending to interpret it.
- **Deliverable:** Attachment display/access path and bounded fallback.
- **Acceptance:** Authorized staff can view/download supported content; unauthenticated links do not expose it; unsupported content receives an honest response. No AI transcription/vision is required. Covers D20.

### S1-022 — Verify inbox usability and reconnection

- [ ] **Owner:** FE + QA. **Dependencies:** S1-017–021.
- **Work:** Exercise login, list, transcript, reply, loading failures, long text, browser refresh, lost connection and reconnect at intended demo screen sizes. Check labels, keyboard interaction and readable error states.
- **Deliverable:** Inbox smoke-test evidence and fixes.
- **Acceptance:** Staff can complete the reply task independently and recover current history after reconnect. Covers D10, D22.

## E. Vietnamese assistant

### S1-023 — Connect an AI provider behind a bounded adapter

- [ ] **Owner:** BE. **Dependencies:** S1-004, S1-006.
- **Work:** Verify current model availability, configure server-side access, define structured intent/field/response output, validate output schemas and impose request/token/time limits. Record model/configuration version and usage without logging secrets.
- **Deliverable:** Provider adapter and failure behavior.
- **Acceptance:** Real inference works; malformed output or timeout cannot directly execute a business action; failure has a controlled fallback. Covers D16.

### S1-024 — Add grounded knowledge and instruction boundaries

- [ ] **Owner:** BE + QA. **Dependencies:** S1-002, S1-023.
- **Work:** Load the curated approved knowledge for the connected business; separate system/business rules from untrusted customer text. Restrict factual answers to supported content; return clarification/handoff when facts are absent. Keep tools/actions allowlisted and validated server-side.
- **Deliverable:** Versioned assistant configuration and grounding tests.
- **Acceptance:** Approved FAQs are answered correctly; invented facts, cross-customer requests and “ignore your rules” prompts do not override permissions. Covers D01, D08, D23.

### S1-025 — Implement context, structured extraction and corrections

- [ ] **Owner:** BE + QA. **Dependencies:** S1-007, S1-023–024.
- **Work:** Combine recent conversation context with structured case fields. Handle accents/no accents, common abbreviations, multiple intents, prior references and field corrections. Preserve originals and ask when confidence/evidence is insufficient.
- **Deliverable:** Conversation interpretation layer and field-change provenance.
- **Acceptance:** Corrections replace superseded values; ambiguous text does not become confirmed facts. Supported multi-question examples retain the active workflow. Covers D03, D05–D07.

### S1-026 — Group message bursts and prevent stale replies

- [ ] **Owner:** BE. **Dependencies:** S1-011, S1-025.
- **Work:** Add a short configurable debounce with a maximum wait, per-conversation sequencing and message-version checks. If newer messages invalidate an in-progress answer, regenerate or discard the stale answer. Integrate ownership invalidation from S1-034.
- **Deliverable:** Bounded message grouping and sequencing tests.
- **Acceptance:** Rapid messages produce a coherent answer; continuous typing does not wait forever; an old reply cannot overwrite a newer correction. Covers D04, D06.

### S1-027 — Add language preference, tone and language evaluation

- [ ] **Owner:** BE + QA. **Dependencies:** S1-005, S1-024–026.
- **Work:** Default to Vietnamese, support basic English and explicit language changes, preserve names/codes and use the approved address style. Run labeled cases; correct knowledge/prompt/extraction problems and record results by category.
- **Deliverable:** Evaluated conversation configuration.
- **Acceptance:** At least 27 of 30 language cases pass expected intent/fields; all critical facts/confirmation/action cases pass independently. Covers D03–D08, D21, D23.

## F. One complete business workflow

### S1-028 — Implement persisted workflow states

- [ ] **Owner:** BE. **Dependencies:** S1-001, S1-007, S1-025.
- **Work:** Implement need discovery, field collection, awaiting confirmation, processing, completed and failed/pending states. Persist workflow version and current step; support interruptions and resumption without repeating completed steps.
- **Deliverable:** One versioned backend workflow; no visual editor.
- **Acceptance:** Restart and topic changes preserve progress; illegal transitions are rejected. Covers D02, D05, D15.

### S1-029 — Validate fields and collect only missing information

- [ ] **Owner:** BE + QA. **Dependencies:** S1-025, S1-028.
- **Work:** Apply agreed required-field rules; validate dates/contact details where relevant; clarify ambiguity and timezone; allow changes/cancellation before execution. Avoid collecting unnecessary identifiers or asking again for known answers.
- **Deliverable:** Validated intake and correction path.
- **Acceptance:** Invalid/incomplete fields cannot enter completion; corrections appear in the next summary. Covers D05–D06.

### S1-030 — Bind explicit confirmation to the exact proposal

- [ ] **Owner:** BE + QA. **Dependencies:** S1-028–029.
- **Work:** Present a concise summary and requested action; bind confirmation to the current field/proposal version. Invalidate confirmation after material changes. Clarify ambiguous agreement; do not treat an unrelated “ok” as authorization.
- **Deliverable:** Confirmation guard with revision-aware tests.
- **Acceptance:** Stale or ambiguous confirmation cannot complete the case; the customer confirms the details actually acted upon. Covers D06–D07.

### S1-031 — Execute and verify the persistent outcome

- [ ] **Owner:** BE + FE. **Dependencies:** S1-012–013, S1-020, S1-028–030.
- **Work:** Create the agreed case transactionally and idempotently, generate a unique reference, assign it to a staff queue and update the context panel. Send success wording only after commit. Handle failure and uncertain execution honestly.
- **Deliverable:** Working end-to-end intake with real case reference.
- **Acceptance:** One confirmed request yields one case under retries/concurrency; references survive restart; default wording says request received, not appointment booked. Covers D02, D14–D15, D17.

## G. Human handoff and ownership

### S1-032 — Implement handoff triggers and waiting state

- [ ] **Owner:** BE. **Dependencies:** S1-007, S1-024–025, S1-028.
- **Work:** Trigger on customer request, unresolved/unsupported input, defined exception or manual staff takeover. Persist `WAITING_FOR_AGENT`, reason and timestamp; send one accurate acknowledgment through the guarded sender and notify the inbox. Route operator claims through S1-033.
- **Deliverable:** Handoff transition and visible waiting queue.
- **Acceptance:** Customer-requested transfer pauses ordinary bot replies immediately; subsequent customer messages remain visible. Covers D09, D24.

### S1-033 — Implement atomic staff claim and direct reply ownership

- [ ] **Owner:** BE + FE. **Dependencies:** S1-008, S1-019, S1-032.
- **Work:** Implement `HUMAN_ACTIVE`, atomic claim/reassignment and server-side reply authorization. Show the current owner and conflicts. Keep assignment updates synchronized across staff sessions.
- **Deliverable:** Tiếp nhận / Chuyển nhân viên controls and ownership enforcement.
- **Acceptance:** Two concurrent claim attempts yield one owner; only the authorized owner sends; customer receives the website reply from the original business number. Covers D10, D12.

### S1-034 — Prevent bot/staff collisions at the send boundary

- [ ] **Owner:** BE + QA. **Dependencies:** S1-012, S1-026, S1-032–033.
- **Work:** Use a conversation version and serialized/atomic send-claim coordination for takeover and outbound dispatch. Invalidate queued/in-flight AI work and check ownership immediately before dispatch. Define an already-dispatched message honestly: a provider-accepted message cannot be recalled by local cancellation.
- **Deliverable:** Race-safe outbound coordination and test instrumentation.
- **Acceptance:** Ten controlled takeovers before bot dispatch yield no subsequent bot dispatch. Already-dispatched messages are visible/audited and not represented as cancellable. Covers D11.

### S1-035 — Provide handoff context and no-agent behavior

- [ ] **Owner:** BE + FE. **Dependencies:** S1-020, S1-032–033.
- **Work:** Show collected fields, unresolved questions, recent transcript, current step and handoff reason. Generate a concise summary if available, with a structured fallback when AI is down. Keep unanswered cases visible and identify the staff monitor; never invent an ETA.
- **Deliverable:** Usable handoff context and waiting experience.
- **Acceptance:** Staff can continue without recollecting all details; unavailable AI does not prevent transfer; no-agent case remains waiting. Covers D09, D16, D24.

### S1-036 — Implement explicit resume and case resolution controls

- [ ] **Owner:** BE + FE. **Dependencies:** S1-028, S1-031, S1-033–035.
- **Work:** Add Trả lại bot and Hoàn tất, with validated transitions and audit history. Resume from updated fields/step; define how a new message on a resolved conversation reopens or starts intake without duplicating the previous case. Staff inactivity never automatically resumes the bot.
- **Deliverable:** Complete ownership lifecycle.
- **Acceptance:** Resume does not repeat a completed action; closure preserves history and the actual outcome. Covers D13, D15.

## H. Reliability, operations and stabilization

### S1-037 — Complete error classification and controlled retries

- [ ] **Owner:** BE. **Dependencies:** S1-011–014, S1-023, S1-031, S1-034.
- **Work:** Distinguish transient, permanent and uncertain failures; implement bounded backoff, failed-job visibility and controlled replay. Recheck ownership and message eligibility on every retry. Avoid blindly repeating externally visible actions after timeout.
- **Deliverable:** Error handling/recovery paths and staff-visible failure states.
- **Acceptance:** Recoverable outages recover without duplicate confirmed cases; permanent failures stop; uncertain sends remain reviewable. Covers D14, D16–D18.

### S1-038 — Verify restart and disconnect recovery

- [ ] **Owner:** BE + FE + QA. **Dependencies:** S1-022, S1-031, S1-036–037.
- **Work:** Restart workers/API during processing and confirmation; interrupt database/queue access in a controlled environment; reconnect the browser. Inspect orphaned events, pending attempts, case state and ownership.
- **Deliverable:** Recovery evidence and fixes.
- **Acceptance:** Confirmed fields/cases and staff ownership survive; queued work recovers without duplicate business actions; UI reconciles with stored truth. Covers D14–D15, D22.

### S1-039 — Add actionable monitoring and audit records

- [ ] **Owner:** BE. **Dependencies:** S1-009, S1-014, S1-031–037.
- **Work:** Log correlation IDs, webhook/queue errors, outbound results, handoff transitions and workflow actions. Expose basic queue age/failure counts, readiness and AI usage/cost observations. Record the person responsible for responding to demo outages; redact personal content and secrets.
- **Deliverable:** Demo operations view/log queries and basic alert route.
- **Acceptance:** Staff/engineer can trace a failed test conversation and identify where it stopped without opening raw secrets or unrelated customer data.

### S1-040 — Run focused access and input-safety checks

- [ ] **Owner:** BE + FE + QA. **Dependencies:** S1-008, S1-010, S1-016, S1-021, S1-024, S1-033.
- **Work:** Test unauthorized IDs, socket subscriptions, attachments, forged webhooks, unsafe displayed content and prompt-injection attempts. Add request/input/media limits and review staged secrets, logs and repository contents.
- **Deliverable:** Focused security evidence and fixes.
- **Acceptance:** No cross-account exposure, client-side provider secret, executable customer markup or unauthorized business action. Covers D19, D23.

### S1-041 — Validate demo load and response targets

- [ ] **Owner:** BE + QA. **Dependencies:** S1-027, S1-031, S1-036–039.
- **Work:** Measure five simultaneously active conversations, accounting for burst grouping, queue time, AI time and provider delivery time separately. Record sample size and slow turns; tune bounded bottlenecks without sacrificing validation.
- **Deliverable:** Measured performance report for the declared demo load.
- **Acceptance:** At least 90% of measured turns receive the first substantive bot response within the proposed 15-second target, excluding documented provider outages. Report misses explicitly; agree a revised target/schedule if unmet rather than silently passing.

## I. Acceptance, rehearsal and pilot handover

### S1-042 — Run the complete demo acceptance suite

- [ ] **Owner:** QA + BE + FE. **Dependencies:** S1-005, S1-015, S1-022, S1-027, S1-031, S1-036–041.
- **Work:** Execute D01–D24 with applicability noted for media/template cases; include focused automated tests and live phone evidence. Test all critical paths on the deployed candidate, not only local builds.
- **Deliverable:** Pass/fail matrix with build, model, knowledge version and redacted evidence.
- **Acceptance:** All release-blocking cases pass and language threshold is met; no skipped critical case is counted as passing.

### S1-043 — Fix demo blockers and run targeted regression

- [ ] **Owner:** BE + FE + QA. **Dependencies:** findings from S1-042.
- **Work:** Classify issues P0–P3, fix P0/P1 first, add a regression case for each material defect and rerun affected flows plus the critical demo path. Document minor accepted limitations and workarounds.
- **Deliverable:** Stabilized release candidate and defect register.
- **Acceptance:** Zero open P0/P1 issues; no optional feature work displaces fixes. If no blockers were found, record that evidence rather than inventing fixes.

### S1-044 — Rehearse with three real customer phones and two staff

- [ ] **Owner:** QA + PO + staff testers. **Dependencies:** S1-042–043.
- **Work:** Each customer completes intake and receives a unique reference; demonstrate Vietnamese conversation, correction, unknown answer, human request, staff reply and explicit resume. Check concurrent staff claim and persistence after refresh/restart.
- **Deliverable:** Live rehearsal evidence and final demo script.
- **Acceptance:** All three phone journeys pass on the candidate build, from the actual connected sender; no manual database repair or hidden simulated success is needed.

### S1-045 — Write setup, operator and recovery guides

- [ ] **Owner:** BE + FE. **Dependencies:** S1-009, S1-036–039, S1-043.
- **Work:** Document deployment/configuration, staff login and inbox use, takeover/resume, knowledge updates, failed/uncertain send review, disconnected number, AI outage and queue recovery. Describe staging backup/restore and rollback/redeploy steps; record known limits.
- **Deliverable:** Markdown runbook and staff quick-start linked from the documentation index.
- **Acceptance:** A teammate follows the guide to start/access the demo and recover a representative failure. No credentials are embedded in documentation.

### S1-046 — Prepare friend-pilot materials and access

- [ ] **Owner:** PO + QA. **Dependencies:** S1-005, S1-043–045.
- **Work:** Recruit 5–8 consenting friends, check recipient eligibility, arrange monitored windows and provide synthetic task cards. Agree pilot-data retention/deletion, support contact and feedback submission path. Reuse the existing feedback register; record no fabricated feedback.
- **Deliverable:** Pilot instructions, participant aliases, schedule and feedback template.
- **Acceptance:** Friends know how to access the demo, report an error and reach staff; no unnecessary real sensitive data is required. Actual pilot sessions occur between sprints.

### S1-047 — Freeze the demo candidate and handover evidence

- [ ] **Owner:** BE + QA. **Dependencies:** S1-042–046.
- **Work:** Label the deployed build and record model/configuration/knowledge versions, staging URL, passing results, residual limitations and rollback target. Check that docs match the delivered scope.
- **Deliverable:** Demo release record and complete handover package.
- **Acceptance:** The demonstrated system is reproducible and identifiable; changes during the pilot create a new recorded version.

### S1-048 — Review the sprint gate and authorize the friend pilot

- [ ] **Owner:** PO + QA + engineering owner. **Dependencies:** S1-047.
- **Work:** Review live results against the parent phase-one definition of done. Record ready/not-ready and reasons. If ready, start the bounded friend pilot; if not, fix blockers or revise scope/schedule. Carry candidate phase-two work to the backlog without implementing it in this task.
- **Deliverable:** Written demo acceptance and pilot-start decision.
- **Acceptance:** Owner has seen the working phone and website path; no P0/P1 remains; testing/support ownership is clear. This gate is not production-release authorization.

## Requirement and test coverage

| Capability | Tasks | Main acceptance cases |
|---|---|---|
| Real WhatsApp transport | S1-003, S1-010–015 | D01, D10, D14, D17–D19 |
| Authentication/account boundaries | S1-007–008, S1-016, S1-040 | D19, D23 |
| Staff inbox/replies/media | S1-016–022 | D10, D17–D18, D20, D22 |
| Vietnamese and basic English | S1-002, S1-005, S1-023–027 | D01, D03–D08, D16, D21, D23 |
| Confirmed business outcome | S1-028–031 | D02, D05–D07, D14–D15 |
| Human takeover and resume | S1-032–036 | D09–D13, D24 |
| Reliability and operations | S1-037–041 | D11, D14–D19, D22–D23 |
| Acceptance and handover | S1-042–048 | All applicable cases and parent sprint gate |

## Sprint completion checklist

- [ ] Real deployed WhatsApp round trip verified.
- [ ] Three real phones complete the workflow with unique persistent case references.
- [ ] Staff website reply arrives in the original WhatsApp conversation.
- [ ] Bot pause, exclusive ownership, race prevention and explicit resume pass.
- [ ] Replayed events/retries do not duplicate the business outcome.
- [ ] Restart/reconnect recovery and accurate failure states pass.
- [ ] At least 90% of 30 language cases pass; all critical action/access/confirmation cases pass.
- [ ] Five-conversation latency target measured and met or explicitly renegotiated before acceptance.
- [ ] All applicable D01–D24 release blockers pass; zero open P0/P1 defects.
- [ ] Staging access, staff guide, runbook, known limitations and pilot materials are ready.
- [ ] Owner records acceptance and the friend-pilot start decision.

## Completion and evidence log

Implementation evidence is recorded below; planned work is not counted as complete.

| Task ID | Named owner | Status | Implementation reference | Test/evidence | Reviewer | Completion date / limitation |
|---|---|---|---|---|---|---|
| S1-006 | Codex | Paused | `frontend/`, `backend/`, `scripts/`, workspace manifests and `compose.yaml` | [Historical verification](10-s1-006-verification.md) | No independent reviewer | 2026-09-25: stopped at user's request; GA laptop prevents Docker/WSL2 |
| S1-008-FE | Codex | Done (FE only) | `frontend/`, `frontend.cmd` | [FE verification](11-s1-008-frontend.md): lint/types/build, 12 browser cases, production smoke and visual inspection | Codex automated/visual review; user review pending | 2026-09-25: browser-only fixtures; no real authentication; parent S1-008 stays open |
| S1-008-BE | Unassigned | Paused | No authentication backend implemented | Not run | Pending | Real authorization and D19 remain outstanding |

Allowed statuses: planned, ready, in progress, paused, blocked, in review, done. For paused work, record the user direction and resumption condition. For blocked work, record the actual dependency, responsible person and next action. Keep secrets and raw personal transcripts outside this log.
