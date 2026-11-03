# Testing Report

**Report date:** 3 November 2026
**Evidence rule:** only checks actually run are marked verified. The project has no automated test suite. Manual checks were run in an isolated local browser origin with synthetic data on 3 November 2026; they do not count as customer research or production testing.

## Checks completed during this audit

| Check | Result | Evidence / limitation |
|---|---|---|
| Repository and page/source inspection | Passed | Inspected existing HTML, CSS, JS and project docs. This is static review, not an end-to-end execution. |
| Feature/documentation cross-check | Passed | Confirmed full partner hub and My Orders implementations; three standalone dashboard files are redirect stubs. |
| JavaScript syntax | Passed | `node --check` passed for all five files in `king-of-spices/assets/js/` using the available Node runtime. |
| Local HTTP smoke check | Passed | Python static server returned HTTP 200 for homepage, My Orders, Partner Hub and `assets/js/script.js`. This confirms serving only, not browser interaction. |
| Post-change JavaScript syntax | Passed | Re-run after login improvements; all five JavaScript files passed `node --check`. |
| Login dialog browser check | Passed | Opened the local homepage; customer and staff tabs switched and rendered; dialog title/labels were present in accessibility state; no browser warnings/errors were reported. Short viewport required scrolling inside the dialog. |
| Browser end-to-end flows | Passed for the cases below | Local-browser synthetic flows; this does not establish multi-device behavior or production readiness. No browser console warnings/errors were observed during the run. |
| Backend/database/payment | Not applicable / absent | No backend, database or payment integration exists. |

## Manual regression checklist (use fresh browser profile and synthetic data)

| ID | Case / steps | Expected result | Status |
|---|---|---|---|
| T01 | Serve `king-of-spices/`; open `index.html`; browse menu | Page/menu render; console remains clear | Passed — menu rendered; no console warnings/errors observed. |
| T02 | Add item, change quantity, remove item; exceed stock | Cart count tracks quantities; remove empties cart; quantity stops at available stock | Passed — added two, increased to stock limit of 16, extra increment was blocked, then removed item. |
| T03 | Try invalid and valid 10-digit checkout phones | Invalid phone blocks order; valid synthetic phone permits checkout | Passed — short number blocked; 10-digit synthetic number accepted. |
| T04 | Place valid synthetic order | ID appears; local order saved; cart clears; stock decreases | Passed — confirmation/ID shown, cart cleared and stock decreased by one in isolated test origin. |
| T05 | Open My Orders in same browser profile | New order appears as `Pending` | Passed — synthetic order and receipt were visible. |
| T06 | Open Partner Hub; update order status | Staff status change appears in customer order view | Passed — Pending → Preparing appeared in My Orders. Other transitions were not exercised. |
| T07 | Try to order beyond remaining stock | Cart/order flow blocks quantity beyond stock | Passed — cart quantity capped at available stock; checkout also rejected a stale cart after stock reached zero. |
| T08 | Apply valid and unknown coupons | Correct coupon message and total | Partial — `WELCOME10` and an unknown code checked; `KING50` remains untested. |
| T09 | Join King's Club; inspect member cart estimate | Member state and discount/free delivery are reflected; no payment occurs | Passed — joined in demo, 10% discount and free delivery appeared; billing is absent. Cancellation not tested. |
| T10 | Submit reservation with a past date, then a valid date | Past date blocked; valid synthetic request returns a reference | Passed — past date was invalid; future request showed a reference. Missing-field cases not separately exercised. |
| T11 | Submit catering with invalid phone/date/guest count, then valid values | Invalid request blocked; valid estimate/request returns a reference | Passed — invalid input blocked; 10-person Premium estimate was ₹4,990 and request reference displayed. |
| T12 | Try same-name dish; adjust inventory; add unique dish | Duplicate retained; stock adjustment updates count; new item appears | Passed — duplicate name blocked, +1 adjustment updated count, and a unique synthetic dish appeared in inventory. |
| T13 | Check mobile viewport and keyboard-only form operation | Controls remain usable and focus/error feedback is visible | Pending |
| T14 | Disconnect internet after initial load | Core HTML/JS works; externally hosted images/icons may fail | Pending |
| T15 | Customer sign-in with invalid then valid synthetic phone | Invalid phone is rejected; valid phone opens demo account state | Passed — short phone rejected; valid synthetic phone showed demo customer state. |
| T16 | Switch Partner Hub tabs and apply queue filters | Correct panel/filter becomes active | Passed — Inventory panel switched and queue filter became active. |

Test data used generic synthetic values on a separate local test origin; no actual customer or payment data was entered. The temporary browser tabs and local servers are being closed after this report update. Browser/version and OS were not captured.

## Release acceptance

- Remaining partial tests (KING50 and all status transitions beyond Preparing) should be completed before final release.
- No release-blocking console errors on critical demo pages.
- Synthetic test order survives navigation/refresh in the same profile.
- Presentation accurately states local-only persistence and manually updated status.
- T13 and T14 limitations are acknowledged if unresolved.
