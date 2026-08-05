# Audit Remediation — Phased Spec

Source: codebase audit 2026-06-11 (9 finder agents + adversarial verification; 17 confirmed findings, 16 refuted). Each phase below is a self-contained spec an agent can execute independently, in priority order. Phases do not depend on each other unless noted.

| Phase | File | Theme | Size | Risk |
| --- | --- | --- | --- | --- |
| 1 | `phase-1-correctness.md` | User-visible correctness (analytics labels, timezone) | Small | Low |
| 2 | `phase-2-silent-failures.md` | Silent failure UX (onboarding, create-habit, timers) | Small-medium | Low |
| 3 | `phase-3-analytics-performance.md` | Analytics query efficiency (combined query, range bounds, projection) | Medium | Medium |
| 4 | `phase-4-robustness.md` | Scale robustness (webhook 400s, batch-delete chunking, restore payload) | Medium | Medium |
| 5 | `phase-5-hygiene-hardening.md` | Repo hygiene + defense-in-depth validation | Small | Low |

## Ground rules for the executing agent

- Read the phase file fully before editing; every finding cites file:line as of 2026-06-11 — re-locate code if lines drifted.
- One PR per phase. Branch from `main` per phase: `fix/audit-phase-N-<slug>`.
- Match existing code style; respect the ≤100-line file rule (`npm run lint:max-lines`) — decompose per `docs/DECOMPOSITION_PATTERNS.md` if an edit pushes a file over.
- Add/extend tests where the phase file names them. Run `npm test` and `npm run lint` before declaring done.
- Do NOT touch `worktrees/`, `web-bundles/`, `superdesign/`, `convex/_generated/`.
- Each phase file ends with Acceptance Criteria — all must pass before the phase is complete.
