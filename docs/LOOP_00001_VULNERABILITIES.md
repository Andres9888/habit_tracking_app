# Security Vulnerabilities - Loop 00001

## Summary

- **Total Findings:** 16
- **Critical:** 2
- **High:** 6
- **Medium:** 6
- **Low/Info:** 2

---

## VULN-001: Hardcoded Figma Access Token in Version Control

- **Type:** Hardcoded Secret
- **File:** `.env.mcp`
- **Line:** 1
- **Severity:** CRITICAL
- **Evidence:**
  ```
  FIGMA_ACCESS_TOKEN=figd_YODDpEJ3FG6Znes3MhFwp3ok5-BRop5YX_fCUn1J
  ```
  This file is tracked in git (`git ls-files` confirms it's checked in), exposing the token to anyone with repository access.
- **Attack Scenario:** An attacker with repository access (or viewing a public fork/clone) can use this token to access the associated Figma account, potentially viewing sensitive designs, modifying assets, or performing actions as the token owner.
- **Remediation:**
  1. Immediately revoke the exposed Figma token
  2. Add `.env.mcp` to `.gitignore`
  3. Remove from git history: `git filter-branch` or `git-filter-repo`
  4. Generate a new token and use environment variables or a secrets manager

---

## VULN-002: Unauthenticated File Storage Upload

- **Type:** Missing Authentication
- **File:** `convex/storage.ts`
- **Line:** 24-30
- **Severity:** CRITICAL
- **Evidence:**
  ```typescript
  export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
      return await ctx.storage.generateUploadUrl();
    },
    returns: v.string(),
  });
  ```
  No authentication check - any client can request an upload URL.
- **Attack Scenario:** Attackers can upload unlimited files to the storage bucket without authentication, leading to storage abuse, hosting of malicious content, or incurring excessive cloud costs.
- **Remediation:** Add `ctx.auth.getUserIdentity()` check and reject unauthenticated requests.

---

## VULN-003: Missing Ownership Validation in habits:update

- **Type:** Broken Access Control (IDOR)
- **File:** `convex/habits.ts`
- **Line:** 107-141
- **Severity:** HIGH
- **Evidence:**
  ```typescript
  export const update = mutation({
    args: { habitId: v.id('habits'), ... },
    handler: async (ctx, args) => {
      const { habitId, ...updates } = args;
      // No ownership check!
      await ctx.db.patch(habitId, cleanedUpdates);
    },
  });
  ```
  Any authenticated user can modify any habit by ID.
- **Attack Scenario:** An attacker can enumerate habit IDs and modify other users' habits (name, notes, settings), corrupting their data.
- **Remediation:** Verify `habit.userId === identity.subject` before allowing update.

---

## VULN-004: Missing Ownership Validation in habits:remove

- **Type:** Broken Access Control (IDOR)
- **File:** `convex/habits.ts`
- **Line:** 287-338
- **Severity:** HIGH
- **Evidence:**
  ```typescript
  export const remove = mutation({
    args: { habitId: v.id('habits') },
    handler: async (ctx, args) => {
      const habit = await ctx.db.get(args.habitId);
      if (!habit) throw new Error('Habit not found');
      // No ownership check!
      await ctx.db.delete(args.habitId);
    },
  });
  ```
- **Attack Scenario:** Any user can delete any other user's habits and tracking data by providing the habit ID.
- **Remediation:** Add ownership validation before deletion.

---

## VULN-005: Unauthenticated File Deletion

- **Type:** Missing Authentication
- **File:** `convex/storage.ts`
- **Line:** 49-58
- **Severity:** HIGH
- **Evidence:**
  ```typescript
  export const deleteFile = mutation({
    args: { storageId: v.id('_storage') },
    handler: async (ctx, args) => {
      await ctx.storage.delete(args.storageId);
      return null;
    },
  });
  ```
  No authentication check - anyone can delete files.
- **Attack Scenario:** Attackers can delete users' vision board images and voice notes by enumerating storage IDs.
- **Remediation:** Add authentication and ownership verification.

---

## VULN-006: Cross-User Data Exposure in listRecent Queries

- **Type:** Information Disclosure
- **File:** `convex/visionBoardImages.ts`
- **Line:** 351-376
- **Severity:** HIGH
- **Evidence:**
  ```typescript
  export const listRecent = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
      const limit = args.limit ?? 10;
      const images = await ctx.db
        .query('visionBoardImages')
        .order('desc')
        .take(limit);
      // Returns ALL users' images!
    },
  });
  ```
  No filtering by user - returns images from all users.
- **Attack Scenario:** Any authenticated user can view other users' private vision board images.
- **Remediation:** Filter by current user's ID or require admin role.

---

## VULN-007: Cross-User Voice Notes Exposure

- **Type:** Information Disclosure
- **File:** `convex/voiceNotes.ts`
- **Line:** 260-279
- **Severity:** HIGH
- **Evidence:**
  ```typescript
  export const listRecent = query({
    handler: async (ctx, args) => {
      if (args.userId) {
        // Filtered path
      }
      return await ctx.db.query('voiceNotes').order('desc').take(limit);
      // Returns ALL users' voice notes when userId not provided!
    },
  });
  ```
- **Attack Scenario:** Any user can access all users' voice recordings by not passing a userId filter.
- **Remediation:** Require authentication and filter by authenticated user's ID.

---

## VULN-008: Missing Ownership Validation in visionBoardImages:remove

- **Type:** Broken Access Control (IDOR)
- **File:** `convex/visionBoardImages.ts`
- **Line:** 271-312
- **Severity:** HIGH
- **Evidence:**
  ```typescript
  export const remove = mutation({
    args: { imageId: v.id('visionBoardImages') },
    handler: async (ctx, args) => {
      const image = await ctx.db.get(args.imageId);
      if (!image) throw new Error('Image not found');
      // No ownership check!
      await ctx.storage.delete(image.storageId);
      await ctx.db.delete(args.imageId);
    },
  });
  ```
- **Attack Scenario:** Any user can delete any other user's vision board images.
- **Remediation:** Verify image ownership before deletion.

---

## VULN-009: Missing Ownership Validation in voiceNotes Mutations

- **Type:** Broken Access Control (IDOR)
- **File:** `convex/voiceNotes.ts`
- **Line:** 191-255
- **Severity:** MEDIUM
- **Evidence:** The `update` and `remove` mutations accept voice note IDs without verifying the caller owns them.
- **Attack Scenario:** Users can modify or delete other users' voice recordings.
- **Remediation:** Add ownership validation to all mutation handlers.

---

## VULN-010: Missing Ownership Validation in affirmations Mutations

- **Type:** Broken Access Control (IDOR)
- **File:** `convex/affirmations.ts`
- **Line:** 120-186
- **Severity:** MEDIUM
- **Evidence:** The `update` and `remove` mutations for affirmations lack ownership checks.
- **Attack Scenario:** Users can modify or delete other users' personalized affirmations.
- **Remediation:** Validate that the affirmation's associated habit belongs to the calling user.

---

## VULN-011: AI Prompt Injection Risk

- **Type:** Injection
- **File:** `convex/affirmations.ts`
- **Line:** 498-567
- **Severity:** MEDIUM
- **Evidence:**
  ```typescript
  function buildAffirmationPrompt(habitContext: HabitContext, ...): string {
    const contextParts: string[] = [`Habit: ${habitContext.name}`];
    if (habitContext.why) {
      contextParts.push(`Why (user's motivation): "${habitContext.why}"`);
    }
    // User-controlled content directly interpolated into prompt
  }
  ```
  User input (habit names, notes, "why" statements) is directly embedded in AI prompts.
- **Attack Scenario:** A malicious user could craft habit names/notes containing prompt injection payloads to manipulate AI output or extract system prompt content.
- **Remediation:** Sanitize user input before including in prompts, or use structured prompt formats that separate system instructions from user content.

---

## VULN-012: Weak Randomness for Queue Item IDs

- **Type:** Insecure Cryptography
- **File:** `src/hooks/useOfflineQueue.ts`
- **Line:** 186
- **Severity:** MEDIUM
- **Evidence:**
  ```typescript
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  ```
  Uses `Math.random()` which is not cryptographically secure.
- **Attack Scenario:** In adversarial contexts, predictable IDs could enable queue manipulation. Low practical risk for offline queue but sets a bad pattern.
- **Remediation:** Use `crypto.randomUUID()` for ID generation.

---

## VULN-013: Weak Randomness in Prediction Confidence

- **Type:** Insecure Cryptography
- **File:** `convex/predictions.ts`
- **Line:** 216-219
- **Severity:** MEDIUM
- **Evidence:**
  ```typescript
  ? 85 + Math.random() * 10 // High confidence with 3+ weeks
  : 70 + Math.random() * 10 // Medium with 1+ week
  : 50 + Math.random() * 15; // Lower with less data
  ```
  Using `Math.random()` for confidence values that are presented to users as predictions.
- **Attack Scenario:** Not a security vulnerability per se, but using random noise in "predictions" could mislead users and is a code quality concern.
- **Remediation:** Remove fake randomness or use deterministic algorithms based on actual data patterns.

---

## VULN-014: Exposed Development Clerk Domain

- **Type:** Information Disclosure
- **File:** `convex/auth.config.ts`
- **Line:** 4
- **Severity:** LOW
- **Evidence:**
  ```typescript
  domain: 'https://vital-elf-64.clerk.accounts.dev',
  ```
  Development domain hardcoded in source code.
- **Attack Scenario:** Information leakage about development infrastructure. Could be used for reconnaissance.
- **Remediation:** Use environment variables for Clerk domain configuration.

---

## VULN-015: User Query Without Authentication

- **Type:** Information Disclosure
- **File:** `convex/users.ts`
- **Line:** 66-71
- **Severity:** LOW
- **Evidence:**
  ```typescript
  export const getUser = query({
    args: { userId: v.id('users') },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.userId);
    },
  });
  ```
  Returns any user's data (email, name, imageUrl) without authentication.
- **Attack Scenario:** An attacker can enumerate user IDs to gather PII.
- **Remediation:** Add authentication check and restrict to returning only public fields or the current user's own data.

---

## VULN-016: Global Settings Query Without User Scoping

- **Type:** Broken Access Control
- **File:** `convex/settings.ts`
- **Line:** 91-95
- **Severity:** MEDIUM
- **Evidence:**
  ```typescript
  handler: async (ctx) => {
    // Get first settings record (since auth was removed, just use any settings)
    const settings = await ctx.db.query('userSettings').first();
  ```
  The comment explicitly states auth was removed; settings are shared globally.
- **Attack Scenario:** All users share the same settings; one user's preference changes affect all users.
- **Remediation:** Scope settings to authenticated user, store per-user settings with userId field.

---

## Findings by Category

| Category        | Count | Critical | High | Medium | Low |
| --------------- | ----- | -------- | ---- | ------ | --- |
| Secrets         | 1     | 1        | 0    | 0      | 0   |
| Auth            | 2     | 1        | 1    | 0      | 0   |
| Access Control  | 9     | 0        | 5    | 3      | 1   |
| Injection       | 1     | 0        | 0    | 1      | 0   |
| Crypto          | 2     | 0        | 0    | 2      | 0   |
| Info Disclosure | 1     | 0        | 0    | 0      | 1   |

## Dependency Vulnerabilities

From automated dependency scans:

| Package | Version | Vulnerability              | Severity | Fix Version |
| ------- | ------- | -------------------------- | -------- | ----------- |
| N/A     | N/A     | npm audit could not be run | N/A      | N/A         |

**Note:** Manual dependency review recommended. Run `npm audit` in an environment with Node.js available.

## Potential False Positives

Findings that may not be actual vulnerabilities:

- **VULN-013 (Prediction Randomness)** - This adds noise to predictions for UX variety, not for security purposes. However, it could mislead users about prediction accuracy.
- **VULN-014 (Dev Clerk Domain)** - Low risk if production uses environment-based configuration, but should still be externalized.

---

## Priority Remediation Order

1. **IMMEDIATE (P0):** VULN-001 (Revoke and rotate Figma token)
2. **IMMEDIATE (P0):** VULN-002 (Add auth to file upload)
3. **HIGH (P1):** VULN-003, VULN-004, VULN-005, VULN-006, VULN-007, VULN-008 (All IDOR/access control issues)
4. **MEDIUM (P2):** VULN-009, VULN-010, VULN-011, VULN-012, VULN-013, VULN-016
5. **LOW (P3):** VULN-014, VULN-015

---

_This vulnerability report was generated by security analysis on 2025-12-29. Manual verification of all findings is recommended before remediation._
