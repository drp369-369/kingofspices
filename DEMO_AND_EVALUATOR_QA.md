# Live Demo and Evaluator Questions

## 4–5 minute demonstration

### Before the room

1. Confirm the actual presentation deadline and browser availability.
2. Serve the existing `king-of-spices/` directory locally and test the exact browser/profile to be used.
3. Use a fresh profile and synthetic customer details only. Have one order already staged only if the live flow has been rehearsed; clearly label it as demo data.
4. Keep local screenshots of menu, cart, My Orders and Partner Hub available in a separate folder/tab for the backup.

### Spoken path

1. **Introduce (15 sec):** “King of Spices is a browser prototype for a direct ordering journey and a small restaurant operations view.”
2. **Problem (20 sec):** “We are investigating whether fragmented ordering and operations cause meaningful friction. We have not yet established prevalence; that is a planned validation activity.”
3. **Customer flow (60 sec):** On the menu, add a dish, open the cart, show item count, estimated fee/tax and coupon. Try a short invalid phone, then a synthetic 10-digit number and address. Place the order.
4. **Order record (30 sec):** Show the confirmation and reference ID, then open My Orders in the same profile. Point out that state is local and not a live delivery integration.
5. **Staff flow (45 sec):** Open Partner Hub, find the order and change it from Pending to Preparing. Return to My Orders or refresh to show the shared local record. Explain that a staff action manually changes the status.
6. **Inventory (30 sec):** Show stock count and one safe adjustment, then explain that inventory is a local demo catalog.
7. **Close with next stage (30 sec):** “Our next steps are to interview target users, resolve the highest-priority observed issues, test the core path and decide whether a server-backed slice is feasible.”

If time permits, show the catering estimate or reservation flow, not both. Use only values confirmed by the team; catering prices currently differ across source and docs and need reconciliation.

## Backup demonstration plan

- If the local server/browser fails, present saved screenshots in the same sequence and explicitly say the live environment failed; do not imply screenshots are a live system.
- If internet access fails, local HTML/JS should still run, but external imagery/icons may not load. Use screenshots for visual assets.
- If state is missing, show the menu and explain the intended synthetic journey; do not waste time attempting edits to unrelated system settings or entering real data.
- If the staff page does not show the order, explain the same-profile/localStorage requirement and use the recorded screenshot. Capture the issue in the test log.

## Likely evaluator questions and concise answers

Answers below are grounded in the current repository. Replace bracketed facts only with team-confirmed evidence.

1. **What exact problem are you solving?** We are testing the hypothesis that independent restaurants and their customers face friction when ordering, order updates and related requests are handled through disconnected workflows. We have not yet measured how common it is.
2. **Who is your primary customer?** Our initial hypotheses are restaurant operators and repeat customers. We will select the primary segment after interviews; it is not yet validated.
3. **What evidence says customers need this?** The repository contains no customer research. We have prepared an interview and usability plan and will report actual sample size and findings only after completing it.
4. **Why do you need to solve it?** If interviews confirm missed orders, repeated manual work or unclear customer status, a direct flow could help. The impact and business case are still unknown.
5. **What alternatives do users have?** We expect to hear about phone/WhatsApp, walk-in, spreadsheets and delivery platforms, but we have not confirmed which alternatives our target users use or their limitations.
6. **What does the prototype currently do?** It demonstrates menu/cart, local checkout/order records, manual kitchen status, local stock editing, a membership state, catering estimate and reservation request.
7. **Can a customer really pay?** No. There is no payment gateway; checkout records a simulated order in the current browser.
8. **Is the restaurant dashboard live?** No. Customer and staff views read the same browser's localStorage. Separate devices do not synchronize.
9. **How is order tracking implemented?** The customer page reads the local order status. A user changes it manually in Partner Hub; no courier or automatic progression exists.
10. **What technology did you choose and why?** Plain HTML, CSS and JavaScript keep the demonstrator easy to run without build tooling. They are enough to illustrate flows, but not a secure multi-user production service.
11. **Where is the database?** There is none. Browser localStorage is used only for local demonstration state.
12. **How do you authenticate staff?** The current UI has a client-side demo role/PIN flow. It is not secure and must be replaced with server-side identity and role checks before real use.
13. **How do you protect personal data?** We do not recommend entering real personal or payment details. A future system needs data minimization, HTTPS, server-side access control, retention policy and security review.
14. **How is stock checked?** The prototype checks local availability and quantity and decrements local stock on order placement. It cannot prevent simultaneous orders from different users because there is no server transaction.
15. **How did you test the application?** A code/documentation audit has been performed. Browser regression cases are documented, but they must be run and logged before we claim end-to-end verification.
16. **What is innovative or different?** The prototype puts customer ordering and a restaurant queue/inventory view into one demonstrable experience. Whether this is meaningfully differentiated from existing tools is a research question, not a proven competitive claim.
17. **Why did you add a membership feature?** It explores repeat-order value through a discount state. No billing or retention benefit is demonstrated; validate economics and customer interest before developing further.
18. **How do you know the 5% tax is correct?** We do not. It is hard-coded as a prototype assumption. Tax treatment and fee rules must be confirmed by the project sponsor/accounting guidance.
19. **How do you know package pricing is correct?** We do not yet; source labels and JavaScript prices are inconsistent with one another and must be reconciled before presentation or use.
20. **What is the most serious limitation?** No backend: data is local, unauthenticated and not shared, so the system cannot support real operations across staff/customer devices.
21. **What happens if the internet fails?** The core local pages may work when served locally, but externally hosted images/icons/fonts may be unavailable. We will keep screenshots as a visual fallback.
22. **How will you validate the problem?** We plan semi-structured interviews with customers and operators, then observed prototype tasks with synthetic data. We will report actual responses, dates and sample limitations.
23. **What is the next technical milestone?** First verify the current flows and user needs; then decide if the team can responsibly build a small server-backed order slice with persistent storage and role checks.
24. **Why not add AI or IoT?** There is no validated need for either in this scope. They would add cost and complexity before we establish core workflow value.
25. **Can this scale to multiple restaurants?** Not in its current form. It needs server-side tenant separation, identity, role permissions, durable storage and operational support.
26. **What is your budget?** No budget has been confirmed. The current local prototype has no paid runtime requirement; production hosting, database, domain, messaging and payment costs need estimates before commitment.
27. **How will you measure success?** Initially: task completion, time, errors and user-reported clarity. In a later pilot, only with consented instrumentation and a baseline, we could measure repeat use, order completion and missed inquiry rates.
28. **How are team contributions balanced?** Deep Ranjan Paul owns product engineering and the demo; Yuvrat Mittal owns customer research, QA and documentation. The visible history has two commits under `drp369-369`, including the recent AI-assisted preparation commit. We should confirm who controls that account before attributing it to Deep. No Yuvrat-authored commit appears in the available history. New work will be tracked under the person who actually completes it.
29. **What if users do not want direct ordering?** We will not force the feature set. If interviews show another higher-value problem or no meaningful pain, we will narrow or change scope and document the decision.
30. **What will be complete by the final exam?** About four weeks after CIE-3, our target is a verified demo path, documented user evidence if recruitment succeeds, named owners, a regression report and a justified backend decision. The final exam date is not confirmed, so we will schedule the readiness cutoff at least one day before faculty confirms it.
