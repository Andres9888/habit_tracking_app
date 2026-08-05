---
task: Review app design consistency and animations
slug: 20260308-143000_review-app-design-consistency-animations
effort: extended
phase: complete
progress: 20/20
mode: interactive
started: 2026-03-08T14:30:00-06:00
updated: 2026-03-08T14:40:00-06:00
---

## Context

Andres requested a comprehensive UX/design consistency audit of the habit tracking app, with emphasis on animations. The app has a well-structured design system (`src/theme/`) with tokens for colors, typography, spacing, animations, shadows, and border radius. However, preliminary analysis reveals significant drift between tokens and actual component usage. The app is React Native using `react-native-reanimated` (not framer-motion). The audit output is a findings document — no code changes yet.

### Risks
- Token drift may be more pervasive than initial samples suggest
- Web (global.css/tailwind) vs native (theme/*.ts) divergence may be intentional for platform differences
- Some "hardcoded" values may be justified (one-off animations, platform-specific)

## Criteria

- [x] ISC-1: All animation duration token bypasses cataloged with file paths
- [x] ISC-2: All spring config token bypasses cataloged with file paths
- [x] ISC-3: Duplicate animation code identified across components
- [x] ISC-4: Font family mismatches between web and native documented
- [x] ISC-5: Font family mismatches between tailwind config and theme tokens documented
- [x] ISC-6: Hardcoded hex color count in components quantified
- [x] ISC-7: Color token divergence between global.css and core.ts documented
- [x] ISC-8: Tailwind spacing vs theme spacing mismatches documented
- [x] ISC-9: Border radius inconsistencies between tailwind and theme documented
- [x] ISC-10: Animation easing function usage patterns cataloged
- [x] ISC-11: Components using inline styles vs token references quantified
- [x] ISC-12: Loading state animation consistency assessed
- [x] ISC-13: Entrance animation pattern consistency assessed
- [x] ISC-14: Button/press feedback animation consistency assessed
- [x] ISC-15: Celebration/success animation consistency assessed
- [x] ISC-16: Sheet/modal animation consistency assessed
- [x] ISC-17: Severity ratings assigned to each finding
- [x] ISC-18: Prioritized remediation recommendations provided
- [x] ISC-19: Summary findings presented in structured audit format
- [x] ISC-20: Anti-criteria: no code changes made, audit only

## Decisions

- Audit is review-only; remediation is a separate effort
- Font divergence flagged as architectural decision needed (may be intentional)
- CSS vs native color differences flagged as decision needed

## Verification

- ISC-1: Section 1A catalogs 13 distinct duration values across 20+ files with specific file paths and line numbers
- ISC-2: Section 1B catalogs 5 inline spring configs with component names and nearest token equivalents
- ISC-3: Section 1C identifies 2 near-identical file pairs (DraggableHabit↔HabitStrengthIndicator, ArchiveUndoToast↔DeleteUndoToast) plus StrengthProgressBar
- ISC-4: Section 3A documents Literata+DM Sans (native) vs Plus Jakarta Sans+Source Sans 3 (web)
- ISC-5: Section 3A documents Inter (tailwind) as third divergent font stack
- ISC-6: Section 2A quantifies 97 hardcoded hex colors across 30+ files with top offenders listed
- ISC-7: Section 2B provides comparison table showing background, card, and border diverge
- ISC-8: Section 4A shows md spacing mismatch (16px vs 12px)
- ISC-9: Section 4B shows card border radius mismatch (12px vs 16px)
- ISC-10: Section 1E documents consistent Easing.out/inOut usage, notes token gap
- ISC-11: Section 1A+2A — ~40 files import tokens, 60+ animation + 97 color bypasses
- ISC-12: Section 1F — Loading/pulse inconsistent (hardcoded 1000ms durations)
- ISC-13: Section 1F — Entrance inconsistent (translateY varies 8/20/30, helpers exist but unused)
- ISC-14: Section 1F — Button press mostly consistent (0.92→1.05→1 pattern)
- ISC-15: Section 1F — Celebration inconsistent (3 different systems)
- ISC-16: Section 1F — Sheet/modal consistent (uses spring tokens correctly)
- ISC-17: Section 5 assigns HIGH/MEDIUM/LOW severity to 11 findings
- ISC-18: Section 6 provides P0/P1/P2 prioritized remediation with 10 specific recommendations
- ISC-19: Full audit delivered in 6 structured sections with tables
- ISC-20: No files were modified — grep and read only
