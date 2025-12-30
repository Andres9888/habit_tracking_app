# Security Remediation Plan - Loop 00001

## Summary

- **Total Findings:** 16
- **IMPLEMENTED:** 1
- **Auto-Remediate (PENDING):** 11
- **Manual Review:** 1
- **Won't Do / False Positive:** 3

## Risk Summary

| Severity | Count | Auto-Fix | Manual | Won't Do |
| -------- | ----- | -------- | ------ | -------- |
| CRITICAL | 2     | 2        | 0      | 0        |
| HIGH     | 6     | 6        | 0      | 0        |
| MEDIUM   | 6     | 4        | 1      | 1        |
| LOW/INFO | 2     | 0        | 0      | 2        |

---

## PENDING - Ready for Auto-Remediation

### SEC-001: Hardcoded Figma Access Token in Version Control

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Vuln ID:** VULN-001
- **Severity:** CRITICAL
- **Remediability:** EASY
- **File:** `.env.mcp`
- **Line:** 1
- **Issue:** Figma access token hardcoded and committed to git, exposing it to anyone with repository access.
- **Fix Strategy:**
  1. Add `.env.mcp` to `.gitignore`
  2. Remove the file from git tracking with `git rm --cached .env.mcp`
  3. Create `.env.mcp.example` with placeholder `FIGMA_ACCESS_TOKEN=your_token_here`
  4. Document that users should copy `.env.mcp.example` to `.env.mcp` and fill in their token
- **Fix Applied:**
  - Added `.env.mcp` to `.gitignore`
  - Removed `.env.mcp` from git tracking with `git rm --cached`
  - Created `.env.mcp.example` with placeholder and documentation
- **Files Modified:** `.gitignore`, `.env.mcp.example` (new)
- **Verified:** `git ls-files .env.mcp` returns nothing - file is no longer tracked
- **Note:** Token revocation and history cleanup should be performed manually by the repository owner

---

### SEC-002: Unauthenticated File Storage Upload

- **Status:** `PENDING`
- **Vuln ID:** VULN-002
- **Severity:** CRITICAL
- **Remediability:** EASY
- **File:** `convex/storage.ts`
- **Line:** 24-30
- **Issue:** `generateUploadUrl` mutation has no authentication check, allowing anonymous file uploads.
- **Fix Strategy:**
  1. Add `ctx.auth.getUserIdentity()` check at the start of the handler
  2. Throw an error if identity is null
  3. Optionally log the userId for audit purposes
- **Verification:** Test that unauthenticated API calls to generateUploadUrl are rejected with 401/403

---

### SEC-003: Missing Ownership Validation in habits:update

- **Status:** `PENDING`
- **Vuln ID:** VULN-003
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/habits.ts`
- **Line:** 107-141
- **Issue:** Any authenticated user can modify any habit by guessing/enumerating habit IDs.
- **Fix Strategy:**
  1. Retrieve the habit from database
  2. Get the authenticated user's identity
  3. Compare `habit.userId` with `identity.subject`
  4. Throw "Unauthorized" error if they don't match
- **Verification:** Test that user A cannot update user B's habits

---

### SEC-004: Missing Ownership Validation in habits:remove

- **Status:** `PENDING`
- **Vuln ID:** VULN-004
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/habits.ts`
- **Line:** 287-338
- **Issue:** Any authenticated user can delete any habit and its associated data.
- **Fix Strategy:**
  1. Get authenticated user's identity
  2. Retrieve the habit and verify `habit.userId === identity.subject`
  3. Only proceed with deletion if ownership is confirmed
- **Verification:** Test that user A cannot delete user B's habits

---

### SEC-005: Unauthenticated File Deletion

- **Status:** `PENDING`
- **Vuln ID:** VULN-005
- **Severity:** HIGH
- **Remediability:** MEDIUM
- **File:** `convex/storage.ts`
- **Line:** 49-58
- **Issue:** `deleteFile` mutation has no authentication or ownership check.
- **Fix Strategy:**
  1. Add authentication check with `ctx.auth.getUserIdentity()`
  2. Before deletion, verify the storage file belongs to the calling user (may require querying related records like visionBoardImages or voiceNotes to establish ownership)
  3. Reject deletion if ownership cannot be verified
- **Verification:** Test that unauthenticated calls are rejected and authenticated users can only delete their own files

---

