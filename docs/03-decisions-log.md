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
put the application on hold citing policy expectations). All public-facing content
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
