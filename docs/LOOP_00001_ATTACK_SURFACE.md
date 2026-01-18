# Attack Surface Map - Loop 00001

**Generated:** 2025-12-29
**Project:** Habit Tracking App (React Native/Expo + Convex Backend)
**Analysis Agent:** code-refactor

## Executive Summary

This is a React Native habit tracking application using Expo for cross-platform mobile/web development and Convex as a serverless backend. Authentication is handled via Clerk (OAuth). The application stores user habits, tracking data, vision board images, voice notes, and various user-generated content.

## Scan Results Summary

| Scan Type       | Tool Used          | Critical               | High | Medium | Low |
| --------------- | ------------------ | ---------------------- | ---- | ------ | --- |
| Dependencies    | npm audit          | N/A (Node unavailable) | -    | -      | -   |
| Secrets         | Grep patterns      | 0                      | 0    | 0      | 0   |
| Static Analysis | Manual code review | 0                      | 3    | 5      | 2   |

**Note:** npm audit could not be run in this environment. Manual review was performed instead.

## Technology Stack

| Component          | Technology        | Version        | Notes                   |
| ------------------ | ----------------- | -------------- | ----------------------- |
| Frontend Framework | React Native      | 0.81.5         | Cross-platform mobile   |
| Web Support        | React Native Web  | 0.21.2         |                         |
| Platform Framework | Expo              | ~54.0.25       | Managed workflow        |
| Backend            | Convex            | 1.21.1-alpha.1 | Serverless BaaS         |
| Authentication     | Clerk             | 2.15.4         | OAuth provider          |
| Auth Library       | @convex-dev/auth  | 0.0.90         | Convex auth integration |
| Secure Storage     | expo-secure-store | 15.0.7         | Token storage           |
| File Storage       | Convex Storage    | -              | Images, audio files     |
| AI Integration     | OpenAI            | 4.77.0         | Affirmation generation  |

## Entry Points

### API Endpoints (Convex Functions)

The application uses Convex as a serverless backend. All "endpoints" are Convex functions (queries/mutations/actions).

#### Authentication Functions

| Function                | Type     | Auth Required | Risk Level |
| ----------------------- | -------- | ------------- | ---------- |
| `users:getOrCreateUser` | mutation | Yes           | Medium     |
| `users:currentUser`     | query    | Yes           | Low        |
| `users:getUser`         | query    | No\*          | Low        |

\*`getUser` takes a userId parameter - potential IDOR if not validated

#### Habit Management

| Function                   | Type     | Auth Required | Risk Level |
| -------------------------- | -------- | ------------- | ---------- |
| `habits:create`            | mutation | Optional\*\*  | Medium     |
| `habits:update`            | mutation | No            | High       |
| `habits:archive`           | mutation | No            | Medium     |
| `habits:remove`            | mutation | No            | High       |
| `habits:list`              | query    | Yes           | Low        |
| `habits:get`               | query    | No            | Medium     |
| `habits:toggleHabit`       | mutation | No            | Medium     |
| `habits:reorderHabits`     | mutation | No            | Low        |
| `habits:restore`           | mutation | No            | Medium     |
| `habits:deleteAllArchived` | mutation | No            | High       |

\*\*Authentication is checked but userId is optional for backwards compatibility

#### File Storage Functions

| Function                    | Type     | Auth Required | Risk Level |
| --------------------------- | -------- | ------------- | ---------- |
| `storage:generateUploadUrl` | mutation | No            | High       |
| `storage:getUrl`            | query    | No            | Low        |
| `storage:deleteFile`        | mutation | No            | High       |
| `visionBoardImages:create`  | mutation | No            | Medium     |
| `visionBoardImages:remove`  | mutation | No            | Medium     |
| `voiceNotes:create`         | mutation | No            | Medium     |
| `voiceNotes:remove`         | mutation | No            | Medium     |

#### Settings and User Data

| Function             | Type     | Auth Required | Risk Level |
| -------------------- | -------- | ------------- | ---------- |
| `settings:get`       | query    | No            | Low        |
| `settings:update`    | mutation | No            | Medium     |
| `notes:create`       | mutation | No            | Low        |
| `letters:create`     | mutation | No            | Low        |
| `reflections:upsert` | mutation | No            | Low        |

