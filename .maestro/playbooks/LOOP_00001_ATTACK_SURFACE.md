---
type: analysis
title: Attack Surface Map - Loop 00001
created: 2026-02-22
tags:
  - security
  - attack-surface
  - convex
  - audit
related:
  - "[[Security Vulnerabilities - Loop 00001]]"
  - "[[Security Analysis - Attack Surface Mapping]]"
---
# Attack Surface Map - Loop 00001

## Scope and Method

- Reviewed Convex backend endpoints (`mutation`, `query`, `action`) and frontend integration points.
- Ran dependency vulnerability audit with `npm audit --json`.
- Ran secret scanning with `gitleaks` and manually triaged findings.
- Ran static pattern scan with `rg` (dangerous eval/exec/HTML injection/plain HTTP) plus auth/ownership coverage review.

## Scan Results Summary

| Scan Type | Tool Used | Critical | High | Medium | Low |
|-----------|-----------|----------|------|--------|-----|
| Dependencies | `npm audit --json` | 0 | 49 | 3 | 0 |
| Secrets | `gitleaks detect --no-git` + triage | 1 | 1 | 0 | 1 |
| Static Analysis | `rg` rule scan + endpoint auth review | 0 | 2 | 2 | 1 |

### Scan Notes

- Dependency audit returned 52 total vulnerabilities (mostly transitive toolchain packages such as Jest, Expo, React Native, TypeScript ESLint).
- `gitleaks` reported 3 findings:
  - `docs/LOOP_00001_VULNERABILITIES.md` contains a Figma token string (critical exposure in tracked docs).
  - `.claude/settings.json` contains a commented token-like value (high risk if valid).
  - `docs/specs/clerk-auth/IMPLEMENTATION_SUMMARY.md` includes a Clerk publishable key (low risk, likely false positive for "secret" classification).
- Static pattern scan found no runtime `eval`, `new Function`, `dangerouslySetInnerHTML`, or shell execution calls in production source paths reviewed.
- CI workflow currently runs lint/tests but no dedicated security job (`npm audit`, Semgrep, CodeQL, or gitleaks) by default.

## Entry Points

### API Endpoints

No custom REST/HTTP handlers are registered in `convex/router.ts` / `convex/http.ts`; the public attack surface is primarily Convex function calls.

| Endpoint | Method | Auth Required | Input Sources |
|----------|--------|---------------|---------------|
| `api.habits.create` | Convex mutation | Optional (identity may be null) | Body (`name`, `notes`, reminders, cues) |
| `api.habits.update` | Convex mutation | Yes + ownership check | Body (`habitId`, update fields) |
| `api.habits.archive` | Convex mutation | No explicit auth | Body (`habitId`) |
| `api.habits.toggleHabit` | Convex mutation | No explicit auth | Body (`habitId`, `date`) |
| `api.habits.get` | Convex query | No explicit auth | Body (`habitId`) |
| `api.storage.generateUploadUrl` | Convex mutation | Yes | Body (none) |
| `api.storage.getUrl` | Convex query | No explicit auth | Body (`storageId`) |
| `api.storage.deleteFile` | Convex mutation | Yes | Body (`storageId`) |
| `api.visionBoardImages.create` | Convex mutation | No explicit auth | Body (`habitId`, `storageId`, caption/order) |
| `api.visionBoardImages.updateCaption` | Convex mutation | No explicit auth | Body (`imageId`, caption) |
| `api.visionBoardImages.remove` | Convex mutation | Yes + ownership check | Body (`imageId`) |
| `api.voiceNotes.create` | Convex mutation | No explicit auth | Body (`habitId`, `audioUrl`, metadata) |
| `api.voiceNotes.update` | Convex mutation | Yes + ownership check | Body (`voiceNoteId`, edits) |
| `api.voiceNotes.listByHabit` | Convex query | No explicit auth | Body (`habitId`, optional limit) |
| `api.notes.list/search/get` | Convex query | No explicit auth | Query args (`noteId`, `habitId`, `searchText`) |
| `api.notes.create/update/remove` | Convex mutation | No explicit auth | Body (`noteId`, `body`, `date`) |
| `api.letters.*` (queries/mutations) | Convex query/mutation | No explicit auth | Body (`letterId`, `habitId`, `unlockDays`) |
| `api.reflections.*` | Convex query/mutation | No explicit auth | Body (`reflectionId`, `habitId`, `date`, `emoji`) |
| `api.affirmations.generateAffirmations` | Convex action | No explicit auth | Body (`habitId`, `count`) + OpenAI prompt context |

