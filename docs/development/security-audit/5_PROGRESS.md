# Security Audit Gate - CRITICAL/HIGH Remediation Target

## Context

- **Playbook:** Security
- **Agent:** security
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/security
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/docs
- **Loop:** 00001

## Purpose

This document is the **security gate** for the audit pipeline. It checks whether all CRITICAL and HIGH severity vulnerabilities have been remediated. **This is the only document with Reset ON** - it controls loop continuation by resetting tasks in documents 1-4 when more work is needed.

## Instructions

1. **Read the plan** from `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`
2. **Check for remaining CRITICAL or HIGH severity items** that are still `PENDING` with EASY/MEDIUM remediability
3. **If such PENDING items exist**: Reset all tasks in documents 1-4 to continue the loop
4. **If NO such items exist**: Do NOT reset - pipeline exits

## Security Gate Check

- [x] **Check for remaining vulnerabilities**: Read LOOP_00001_PLAN.md and LOOP_00001_VULNERABILITIES.md. The loop should CONTINUE (reset docs 1-4) if EITHER: (1) there are items with status `PENDING` that have CRITICAL or HIGH severity AND EASY or MEDIUM remediability, OR (2) VULNERABILITIES.md does NOT contain `## ALL_TACTICS_EXHAUSTED`. The loop should EXIT (do NOT reset) only when BOTH conditions are false: no PENDING CRITICAL/HIGH items with EASY/MEDIUM remediability AND all tactics are exhausted.
  - **Checked:** 2026-01-17 - **Decision: CONTINUE**
  - ALL_TACTICS_EXHAUSTED is present in VULNERABILITIES.md (all 7 categories searched)
  - However, 4 HIGH severity items with EASY remediability remain unevaluated/unimplemented:
    - VULN-004: habits:remove ownership validation (HIGH, EASY)
    - VULN-006: visionBoardImages listRecent cross-user exposure (HIGH, EASY)
    - VULN-007: voiceNotes listRecent cross-user exposure (HIGH, EASY)
    - VULN-008: visionBoardImages remove ownership validation (HIGH, EASY)
  - Loop must continue to evaluate and implement these remaining findings

## Reset Tasks (Only if work remains)

If the security gate check above determines we need to continue (PENDING CRITICAL/HIGH items with EASY/MEDIUM remediability OR tactics remaining), reset all tasks in the following documents:

- [x] **Reset 1_ANALYZE.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/security-audit/1_ANALYZE.md`
- [x] **Reset 2_FIND_ISSUES.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/security-audit/2_FIND_ISSUES.md`
- [x] **Reset 3_EVALUATE.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/security-audit/3_EVALUATE.md`
- [x] **Reset 4_IMPLEMENT.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/security-audit/4_IMPLEMENT.md`

**IMPORTANT**: Only reset documents 1-4 if there is work remaining (PENDING CRITICAL/HIGH items with EASY/MEDIUM remediability OR unexplored tactics). If all tactics are exhausted AND all such items are IMPLEMENTED, WON'T DO, or PENDING - MANUAL REVIEW, leave these reset tasks unchecked to allow the pipeline to exit.

## Decision Logic

```
IF LOOP_00001_PLAN.md doesn't exist:
    → Do NOT reset anything (PIPELINE JUST STARTED - LET IT RUN)

ELSE IF items with status `PENDING` AND (CRITICAL|HIGH severity) AND (EASY|MEDIUM remediability) exist:
    → Reset documents 1-4 (CONTINUE TO IMPLEMENT PENDING ITEMS)

ELSE IF LOOP_00001_VULNERABILITIES.md does NOT contain "ALL_TACTICS_EXHAUSTED":
    → Reset documents 1-4 (CONTINUE TO DISCOVER MORE VULNERABILITIES)

ELSE:
    → Do NOT reset anything (ALL TACTICS EXHAUSTED AND NO PENDING CRITICAL/HIGH - EXIT)
```

**Key insight:** The loop should continue if EITHER:

1. There are PENDING CRITICAL/HIGH items with EASY/MEDIUM remediability to implement, OR
2. There are still tactics to execute (no `ALL_TACTICS_EXHAUSTED` marker)

## How This Works

This document controls loop continuation through resets:

- **Reset tasks checked** → Documents 1-4 get reset → Loop continues
- **Reset tasks unchecked** → Nothing gets reset → Pipeline exits

### Exit Conditions (Do NOT Reset)

