# Two-phase delivery plan

Planning baseline: 2026-09-24. Update 2026-09-25: the user paused S1-006 and backend implementation because the GA laptop cannot use Docker/WSL2. Work now proceeds on S1-008 frontend with public synthetic accounts in separate `frontend/` and `backend/` folders. The schedule below is a baseline, not an active commitment while BE is paused. Real end-to-end acceptance remains required; no paid provisioning or production deployment has occurred.

## Delivery objective

Phase 1 must produce a working end-to-end demonstration with a real WhatsApp customer path, a persistent business outcome and a usable staff handoff. Phase 2 uses observed pilot failures and feedback to refine that working system and complete an explicitly agreed release scope.

The friend pilot is a validation interval between the two phases, not a third engineering phase. Phase-two scope is frozen only after the pilot is triaged.

## Timing assumptions

Suggested planning envelope: two sprints of 10 working days each, separated by a 3–5 calendar-day friend pilot. This assumes two engineers with complementary frontend/backend experience, access to an AI-capable developer, timely owner decisions and part-time testing support. Workstreams can overlap; day ranges are an allocation guide, not a fixed-price promise.

With one engineer, retain the same acceptance gates but extend the schedule or reduce scope. Account verification, number onboarding, template review and access to external systems may take additional calendar time. Do not promise a demo date until the real message path is proven.

## Pre-sprint readiness gate

| Input | Owner | Evidence / fallback |
|---|---|---|
| Actual business and one closing outcome | Product owner | A written successful example plus exception examples; otherwise explicitly use consultation intake as a labeled demonstration |
| WhatsApp account, number and permissions | Product owner + backend engineer | An eligible tester sends and receives an actual message; use a provider-supported test sender if production onboarding is pending and disclose that limitation |
| Tester eligibility | Backend engineer | Test recipients are registered/eligible for the chosen sender setup |
| Approved knowledge | Product owner | Roughly 20–40 reviewed Q&A entries, allowed commitments and escalation rules |
| Staff | Product owner | At least two staff/test accounts and a named person monitoring demo/pilot handoffs |
| Infrastructure and AI access | Engineering owner | Staging environment, server-side secrets and approved spending cap |
| Definition of success | Product owner + tester | Sign off the demo script and acceptance criteria below |

Prepare account onboarding first because it can run while other planning is completed. Do not build ten days of UI before discovering that the target number cannot send messages.

## Phase 1 — Working demo

Detailed implementation backlog: [Sprint 1 tasks](08-sprint-1-tasks.md). The backlog expands the packages below without changing the two-phase scope.

### Product slice

One connected business number; Vietnamese-first conversations with basic English support; a small approved knowledge set; one consultation-intake workflow; a persistent case reference; a minimal authenticated staff inbox; manual assignment and direct staff replies; bot pause/resume; visible failure states.

If the actual business workflow becomes available before development, replace the consultation slice with one equally bounded real workflow. Do not expand into several workflows in this sprint.

### What must be real

- Actual inbound and outbound WhatsApp messages on a phone.
- A real AI response grounded in the supplied knowledge.
- Real persisted messages, fields, assignments and case records.
- Actual staff replies from the website reaching the same WhatsApp conversation.
- A working staging deployment accessible to the pilot group.

Synthetic catalog/service data is acceptable when clearly labeled. A fake booking, fake payment, simulated webhook-only demo or scripted video does not satisfy the end-to-end acceptance gate. External integrations may be deferred, but their absence must be reflected honestly in customer-facing wording.

### Work packages and suggested sequence

| Window | Package | Deliverable and verification | Dependency |
|---|---|---|---|
| Days 1–2 | P1.1: transport first | Phone → webhook → stored message → outbound reply; inspect real arrival and status | Account readiness |
| Days 1–3 | P1.2: persistence and access | Staff login, account-scoped records, webhook verification, secrets, deduplication, durable queue | Environment access |
| Days 2–4 | P1.3: staff inbox | Conversation list, transcript, case panel, reply composer, ownership indicator, live updates and reconnect | P1.1–P1.2 |
| Days 3–5 | P1.4: Vietnamese assistant | Curated knowledge, context, missing-field extraction, corrections, bounded message grouping, unknown-answer fallback | Reviewed content |
| Days 4–6 | P1.5: one closing workflow | Need → fields → summary → explicit confirmation → persistent case → actual reference | P1.2 and P1.4 |
| Days 5–7 | P1.6: human handoff | Request/manual takeover, atomic ownership, queue, context summary, staff reply, explicit return to bot | P1.3–P1.5 |
| Days 7–8 | P1.7: failure handling | Ownership race checks, AI failure fallback, retries/reconciliation, restart recovery, message eligibility guard | Working vertical slice |
| Days 9–10 | P1.8: stabilize and rehearse | Run acceptance suite, fix blockers, rehearse on real phones, prepare pilot instructions and known limitations | All previous packages |

