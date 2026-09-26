# Verification and friend-pilot plan

## Test layers

1. Focused automated tests for state transitions, permissions, field validation, deduplication and action idempotency.
2. Integration tests for webhook handling, persistence, queues, provider failures and outbound guards.
3. Browser tests for staff login, inbox, assignment, reply, reconnect and case completion.
4. Real-phone WhatsApp tests to prove the entire transport path.
5. Human-reviewed Vietnamese conversation evaluation and friend testing.

Provider stubs are useful for controlled failures and time-window tests, but cannot replace live send/receive acceptance. Record build, configuration, knowledge revision and model identifier for every evaluation.

## Demo acceptance scenarios

| ID | Scenario | Expected result | Release blocking? |
|---|---|---|---|
| D01 | New tester asks an approved FAQ | Correct answer reaches the phone and appears in staff history | Yes |
| D02 | Complete intake and explicitly confirm | Exactly one persistent case, correct fields and real reference | Yes |
| D03 | “tu van giup minh”, abbreviations and mixed English | Correct likely intent; clarification when uncertain | Quality threshold |
| D04 | Three short messages in rapid succession | Coherent response using all relevant information | Quality threshold |
| D05 | Ask several questions and interrupt the workflow | Answer supported questions and resume without losing fields | Quality threshold |
| D06 | Correct a field before confirmation | Old value replaced; summary uses corrected value | Yes |
| D07 | Ambiguous “ok” or emoji without a complete proposal | No unauthorized completed action | Yes |
| D08 | Ask an unsupported factual question | No invented policy, price or success; clarify or hand off | Yes |
| D09 | Request a person | Bot pauses, staff queue updates, summary preserves context | Yes |
| D10 | Staff reply from website | Message arrives from the same business number | Yes |
| D11 | Staff takes over while AI is generating | Stale bot reply is discarded; repeat ten times | Yes |
| D12 | Two staff claim simultaneously | Only one acquires reply ownership | Yes |
| D13 | Staff explicitly returns to bot | Bot resumes from updated state; no repeated completed action | Yes |
| D14 | Duplicate inbound webhook and worker retry | One logical processing result and no duplicate case | Yes |
| D15 | Restart backend/worker mid-conversation | Fields, history, ownership and confirmed case survive | Yes |
| D16 | AI timeout or provider failure | Bounded recovery and visible fallback; no false success | Yes |
| D17 | Send failure or ambiguous send timeout | Accurate pending/failed state; no blind duplicate send loop | Yes |
| D18 | Expired messaging window | Free-form outbound blocked; eligible template path or clear staff explanation | Yes |
| D19 | Unauthorized staff or forged webhook | Access rejected; no exposed conversation or accepted event | Yes |
| D20 | Upload media outside demo interpretation scope | Staff can access permitted media, bot explains limitation and routes help | Yes if media is accepted |
| D21 | Basic English request then Vietnamese preference | Correct language switch without losing case state | Quality threshold |
| D22 | Refresh browser / reconnect live connection | Persisted history reloads without missing or duplicate display entries | Yes |
| D23 | Customer asks bot to ignore rules or access another customer | No instruction override, unauthorized action or data disclosure | Yes |
| D24 | No staff available | Visible waiting state; accurate customer notice, no invented ETA | Yes |

For D18, test time-boundary logic with a controlled clock and verify the selected live template path when an approved template exists. If templates are unavailable for the demo, show the blocked-send state and disclose that outbound re-engagement is unsupported.

## Vietnamese evaluation set

Prepare at least 30 labeled cases for phase one: ordinary questions, missing accents, abbreviations, multiple intents, corrections, references, uncertain confirmations, unknown information, handoff and mixed language. Each case specifies expected intent, extracted fields, allowed response facts and allowed next action.

The product owner or a Vietnamese-speaking reviewer judges naturalness and correctness. Do not use an AI grader as the sole acceptance authority. Score factual correctness and action correctness separately from tone. Any critical false commitment fails the gate even when aggregate accuracy passes.

Create a held-out set of at least 60 representative conversations for phase two. Do not continually tune against this final set. Add every reproduced pilot defect to the regression set and report results separately for held-out and regression cases.

## Friend pilot procedure

### Before inviting testers

- Complete the phase-one gate and freeze a labeled build.
- Confirm each tester can message the configured number.
- Provide the business scenario, supported workflow, test window and escalation contact.
- Explain that conversations are recorded for testing; use synthetic personal details and obtain consent.
- Give staff a short guide and ensure someone watches handoffs during test windows.
- Agree pilot-data retention and deletion; restrict raw transcripts to authorized reviewers.

### Tester task card

1. Ask a normal question in your own words.
2. Complete the demonstrated intake process.
3. Change one detail before confirming.
4. Try an unexpected or ambiguous question.
5. Ask for a person and exchange a message with staff.
6. Return later and check whether the conversation still makes sense.
7. Report where you got stuck, what sounded unnatural and any incorrect claim.

Allocate additional tasks across friends: unaccented text, rapid bursts, multiple questions, image/voice input, English/Vietnamese switching and interrupted connectivity. Do not ask friends to share real sensitive identifiers or perform real payments.

### Feedback questions

- Did you complete the task? If not, where did it stop?
- Was any answer incorrect, confusing or repetitive?
- Did the assistant remember corrections and prior information?
- Was it clear whether a bot or person was replying?
- Did the promised action actually happen?
- Which missing feature would have helped most?

## Severity and triage

| Severity | Definition | Treatment |
|---|---|---|
| P0 | Unauthorized data exposure/action, severe loss or unsafe false commitment | Stop affected testing, contain and fix immediately |
| P1 | Core flow blocked, lost messages, duplicate case/action, bot/staff collision | Release blocker; fix before broad pilot/release |
| P2 | Recoverable misunderstanding, awkward workflow or missing noncritical capability | Rank by frequency, customer impact and workaround |
| P3 | Cosmetic problem or optional enhancement | Backlog unless inexpensive and justified |

Review daily during the pilot. New feature requests are not automatically defects. Reproduce, identify the root cause, assign an owner and turn the behavior into a regression test. Have the reporter or another tester verify the fix where practical.

## Phase-two operational verification

- Cross-account and cross-role data isolation, including attachment access.
- At least two real business senders; original sender preserved in each thread.
- Opt-out and reminder cancellation, if reminders are included.
- Exact business-action success/failure handling, including ambiguous external timeouts.
- Workflow edits do not silently change in-progress cases.
- Queue backlog and recovery at declared target load.
- Backup restore, deployment rollback and secret rotation procedures.
- Logs and exports do not unnecessarily expose personal content.
- Application behavior when a connected number becomes unavailable.

## Evidence and reporting

Record test ID, build, timestamp/time zone, redacted conversation/case reference, result, observed latency, evidence location and defect link. Measure application response latency separately from provider delivery delay. Count verified workflow completions separately from customer agreement.

Demo targets and final-release thresholds live in the [delivery plan](04-delivery-plan.md). They are proposed acceptance targets, not claims of measured performance.
