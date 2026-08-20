# Conventions & Gotchas

**Read this before writing code.** These encode mistakes already made and fixed.

## Money
- All backend amounts are **paise** (integers). Never store rupees.
- Frontend converts ₹ ↔ paise only at input/display edges (see `format.ts`:
  `formatRupees`, `rupeesToPaise`, `paiseToRupeeInput`).

## NestJS: JwtModule per guarded module
- **Every module** whose controllers use `@UseGuards(JwtGuard, RolesGuard)` MUST
  register `JwtModule.registerAsync(...)` in its own `imports`, and include
  `JwtGuard`/`RolesGuard` in providers.
- Missing this does not fail quietly — it **crashes the entire backend on boot**
  (this happened with `SettingsModule` and broke staff login site-wide).
- If a module injects `SettingsService`, it must import `SettingsModule`.

## Settings
- One namespaced-JSON row per group in `AppSetting` (`group` PK, `value` Json).
- Each group has a typed interface + defaults + a `merge*` helper + validation.
- Current groups: `pricing`, `payments`. Future: hours, slots, holidays.

## Payments
- Never hard-wire a gateway. Implement `PaymentProvider`, register in the
  `PaymentsService` map, enable via the `payments` settings group.
- Gateway secrets live in env vars; providers must construct safely with empty
  keys and only throw when actually used.

## Public-facing copy: no marketplace language
- Never call Easy Breezy a marketplace, aggregator, intermediary, or platform
  connecting buyers to third-party sellers.
- We are the **service provider**; technicians are our **contracted** staff.
- We do **not** sell/ship goods or spare parts — parts are provided by the
  customer; technicians provide labour only.

## Shared frontend components
- **`PolicyLayout`** (`src/components/PolicyLayout.tsx`) is a shared shell (navbar
  + header banner + footer) for legal-style pages. It renders a **badge** in the
  header — this is now a **per-page prop**, NOT hardcoded "Legal." Always pass an
  appropriate `badge`/`badgeIcon`. Do not reuse blindly assuming "Legal."
- **`DashboardLayout`** — staff shell; sidebar items are role-gated.
- Reuse `StatusBadge`, the pagination normalizer, `AssignModal`, and shared
  Modal/Input bits rather than re-rolling them.

## Frontend routing notes
- Node server build (no `output: export`) — dynamic routes (`[id]`) work.
- Nav uses plain `<a href>` for same-page anchors (`/#home`) and route links
  alike; that's acceptable.

## When editing files
- Tag every change with location: `[BACKEND]`, `[FRONTEND]`, `[DEPLOY]`,
  `[MANUAL]`, plus the exact file path.
- Local code is often ahead of GitHub (batching before push). Re-read actual
  files; don't trust the live repo or stale descriptions.