### SEC-006: Cross-User Data Exposure in listRecent (Vision Board Images)

- **Status:** `PENDING`
- **Vuln ID:** VULN-006
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/visionBoardImages.ts`
- **Line:** 351-376
- **Issue:** `listRecent` query returns images from all users without filtering.
- **Fix Strategy:**
  1. Add authentication check
  2. Filter query by `userId` matching the authenticated user
  3. Use `.withIndex()` on userId for efficient filtering
- **Verification:** Test that users only see their own images in listRecent results

---

### SEC-007: Cross-User Voice Notes Exposure

- **Status:** `PENDING`
- **Vuln ID:** VULN-007
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/voiceNotes.ts`
- **Line:** 260-279
- **Issue:** `listRecent` returns all users' voice notes when userId parameter is omitted.
- **Fix Strategy:**
  1. Make authentication required
  2. Always filter by the authenticated user's ID instead of accepting a userId parameter
  3. Remove the optional userId parameter to prevent enumeration
- **Verification:** Test that the query only returns the authenticated user's voice notes

---

### SEC-008: Missing Ownership Validation in visionBoardImages:remove

- **Status:** `PENDING`
- **Vuln ID:** VULN-008
- **Severity:** HIGH
- **Remediability:** EASY
- **File:** `convex/visionBoardImages.ts`
- **Line:** 271-312
- **Issue:** Any user can delete any vision board image by providing its ID.
- **Fix Strategy:**
  1. Get authenticated user's identity
  2. Retrieve the image record
  3. Verify `image.userId === identity.subject` before deletion
  4. Also delete the associated storage file
- **Verification:** Test that user A cannot delete user B's vision board images

---

### SEC-009: Missing Ownership Validation in voiceNotes Mutations

- **Status:** `PENDING`
- **Vuln ID:** VULN-009
- **Severity:** MEDIUM
- **Remediability:** EASY
- **File:** `convex/voiceNotes.ts`
- **Line:** 191-255
- **Issue:** `update` and `remove` mutations don't verify ownership.
- **Fix Strategy:**
  1. Add authentication check in both mutations
  2. Retrieve the voice note record
  3. Verify `voiceNote.userId === identity.subject`
  4. Reject operation if ownership doesn't match
- **Verification:** Test that users can only update/remove their own voice notes

---

### SEC-010: Missing Ownership Validation in affirmations Mutations

- **Status:** `PENDING`
- **Vuln ID:** VULN-010
- **Severity:** MEDIUM
- **Remediability:** MEDIUM
- **File:** `convex/affirmations.ts`
- **Line:** 120-186
- **Issue:** `update` and `remove` mutations don't verify the affirmation belongs to the user's habit.
- **Fix Strategy:**
  1. Get the affirmation's associated habitId
  2. Query the habit to get its userId
  3. Verify the habit belongs to the authenticated user
  4. Only then proceed with the update/remove operation
- **Verification:** Test that users can only modify affirmations for their own habits

---

### SEC-011: Weak Randomness for Queue Item IDs

- **Status:** `PENDING`
- **Vuln ID:** VULN-012
- **Severity:** MEDIUM
- **Remediability:** EASY
- **File:** `src/hooks/useOfflineQueue.ts`
- **Line:** 186
- **Issue:** Uses `Math.random()` for ID generation instead of cryptographically secure method.
- **Fix Strategy:**
  1. Replace `Math.random().toString(36).substr(2, 9)` with `crypto.randomUUID()`
  2. Or use `crypto.getRandomValues()` for a shorter ID if needed
- **Verification:** Confirm IDs are now generated using crypto API

---

### SEC-012: Global Settings Query Without User Scoping

- **Status:** `PENDING`
- **Vuln ID:** VULN-016
- **Severity:** MEDIUM
- **Remediability:** MEDIUM
- **File:** `convex/settings.ts`
- **Line:** 91-95
- **Issue:** Settings are shared globally; any user's changes affect all users.
- **Fix Strategy:**
  1. Add authentication check
  2. Query settings by the authenticated user's ID
  3. Create user-specific settings record if none exists
  4. Update the mutation to also scope by user
- **Verification:** Test that each user has independent settings

---

## PENDING - MANUAL REVIEW

### SEC-013: AI Prompt Injection Risk

