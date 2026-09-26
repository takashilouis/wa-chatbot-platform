# Vietnamese chatbot research and design implications

## Scope and evidence quality

This records the research discussed in this task, reviewed on 2026-09-22. Sources are vendor product pages and documentation, not independent benchmarks or a statistically representative market survey. Their features and commercial claims may change. Recheck shortlisted services before purchase or integration.

The research covers Vietnamese product-sales patterns as requested. The original project domain remains unspecified and was described as not product sales. We borrow interaction patterns without assuming a retail business model.

## Reviewed products

| Product | Documented pattern | Design implication |
|---|---|---|
| Haravan AI Chat | Conversation connected to product, inventory, order and shipping data; cart operations and staff escalation | Accurate operational data and completed actions matter more than plausible replies |
| Botcake / Pancake ecosystem | Configurable AI flows, product knowledge, lead qualification, WhatsApp support and human transfer | Combine flexible language with explicit process steps |
| FPT.AI Conversation | Vietnamese intent recognition, entity extraction, context management and centralized agent support | Extract meaningful fields and remember prior answers |
| Bizfly AI Chat Agent | Sales journey including discovery, advice, objection handling and closing | Track decision stage, rather than answering every message independently |

Sources:

- [Haravan AI Chat](https://www.haravan.com/pages/haravan-ai-chat)
- [Haravan deployment guide](https://help.haravan.com/docs/social/AI%20Chat/huong-dan-thiet-lap-Haravan-AI-chat/)
- [Botcake AI Agent](https://botcake.io/vi/features/botcake-ai-agent)
- [FPT.AI introduction](https://docs.fpt.ai/docs/vi/conversation/documentation/chatbot-introduction/starting-with-fptai/)
- [Bizfly sales-agent discussion](https://bizfly.vn/techblog/bizfly-ai-agent-ban-hang-hieu-qua.html)

Do not infer that every vendor supports every channel. For example, the reviewed Haravan page emphasizes its listed commerce/social channels; it was used for sales workflow research, not proof of WhatsApp compatibility.

## Proposed Vietnamese conversation capabilities

Evaluate unaccented text, abbreviations, rapid message bursts, mixed-language text, multiple intents, references to prior messages, corrections, soft interest, objections and explicit confirmation. These are project evaluation requirements, not independently verified capabilities of all reviewed vendors.

Example phrases: “con hang ko”, “bn tien”, “dc freeship k”, “cái thứ hai”, “à thôi lấy 2 cái màu trắng”, “bớt chút chốt luôn”, “để mình xem”. Preserve names, quantities, addresses and original text. Clarify uncertainty instead of guessing.

## Reference closing journey

`Understand need → advise → resolve questions/objections → propose next step → confirm exact details → execute → verify outcome → follow up`

Retail illustration: look up exact variant and current price, apply only authorized promotions, confirm quantity and delivery details, summarize the payable total, obtain confirmation, create the order and return its real reference. Agreement, order creation, payment and delivery are different events.

Service adaptation: collect needs, explain the process, resolve concerns, confirm the requested service or appointment, submit the case, and report the actual acceptance/booking status.

## Conclusions for this project

- Use AI for language and contextual interpretation; use deterministic validation for commitments and actions.
- Ground answers in approved knowledge and live business records where applicable.
- Personalize with declared preferences, prior answers and authorized history.
- Design human handoff as a complete operational path.
- Measure verified outcomes, incorrect commitments, repeated questions and handoff reliability, not just message counts.
- Keep model/provider selection provisional until tested against representative Vietnamese conversations.

No vendor conversion percentages or model superiority claims have been adopted as project guarantees.