#### AI-Powered Functions

| Function                                   | Type   | Auth Required | Risk Level |
| ------------------------------------------ | ------ | ------------- | ---------- |
| `affirmations:generateAffirmations`        | action | No            | Medium     |
| `affirmations:generateAndSaveAffirmations` | action | No            | Medium     |

### External Integrations

| Service            | Purpose                   | Data Exchanged                      |
| ------------------ | ------------------------- | ----------------------------------- |
| Clerk              | OAuth Authentication      | User identity, tokens               |
| Convex Cloud       | Backend/Database          | All app data                        |
| OpenAI API         | AI Affirmation Generation | User habit data, preferences        |
| Expo Notifications | Push Notifications        | Device tokens, notification content |

## Security-Sensitive Code Locations

### Authentication

- `convex/auth.ts:1-6` - Convex auth setup (providers array is empty)
- `convex/auth.config.ts:1-8` - Clerk provider configuration
- `convex/users.ts:1-72` - User creation and lookup
- `src/lib/appConfig.ts:1-31` - Frontend auth token handling with SecureStore

### Authorization (CRITICAL GAPS IDENTIFIED)

- **Most mutations lack ownership checks** - Users can modify other users' data
- `convex/habits.ts:472-538` - `list` query correctly filters by identity.subject
- `convex/habits.ts:129-141` - `update` mutation **lacks** ownership validation
- `convex/habits.ts:287-338` - `remove` mutation **lacks** ownership validation
- `convex/storage.ts:24-30` - Upload URL generation has **no authentication**

### File Operations

- `convex/storage.ts:1-59` - File upload/download/delete
- `convex/visionBoardImages.ts:1-377` - Image CRUD with storage
- `convex/voiceNotes.ts:1-447` - Audio file handling

### Database Access

- All files in `convex/*.ts` use Convex DB queries
- Schema defined in `convex/schema.ts:1-515`
- No raw SQL - Convex handles query building

### Cryptographic Operations

- Token storage: `expo-secure-store` (OS-level encryption)
- No custom crypto implementations found

## Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICE                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React Native App (Expo)                                   │  │
│  │  ├── expo-secure-store (token storage)                    │  │
│  │  ├── Clerk SDK (OAuth flow)                               │  │
│  │  └── Convex Client (API calls)                            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   Clerk Auth    │    │  Convex Cloud   │                     │
│  │   (OAuth)       │◄──►│  (Backend)      │                     │
│  │                 │    │                 │                     │
│  │ - User identity │    │ - Database      │                     │
│  │ - JWT tokens    │    │ - Functions     │                     │
│  │ - Session mgmt  │    │ - File storage  │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                │                                 │
│                                │                                 │
│                                ▼                                 │
│                    ┌─────────────────┐                          │
│                    │   OpenAI API    │                          │
│                    │  (Affirmations) │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Classifications

### Credentials (High Sensitivity)

- Clerk JWT tokens (stored in SecureStore)
- OpenAI API key (environment variable)
- Convex deployment URL (environment variable)

### PII (Medium-High Sensitivity)

- User email (`users.email`)
- User name (`users.name`)
- User profile image URL (`users.imageUrl`)
- Clerk user ID (`users.clerkId`)

### User-Generated Content (Medium Sensitivity)

- Habit names and notes
- Letters to self (personal messages)
- Voice notes (audio recordings)
- Vision board images (uploaded photos)
- Reflections and affirmations
- Tracking data (completion history)

### Application Data (Low Sensitivity)

- Templates (pre-defined content)
- Articles (static content)
- Categories (reference data)
- UI settings (preferences)

## High-Risk Areas

Based on this analysis, the following areas warrant immediate investigation:

### 1. Missing Authorization Checks (CRITICAL)

- **Location:** All mutation functions in `convex/*.ts`
- **Issue:** Most mutations accept resource IDs without verifying ownership
- **Impact:** Any authenticated user can modify/delete any other user's data
- **Example:** `habits:update`, `habits:remove`, `visionBoardImages:remove`

### 2. Unauthenticated File Upload (HIGH)

- **Location:** `convex/storage.ts:24-30`
- **Issue:** `generateUploadUrl` requires no authentication
- **Impact:** Anyone can upload files to the storage bucket, potential for storage abuse or malicious file hosting

