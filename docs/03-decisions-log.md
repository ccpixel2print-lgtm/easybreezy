# Decisions Log

## From Master Doc §10 (locked, with rationale)
- **Service-provider model, operated marketplace-style internally** — per-booking,
  on-demand with contracted technicians. NOTE amendment below re: external framing.
- **Pincode serviceability checked at add-to-cart** (not upfront) so all services
  stay publicly browsable while bookings are gated to served areas.
- **Customer-preferred time window** confirmed by supervisor (no real-time
  guaranteed slots in MVP).
- **Contractor payout is Phase 1** (core to the model); wallet is an append-only
  **ledger** for audit-safety and refund claw-backs; splits are **per-employee,
  net-of-GST**; settlement is **manual** in MVP.
- **Completion = before/after photos + customer confirmation** (supervisor
  phone-close fallback); OTP confirmation is Phase 2.
- **Channel-agnostic notifications** so WhatsApp lights up later without rework.

## Amendments to the Master Doc (this project, with rationale)

### A. External positioning: NOT a marketplace
Although the master doc calls the model "Urban Company–style marketplace," Easy
Breezy presents **externally and legally as the principal service provider**. We
select and engage technicians on a per-visit/per-work **contract** basis and are
directly responsible to the customer.
**Rationale:** required for payment-gateway onboarding (Razorpay rejected; PhonePe
approved after the service-provider positioning was applied). All public-facing content
(site copy, T&C, privacy, delivery, about, contact) must reflect the service-
provider model and must not use "marketplace/aggregator/intermediary/seller"
language. Internally, the contractor revenue-split + wallet model still applies.

### B. COD is an admin toggle, not "online-prepaid only"
The master doc says online-prepaid only in MVP with COD in Phase 2. **Amended:**
COD is one of the admin-toggleable payment methods in the `payments` settings
group. Admins enable/disable it (and any gateway) without redeploy.
**Rationale:** gives the admin operational flexibility to decide whether to offer
COD, using the same PG-agnostic infrastructure.

### C. Pricing composition
Order total = serviceCharge + platformFee + convenienceFee, then GST on that base
(GST itself toggleable). Platform & convenience fees are each admin-configurable
(enabled, FLAT/PERCENT, value). **Discounts/coupons and tips deferred to Phase 2.**
Tips, when built, will have an admin-configurable platform/employee split.

### D. Payment gateway: PhonePe (Razorpay dropped)
Razorpay onboarding was rejected; PhonePe was approved and is now the live
gateway via `@phonepe-pg/pg-sdk-node@2.0.6` (StandardCheckout). The PG-agnostic
interface/registry is unchanged — PhonePe is just the active provider.
**Rationale:** gateway availability. The generic `POST /payments/verify` route
originally planned is superseded by PhonePe's server-to-server webhook
(`/payments/phonepe/webhook`) plus a client-polled `verifyAndSettle` status route.
Webhook subscribes to Checkout Order Completed + Failed only (no refund events yet).

### E. Bookings list ordering (locked)
Admin + Supervisor bookings lists sort **ascending by scheduledDate, then by slot
start time** — i.e. the **soonest job to attend is at the top**. This is an
operations queue, not a "most-recently-created" feed.
**Rationale:** staff work the nearest-due job first; ascending scheduledDate is
the correct priority order.

### F. Notification engine design (locked)
Hybrid delivery: **in-app is authoritative and synchronous** (written now,
enlists in the caller's `$transaction` when one is passed, so the notification
commits atomically with the business change); **email is best-effort and
post-commit** (fire-and-forget, failures swallowed inside `EmailChannel` so a
mail outage never rolls back or fails the business operation).
- **Channel-agnostic** (`NotificationMessage` + channel interface) so WhatsApp
  can be added later without touching callers — per Master Doc.
- **CC/BCC ops address** is a single optional field in the `notifications`
  settings group (Admin → Settings), BCC'd on every outbound customer/employee
  email so ops get a passive copy without extra config per event.
- **Admin/supervisor events fan out** to all active ADMIN+SUPERVISOR as one
  in-app row each, but the **email is attached to only the first recipient**
  (which BCCs the ops address) — avoids spamming every admin's inbox while still
  giving ops one email + everyone the in-app badge.
- **Build-one-event-first** was the agreed rollout: TECHNICIAN_ASSIGNED was wired
  and smoke-tested end-to-end before the remaining 14 events were added.
**Rationale:** notifications must never be able to break a checkout, payment,
assignment, or payout; in-app is the reliable channel and email is a convenience
layer.
### G. Customer account area is in-site, not a separate dashboard (locked)
Unlike staff (who use the `DashboardLayout` shell with a sidebar), the customer
"account area" must feel like part of the normal website. Keep all existing
public navigation and chrome; the only addition is a dropdown under the customer
name/email in the existing site header, linking to three pages — Profile,
Bookings, Refund/Cancellations — which render within the website's own layout.
No sidebar, no distinct dashboard look.
**Rationale:** the customer journey stays continuous with browsing/booking; a
separate admin-style shell would feel jarring and off-brand for end customers.

## Technical decisions (this project)
- **Money in paise** everywhere (backend); frontend converts at edges.
- **JWT in localStorage**; separate `StaffAuthContext` (`eb_staff_token`) from
  customer auth.
- **Single `/staff/login`** with role-based redirect.
- **Namespaced-JSON settings** (`AppSetting` table, one JSON blob per group:
  `pricing`, `payments`, and future groups like hours/slots/holidays). Coupons get
  their own tables (Phase 2), not settings.
- **PG-agnostic payments**: interface + registry + settings-driven active provider.
- **Catalog soft-delete** (deactivate, not hard delete) to preserve history;
  catalog is admin-only.
- **No class-validator** (validation done manually in services).
- **Docs live in the frontend repo** (`easybreezy/docs/`).
