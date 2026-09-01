# King of Spices — Revenue Platform Extension

This extends the original open-source [King of Spices](https://github.com/Alkaison/King-of-Spices)
restaurant website (HTML/CSS/JS, no build step, no backend) with three
monetization features, without rebuilding the existing design.

## Run it locally
No build tools needed. From this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. (Opening the file directly
also works, but a local server avoids any browser file:// restrictions.)

## What's new
- **Online ordering** — real add-to-cart, quantity controls, tax, delivery
  fee (Standard ₹40 / Express ₹80), coupons (`WELCOME10`, `KING50`), and an
  order confirmation with an order ID and ETA. See `assets/js/script.js`.
- **King's Club membership** (`kings-club.html`) — ₹99/month plan with an
  automatic 10% order discount and free delivery above ₹499 once joined.
  See `assets/js/kings-club.js`.
- **Catering & Events** (`catering.html`) — Basic/Premium/Royal packages
  with a live guests × price estimate and a validated request form that
  returns a reference ID. See `assets/js/catering.js`.

Everything is simulated with `localStorage` — there is no backend and no
real payment gateway, as specified.

## What's preserved
- Original pages: `index.html`, `about.html`, `reservation.html` — same
  copy, sections, and layout structure as the source repo.
- Original nav style, hero, promo cards, menu grid, testimonials and
  footer, restyled with the same orange/black identity (`#ff9d2e` accent
  on a dark header) rather than replaced.
- The reservation form's fields and flow; it now shows a proper
  confirmation instead of doing nothing on submit.

## A note on assets
This build could not pull the original repository's binary image files or
its exact `style.css`/`script.js` (network access to GitHub's file/raw
endpoints was blocked in the environment this was built in). Images are
therefore linked directly from the live GitHub Pages site
(`alkaison.github.io/King-of-Spices/assets/images/...`) so the pages
render with the original artwork; `style.css` and the base `script.js`
were rebuilt to match the same color identity, typography feel, and class
names used by the original markup. If you have the original repo cloned,
you can drop this project's HTML/CSS/JS into it and swap the image URLs
back to local `./assets/images/...` paths — the class/id names line up
with the original markup so no HTML changes should be needed.

## Frontend-only limitations
- No payment gateway — checkout, membership billing, and catering
  invoicing are all simulated.
- Persistence is per-browser (`localStorage`), not shared across devices
  or users.
- Coupon and package pricing are hard-coded in the JS files rather than
  coming from a CMS or database.