- **Status:** `PENDING - MANUAL REVIEW`
- **Vuln ID:** VULN-011
- **Severity:** MEDIUM
- **Remediability:** HARD
- **File:** `convex/affirmations.ts`
- **Line:** 498-567
- **Reason for Review:** User input is directly interpolated into AI prompts. Sanitization approach needs careful design to:
  - Not break legitimate user content (e.g., quotes, special characters)
  - Effectively prevent prompt injection attacks
  - Consider using structured prompts with separate system/user content sections
- **Recommended Approach:**
  1. Use structured message format separating system instructions from user content
  2. Consider escaping or quoting user content blocks
  3. Add length limits to prevent token exhaustion
  4. Test with known prompt injection payloads
- **Breaking Change Risk:** Low - changes are internal to AI prompt construction

---

## WON'T DO / FALSE POSITIVE

### SEC-014: Weak Randomness in Prediction Confidence

- **Status:** `WON'T DO`
- **Vuln ID:** VULN-013
- **Severity:** MEDIUM
- **Reason:** This is a UX design choice, not a security vulnerability. The randomness adds variety to predictions to avoid robotic-feeling static numbers. No security impact.
- **Risk Acceptance:** Accepted as design decision. Consider documenting this behavior if user-facing.

---

### SEC-015: Exposed Development Clerk Domain

- **Status:** `WON'T DO`
- **Vuln ID:** VULN-014
- **Severity:** LOW
- **Reason:** Low risk information disclosure. The development domain is already semi-public (visible in browser network requests during dev). Production should use environment variables.
- **Risk Acceptance:** Acceptable for development. Verify production uses environment-based configuration.

---

### SEC-016: User Query Without Authentication

- **Status:** `WON'T DO`
- **Vuln ID:** VULN-015
- **Severity:** LOW
- **Reason:** While technically an information disclosure issue, the practical risk is low:
  - User IDs are opaque Convex IDs, not sequential
  - Only public profile information is returned
  - May be needed for legitimate features (viewing other users' public profiles)
- **Risk Acceptance:** Review when implementing social features. Consider restricting to only public fields.

---

## Remediation Order

Recommended sequence based on severity, dependencies, and code locality:

### Phase 1: Critical Issues (Immediate)

1. **SEC-001** - Hardcoded Figma token (CRITICAL, standalone fix)
2. **SEC-002** - Unauthenticated file upload (CRITICAL, blocks storage abuse)

### Phase 2: High Severity Access Control (Same Day)

3. **SEC-003** - habits:update IDOR
4. **SEC-004** - habits:remove IDOR
   _(Group: Both in `convex/habits.ts`)_
5. **SEC-005** - Unauthenticated file deletion
6. **SEC-006** - Vision board images listRecent exposure
7. **SEC-008** - Vision board images remove IDOR
   _(Group: Both in `convex/visionBoardImages.ts`)_
8. **SEC-007** - Voice notes listRecent exposure

### Phase 3: Medium Severity (Within Week)

9. **SEC-009** - Voice notes mutations IDOR
10. **SEC-010** - Affirmations mutations IDOR
11. **SEC-011** - Weak randomness in queue IDs
12. **SEC-012** - Global settings query

### Phase 4: Manual Review Items

13. **SEC-013** - AI prompt injection (requires design discussion)

---

## Dependencies and Groupings

### Group A: Habits Module

- **SEC-003, SEC-004** - Both in `convex/habits.ts`, same ownership pattern

### Group B: Vision Board Images Module

- **SEC-006, SEC-008** - Both in `convex/visionBoardImages.ts`, share ownership logic

### Group C: Voice Notes Module

- **SEC-007, SEC-009** - Both in `convex/voiceNotes.ts`, share auth pattern

### Group D: Storage Layer

- **SEC-002, SEC-005** - Both in `convex/storage.ts`, authentication pattern

### Dependency Chain

- SEC-005 (file deletion) may depend on SEC-006/SEC-008 for ownership lookup
- SEC-010 (affirmations) depends on habit ownership patterns from SEC-003/SEC-004

---

## Testing Requirements

After each fix, verify:

1. **Authenticated endpoints reject unauthenticated requests** (401/403 response)
2. **Ownership checks work** (User A cannot access User B's resources)
3. **Happy path still works** (Legitimate operations succeed)
4. **Edge cases handled** (Missing records, malformed IDs)

---

_This remediation plan was generated on 2025-12-29. Execute fixes in the specified order for optimal security improvement with minimal disruption._
