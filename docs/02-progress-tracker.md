# Progress Tracker (single source of truth)

Reconciled against Master Doc §§6, 8, 9 + Addendums A & B. Supersedes ALL older
versioned trackers.

**Legend:** ✅ done & live-tested · 🟡 coded, local, NOT pushed/tested · ⏳ not
started · 🔵 Phase 2 (deferred)

> **Push status:** public/customer site, full staff dashboard suite, AND the
> PG-agnostic payments redesign with the PhonePe provider are pushed to `main`.
> **Still 🟡 (coded locally, unpushed/untested):** the pricing/charges block,
> admin Settings UI, checkout breakdown, GST-optional, the Phase 0
> bookings-card/sort changes, and the Phase 1 completion spine (employee
> accept→work-done, photo upload, supervisor confirm, `BookingPhoto` +
> `StorageService`, `booking_completion_spine` migration). When in doubt,
> re-read the actual source file.

## Phase 0 — immediate polish
- Bookings-card redesign (Admin + Supervisor share one page): date `DD-MM-YY`
  and slot in large bold, full address (addressLine1/2, area, city, pincode)
  shown — ✅
- Backend `listBookings` sort → soonest-to-attend first (scheduledDate asc,
  then scheduledTimeWindow, then createdAt); `where` retyped
  `Prisma.BookingWhereInput` to clear no-unsafe-* lint — ✅
- Payment gating on assignment (assign blocked unless order CONFIRMED) — ✅

## Foundation & Public/Customer surface
- Public marketing site (landing, services, about, contact) — ✅
- Services browse by category — ✅
- Cart with per-item date/time — ✅
- Pincode serviceability at add-to-cart + out-of-area lead capture — ✅
- Customer email-OTP auth — ✅
- Checkout creating Order + Bookings — ✅
- Customer account: booking status + history — 🟡 partial
- GST invoice PDF download — ⏳
- Visiting-flow quote review/approve + balance payment — 🔵/⏳
- Completion confirmation (supervisor-confirmed; customer-facing view later) — 🟡
- Feedback (rating + comment) — ⏳

## Staff dashboards
- Staff auth, role routing, shell/guard — ✅
- Admin overview, orders, customers — ✅
- Bookings list + assign/reassign/unassign — ✅
- Staff management CRUD — ✅
- Catalog CRUD (categories, services, sub-services, pincodes) — ✅
- Employee area: My Jobs + job detail (accept/reject/start/work-done + photo
  upload) — 🟡 (coded, not committed; replaces old start/complete flow)

## Pricing & charges (this session)
- Settings foundation: namespaced `AppSetting`, pricing group, admin GET/PATCH — 🟡
- Checkout refactor: platform + convenience fees, GST on combined base, 2 new
  `Order` columns — 🟡
- GST-optional toggle — 🟡
- Admin Settings tab (frontend) + `staffApi` fetchers — 🟡
- Public `/pricing-config` endpoint + checkout breakdown display — 🟡

## Payments (PG-agnostic; PhonePe live)
- Provider interface + mock/cod providers — ✅ (pre-existing)
- PG-agnostic redesign: registry, `payments` settings group, per-request resolve,
  admin GET/PATCH `/admin/settings/payments` — ✅ (pushed to main)
- PhonePe provider (`@phonepe-pg/pg-sdk-node@2.0.6`): createPayment + redirectUrl,
  verifyPayment (getOrderStatus mapping), validateWebhook — ✅
- PhonePe webhook `POST /payments/phonepe/webhook` + `verifyAndSettle` status
  route (supersedes the old generic `/payments/verify` idea) — ✅
- COD as admin toggle — ✅ (via payments settings)
- - Order/payment status transitions on success (`markOrderPaid` → order PAID,
  bookings CONFIRMED) — ✅
- Payment lifecycle (this session):
  - Admin order-level full refund/cancel (`POST /admin/orders/:id/refund`,
    ADMIN-only): order → CANCELLED, paid payment → REFUNDED, pending → FAILED,
    bookings → CANCELLED, and each `JOB_CREDIT` clawed back via
    `WalletService.reverseForBooking` (exact credited amount, idempotent per
    booking) — all in one `$transaction`.
  - Customer self-cancel of an unpaid order (`POST /me/orders/:id/cancel`):
    only `PENDING_PAYMENT` orders with no bookings advanced into ops; pending
    payments → FAILED, bookings → CANCELLED. Recovery path is cancel +
    re-checkout (Option B — merchantOrderId stays == Order.id; no true retry).
  - Guarded settlement: `markOrderPaid` now refuses to settle a
    CANCELLED/REFUNDED order (late/duplicate webhook can't resurrect a dead
    order); already-PAID is an idempotent no-op.
  - Stale-order expiry: `expireStalePendingOrders(minutes)` cancels orders stuck
    in `PENDING_PAYMENT` past a cutoff (skips COD/ops-advanced). Exposed as
    `POST /admin/orders/expire-stale` (ADMIN-only). Trigger is a DEFERRED
    follow-up — wire an external cron (e.g. cron-job.org) to hit this endpoint;
    no in-app scheduler yet.
- Partial refunds (`PARTIALLY_REFUNDED`) — 🔵 Phase 2 (order-level full
  refund/cancel only for now).
- Real gateway (PhonePe) money-movement refund — ⏳ deferred; current refund
  records internal state only (`PaymentProvider.refund` is an optional,
  unimplemented hook).
- Razorpay — ❌ dropped (rejected); replaced by PhonePe (see decisions log §D)
- Visiting two-payment flow (visit fee + quote balance) — 🔵/⏳

