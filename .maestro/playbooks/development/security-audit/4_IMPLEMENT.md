# Security Remediation - Fix Vulnerabilities

## Context

- **Playbook:** Security
- **Agent:** security-test
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/security-test
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/Auto Run Docs
- **Loop:** 00001

## Objective

Implement fixes for `PENDING` security vulnerabilities from the evaluation phase. Apply secure coding practices and verify each fix.

## Instructions

1. **Read the plan** from `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md`
2. **Find all `PENDING` items** (not `IMPLEMENTED`, `WON'T DO`, or `PENDING - MANUAL REVIEW`)
3. **Implement the fix** following the fix strategy
4. **Verify the fix** works and doesn't break functionality
5. **Update status** to `IMPLEMENTED` in the plan file
6. **Log changes** to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/SECURITY_LOG_security-test_2026-02-25.md`

## Task

- [x] **Fix one vulnerability (or skip if none)**: Implemented `SEC-001` (Unauthenticated Global Deletion of Archived Habits) by hardening `convex/habits/archive.ts` with explicit per-record ownership checks in `deleteAllArchived`, then updated status in `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md` to `IMPLEMENTED` and logged remediation details to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/SECURITY_LOG_security-test_2026-02-25.md`.
  - Verified by inspection that `deleteAllArchived` now requires authentication, scopes archived retrieval to the caller, and rejects mismatched `userId` before deleting habit + tracking records.

## Implementation Checklist

Before implementing, verify:

- [x] The status is exactly `PENDING` (not `PENDING - MANUAL REVIEW` or `WON'T DO`) **PASS**: `SEC-001` was pending and selected.
- [x] The severity is CRITICAL or HIGH **PASS**: `SEC-001` severity is CRITICAL.
- [x] The remediability is EASY or MEDIUM **PASS**: `SEC-001` remediability is MEDIUM.
- [x] The fix strategy is clearly specified **PASS**: plan already listed ownership-based scoping and per-record checks.
- [x] No other changes are required (no dependencies) **PASS**: no external deps required for this fix.

## Remediation Patterns

### SQL Injection Fix

- Replace string concatenation with parameterized queries
- Use ORM methods that auto-escape
- Validate and sanitize input types

### Command Injection Fix

- Use array-based command execution without shell
- Validate input against allowlist
- Escape special characters if shell is required

### Path Traversal Fix

- Resolve paths and verify they're within allowed directory
- Use basename to strip directory components
- Reject paths containing `..`

### Hardcoded Secrets Fix

- Move secrets to environment variables
- Use secrets management (Vault, AWS Secrets Manager)
- Rotate any exposed credentials immediately
- Add to .gitignore if config files

### XSS Fix

- Use framework's auto-escaping (React, Vue, etc.)
- Sanitize HTML with DOMPurify or similar
- Use Content-Security-Policy headers
- Validate and encode output context-appropriately

### Authentication Fix

- Use bcrypt/argon2 for password hashing
- Implement constant-time comparison for tokens
- Add secure and httpOnly flags to cookies
- Regenerate session after login

### Cryptography Fix

- Replace MD5/SHA1 with SHA-256 or better
- Use authenticated encryption (AES-GCM)
- Generate random IVs for each encryption
- Use crypto.randomBytes() for tokens

### Dependency Fix

- Update to patched version
- If no patch, evaluate alternatives
- Document if accepting risk temporarily

## Verification Steps

After each fix:

1. **Code Review**: Does the fix address the root cause?
2. **Regression Test**: Does existing functionality still work?
3. **Security Test**: Is the vulnerability actually fixed?
4. **Scan Again**: Do automated tools still flag it?

## Update Plan Status

After implementing each fix, update `LOOP_00001_PLAN.md`:

```markdown
### SEC-001: [Vulnerability Name]

- **Status:** `IMPLEMENTED` ← Changed from PENDING
- **Implemented In:** Loop 00001
- **Fix Applied:** [Brief description of what was changed]
- **Files Modified:** `[list of files]`
- **Verified:** [How you verified it works]
```

## Log Format

Append to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/SECURITY_LOG_security-test_2026-02-25.md`:

```markdown
## Loop 00001 - [Timestamp]

### Vulnerabilities Remediated

#### SEC-001: [Vulnerability Name]

