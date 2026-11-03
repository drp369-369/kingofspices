# King of Spices — CIE-3 Project Pack

This repository contains a browser-only restaurant revenue platform prototype and its CIE-3 evaluation materials. The application is in [`king-of-spices/`](king-of-spices/); the audit and preparation documents are linked below.

## Run the prototype

From the repository root, run `python -m http.server 8000` and open `http://localhost:8000/king-of-spices/index.html`. No build step or package installation is required. Use a current desktop browser and a fresh browser profile for a clean demo. The application stores its demo state in that browser's `localStorage`.

## What the prototype demonstrates

- Menu browsing, cart quantities, coupons, delivery choices, estimated tax and local order records.
- King's Club membership state and discount calculation (no payment or subscription billing).
- Catering estimate and locally saved inquiry reference.
- Table reservation form and locally saved reservation reference.
- My Orders page and a partner hub with a kitchen queue and stock editor.

These flows are a front-end simulation. There is no API, database, identity service, payment processor, message delivery, multi-user synchronization, or automatic order status progression. Kitchen staff must change order status in the partner hub; the customer and kitchen pages share data only when opened in the same browser profile.

## Project map

- [`PROJECT_AUDIT.md`](PROJECT_AUDIT.md) — evidence-based status, gaps and technical audit.
- [`PROBLEM_VALIDATION.md`](PROBLEM_VALIDATION.md) — problem framing, personas and validation plan; no customer evidence was supplied.
- [`PRODUCT_DEVELOPMENT.md`](PRODUCT_DEVELOPMENT.md) — feature status and implemented changes.
- [`TEAM_ALLOCATION.md`](TEAM_ALLOCATION.md) — Git history evidence and divided next-stage responsibilities for the two core members.
- [`DEVELOPMENT_ROADMAP.md`](DEVELOPMENT_ROADMAP.md) — CIE-3 today checklist and four-week plan toward the final exam, expected about a month later (exact date unknown).
- [`TESTING_REPORT.md`](TESTING_REPORT.md) — verified static checks and test cases still to run.
- [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md) — current architecture and production direction.
- [`CIE3_PRESENTATION.md`](CIE3_PRESENTATION.md) — slide-by-slide content and speaker notes.
- [`DEMO_AND_EVALUATOR_QA.md`](DEMO_AND_EVALUATOR_QA.md) — live demo script, fallback and 30 grounded evaluator answers.

## Before presenting

Confirm team member names, actual work ownership, evaluation date and duration, customer research, location/tax assumptions, and whether the evaluator expects a deployed backend. Do not present demo testimonials, price/tax assumptions, local status changes or simulated sign-in as validated customer evidence or production services.
