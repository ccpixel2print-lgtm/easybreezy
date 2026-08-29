# Open Questions / Pending Decisions

## Payments
- ~~`POST /payments/verify` callback route~~ — RESOLVED (decisions §D): PhonePe
  uses webhook + `verifyAndSettle`; no generic verify route needed.
- **`Order.paymentProvider` column** — still OPEN. `Payment.provider` exists, but
  `Order` does not persist the chosen provider and the schema comment still says
  `"razorpay"`. Decide: (a) add `Order.paymentProvider` + persist in
  `initiatePayment`, or (b) rely on the `Payment` row. Recommend (a) for cleaner
  queries. Also update the stale `Payment.provider` comment `"razorpay"` →
  `"phonepe"`.

## Workflow / operations
- **Supervisor booking-detail view** — DEFERRED by decision. List endpoint kept
  light (no photos). Need a detail drawer/page so supervisors review before/after
  photos before confirming completion. Confirm works now; photo review pending.
- **Photo enforcement** — currently optional-with-nudge. Flip to hard-required
  (block work-done without ≥1 before + ≥1 after) once R2 is live if desired.
- **Wallet credit on completion** — `confirmCompletion` has a TODO hook; wire it
  into the money-model phase (credit net-of-GST split, ideally in the same DB
  transaction as the status flip).

## Policy / compliance
- **Named Grievance Officer** for the Privacy Policy (name + designation) — using
  generic email for now.
- **Registered address reconciliation** — confirm "Plot No 29-32, BJR Nagar,
  Jawahar Nagar, Ambedkar Nagar, Hyderabad, Secunderabad, Telangana 500087"
  matches company registration + bank + PhonePe application exactly.
- Real policy content must replace remaining Lorem Ipsum before go-live.

## Deployment
- Exact deploy process on Hostinger (manual `git pull` + build, or pipeline?) —
  document once confirmed.
- Full env-var inventory — keep `01-architecture.md §8` current.
- Monorepo vs multi-repo: currently two repos; a "monorepo split" was noted
  earlier but direction is unconfirmed given two-VPS-now / one-VPS-later.

## Sequencing
- After the pricing/payments block is pushed & tested, confirm next block:
  `PATCH /auth/me` (quick win) → payment lifecycle → notifications → invoices →
  employee/supervisor workflow + money model → hardening.
