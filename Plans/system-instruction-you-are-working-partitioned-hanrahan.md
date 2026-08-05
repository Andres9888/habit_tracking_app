# Plan — Continue Onboarding-v2 Flow (step-by-step polish from Welcome forward)

## Context

The onboarding-v2 flow — a 13-step pre-auth questionnaire + paywall — was built in 7 commits on the local branch `onboarding-v2-backup` but never merged into main. Those commits sit behind ~100 unrelated main commits (timeline material tiers, scrollspy tabs, ranks, etc.), so the branch itself is too drifted to base new work on directly.

Andres wants to "continue working on the onboarding flow, starting from the beginning." Interpreted as: (1) get the onboarding-v2 work back onto a current-main-based branch in this workspace, (2) walk the flow step-by-step starting at step 1 (Welcome), polishing and closing gaps as we go.

Desired outcome: onboarding-v2 runs cleanly against today's main, and Welcome (step 1) is the first step polished + reviewed in-app by the end of the first pass. Subsequent sessions continue down the flow (Goal → Pain Points → …).

## Recommended approach — cherry-pick the 7 commits onto current main

The 7 onboarding-v2 commits touch only:
- `src/screens/onboarding-v2/**` — entirely new files, no conflicts
- `src/components/auth/AuthGate.tsx` — the only real cross-cutting integration
- `convex/templates/importTemplate.ts` — 3-line adjustment
- `src/screens/auth/components/AuthError/AuthError.tsx` — incidental, skip

Cherry-picking is the cleanest route because the onboarding-v2 directory is self-contained and new. All 138 other files that appear in `git diff main..onboarding-v2-backup` are stale drift from an old branch base, not real work. Rebase would force us to resolve conflicts in all that drift; cherry-pick sidesteps it entirely. AuthGate.tsx has likely changed on main since the branch; that's the only file that may need a merge-conflict resolution and it's a small, targeted file.

## Step 1 of the continuation: Welcome step polish

Starting "from the beginning" means the **WelcomeStep.tsx** (step 1, 58 lines). Scope for this first pass:
- Run the app, force-enter onboarding-v2, screenshot the current Welcome step
- Review copy, hierarchy, CTA, motion, haptic, accessibility against the rest of the app's design system
- Compare to `HeroHeader.tsx` / `PrimaryCTA.tsx` conventions used elsewhere in the flow so step 1 matches the established style
- Apply targeted improvements (only what Welcome needs; don't touch other steps)
- Verify in-app before moving to step 2

Subsequent steps (Goal, PainPoints, …) are out of scope for this plan — we'll pick them up one at a time in follow-up sessions.

## Execution order

1. **Rename branch**: `git branch -m onboarding-v2` (the current workspace branch is `macau-v1`; rename deferred because plan mode was active).
2. **Cherry-pick the 7 commits in order** onto the renamed branch:
   - `370cc4a89` Phase A scaffold
   - `12ccb7f5f` Phase B static content
   - `7ef21ba24` Phase C Processing/AppDemo/PlanPreview
   - `89df7db3f` Phase D Notifications/Account/Paywall
   - `577cfeaf6` Phase E entrance animation + haptics
   - `33c7aacef` force-show for review (keep — needed for polish iteration)
   - `a3bbe50b2` allow completion within session
3. **Resolve AuthGate.tsx conflict** if cherry-pick hits one (likely, since main has evolved). Skip `AuthError.tsx` if it conflicts — it's incidental drift. Keep `importTemplate.ts` changes.
4. **Typecheck + lint** the resulting state (`npm run typecheck`, `npm run lint` scoped to onboarding-v2).
5. **Run app on iOS simulator**, confirm onboarding-v2 launches for a signed-in account (force-show is still on), verify the Welcome step renders without crashes.
6. **Screenshot Welcome step**, review against design conventions.
7. **Iterate on Welcome**: copy/hierarchy/CTA/motion/a11y. Small commits per concern.
8. **Verify Welcome in-app again**, confirm clean before stopping.
9. **Leave force-show intact** for the next session's step 2 review.

## Critical files to read before executing

- `git show onboarding-v2-backup:src/screens/onboarding-v2/OnboardingFlowV2.tsx` — orchestrator; confirms STEP_SEQUENCE order
- `git show onboarding-v2-backup:src/screens/onboarding-v2/steps/WelcomeStep.tsx` — the file we'll polish
- `git show onboarding-v2-backup:src/screens/onboarding-v2/components/HeroHeader.tsx` — establishes the step header convention
- `git show onboarding-v2-backup:src/screens/onboarding-v2/components/PrimaryCTA.tsx` — establishes the CTA convention
- `git show onboarding-v2-backup:src/screens/onboarding-v2/components/StepFrame.tsx` — wrapper/progress pattern Welcome uses
- `src/components/auth/AuthGate.tsx` (current main version) — anticipate the cherry-pick conflict here
- `src/theme/animations.ts` (current main) — main may have updated the canonical ease-out to "calm cubic" (commit 49a5b050f); Welcome's Phase E FadeInUp should align

## Reused utilities (don't re-create)

- `HeroHeader` + `PrimaryCTA` + `StepFrame` — already the shared atoms; Welcome already uses them
- `useHaptics` / `expo-haptics` — already wired in PrimaryCTA for selection feedback (Phase E)
- App-wide entrance animation tokens in `src/theme/animations.ts` — prefer these over re-defining FadeIn values
- `accessibilityRole` / `accessibilityLabel` patterns used elsewhere in `src/screens/auth` (AuthScreen already has the conventions)

## Verification (end-to-end for this session)

1. `git log --oneline main..HEAD` shows exactly 7 onboarding-v2 commits + any Welcome-polish commits on top
2. `npm run typecheck` passes
3. `npm run lint -- src/screens/onboarding-v2/` passes (respecting 100-line rule)
4. App boots on iOS simulator, onboarding-v2 appears on app launch for a signed-in account, Welcome renders without console errors
5. Welcome step: hero, copy, primary CTA, entrance animation, and haptic tap all feel cohesive; back button hidden on step 1; progress bar shows 1 of 13
6. Screenshot saved to `.context/welcome-step-before.png` and `.context/welcome-step-after.png` for before/after comparison
7. Pressing the CTA advances to GoalStep (step 2) without errors — confirms Welcome hands off correctly even though we're not polishing step 2 this session

## Out of scope (explicitly deferred)

- Cross-cutting concerns: analytics wiring, paywall entitlement logic, removing the force-show hack, global a11y audit — these are full workstreams and don't belong in a "review step 1" pass
- Steps 2–13 — covered in subsequent sessions using the same pattern
- The 138 drifted non-onboarding-v2 files from the backup branch — they are not real work and are discarded by the cherry-pick approach