During the last two days, do not add optional features. Keep capacity for fixing the demonstrated path. If that path is not passing, postpone the pilot and revise the estimate.

### Demo interface

- Vietnamese labels: Hộp thư, Chờ nhân viên, Đang xử lý, Đã hoàn tất.
- Account name and business number visible on the active conversation.
- Conversation transcript, structured fields and workflow stage visible together.
- Controls: Tiếp nhận, Gửi, Chuyển nhân viên, Trả lại bot, Hoàn tất.
- Clear sending/failed status and error recovery; do not mark a message delivered on API acceptance alone.
- Minimal admin configuration for knowledge and the chosen workflow. Repository-managed configuration is acceptable for the demo; a polished editor is not required.
Duplicate actions, lost state, fabricated success and bot/staff reply collisions block acceptance. Optional features cannot displace stabilization.
### Phase-one definition of done

All release-blocking cases in the [test plan](05-test-and-pilot-plan.md) pass. In particular:

1. Three eligible tester phones independently complete the workflow and receive unique, persistent case references.
2. A tester requests a person; staff accepts and replies from the website; the reply arrives from the original business number.
3. Ten takeover-race repetitions produce no post-takeover bot reply. Two staff cannot simultaneously acquire reply ownership.
4. Replaying the same inbound event creates neither a duplicate reply job nor a duplicate case.
5. Restarting the backend/worker does not lose confirmed fields, assignments or case records.
6. Unknown information, invalid data and AI/provider failure produce a clear fallback rather than invented success.
7. At least 90% of the initial 30 language cases meet the intent/field expectations, and all critical confirmation, authorization and action cases pass.
8. Under the declared demo load of five active conversations, target first substantive bot response within 15 seconds for at least 90% of measured turns, excluding a documented provider outage. Record actual results; do not hide misses behind an average.
9. No open P0 or P1 defect. Known P2/P3 limitations are listed and do not obstruct the pilot tasks.
10. Owner sees a live demonstration, and testers receive instructions and a support contact.

### Demo handover artifacts

Staging URL; allowed tester instructions; staff guide; supported workflow and knowledge revision; redacted acceptance evidence; known limitations; basic restart/recovery runbook; feedback form/register; deployed version identifier. Keep credentials out of these documents.

## Between phases — Friend pilot

Invite 5–8 consenting friends with a mix of Vietnamese writing habits and phone platforms where available. Use eligible WhatsApp recipients and synthetic personal details. Run at least 30 complete sessions over 3–5 calendar days. This is a usability and defect-discovery pilot, not statistical proof of product quality.

Give each person a normal task and an exploratory task: no accents, burst messages, change of mind, ambiguous “ok,” unexpected question, handoff, or returning conversation. Keep a staff monitor available during advertised testing windows. Testers must know whether they are talking to the bot or a person.

Record problems in the [feedback register](07-feedback-register.md), including build version, redacted evidence, expected/actual result, severity and reproduction steps. Do not tell testers how to phrase every message; spontaneous wording is part of the test.

At pilot close, engineering and owner triage together: reproduce failures, distinguish content gaps from code defects, identify confusing workflow steps and select the highest-value additions. Every accepted defect gets an owner and a test case. Preserve a separate set of conversations for final evaluation rather than tuning to all pilot examples.

### Gate before phase two

- Pilot findings summarized with counts and examples, without inventing feedback.
- P0/P1 defects identified, contained and prioritized first.
- Actual business outcome and required integrations confirmed.
- Supported languages, number count and target load agreed.
- Scope and estimates adjusted to the remaining capacity.
- Required account/template/provider access available or explicitly removed from the release commitment.

## Phase 2 — Refine and complete the agreed release

### Priority order

1. Correctness and ownership failures, duplicate actions, data exposure, missing messages and lost state.
2. Vietnamese understanding, content gaps and friction observed during the pilot.
3. Operational completeness: routing, account separation, monitoring, recovery and staff tools.
4. Additional features justified by pilot evidence and business value.

Reserve approximately 40% of engineering capacity for pilot defects and refinement, 35% for agreed additions and 25% for verification/release preparation. If defect volume rises, reduce additions before reducing verification.

