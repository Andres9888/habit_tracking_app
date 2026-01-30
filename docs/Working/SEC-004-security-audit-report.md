---
type: report
title: SEC-004 Voice Note and Image URL Security Audit
created: 2026-01-22
tags:
  - security
  - audit
  - SEC-004
related:
  - "[[SEC-001-security-audit-report]]"
  - "[[SECURITY-PERFORMANCE-SPEC]]"
---

# SEC-004: Voice Note and Image URL Security Audit

**Completed:** 2026-01-22 by security-performance agent

## Executive Summary

This audit identified and remediated **critical security vulnerabilities** in voice note and vision board image queries that could have allowed unauthorized access to user content. The primary issues were:

1. **Missing authentication checks** in query handlers
2. **Missing ownership verification** allowing cross-user data access
3. **No signed URL expiration** on Convex storage URLs (architectural limitation)

## Vulnerability Assessment

### RISK-SEC-005: Voice Note/Image URL Exposure

| Aspect | Finding |
|--------|---------|
| **Severity** | High |
| **Likelihood** | Medium (requires guessing/enumeration of IDs) |
| **Impact** | Unauthorized access to personal audio recordings and images |
| **Status** | **REMEDIATED** |

### Vulnerability Details

#### Before Remediation

The following queries had no authentication or ownership checks:

| File | Query | Risk |
|------|-------|------|
| `voiceNotesQueries.ts` | `listByHabit` | Any user with a habitId could access all voice notes |
| `voiceNotesQueries.ts` | `getDay1Note` | Any user could access Day 1 recordings |
| `voiceNotesQueries.ts` | `get` | Any user with a voiceNoteId could access the audio URL |
| `voiceNotesQueries.ts` | `countByHabit` | Information disclosure (count leak) |
| `visionBoardImagesQueries.ts` | `listByHabit` | Any user with a habitId could access all images |
| `visionBoardImagesQueries.ts` | `get` | Any user with an imageId could access the image URL |
| `visionBoardImagesQueries.ts` | `countByHabit` | Information disclosure (count leak) |
| `visionBoardImagesQueries.ts` | `listByUser` | Any user could pass any userId to access images |
| `lettersQueriesExtra.ts` | `getMostRecentUnlocked` | Cross-user letter access |
| `lettersQueriesExtra.ts` | `listByUser` | Any user could pass any userId to access letters |

#### Attack Vector

```
1. Attacker creates account
2. Attacker enumerates or guesses habitIds (Convex IDs are predictable)
3. Attacker calls listByHabit(habitId) to get voice note URLs
4. Voice note URLs are permanent and accessible to anyone
5. Attacker downloads personal audio recordings
```

## Remediation Applied

### Files Modified

1. **`convex/voiceNotesQueries.ts`**
   - Added authentication check to `listByHabit`, `getDay1Note`, `get`, `countByHabit`
   - Added ownership verification via habit lookup
   - Pattern: Check `habit.userId === identity.subject`

2. **`convex/visionBoardImagesQueries.ts`**
   - Added authentication check to `listByHabit`, `get`, `countByHabit`, `listByUser`
   - Added ownership verification
   - Changed `listByUser` to use authenticated user's ID (removed userId parameter)

3. **`convex/lettersQueriesExtra.ts`**
   - Added authentication check to `getMostRecentUnlocked`, `listByUser`
   - Added ownership verification via habit lookup
   - Changed `listByUser` to use authenticated user's ID (removed userId parameter)

### Security Pattern Applied

```typescript
// SEC-004: Authentication check
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error('Unauthenticated: Must be logged in');
}

// SEC-004: Ownership verification via habit
const habit = await ctx.db.get(args.habitId);
if (!habit) {
  throw new Error('Habit not found');
}
if (habit.userId !== identity.subject) {
  throw new Error('Not authorized');
}
```

## Architectural Finding: URL Expiration

### Issue

Convex's native `storage.getUrl()` returns **permanent URLs** with no expiration. Once a URL is generated:
- It can be accessed by anyone who has the URL
- It remains valid until the file is deleted
- There is no time-based expiration

### Risk Assessment

| Factor | Assessment |
|--------|------------|
| Access Control | Query-time only (not URL-time) |
| URL Lifetime | Permanent until file deletion |
| Sharing Risk | URLs can be shared/leaked |
| Caching Risk | URLs may be cached in logs, browsers |

### Recommendation

For applications requiring signed URLs with expiration, consider:

1. **Convex R2 Component** - Supports custom expiration (default 15 minutes)
2. **ConvexFS Component** - Signed CDN URLs with time-limited access
3. **Files Control Component** - Download grants with max uses & expiration

### Current Mitigation

With authentication and ownership checks in place, the risk is significantly reduced:
- URLs are only returned to authenticated, authorized users
- An attacker cannot obtain URLs without valid credentials
- The remaining risk is URL sharing by authorized users

## Verification

### Test Cases Required

```gherkin
# SEC-TEST-004-A: Voice Note Cross-User Access Prevention
Given User A has a voice note attached to Habit H
And User B is authenticated
When User B calls voiceNotesQueries.listByHabit(H)
Then User B should receive an authorization error
And User B should NOT receive the voice note URL

# SEC-TEST-004-B: Image Cross-User Access Prevention
Given User A has images on their vision board
And User B is authenticated
When User B calls visionBoardImagesQueries.get(imageId)
Then User B should receive an authorization error
And User B should NOT receive the image URL

# SEC-TEST-004-C: Unauthenticated Access Prevention
Given no user is authenticated
When any voice note or image query is called
Then the query should return an authentication error
```

## Summary of Changes

| Metric | Value |
|--------|-------|
| Files Modified | 3 |
| Queries Secured | 10 |
| Attack Vectors Closed | 10 |
| Breaking API Changes | 2 (`listByUser` functions no longer accept userId) |

## Future Recommendations

1. **Consider signed URL implementation** for sensitive content if URL sharing is a concern
2. **Add rate limiting** to prevent ID enumeration attacks
3. **Implement audit logging** for file access patterns
4. **Add security tests** to CI pipeline (SEC-005)

---

**Document End**
