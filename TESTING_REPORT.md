# Testing Report

**Report date:** 3 November 2026
**Evidence rule:** only checks actually run are marked verified. The project has no automated test suite. Browser workflow cases below remain pending until executed and recorded by a team member.

## Checks completed during this audit

| Check | Result | Evidence / limitation |
|---|---|---|
| Repository and page/source inspection | Passed | Inspected existing HTML, CSS, JS and project docs. This is static review, not an end-to-end execution. |
| Feature/documentation cross-check | Passed | Confirmed full partner hub and My Orders implementations; three standalone dashboard files are redirect stubs. |
| JavaScript syntax | Passed | `node --check` passed for all five files in `king-of-spices/assets/js/` using the available Node runtime. |
| Local HTTP smoke check | Passed | Python static server returned HTTP 200 for homepage, My Orders, Partner Hub and `assets/js/script.js`. This confirms serving only, not browser interaction. |
| Post-change JavaScript syntax | Passed | Re-run after login improvements; all five JavaScript files passed `node --check`. |
| Login dialog browser check | Passed | Opened the local homepage; customer and staff tabs switched and rendered; dialog title/labels were present in accessibility state; no browser warnings/errors were reported. Short viewport required scrolling inside the dialog. |
| Browser end-to-end demo | Not run | Do not claim tested in browser until the cases below are run. |
| Backend/database/payment | Not applicable / absent | No backend, database or payment integration exists. |

## Manual regression checklist (use fresh browser profile and synthetic data)

| ID | Case / steps | Expected result | Status |
|---|---|---|---|
| T01 | Serve `king-of-spices/`; open `index.html`; browse menu | Page and menu render; no missing local assets or console errors | Pending |
| T02 | Add dish, increase/decrease quantity, remove it | Cart count and quantities stay consistent; cannot exceed stock | Pending |
| T03 | Add one item; use malformed and valid 10-digit delivery phones | Invalid phone blocks checkout; valid phone permits the next step | Pending |
| T04 | Place valid synthetic order | Order ID appears; order stored locally; cart clears; stock decreases by ordered quantity | Pending |
| T05 | Open My Orders in same browser profile | Newly created order appears with `Pending` state | Pending |
| T06 | Open Partner Hub; move order through statuses | Selected status saves locally and appears in My Orders after refresh | Pending |
| T07 | Try to order more than remaining stock / order an unavailable dish | Checkout blocks and stock is not decremented | Pending |
| T08 | Apply `WELCOME10`, `KING50`, unknown coupon; compare totals | Coupon message and totals match documented rules; confirm with source before calling pricing final | Pending |
| T09 | Join/cancel King's Club; inspect cart estimate | Member state and discount toggle locally; no payment is charged | Pending |
| T10 | Submit reservation with missing/invalid fields and with yesterday's date | Invalid fields/date blocked; valid future/today request shows local reference | Pending |
| T11 | Submit catering request with <10 guests/invalid phone/past date, then valid values | Invalid request blocked; valid request estimates and stores local reference | Pending |
| T12 | Add inventory item with existing normalized name | Existing item is retained and a duplicate warning is shown | Pending |
| T13 | Check mobile viewport and keyboard-only form operation | Controls remain usable and focus/error feedback is visible | Pending |
| T14 | Disconnect internet after initial load | Core HTML/JS works; externally hosted images/icons may fail | Pending |

Record browser/version, OS, date, tester, exact data, result, defect ID and screenshot for each test. Use an isolated browser profile and clear test data before/after testing.

## Release acceptance

- T01–T12 pass or have documented blockers with owner and workaround.
- No release-blocking console errors on critical demo pages.
- Synthetic test order survives navigation/refresh in the same profile.
- Presentation accurately states local-only persistence and manually updated status.
- T13 and T14 limitations are acknowledged if unresolved.