### Work packages and suggested sequence

| Window | Package | Deliverable / acceptance |
|---|---|---|
| Days 1–2 | P2.1: pilot triage and correction | Reproduced blockers fixed; regression cases added; release scope frozen |
| Days 2–4 | P2.2: Vietnamese quality | Better normalization, reference handling, tone and clarification; evaluate against held-out conversations |
| Days 2–5 | P2.3: staff operations | Account/team filters, internal notes, assignment/reassignment and queue escalation; permissions tested |
| Days 3–6 | P2.4: multiple numbers | Two real connected numbers validated; correct sender, isolated data and per-account workflow/knowledge |
| Days 4–6 | P2.5: agreed business integration | One prioritized integration if required, with confirmation, idempotency/reconciliation and honest failure reporting |
| Days 4–7 | P2.6: selected additions | Choose from the bounded feature list below; each has an acceptance test and owner |
| Days 7–9 | P2.7: release verification | End-to-end, permissions, failure recovery, load and backup-restore checks; full staff/customer UAT |
| Day 10 | P2.8: release readiness | Owner review, release checklist, rollback plan, support ownership and monitored rollout decision |

These packages overlap only when staffing allows. A complex external integration or full visual editor can exceed this sprint alone; estimate it after discovery and defer optional work when needed.

### Additional-feature candidates

| Feature | Include when | Minimum acceptance |
|---|---|---|
| Admin knowledge management | Owner needs changes without a developer | Draft/review/publish, version tracking and correct account scope |
| Configurable workflow forms | Owner needs several similar workflows | Required fields, branching and validation; in-progress cases retain their workflow version |
| Visual workflow editor | Actual editing complexity justifies it and capacity remains | Validate unreachable/missing steps; simulate; version and publish safely |
| Image/voice understanding | Pilot shows substantial demand | Confirm uncertain extraction; preserve original media and provide human fallback |
| Follow-up reminders | Business needs them and consent/templates are ready | Caps, cancellation, opt-out, ownership checks and current messaging eligibility |
| Additional languages | Named language demand exists | Reviewed critical wording and a per-language acceptance set |
| Outcome reports | Team needs operational decisions | Distinguish interest, confirmed action and verified completion; use real events |

Mandatory refinement is not traded away to fit these additions. No mass marketing or payments are assumed without a separate approved scope.

### Phase-two definition of done

- Every in-scope requirement has passing acceptance evidence and an owner sign-off.
- No P0/P1 defects; remaining minor issues have agreed workarounds and backlog entries.
- All critical safety/action/ownership cases pass; at least 95% of a held-out set of 60 representative Vietnamese conversations meet expected intent, fields and response quality.
- Two-number operation and role/account isolation pass live tests, if multi-number release scope is retained.
- Peak load is agreed from expected usage and tested; absent better data, use 20 simultaneous active conversations as a provisional target, not a capacity claim.
- Queue backlog clears after a simulated outage without duplicate completed business actions.
- Backup restoration and application rollback are rehearsed in a non-production environment.
- Staff receive training, support ownership and a documented response to disconnected numbers, AI outages and failed sends.
- Production data retention, access review, secrets, monitoring and spending alerts are configured.
- Deployment to production occurs only with the owner's release authorization; completing code is not the same as going live.

## Risk and scope controls

| Risk | Response |
|---|---|
| WhatsApp onboarding delayed | Prove eligible test-sender messaging early; disclose demo restriction; track production onboarding separately |
| Actual closing process unknown | Freeze one explicit demo outcome before implementation; never fabricate booking/payment success |
| AI gives plausible but wrong answer | Curated content, validated actions, targeted evaluations and fallback |
| Bot/staff collision | Atomic ownership, generation invalidation and a final send-time guard |
| Integration timeout or duplicate webhook | Durable state, idempotency and reconciliation; surface uncertainty |
| Too many pilot findings | Fix blockers and reduce optional phase-two features; extend schedule if needed |
| Costs exceed expectations | Track WhatsApp, AI, hosting, storage and monitoring separately; set agreed spending caps |
| Staff unavailable during pilot | Advertise monitored windows, keep queue visible and avoid promised response times |

## Decisions needed before implementation

Confirm the business domain and closing event, one workflow and its required fields, who owns the WhatsApp account, staffing/capacity, pilot participants, deployment budget and whether an external system must be involved in demo success. These are listed in the [decision register](06-decisions-and-questions.md). They do not prevent documentation, but unresolved dependencies must not be silently treated as approved implementation assumptions.