- **Status:** IMPLEMENTED
- **Severity:** [CRITICAL | HIGH]
- **Type:** [SQL Injection | XSS | etc.]
- **File:** `[path/to/file.ts]`
- **Fix Description:**
  [What was changed and why]
- **Before:** [Brief description or code reference]
- **After:** [Brief description of the fix]
- **Verification:**
  - [x] Code review passed
  - [x] Functionality tested
  - [x] Vulnerability no longer exploitable
  - [x] Automated scan clean

---
```

## Special Handling

### Exposed Credentials

If you find hardcoded credentials:

1. **DO NOT COMMIT** the secret, even to remove it
2. **Assume compromised** - credential must be rotated
3. **Note in log** that rotation is required
4. **Replace with** environment variable reference

### Breaking Changes

If a fix might break functionality:

1. **Document the risk** in the plan
2. **Mark as PENDING - MANUAL REVIEW** if uncertain
3. **Add migration notes** if API changes

### Dependencies with No Patch

If a vulnerable dependency has no fix:

1. **Check for alternatives** - can we switch libraries?
2. **Assess exploitability** - is our usage actually vulnerable?
3. **Document accepted risk** if keeping temporarily
4. **Set reminder** to check for patch

## Guidelines

- **One fix at a time**: Easier to verify and rollback
- **Test after each fix**: Don't batch untested changes
- **Rotate secrets immediately**: Don't wait for the fix to merge
- **Keep the log detailed**: Audit trail is important
- **When in doubt, ask**: Mark for manual review

## How to Know You're Done

This task is complete when ONE of the following is true:

**Option A - Implemented a fix:**

1. You've implemented exactly ONE fix from `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md`
2. You've appended the change details to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/SECURITY_LOG_security-test_2026-02-25.md`
3. You've updated the item status in `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md` to `IMPLEMENTED`

**Option B - No PENDING fixes available:**

1. `LOOP_00001_PLAN.md` doesn't exist, OR
2. It contains no items with status exactly `PENDING` that have CRITICAL/HIGH severity AND EASY/MEDIUM remediability
3. Mark this task complete without making changes

This graceful handling allows the pipeline to continue when a loop iteration produces no actionable fixes.

## When No Fixes Are Available

If there are no qualifying `PENDING` items in the plan file, append to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/SECURITY_LOG_security-test_2026-02-25.md`:

```markdown
---

## [YYYY-MM-DD HH:MM] - Loop 00001 Complete

**Agent:** security-test
**Project:** /Users/andres/Code/habit_tracking_app.worktrees/security-test
**Loop:** 00001
**Status:** No PENDING fixes available (CRITICAL/HIGH severity with EASY/MEDIUM remediability)

**Summary:**

- Items IMPLEMENTED: [count]
- Items WON'T DO: [count]
- Items PENDING - MANUAL REVIEW: [count]
- Items PENDING (LOW severity or HARD remediability): [count]

**Recommendation:** [Either "All automatable security fixes implemented" or "Remaining items need manual review or have lower priority"]
```

This signals to the pipeline that this loop iteration is complete.

## Execution Notes (2026-02-25)

- Re-reviewed this work item during the current run: there are no unchecked tasks in this document.
- All required artifacts already reflect `SEC-001` remediation (`LOOP_00001_PLAN.md` and `SECURITY_LOG_security-test_2026-02-25.md`), so no code edits were necessary.
- No task-related images were provided or reviewed for this task.
- Verified there are no remaining unchecked tasks in this document.
- Confirmed SEC-001 is already implemented end-to-end:
  - `LOOP_00001_PLAN.md` status set to `IMPLEMENTED`.
  - `SECURITY_LOG_security-test_2026-02-25.md` contains completed SEC-001 remediation entry.
  - `convex/habits/archive.ts` shows `deleteAllArchived` scoped to authenticated caller and filtered by `identity.subject`.
- No task-related images were provided for review.

### Loop 00003 execution check-in

- Re-ran the task-selection pass for this run and confirmed there are no remaining unchecked task checkboxes in `4_IMPLEMENT.md` beyond template/example items.
- No code changes were required.
- No task-related images were provided for review (0 images analyzed).

### Loop 00002 execution check-in

- Re-ran the task-selection pass for this run and confirmed there are no remaining unchecked task checkboxes in `4_IMPLEMENT.md` outside template/example content.
- The active task in this file (`SEC-001`) is already marked complete and backed by existing plan/log entries.
- No task-related images were provided for review (0 images analyzed).