### File Upload Points

- `src/hooks/useImageUpload.ts`: requests signed URL, fetches local file URI, uploads blob to signed URL.
- `convex/storage.ts:generateUploadUrl`: signed upload URL issuance (auth enforced).
- `convex/visionBoardImagesCreate.ts`: associates uploaded storage objects to habits (no explicit auth/ownership validation).

### External Integrations

- Clerk authentication (`@clerk/clerk-expo`, `convex/auth.config.ts`).
- Convex cloud backend and storage (`EXPO_PUBLIC_CONVEX_URL`, `ctx.storage.*`).
- OpenAI API (`convex/affirmationsAI.ts`, `OPENAI_API_KEY`).
- Expo notifications, sharing, file-system APIs on device (`expo-notifications`, `expo-sharing`, `expo-file-system`).

## Security-Sensitive Code Locations

### Authentication

- `src/App.tsx`: Clerk token retrieval and Convex auth token wiring; also allows unauthenticated dev mode when key is absent.
- `src/lib/appConfig.ts`: token cache via SecureStore and Convex client bootstrap.
- `convex/auth.ts` and `convex/auth.config.ts`: Convex auth provider setup.
- `convex/users.ts`: authenticated user bootstrap and lookup.

### Authorization

- Hardened ownership checks:
  - `convex/habits/update.ts`
  - `convex/habits/remove.ts`
  - `convex/storage.ts` (auth checks on upload/delete)
  - `convex/visionBoardImagesDelete.ts`
  - `convex/voiceNotesMutations.ts` (update/remove)
- High-exposure unauthenticated paths:
  - `convex/habits/archive.ts`, `convex/habits/pause.ts`, `convex/habits/reorder.ts`, `convex/habits/toggle.ts`, `convex/habits/get.ts`, `convex/habits/getTracking.ts`, `convex/habits/stats.ts`
  - `convex/notesMutations.ts` and `convex/notesQueries.ts`
  - `convex/lettersMutations.ts` and `convex/lettersQueries.ts`
  - `convex/reflectionsMutations.ts` and `convex/reflectionsQueries.ts`
  - `convex/visionBoardImagesCreate.ts`, `convex/visionBoardImagesMutations.ts`, `convex/visionBoardImagesQueries.ts`
  - `convex/voiceNotesQueries.ts` and `convex/voiceNotesMutations.ts:create`

### Cryptography and Secret Handling

- Platform-secure token storage via `expo-secure-store` in `src/lib/appConfig.ts`.
- No custom crypto primitives identified.
- Secret hygiene risk from token-like strings in tracked docs/config artifacts.

### Database Access

- Convex database accessed throughout `convex/*.ts` and modular subfolders.
- Data model and PII/sensitive fields defined in `convex/schema.ts` (users, notes, letters, reflections, voice notes, images).

### File Operations

- Device file creation/export: `src/utils/exportData/export.ts`.
- Blob upload path: `src/hooks/useImageUpload.ts`.
- Convex storage lifecycle: `convex/storage.ts`, `convex/visionBoardImagesDelete.ts`.

### Command Execution

- No backend command execution primitives found in application runtime code reviewed.

## Trust Boundaries

