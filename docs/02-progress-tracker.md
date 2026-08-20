# Progress Tracker (single source of truth)

Reconciled against Master Doc §§6, 8, 9 + Addendums A & B. Supersedes ALL older
versioned trackers.

**Legend:** ✅ done & live-tested · 🟡 coded, local, NOT pushed/tested · ⏳ not
started · 🔵 Phase 2 (deferred)

> **Push status:** the last confirmed-live state is the public/customer site +
> full staff dashboard suite. **Everything since is 🟡 (coded locally, unpushed,
> untested):** the entire pricing/charges block, admin Settings UI, checkout
> breakdown, GST-optional, and the payments PG-agnostic redesign.

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
- Completion confirmation — ⏳
- Feedback (rating + comment) — ⏳

## Staff dashboards
- Staff auth, role routing, shell/guard — ✅
- Admin overview, orders, customers — ✅
- Bookings list + assign/reassign/unassign — ✅
- Staff management CRUD — ✅
- Catalog CRUD (categories, services, sub-services, pincodes) — ✅
- Employee area: My Jobs + job detail start/complete (basic) — ✅

## Pricing & charges (this session)
- Settings foundation: namespaced `AppSetting`, pricing group, admin GET/PATCH — 🟡
- Checkout refactor: platform + convenience fees, GST on combined base, 2 new
  `Order` columns — 🟡
- GST-optional toggle — 🟡
- Admin Settings tab (frontend) + `staffApi` fetchers — 🟡
- Public `/pricing-config` endpoint + checkout breakdown display — 🟡

## Payments (PG-agnostic; online-prepaid + admin-toggleable COD)
- Provider interface + mock/cod providers — ✅ (pre-existing)
- PG-agnostic redesign: registry, `payments` settings group, per-request resolve,
  admin GET/PATCH `/admin/settings/payments` — 🟡
- Razorpay provider (dormant until keys + enable) — 🟡
- `POST /payments/verify` callback route + frontend handler — ⏳
- COD as admin toggle — 🟡 (via payments settings)
- Order/payment status transitions on success — ⏳
- Visiting two-payment flow (visit fee + quote balance) — 🔵/⏳

## Employee/Supervisor operational workflow (Master Doc Phase 1; sequenced after v1 core)
- 3-step employee flow (accept/reject → start → complete) — ⏳
- WIP timer, arrival proof — ⏳
- Before/after photo upload — ⏳
- Daily attendance — ⏳
- Supervisor confirm-request queue — ⏳
- Skill/area/availability-filtered assignment + clash-blocking — ⏳
- Force-reassign, reschedule-on-behalf — ⏳
- Quote raising (employee or supervisor; incl. supervisor-added extra charges) — ⏳

## Money model depth (Master Doc Phase 1)
- Per-employee revenue split (net-of-GST, configurable toggles) — ⏳
- Append-only wallet ledger (credit on closure, debit on refund/settlement) — ⏳
- Settlement screen + payout recording + notification — ⏳
- Refunds queue → gateway partial refund — ⏳

## Cross-cutting (Master Doc Phase 1)
- Channel-agnostic notification engine (in-app + email live, WhatsApp-ready) — ⏳
- GST invoice PDF generation — ⏳
- Enforced status lifecycles (§8) — 🟡 partial via enums
- Profile `PATCH /auth/me` — ⏳

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
  `order_charges`) — ⏳
- Confirm `NEXT_PUBLIC_API_URL` on frontend host — ⏳
- Finalize + publish real policy content (replace Lorem Ipsum) — 🟡
