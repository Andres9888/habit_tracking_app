---
task: review code for defects and risks
slug: 20260307-113721_review-code
effort: extended
phase: complete
progress: 16/16
mode: interactive
started: 2026-03-07T11:37:21+09:00
updated: 2026-03-07T11:51:30+09:00
---

## Context

User requested an analysis-first code review. The worktree is already dirty on `main` with large ongoing changes across Convex mutations, storage utilities, auth flow, and `CalendarTimeline` UI/tests. The review should identify concrete defects and risks from the current changeset without editing code or speculating beyond repo evidence.

Not requested: implementation, commits, or broad architecture rewrites. Requested: parallel context gathering with explore agents plus direct targeted searches before drawing conclusions.

### Risks

- Storage migration now routes drafts and offline queue payloads through a new sensitive-storage abstraction, which may change persistence semantics across native, test, and web runtimes.
- Habit completion now defers streak/strength recomputation through scheduled Convex jobs, so race handling and stale-job cancellation must be correct.
- Calendar navigation semantics changed at the gesture layer, which can invert behavior or bypass forward-navigation limits if the surrounding UI assumptions differ.
- The worktree includes package/postinstall changes and deleted support files, so CI or local installs may break even if feature code looks sound.
- The new secure-storage path is not exercised by existing test fallback code, so production-only regressions can slip through green Jest runs.

### Plan

Inspect changed files directly, validate suspected regressions with targeted tests and diagnostics, then separate confirmed defects from mere risk using Oracle. Final output should rank issues by severity, include file references, and clearly call out coverage gaps versus bugs.

## Decisions

- 2026-03-07 11:49: Focus review on changed storage, Convex toggle, and swipe files because they combine user-facing impact with recent edits.
- 2026-03-07 11:49: Treat full-project typecheck failures as pre-existing noise unless directly tied to reviewed files.
- 2026-03-07 11:49: Use targeted Jest runs plus Oracle adjudication instead of broad repo testing, because the task is review accuracy rather than code changes.

## Verification

- ISC-1: `git status --short`, branch name, and diff stats confirmed this is a review of a large dirty worktree on `main`.
- ISC-2: `package.json` scripts/postinstall reviewed; deleted Expo patch noted in diff output.
- ISC-3: `convex/habits/toggle.ts` reviewed directly; Oracle classified scheduler logic as operational risk rather than clear bug.
- ISC-4: `convex/schema.ts` and `convex/habits/validators.ts` both include `pendingStrengthRecalcId` and `pendingStrengthRecalcRequestedAt`.
- ISC-5: `src/hooks/useDraftStorage/storage.ts` reviewed directly; draft content now flows through sensitive storage outside tests.
- ISC-6: `src/hooks/useOfflineQueue/storage.ts` reviewed directly; queue items now flow through sensitive storage while index remains AsyncStorage-backed.
- ISC-7: `src/utils/storage/sensitiveStorage.ts` reviewed directly; unavailable SecureStore falls back to in-memory `Map` only.
- ISC-8: `src/components/CalendarTimeline/useTimelineSwipe.ts` reviewed directly and matched against new hook tests.
- ISC-9: Explore agent mapped sparse coverage and direct glob checks found no dedicated `sensitiveStorage` tests.
- ISC-10: Explore outputs were incorporated for hotspot ranking and coverage context.
- ISC-11: All reported findings tie back to direct reads, grep hits, diff output, and Oracle review.
- ISC-12: Findings ranked high/medium/low before final output.
- ISC-13: Final report will reference exact changed files.
- ISC-14: Storage persistence loss is treated as a defect; missing `sensitiveStorage` coverage is treated as a coverage gap.
- ISC-15: No repository code outside the PRD was modified during review.
- ISC-16: Oracle task `ses_339d480c3ffeOBz7ehrbAYgzGn` completed and its findings were incorporated.

## Learning

- Starting with direct diffs and only then using agent output kept the review grounded in changed code instead of drifting into generic repo analysis.
- A smarter pass would have launched a dedicated explore query for web/offline persistence semantics earlier, because that became the central confirmed defect.
- The selected capabilities were sufficient: two explore agents, `CORE`, `Thinking`, and `oracle` produced enough evidence without overloading the run.
- A smarter algorithm could auto-diff changed files against advertised product promises like offline web support, which would surface this class of regression faster.

## Criteria

- [x] ISC-1: Review covers current branch and dirty worktree scope.
- [x] ISC-2: Root package scripts and install hooks are inspected.
- [x] ISC-3: Convex habit toggle changes are analyzed for races.
- [x] ISC-4: Convex schema changes are checked for validator parity.
- [x] ISC-5: Draft storage migration behavior is analyzed.
- [x] ISC-6: Offline queue storage migration behavior is analyzed.
- [x] ISC-7: Sensitive storage fallback behavior is analyzed.
- [x] ISC-8: Calendar swipe behavior changes are analyzed.
- [x] ISC-9: Test coverage for changed risk areas is mapped.
- [x] ISC-10: At least one explore agent result is incorporated.
- [x] ISC-11: Direct code evidence backs each reported issue.
- [x] ISC-12: Findings are prioritized by severity.
- [x] ISC-13: Report includes exact file references for findings.
- [x] ISC-14: Report distinguishes defects from coverage gaps.
- [x] ISC-15: Review avoids modifying repository code.
- [x] ISC-16: Oracle review is collected before final response.
