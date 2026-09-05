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
  - ~~Failed/abandoned payment recovery~~ — RESOLVED (Option B): no in-place
  retry; `merchantOrderId` stays == `Order.id`. Customer cancels the unpaid
  order (`POST /me/orders/:id/cancel`) and re-checkouts (new order = new id).
  Keeps the verified PhonePe verify/webhook chain untouched.
- **Stale-order expiry trigger** — OPEN (low priority). `expireStalePendingOrders`
  + `POST /admin/orders/expire-stale` exist; needs an external cron
  (e.g. cron-job.org) pointed at the endpoint. Decide cadence (e.g. hourly,
  minutes=60) and whether to later move to an in-app `@nestjs/schedule` cron.
- **Gateway refund money-movement** — OPEN. Admin refund currently records
  internal state only (order/payment/booking/wallet). Implementing real PhonePe
  refunds needs `PaymentProvider.refund` + SDK call + refund status handling.


## Workflow / operations
- **Supervisor booking-detail view** — DEFERRED by decision. List endpoint kept
  light (no photos). Need a detail drawer/page so supervisors review before/after
  photos before confirming completion. Confirm works now; photo review pending.
- **Photo enforcement** — currently optional-with-nudge. Flip to hard-required
  (block work-done without ≥1 before + ≥1 after) once R2 is live if desired.
- ~~**Wallet credit on completion**~~ — RESOLVED (money-model phase). Employee
  wallet is credited inside the same `$transaction` as the status flip to
  COMPLETED in `assignments.service.ts` `confirmCompletion`, via
  `WalletService.creditForCompletion` (JOB_CREDIT, net split using
  `employee.payoutRatePercent ?? global defaultPayoutPercent`). Idempotent on
  `@@unique([bookingId, type])`. Reversal hook (`reverseForBooking`) available
  for refunds/cancellations.
- **Customer account area** — scoped, not built. LOCKED constraint: NOT a
  separate dashboard UI. Customer remains on the normal website with full public
  nav/chrome; add only a dropdown under the customer name/email in the existing
  header with three items — Profile, Bookings, Refund/Cancellations — each
  rendering as a page inside the website's own layout. Sequenced after the
  notification engine per the current plan.

## Notifications (engine live; follow-ups deferred)
- **`notifyStaff` deduplication** — DEFERRED (agreed). The admin/supervisor
  fan-out helper is duplicated in `OrdersService` and `EmployeeService`. Lift it
  to a single shared method on `NotificationsService`
  (`notifyStaff(msg)` — fetches active ADMIN+SUPERVISOR, one in-app each, email
  on first recipient only) and repoint both callers; delete the private copies.
- **BOOKING_RECEIVED timing vs. payment state** — DEFERRED (agreed). Currently
  fires in `checkout()` for every order, including online orders whose payment
  may fail/abandon — so ops can see a "received" booking that never gets paid.
  Planned fix: fire BOOKING_RECEIVED only when bookings actually enter operations
  — from `confirmBookingsForOps` (COD, immediate) and from `markOrderPaid`
  (online, on settle) — and remove it from `checkout()`. Assign-gating itself is
  already enforced by the status machine (`assign()` allows only CONFIRMED
  bookings; online bookings stay PENDING_PAYMENT until settled), so no separate
  guard is strictly required — an explicit `paymentStatus` guard in `assign()`
  is an optional belt-and-suspenders add.
- **PAYMENT_REJECTED customer email** — DEFERRED (agreed). The FAILED branch in
  `verifyAndSettle` currently marks payments FAILED silently. Add a customer
  in-app + email notification there so the customer knows the payment failed and
  can re-checkout.
- **Notification deep-linking** — DEFERRED. Notifications carry `data`
  (`bookingId` / `orderId`), but the staff bell only marks-read on click; it
  does not navigate. Add per-type routing (role-aware target route) once the
  bell is proven in use.
- **Customer notification bell** — DEFERRED (with customer-area work). Mounts
  into the EXISTING website header (not a separate shell), next to the customer
  name/email dropdown. Same `/me/notifications` API as staff (route is
  JwtGuard-only, so it already serves customers).

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
- Done: pricing/payments block, Phase 0 bookings-card/sort, money model,
  `PATCH /auth/me` (profile edit, both roles), and the payment lifecycle
  (refund/cancel, guarded settlement, expiry method).
- - Done: pricing/payments block, Phase 0 bookings-card/sort, money model,
  `PATCH /auth/me`, the payment lifecycle (refund/cancel, guarded settlement,
  expiry method), and the **notification engine backend** (all 15 events wired,
  in-app + email, CC/BCC settings box).
- Current position: notification engine backend complete → **next: notification
  frontend consumer** (bell, list, unread badge, mark-read) → GST invoice PDF →
  employee/supervisor workflow (supervisor booking-detail/photo-review) →
  notification follow-ups above → hardening.
