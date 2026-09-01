# King of Spices — Revenue Platform Extension

This repository extends the [King of Spices](https://github.com/Alkaison/King-of-Spices) restaurant website with monetization, online ordering, King's Club membership, catering management, and partner portals.

## 🚀 Features
- **Online Ordering System**: Real add-to-cart, cart management, coupons (`WELCOME10`, `KING50`), tax & delivery fee calculations, and live order tracking.
- **King's Club Membership**: Subscription plan with automated 10% discount and free delivery.
- **Catering & Events**: Dynamic guest pricing calculator, package selection, and inquiry validation.
- **Partner & Management Portals**: Restaurant operations dashboard, inventory tracker, user management, and partner portal.
- **Table Reservations**: Interactive reservation booking flow with real-time validation.

## 📂 Project Structure
- `king-of-spices/`
  - `index.html` — Homepage & Online Ordering
  - `about.html` — About Us
  - `reservation.html` — Table Reservation
  - `kings-club.html` — King's Club Membership
  - `catering.html` — Catering & Event Booking
  - `partner-portal.html` — Restaurant Partner Onboarding & Portal
  - `dashboard-restaurant.html` — Restaurant Management Dashboard
  - `dashboard-inventory.html` — Inventory Management Dashboard
  - `dashboard-user.html` — Customer Profile & Order History
  - `my-orders.html` — Order Tracking & History
  - `assets/` — CSS stylesheets & JavaScript modules

## 💻 Running Locally
No build tools required! Simply serve the directory with any local static server:

```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000/king-of-spices/index.html`.