## Employee/Supervisor operational workflow (Master Doc Phase 1)
- Completion spine (accept/reject → start → work-done → supervisor confirm) —
  🟡 (coded, not committed). Lifecycle now:
  `CONFIRMED → ASSIGNED → ACCEPTED → IN_PROGRESS → AWAITING_CONFIRMATION →
  COMPLETED`; reject returns booking to CONFIRMED queue (clears workflow
    timestamps on reassign). Wallet-credit hook is now LIVE inside
  `confirmCompletion` — credit + status flip run in one transaction.
- Before/after photo upload (R2/S3-compatible storage; optional-with-nudge) —
  🟡 (coded, not committed). `BookingPhoto` model + `/employee/jobs/:id/photos`
  upload endpoint; StorageService lazily builds the R2 client and errors clearly
  if R2 env is absent, so the flow is testable pre-R2.
- Supervisor confirm from bookings list (`POST /admin/bookings/:id/confirm`) —
  🟡 (coded, not committed).
- **Supervisor booking-detail view (photo review before confirm)** — ⏳ DEFERRED.
  The list endpoint stays light (no photos); only `getBooking` returns photos.
  Build a detail drawer/page so supervisors can review before/after photos before
  confirming. Until then the confirm button works but the list photo strip is empty.
- WIP timer, arrival proof — ⏳
- Daily attendance — ⏳
- Skill/area/availability-filtered assignment + clash-blocking — ⏳
- Force-reassign, reschedule-on-behalf — 🟡 partial (reassign now covers
  ASSIGNED/ACCEPTED/IN_PROGRESS/AWAITING_CONFIRMATION)
- Quote raising (employee or supervisor; incl. supervisor-added extra charges) — ⏳

## Money model depth (Master Doc Phase 1)
- Per-employee revenue split — 🟡 (coded, not committed). Payout base =
  `Booking.serviceAmount` (pre-tax service charge). Rate resolution:
  per-employee `User.payoutRatePercent` if set, else global
  `payouts.defaultPayoutPercent` (settings group, default 70%). Whole-number
  percent, paise math (`round(serviceAmount × pct/100)`).
- Append-only wallet ledger (`WalletLedger`) — 🟡 (coded, not committed).
  Entry types: JOB_CREDIT (+), PAYOUT (−), REVERSAL (−), ADJUSTMENT (±).
  Balance = SUM(amount). Credit written in the SAME transaction as the
  `AWAITING_CONFIRMATION → COMPLETED` flip; idempotent via
  `@@unique([bookingId, type])` so double-confirm can't double-credit.
- Payout recording (debit) — 🟡 (coded, not committed). Admin/supervisor
  `POST /admin/bookings/employees/:employeeId/wallet/payout`; validates amount
  ≤ balance; stored negative. Employee wallet screen + admin wallet panel
  (balance, totals, ledger, record-payout, set-rate) built.
- - Reversal/refund clawback (customer refund → employee debit) — ✅ wired.
  `reverseForBooking` now accepts an optional `tx` (enlists in the refund
  transaction) and is called by the admin refund flow, reversing each booking's
  exact `JOB_CREDIT`. Idempotent per booking (`@@unique([bookingId, type])`).
- Global payout default settings — 🟡 (coded, not committed).
  `GET/PATCH /admin/settings/payouts` + `staffApi` fetchers.
- `wallet_ledger_and_payout_rate` Prisma migration — ⏳ not yet deployed.
- Settlement screen + payout notification — ⏳ (payout recording done; a
  dedicated settlement/batch screen + notifications still pending).
- Refunds: order-level full refund/cancel done (see Payments section).
  Refunds queue UI + gateway partial refund — ⏳ / 🔵.


## Cross-cutting (Master Doc Phase 1)
- Channel-agnostic notification engine (in-app + email live, WhatsApp-ready) — ⏳
- GST invoice PDF generation — ⏳
- Enforced status lifecycles (§8) — 🟡 booking lifecycle enforced end-to-end
  (accept→…→confirm). Order/payment lifecycle now guarded too: settlement
  refuses terminal orders, refund/cancel/expiry transitions are explicit and
  transactional. Remaining enum-only edges: visiting two-payment flow.
- Profile `PATCH /auth/me` — ✅ backend (name/phone, validated) + shared
  `ProfileForm` at `/admin/profile` and `/employee/profile`, role-aware topbar
  link.

## Phase 2 (🔵)
Coupons/discounts/referrals · customer tips (with admin platform/employee split) ·
WhatsApp notifications · customer self-reschedule/self-cancel policy engine ·
completion OTP · ratings→assignment · availability calendar · advanced cash
reconciliation.

## Policy/compliance (this session)
- Rewrite all legal pages to service-model (non-marketplace) content — 🟡 drafted
- Standalone About + Contact pages — 🟡 drafted
- Footer/nav link + label updates — 🟡 drafted
- Per-page policy badges — 🟡 drafted

## Launch gates
- Rotate test admin credentials — ⏳
- Verify `MAIL_FROM` domain — ⏳
- Run `prisma migrate deploy` on DB (pending migrations: `add_app_settings`,
  `order_charges`, `booking_completion_spine`, `wallet_ledger_and_payout_rate`) — ⏳
- Configure Cloudflare R2 (`R2_*` env vars) before go-live so photo upload
  works; flow is coded to fail gracefully until then — ⏳
- Confirm `NEXT_PUBLIC_API_URL` on frontend host — ⏳
- Finalize + publish real policy content (replace Lorem Ipsum) — 🟡
