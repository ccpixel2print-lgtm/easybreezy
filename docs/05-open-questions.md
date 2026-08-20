# Open Questions / Pending Decisions

## Payments
- **`POST /payments/verify` callback route** (real-gateway verify → `markOrderPaid`)
  + frontend checkout handler — deferred until live gateway keys exist. Build when
  PhonePe/Razorpay approved.
- Does `Order` track the chosen provider (`paymentProvider` column)? If yes,
  persist it in `initiatePayment`; if no, add the column. **Needs confirmation.**

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