### 3. IDOR Vulnerabilities (HIGH)

- **Location:** Functions taking ID parameters without ownership validation
- **Issue:** Resource IDs are predictable (Convex IDs)
- **Example Files:**
  - `convex/users.ts:66-71` - `getUser` exposes any user by ID
  - `convex/habits.ts:389-470` - `get` returns any habit by ID

### 4. Backwards Compatibility Auth Gap (MEDIUM)

- **Location:** `convex/habits.ts:33-41`
- **Issue:** `userId` is optional for migration compatibility
- **Impact:** Legacy data and new anonymous data lack user association

### 5. AI Prompt Injection Risk (MEDIUM)

- **Location:** `convex/affirmations.ts:620-724`
- **Issue:** User input (habit names, notes) sent directly to OpenAI
- **Impact:** Potential prompt injection if user crafts malicious habit names

### 6. Exposed Clerk Development Domain (LOW)

- **Location:** `convex/auth.config.ts:4`
- **Issue:** Development Clerk domain (`vital-elf-64.clerk.accounts.dev`) in code
- **Impact:** Information disclosure, but low risk if production uses different config

## Investigation Tactics

### Tactic 1: Authorization Audit

- **Target:** Broken Access Control (OWASP A01)
- **Search Pattern:** `ctx.db.patch|ctx.db.delete|ctx.db.insert` without `ctx.auth.getUserIdentity()`
- **Files to Check:** All `convex/*.ts` mutation handlers
- **Expected Finding:** Many mutations lack ownership validation

### Tactic 2: Input Validation Audit

- **Target:** Injection vulnerabilities
- **Search Pattern:** User input passed to external services
- **Files to Check:**
  - `convex/affirmations.ts` (OpenAI integration)
  - `convex/voiceNotes.ts:155-158` (audioUrl validation)
- **Expected Finding:** Limited validation on user-provided URLs

### Tactic 3: File Upload Security

- **Target:** Unrestricted File Upload
- **Search Pattern:** `storage.generateUploadUrl` calls
- **Files to Check:** `convex/storage.ts`, `convex/visionBoardImages.ts`
- **Expected Finding:** No file type validation, no size limits enforced at API level

### Tactic 4: Data Exposure Audit

- **Target:** Sensitive Data Exposure
- **Search Pattern:** Query functions returning user data
- **Files to Check:**
  - `convex/visionBoardImages.ts:351-376` (`listRecent` - returns all users' images)
  - `convex/voiceNotes.ts:260-279` (`listRecent` - returns all users' voice notes)
- **Expected Finding:** Some queries may expose cross-user data

## Recommendations

### Immediate Actions (P0)

1. Add ownership validation to all mutation handlers
2. Require authentication for `storage:generateUploadUrl`
3. Add rate limiting to AI-powered endpoints

### Short-term Actions (P1)

1. Audit all query functions for data leakage
2. Implement file type and size validation
3. Add input sanitization before OpenAI calls
4. Remove development domain references from code

### Medium-term Actions (P2)

1. Add comprehensive audit logging
2. Implement RBAC if admin features are added
3. Set up automated security scanning in CI/CD
4. Create security-focused integration tests

## Files Analyzed

| File                          | Purpose          | Lines |
| ----------------------------- | ---------------- | ----- |
| `convex/auth.ts`              | Auth setup       | 6     |
| `convex/auth.config.ts`       | Clerk config     | 8     |
| `convex/users.ts`             | User management  | 72    |
| `convex/habits.ts`            | Core habit logic | 928   |
| `convex/storage.ts`           | File storage     | 59    |
| `convex/visionBoardImages.ts` | Image handling   | 377   |
| `convex/voiceNotes.ts`        | Audio handling   | 447   |
| `convex/settings.ts`          | User settings    | ~170  |
| `convex/schema.ts`            | Database schema  | 515   |
| `src/lib/appConfig.ts`        | Frontend auth    | 31    |
| `package.json`                | Dependencies     | 133   |
| `.env.example`                | Env variables    | 15    |
| `.mcp.json`                   | MCP config       | 62    |

---

_This attack surface map was generated by automated security analysis. Manual review is recommended for all high-risk findings._
