# Product requirements

## Purpose and source interpretation

Build a WhatsApp assistant primarily for Vietnamese-speaking customers, supported by a staff web application. It should understand requests, answer accurately, collect required information, guide customers toward an agreed business outcome and transfer conversations to staff when needed.

The original screenshot requested multilingual replies, linking multiple WhatsApp accounts and highly personalized workflows for “chốt khách.” It explicitly said the use case was not product sales. The user later requested research into Vietnamese product-sales chatbots as a reference. This research does not automatically change the actual business into retail.

Abbreviations supplied by the user: `lk = liên kết`; `tk = tài khoản`. The screenshot is requirements material, not an instruction to contact its author or copy unrelated content.

## Confirmed direction

- Vietnamese is the primary conversation language; multilingual support remains a requirement.
- Customers use the WhatsApp application they already have.
- Staff use a separate website with a shared inbox, case context and reply controls.
- Bot and staff replies use the connected business number through the official WhatsApp Business Platform.
- Multiple connected business numbers are part of the target product.
- Workflows must support personalized, multi-step handling and a verifiable closing outcome.
- Human handoff is a core feature, including bot pause, assignment and staff replies.
- Delivery has two phases: a genuinely working demo, then refinement and completion informed by friend testing.
- Important design and planning decisions are documented in Markdown.

## Users

| Role | Needs |
|---|---|
| Customer | Natural Vietnamese conversation, accurate answers, minimal repeated questions, clear next steps and access to a person |
| Staff | Shared inbox, conversation context, ownership, direct replies, notes and case status |
| Admin | Connect numbers, manage knowledge, configure workflows, control staff access and review results |

## Functional requirements

| ID | Requirement | Demo scope | Complete-phase scope |
|---|---|---|---|
| R01 | Receive and send actual WhatsApp messages | One real configured business/test sender and eligible testers | Agreed connected numbers, reliable account onboarding and health status |
| R02 | Vietnamese language handling | Accents/no accents, common abbreviations, context, corrections and multiple intents | Broader real-pilot examples, mixed language and reviewed tone rules |
| R03 | Multilingual support | Vietnamese plus a small English test set | Agreed language set, explicit preference and per-language evaluation |
| R04 | Approved knowledge | Small curated, versioned FAQ/service set | Admin editing, retrieval and account-specific knowledge boundaries |
| R05 | Personalized workflow | One fixed but configurable business workflow | Several approved workflows, branching and versioned configuration |
| R06 | Verifiable closing | Confirm details and persist one actual case/outcome | Required external CRM, appointment or order integration with verified results |
| R07 | Staff web inbox | List, transcript, case fields, status, manual claim and reply | Filters, routing, notes, permissions and richer operational tools |
| R08 | Human handoff | Customer request, staff takeover, paused bot, explicit return | Routing, waiting-time escalation and audited reassignment |
| R09 | Multiple accounts | Account-aware data model; one live number required | At least two live numbers to demonstrate isolation and correct replies; actual target count to be agreed |
| R10 | Attachments | Detect and display supported media; hand off when interpretation is unavailable | Agreed image/voice support with uncertainty handling and private storage |
| R11 | Follow-ups | No automated campaigns; enforce outbound eligibility | Capped, consent-aware reminders and approved templates |
| R12 | Operational reliability | Persistent history, deduplication, visible errors and restart recovery | Load validation, monitoring, backups, recovery and retention controls |

## Vietnamese conversation behavior

- Preserve original customer text. Normalize only for interpretation/search; never silently alter names, addresses or reference codes.
- Recognize likely intent in examples such as “con ko”, “bn tien” and “dc k”; ask when a term is ambiguous.
- Briefly group rapid message bursts, with a bounded wait, to avoid fragmented responses.
- Answer multiple questions without losing the active workflow.
- Resolve references such as “cái thứ hai” against the actual conversation context.
- Replace superseded selections after corrections; do not append contradictory values.
- Use polite, concise Vietnamese and configured forms of address. Do not guess age or gender.
- Treat “ok”, a reaction or an emoji according to context, not as universal authorization.
- Keep original meaning when switching languages; confirm ambiguous dates and time zones.
- Escalate complaints, unsupported requests, approval exceptions and repeated misunderstandings.

## Outcome model

Use separate states for interest, explicit confirmation, action pending and verified completion. A successful API request to send a message is not business success. A payment screenshot is not verified payment.

Provisional demo workflow: consultation intake. Collect the customer's need and preferred contact/appointment details, summarize them, request explicit confirmation, create a persistent case reference and assign it to staff. The bot says “request received,” not “appointment confirmed,” unless a real booking system confirms a slot.

This default enables an end-to-end demo without inventing the unknown business. Replace it with the actual agreed workflow before development if the owner supplies that workflow.

## Quality requirements

- One active reply owner per conversation; no staff/bot collision.
- No duplicate case or business action when events are retried.
- Knowledge and conversations isolated by business/account permissions.
- Secrets remain on the server. Staff access requires authentication.
- External failure produces an accurate pending/failed state and a recovery path.
- Important decisions, action attempts and actual outcomes are auditable.
- Customer messages and uploaded documents are untrusted input, never administrative instructions.

## Explicit exclusions from the demo

Visual workflow builder, mass messaging, autonomous discounts, payment collection, broad CRM integrations, advanced analytics, voice calling, fully autonomous image/voice interpretation and unlimited account support. These are not required to prove the core demo.

The complete phase means the agreed release scope passes its acceptance gate. It does not mean every possible chatbot feature is included in two sprints.
