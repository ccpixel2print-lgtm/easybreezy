# Easy Breezy — Project Documentation

This `docs/` folder is the single source of truth for the Easy Breezy project.
If working context is ever lost, reading these files in order restores full
understanding of the product, architecture, current progress, and every locked
decision.

## Files

1. **00-README.md** — this index.
2. **01-architecture.md** — system topology, the three front-end surfaces, tech
   stack, data/object model, auth model, deployment (current + target).
3. **02-progress-tracker.md** — the single, reconciled status of every feature.
   Supersedes all older versioned trackers.
4. **03-decisions-log.md** — locked decisions and their rationale.
5. **04-conventions.md** — coding conventions, shared components, and known
   gotchas. **Read this before writing any code.**
6. **05-open-questions.md** — decisions still pending.

## Source of truth hierarchy

1. The **Master Requirement Document v1.0** (frozen 2026-07-02) + Addendums A & B
   is the authoritative product scope.
2. Where these docs **amend** the master doc (e.g. COD as an admin toggle), the
   amendment is stated explicitly with rationale in `03-decisions-log.md`.
3. When in doubt about *current code state*, re-read the actual source file — do
   not trust descriptions alone. Much of the pricing/payments work is coded
   locally and **not yet pushed**, so the live GitHub repo is behind local.

## Golden rules (expanded in 04-conventions.md)

- Money is stored in **paise** everywhere in the backend.
- Public-facing copy must never call Easy Breezy a **marketplace or aggregator**.
  We are the principal service provider; technicians are our contracted staff.
- Every NestJS module using `@UseGuards(JwtGuard, RolesGuard)` must register
  `JwtModule` itself (a missing registration crashed the whole backend once).
- `PolicyLayout` is a shared shell with a **per-page badge**; do not assume it
  says "Legal."