```
[Mobile/Web Client]
  |- Local storage (SecureStore / AsyncStorage / localStorage)
  |- User-controlled inputs (forms, media picks, auth flows)
        |
        | HTTPS / WebSocket
        v
[Convex Backend Functions]
  |- Queries / Mutations / Actions
  |- Convex DB + Convex Storage
        |
        +--> [Clerk Identity Provider]
        +--> [OpenAI API]
        +--> [Expo platform services]
```

## Data Flow Diagram

1. User authenticates via Clerk; app requests JWT and forwards token to Convex client (`src/App.tsx`).
2. Frontend invokes Convex endpoints directly (no custom REST layer).
3. Convex functions read/write habits, tracking, notes, letters, reflections, media metadata, and user rows.
4. Media uploads: frontend requests signed URL from Convex, uploads blob directly, then stores resulting storage ID.
5. AI generation: habit context fields are sent from Convex action to OpenAI and response is persisted as affirmations.
6. Sensitive data classes at rest include profile identity data (`users`), personal journaling content (notes/letters/reflections), and media references (voice notes/images).

## High-Risk Areas

1. **Inconsistent Access Control Across Convex Endpoints** - many state-changing functions lack explicit authentication/ownership checks, increasing IDOR and cross-user tampering risk.
2. **Ownership Field Drift (`userId`)** - several create mutations do not set `userId`, while other paths enforce `userId === identity.subject`; this can cause bypasses or orphaned records.
3. **Sensitive Data Exposure via Open Queries** - list/get endpoints for notes, letters, voice notes, reflections, and images can be queried by identifier or broad scope without auth.
4. **Secret Hygiene in Tracked Docs/Config** - gitleaks-confirmed token-like strings remain in repository content.
5. **Dependency Risk Backlog** - high vulnerability count in `npm audit` should be triaged and reduced, especially for runtime-exposed packages.

## Investigation Tactics

### Tactic 1: Auth Coverage Diff

- **Target:** Broken access control (OWASP A01)
- **Search Pattern:** `export const .* = (mutation|query|action)` and compare against `ctx.auth.getUserIdentity()` usage
- **Files to Check:** `convex/**/*.ts` excluding `_generated` and tests

### Tactic 2: Ownership Enforcement Audit

- **Target:** IDOR / cross-user object access
- **Search Pattern:** `ctx.db.patch|ctx.db.delete|ctx.db.get` on user-owned tables without `userId` equality check
- **Files to Check:** `convex/habits/*`, `convex/notes*`, `convex/letters*`, `convex/reflections*`, `convex/visionBoardImages*`, `convex/voiceNotes*`

### Tactic 3: UserId Persistence Integrity

- **Target:** Authorization bypass through missing ownership attributes
- **Search Pattern:** `ctx.db.insert(` for tables with `userId` in schema where inserted object omits `userId`
- **Files to Check:** `convex/schema.ts` vs create mutations in matching modules

### Tactic 4: Secret Leak Regression Scan

- **Target:** Hardcoded credentials and leaked tokens
- **Search Pattern:** `gitleaks detect --no-git` and regex search for `sk_`, `pk_test_`, `figd_`, `ghp_`
- **Files to Check:** repo root, docs, config folders (`.claude`, `docs`, env templates)

### Tactic 5: External Call Input Hardening

- **Target:** Prompt injection / unsafe outbound payloads
- **Search Pattern:** user fields forwarded into third-party calls without strict normalization/allow-lists
- **Files to Check:** `convex/affirmationsAI.ts`, prompt builders under `convex/affirmations/`

## Recommended Next Actions

1. Enforce auth + ownership checks consistently on all user-data endpoints, then add regression tests for unauthorized access attempts.
2. Ensure all user-owned inserts persist `userId` from identity and reject writes when identity is absent.
3. Rotate and scrub token-like values from tracked documentation/config files, then gate with CI gitleaks.
4. Add automated security jobs in CI (`npm audit`, gitleaks, static security linting/CodeQL).
5. Triage `npm audit` findings by runtime exposure and patch availability; prioritize direct/runtime dependencies first.
