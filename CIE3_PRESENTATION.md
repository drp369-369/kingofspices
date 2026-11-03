# CIE-3 Presentation Plan

**Recommended length:** 8–10 minutes plus questions. Trim to the evaluator's time limit. Replace bracketed team details and insert real, consented research evidence only after it is collected.

**Timing context:** This deck is for CIE-3 on 3 November 2026. The [roadmap](DEVELOPMENT_ROADMAP.md) schedules follow-up work for about four weeks; the final exam is expected around early December, but its exact date is unknown.

| # / time | Slide title | Key points | Suggested visual | Speaker explanation |
|---|---|---|---|---|
| 1 / 20 sec | King of Spices Revenue Platform | Team names; CIE-3; one-line concept | Screenshot of menu and partner hub | “We built a browser prototype exploring direct ordering and restaurant operations in one journey.” |
| 2 / 35 sec | The problem we are investigating | Hypothesis: disconnected ordering and operations can create friction; no validated prevalence claim yet | Simple current-workflow sketch from phone/order to kitchen | “This is our problem hypothesis. We are validating it with customers and operators; we do not yet claim measured market impact.” |
| 3 / 35 sec | Who may experience it | Repeat customer, restaurant operator, event organizer; pain points are hypotheses | Three persona cards, labeled “to validate” | Explain the jobs and invite evaluator to note the initial customer segment. |
| 4 / 35 sec | What we know—and still need to learn | Repository contains no interview/survey evidence; planned interview protocol | Evidence ladder: assumptions → interviews → observed tasks → pilot metrics | “We will report actual sample, date and limitations. Website testimonials are not validation data.” |
| 5 / 35 sec | Proposed solution | Direct menu/cart, membership concept, catering estimate, reservation form, staff view | Journey map | Explain one customer journey and why it is a coherent prototype. |
| 6 / 35 sec | Architecture and technology | HTML/CSS/vanilla JS; localStorage; no API/database/payment | Mermaid architecture from Technical Architecture | Clearly state same-browser only and client-side role demo. |
| 7 / 45 sec | What works in the prototype | Cart/totals, local order record, manual kitchen status, inventory editor, request/reference flows | 4–5 screenshots, with “local simulation” labels | Describe implemented flows without implying external service or automatic tracking. |
| 8 / 90 sec | Live prototype demonstration | Add menu item; validate phone; create synthetic order; view My Orders; update status in Partner Hub | Live browser | Use `DEMO_AND_EVALUATOR_QA.md`; keep synthetic data and a clean profile. |
| 9 / 35 sec | Product progress and limitations | Implemented vs missing: backend, identity, payment, cross-device sync, actual notifications | Two-column status board | Show technical honesty: this is a demonstrable front-end MVP, not production operations software. |
| 10 / 35 sec | Innovation and competitive position | Unified customer and staff prototype; transparent estimates; local order/inventory workflow | Competitor/alternative comparison without unsupported market claims | Explain the differentiator as a hypothesis; validate alternatives with interviews. |
| 11 / 30 sec | Team ownership | Deep Ranjan Paul (USN 1RUA24SCS0030) owns product engineering/demo; Yuvrat Mittal (USN 1RUA24CSE0552) owns customer research/QA/docs. Git shows commits `f3bee52` and `4512542` under `drp369-369`; the latest notes AI assistance. Confirm account identity before linking it to a person. | Responsibility matrix from TEAM_ALLOCATION | Show the recorded Git author accurately and distinguish future assignments from earlier work. |
| 12 / 60 sec | Six-week development roadmap | M1–M6, dates and owners; backend gated by feasibility | Timeline from DEVELOPMENT_ROADMAP | Call out dated milestones and decision gate; confirm institutional deadline. |
| 13 / 40 sec | Testing and risk controls | Regression plan, customer observation plan; no results until run | Test funnel + top three risks | Separate software test results from customer validation; show current pending status honestly. |
| 14 / 35 sec | Expected product outcome | Reliable demo, validated problem, tested next-step architecture; no promised commercial impact | Prototype → validated MVP → pilot sequence | Describe measurable outcomes, not speculative revenue. |
| 15 / 15 sec | Thank you / questions | One-sentence recap and Q&A | Product screenshot and team names | “Our next decision is based on user evidence and the feasibility gate, not feature count.” |

## Rubric coverage

- **Problem/customer (3):** slides 2–4, with real evidence added when available.
- **Development progress (2):** slides 6–9 and live flow.
- **Teamwork (2):** slide 11 with confirmed names/evidence.
- **Next-stage plan (8):** slides 12–14, emphasizing named owners, criteria, tests, dependencies and risks.

Do not present estimates as validated prices, localStorage as a database, a demo PIN as secure authentication, or a planned milestone as completed work.
