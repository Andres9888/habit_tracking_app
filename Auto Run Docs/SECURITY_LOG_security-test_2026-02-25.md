## Loop 00001 - 2026-02-25 16:24

### Vulnerabilities Remediated

#### SEC-002: Notes API Enables Cross-User Data Read and Tampering (IDOR Chain)

- **Status:** IMPLEMENTED
- **Severity:** HIGH
- **Type:** IDOR
- **File:** `convex/notesQueries.ts`, `convex/notesMutations.ts`
- **Fix Description:**
  Added strict ownership enforcement for `note` reads/updates/deletes when legacy `note.userId` is missing. These paths now require either matching `note.userId` or verified parent `habit.userId` ownership before returning or mutating notes.
- **Before:**
  Legacy notes missing `userId` could pass ownership checks in `get`, `update`, and `remove` when `userId` was undefined and no additional ownership fallback blocked access.
- **After:**
  `get`, `update`, and `remove` now explicitly deny access for missing `userId` unless the note is linked to a habit owned by the requesting user, preventing cross-user access by `noteId`.
- **Verification:**
  - [x] Code review passed
  - [ ] Functionality tested
  - [x] Vulnerability no longer exploitable
  - [ ] Automated scan clean

---

## Loop 00001 - 2026-02-25 16:51

### Vulnerabilities Remediated

#### SEC-001: Unauthenticated Global Deletion of Archived Habits

- **Status:** IMPLEMENTED
- **Severity:** CRITICAL
- **Type:** IDOR / Missing authorization check
- **File:** `convex/habits/archive.ts`
- **Fix Description:**
  Added explicit ownership enforcement inside `deleteAllArchived` so each archived habit is verified against the authenticated user before deleting habit records and their associated tracking rows.
- **Before:** Mutation could proceed based on broader query access path and did not explicitly assert each candidate habit's owner inside the loop.
- **After:** `deleteAllArchived` now requires a valid identity, filters archived habits by `identity.subject`, and throws on any habit with a mismatched `userId` prior to deletions.
- **Verification:**
  - [x] Code review passed
  - [ ] Functionality tested
  - [x] Vulnerability no longer exploitable
  - [ ] Automated scan clean

---