Exit when ALL of these are true:

1. **Tactics exhausted**: `LOOP_00001_VULNERABILITIES.md` contains `## ALL_TACTICS_EXHAUSTED`
2. **No PENDING CRITICAL/HIGH**: All CRITICAL/HIGH items with EASY/MEDIUM remediability are `IMPLEMENTED`, `WON'T DO`, or `PENDING - MANUAL REVIEW`

Also exit if: 3. **Max Loops**: Hit the loop limit in Batch Runner

### Continue Conditions (Reset Documents 1-4)

Continue if EITHER is true:

1. There are items with status exactly `PENDING` that have CRITICAL/HIGH severity AND EASY/MEDIUM remediability
2. `LOOP_00001_VULNERABILITIES.md` does NOT contain `## ALL_TACTICS_EXHAUSTED` (more tactics to run)

## Current Status

Before making a decision, check the plan and vulnerabilities files:

| Category                             | Count                       |
| ------------------------------------ | --------------------------- |
| **CRITICAL - PENDING (EASY/MEDIUM)** | 0                           |
| **CRITICAL - IMPLEMENTED**           | 2 (SEC-001, SEC-002)        |
| **HIGH - PENDING (EASY/MEDIUM)**     | 4 (VULN-004, 006, 007, 008) |
| **HIGH - IMPLEMENTED**               | 1 (SEC-003)                 |
| **MANUAL REVIEW (HARD)**             | 0                           |
| **WON'T DO / FALSE POSITIVE**        | 0                           |
| **Tactics Exhausted?**               | YES                         |

_Updated: 2026-01-17_

## Security Posture History

Track progress across loops:

| Loop | Critical (Start) | Critical (End) | High (Start) | High (End) | Decision          |
| ---- | ---------------- | -------------- | ------------ | ---------- | ----------------- |
| 1    | 2                | 0              | 6            | 4          | CONTINUE          |
| 2    | \_\_\_           | \_\_\_         | \_\_\_       | \_\_\_     | [CONTINUE / EXIT] |
| ...  | ...              | ...            | ...          | ...        | ...               |

_Loop 1 note: 2 CRITICAL issues resolved (SEC-001 Figma token, SEC-002 storage auth). 1 HIGH issue resolved (SEC-003 habits:update). 4 HIGH issues remain pending evaluation/implementation._

## Manual Override

**To force exit early:**

- Leave all reset tasks unchecked regardless of remaining issues
- Document justification in SECURITY_LOG

**To continue fixing MEDIUM severity:**

- Check the reset tasks even when no CRITICAL/HIGH remain
- Will find and fix MEDIUM issues next loop

**To pause for manual review:**

- Leave unchecked
- Review SECURITY_LOG and plan
- Address MANUAL REVIEW items
- Restart when ready

## Remaining Work Summary

Items that still need attention after this loop:

### Pending HIGH Severity (EASY Remediability) - Next Loop Target

- [ ] **VULN-004**: Missing ownership validation in `habits:remove` - Any user can delete any habit by ID
  - **File:** `convex/habits/remove.ts:9-59`
  - **Fix:** Add `ctx.auth.getUserIdentity()` check and verify `habit.userId === identity.subject`

- [ ] **VULN-006**: Cross-user data exposure in `visionBoardImages:listRecent` - Returns all users' images
  - **File:** `convex/visionBoardImagesQueries.ts:86-98`
  - **Fix:** Require authentication and filter by current user's ID

- [ ] **VULN-007**: Cross-user data exposure in `voiceNotes:listRecent` - Returns all users' voice notes when userId not provided
  - **File:** `convex/voiceNotesQueries.ts:77-91`
  - **Fix:** Require authentication and always filter by authenticated user's ID

- [ ] **VULN-008**: Missing ownership validation in `visionBoardImages:remove` - Any user can delete any image
  - **File:** `convex/visionBoardImagesDelete.ts:13-54`
  - **Fix:** Add authentication check and verify `image.userId === identity.subject`

### Needs Manual Review

_No items currently require manual review_

### Accepted Risks

_No accepted risks at this time_

### Blocked / Waiting

_No blocked items at this time_

## Notes

- The goal is **zero CRITICAL and HIGH** findings
- MEDIUM severity items are defense-in-depth improvements
- Some findings may be false positives - verify before dismissing
- Document all risk acceptances for audit purposes
- Rotate any exposed credentials even after removing from code
