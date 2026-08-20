# Architecture

## 1. What Easy Breezy Is

Easy Breezy is a limited-area, online-prepaid home-services business for India
(maid, electrician, plumber, deep cleaning, etc.) in a restricted set of
serviceable pincodes. Customers self-serve on the website; an internal operations
team (supervisors + contracted technicians) fulfills each job.

**Business/legal positioning:** Easy Breezy is the **principal service provider**.
We select and engage technicians on a **per-visit / per-work contract basis** and
are directly responsible to the customer for the work. Operationally this resembles
an Urban Company–style flow (per-booking, on-demand, revenue-split with
contractors), but **we are not a marketplace, aggregator, or intermediary**, and
public-facing copy must never describe us as one. (This positioning was required
for payment-gateway onboarding — see 03-decisions-log.md.)

## 2. Three Front-End Surfaces, One API

All surfaces share one API-first backend + one database.

1. **Public + Customer website (blended).** Public marketing site (landing,
   services, about, contact) with the customer experience woven into the same
   site after login — cart, checkout, booking tracking, history, invoices, quote
   approval, feedback. No separate customer app shell.
2. **Employee/Contractor dashboard** — separate, mobile-first, ultra-lightweight.
   Assignments, accept/reject, start/complete, photo upload, attendance, wallet.
3. **Admin & Supervisor consoles** — data-dense back office.

Current build reality: surfaces 1 and 3 (public/customer + full staff dashboard
suite) are live. The employee area exists as part of the staff dashboards. The
heavier operational workflow (WIP timer, photos, quotes, wallet) is not yet built.

## 3. Tech Stack

- **Frontend:** Next.js 14.2.35 (App Router), TypeScript, Tailwind. Node server
  build (NOT static export — dynamic routes like `[id]` work).
- **Backend:** NestJS + Prisma.
- **Database:** Neon Postgres (managed) today.
- **Email:** Resend (customer OTP live).
- **Payments:** Provider-agnostic abstraction (see §7).
- **Auth:** JWT (stored in localStorage).

## 4. Auth Model (dual, role-aware, one user store)

- **Customers:** passwordless **email OTP**. The public website's login is the
  customer login only.
- **Staff (Admin / Supervisor / Employee):** **email + password**, via
  `/staff/login` with role-based redirect. Separate `StaffAuthContext`
  (storage key `eb_staff_token`).
- Both flows resolve against a single role-aware user store.

## 5. Data / Object Model (from Master Doc §9)

- **Order** — payment container for one customer; holds one or more **Bookings**.
- **Booking** — a single service with its own schedule, assignment, lifecycle.
  Owns: an **Assignment** (employee, accept/reject/reassign, WIP timer), an
  optional **Quote** (visiting-type only), a **Completion** record (before/after
  photos + confirmation), one or more **Payments**, an optional **Refund**
  (partial-capable, admin-approved), and **Feedback**.
- On closure: post **Wallet Ledger** entries (employee credit + platform share).
- On approved refund: post a ledger **debit** (claw-back).
- **Settlement** batches unsettled ledger entries, posts a settlement debit,
  notifies the employee.
- Reference data: Services, Serviceable Pincodes, Users/Roles, and
  **Configuration** (charges, taxes, SLA, global split default).

Money is stored in **paise** throughout the backend. The frontend converts
₹ ↔ paise at the edges.

### Pricing model (as built this session — amends master doc)

Order total is composed of configurable line items:

    taxableBase = serviceCharge + platformFee + convenienceFee
    gst         = round(taxableBase * gstRate)   // only if gstEnabled
    totalAmount = taxableBase + gst

- `serviceCharge` = sum of booking service amounts (the existing subtotal).
- `platformFee`, `convenienceFee` — each admin-configurable: enabled flag,
  FLAT or PERCENT, value. Stored as new paise columns on `Order`.
- `gst` — admin-configurable rate + an **enabled toggle** (GST is optional).
- **Discounts/coupons and tips are Phase 2** (deferred this session).

### Pricing types (Master Doc §4)

- `hourly` — prepay booked hours upfront.
- `fixed` — prepay full price upfront.
- `visiting` — prepay a fixed visit/inspection fee; on site a **Quote** is raised
  (by employee, or supervisor on their behalf); customer approves and pays the
  balance online. Two online payments. (Quote flow = not yet built.)

## 6. Status Lifecycles (Master Doc §8)

- **Order:** created → paid → partially_fulfilled → completed / cancelled / refunded
- **Booking:** requested → confirmed → assigned → accepted → in_progress →
  completed → closed / cancelled / no_show
- **Assignment:** assigned → accepted / rejected / reassigned
- **Quote:** raised → approved / rejected → paid
- **Refund:** requested → approved → processing → completed / rejected
- **Wallet Ledger Entry:** created (unsettled) → settled / reversed
- **Settlement:** draft → paid

## 7. Payments Architecture (PG-agnostic, plug-and-play)

Payment gateways may change (Razorpay was rejected; PhonePe pending). The system
is built so gateways are swappable without redeploy:

- **`PaymentProvider` interface** — `name`, `createPayment`, optional
  `verifyPayment`, optional `refund`.
- **Provider registry** in `PaymentsService` — a `Map<name, PaymentProvider>`;
  `mock`, `cod`, and `razorpay` registered.
- **`payments` settings group** (`activeProvider`, `enabledProviders`) drives
  which provider is used, resolved per-request. Admin toggles gateways (and COD)
  from settings — **no redeploy**.
- Adding a gateway = implement the interface, register it, enable it in settings.
- Secrets (e.g. `RAZORPAY_KEY_ID/SECRET`) stay in env vars; dormant providers
  don't break boot when keys are empty.

**COD** is one such toggleable provider — admins decide whether to offer it.

## 8. Deployment

### Current
- **Two VPS + managed DB:** VPS #1 = frontend (Next.js), VPS #2 = backend
  (NestJS) on Hostinger; database = Neon Postgres (managed).
- `NEXT_PUBLIC_API_URL` on the frontend points at the live backend.

### Target (future production)
- **Single VPS** hosting frontend + backend + **self-hosted Postgres** together.
  (Reinforces the "lightweight, self-hostable" principle.)

### Known env vars
`DATABASE_URL`, `JWT_SECRET`, `PAYMENT_PROVIDER` (fallback default provider),
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `MAIL_FROM`, `NEXT_PUBLIC_API_URL`.
(Maintain the full list here as it grows.)
