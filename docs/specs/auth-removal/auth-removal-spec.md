# Authentication Removal Specification

## Overview

Remove Clerk + Convex authentication from the habit tracking app, transitioning to a local-first, anonymous experience with optional future account linking.

## Current State

### Authentication Stack
- **Identity Provider**: Clerk (`@clerk/clerk-expo`)
- **Backend Validation**: Convex (`@convex-dev/auth`)
- **Token Storage**: Expo SecureStore
- **Data Isolation**: `userId` field on all user-specific tables

### Affected Components
| Component | File Path | Purpose |
|-----------|-----------|---------|
| AuthGate | `src/components/auth/AuthGate.tsx` | Route protection |
| WelcomeScreen | `src/screens/auth/WelcomeScreen.tsx` | Auth landing page |
| SignInScreen | `src/screens/auth/SignInScreen.tsx` | Email/password login |
| SignUpScreen | `src/screens/auth/SignUpScreen.tsx` | Registration |
| SocialLoginButtons | `src/components/auth/SocialLoginButtons.tsx` | OAuth (Google/Apple) |
| Convex Auth Config | `convex/auth.config.ts` | Clerk provider config |
| Users Module | `convex/users.ts` | User CRUD operations |

### Data Tables with userId
- `habits` - Main habit data
- `affirmations` - Personal affirmations
- `letters` - Letters to self
- `voiceNotes` - Voice recordings
- `visionBoardImages` - Personal images
- `reflections` - Journal entries
- `notes` - Personal notes
- `trackingRecords` - Completion history

## Target State

### Architecture: Anonymous Device-Based Identity

```
┌─────────────────────────────────────────────────────────┐
│                    App Launch                            │
├─────────────────────────────────────────────────────────┤
│  1. Check AsyncStorage for deviceUserId                  │
│  2. If none: Generate UUID, store in AsyncStorage        │
│  3. Create/fetch anonymous user record in Convex         │
│  4. All queries filter by deviceUserId                   │
│  5. No login/signup screens shown                        │
└─────────────────────────────────────────────────────────┘
```

### Key Design Decisions

#### Decision 1: Device-Based Identity
- Generate UUID on first launch
- Store in AsyncStorage (persists across app updates)
- Use as `userId` for all data operations

#### Decision 2: Remove Clerk Dependency
- Delete all Clerk-related code and config
- Remove `@clerk/clerk-expo` from dependencies
- Remove Clerk environment variables

#### Decision 3: Simplify Convex Auth
- Remove JWT validation requirement
- Queries/mutations accept `deviceUserId` parameter
- Backend validates deviceUserId format (UUID)

#### Decision 4: Data Migration Strategy
- Existing authenticated users: Data remains tied to clerkId
- New users: Data tied to deviceUserId
- Migration path: If user later signs up, link deviceUserId to account

## Functional Requirements

### FR-1: Anonymous User Creation
- **On first launch**: Generate deviceUserId (UUID v4)
- **Store locally**: AsyncStorage key `@habit_app:device_user_id`
- **Create backend record**: `users` table with `isAnonymous: true`

### FR-2: Data Isolation
- All queries must filter by deviceUserId
- No user can access another user's data
- Backend validates deviceUserId is valid UUID format

### FR-3: Seamless App Entry
- No welcome/auth screens
- Direct to habits list on launch
- Onboarding flow (if any) is feature-based, not auth-based

### FR-4: Future Account Linking (Deferred)
- Schema supports `clerkId` field for future linking
- `isAnonymous` flag distinguishes anonymous vs linked users
- Implementation deferred to future sprint

## Non-Functional Requirements

### NFR-1: Security
- deviceUserId must be UUID v4 format
- Backend rejects malformed deviceUserIds
- Rate limiting on user creation (prevent abuse)

### NFR-2: Performance
- No network call required before showing UI
- Async user record creation (non-blocking)

### NFR-3: Data Persistence
- deviceUserId survives app updates
- deviceUserId lost on app uninstall (expected behavior)
- No cross-device sync (by design)

## API Changes

### Mutations - Before
```typescript
// Requires authenticated context
export const create = mutation({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    // ... use identity.subject as userId
  }
});
```

### Mutations - After
```typescript
// Accepts deviceUserId parameter
export const create = mutation({
  args: {
    deviceUserId: v.string(),
    // ... other args
  },
  handler: async (ctx, args) => {
    if (!isValidUUID(args.deviceUserId)) {
      throw new Error('Invalid device ID');
    }
    // ... use args.deviceUserId as userId
  }
});
```

### Queries - Before
```typescript
// Filters by authenticated user
.filter((q) => q.eq(q.field('userId'), identity.subject))
```

### Queries - After
```typescript
// Filters by deviceUserId parameter
.filter((q) => q.eq(q.field('userId'), args.deviceUserId))
```

## Files to Delete

```
src/components/auth/AuthGate.tsx
src/components/auth/SocialLoginButtons.tsx
src/screens/auth/WelcomeScreen.tsx
src/screens/auth/SignInScreen.tsx
src/screens/auth/SignUpScreen.tsx
convex/auth.ts
convex/auth.config.ts
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Remove ClerkProvider, add deviceUserId provider |
| `convex/users.ts` | Add anonymous user creation, remove Clerk deps |
| `convex/habits.ts` | Accept deviceUserId param, remove auth checks |
| `convex/schema.ts` | Keep userId fields, add deviceUserId index |
| `package.json` | Remove @clerk/*, @convex-dev/auth |
| `src/lib/appConfig.ts` | Remove Clerk token cache |
| All queries with userId | Accept deviceUserId as parameter |

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/deviceIdentity.ts` | UUID generation and storage |
| `src/contexts/DeviceUserContext.tsx` | React context for deviceUserId |

## Dependencies to Remove

```json
{
  "@clerk/clerk-expo": "^2.15.4",
  "@convex-dev/auth": "^0.0.90",
  "expo-auth-session": "~7.0.9"
}
```

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss on uninstall | High | Document behavior clearly, defer backup feature |
| No cross-device sync | Medium | Position as privacy feature, defer sync to v2 |
| UUID collision | Very Low | UUID v4 collision probability is negligible |
| Abuse via fake deviceIds | Medium | Rate limiting, UUID format validation |

## Success Criteria

- [ ] App launches directly to habits screen (no auth wall)
- [ ] New users can create and track habits without signup
- [ ] Existing auth code fully removed
- [ ] All tests pass with new identity system
- [ ] Bundle size reduced (no Clerk SDK)
- [ ] No regressions in habit CRUD operations

## Out of Scope

- Cross-device sync
- Account creation/linking
- Data backup/restore
- Migration of existing authenticated user data

## Timeline Estimate

Phase 1: Core Identity System (deviceUserId)
Phase 2: Remove Auth Components
Phase 3: Update Backend Mutations/Queries
Phase 4: Testing & Cleanup
