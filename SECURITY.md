# Security Policy — Chain Day

Last audited: 2026-02-16 (v4)

## Architecture Overview

| Layer | Technology | Security Model |
|-------|-----------|---------------|
| Auth | Clerk (OAuth/SSO) | JWT-based, managed by Clerk |
| Token Storage | `expo-secure-store` | Hardware-backed keychain (iOS Keychain / Android Keystore) |
| Backend | Convex | Server-side mutations with auth checks, typed validators |
| Transport | HTTPS only | Enforced for all API calls and storage URLs |

## Security Controls

### SEC-001: Authentication & Authorization
- All mutations require `ctx.auth.getUserIdentity()` — unauthenticated calls are rejected.
- Ownership verification: mutations check `habit.userId === identity.subject` before modification.
- Token caching uses `expo-secure-store` (not AsyncStorage) — see `src/lib/appConfig.ts`.

### SEC-002: Convex Type Validators
- All mutation arguments use Convex `v.*` validators (schema-level type enforcement).
- Invalid types are rejected before handler code executes.

### SEC-003: Input Sanitization
- Centralized validation in `convex/lib/inputValidation.ts`.
- Covers: habit names, notes, affirmations, letter content/titles, voice note labels, vision board captions, WOOP fields, visualization fields, URLs, colors, emoji, time formats, identifiers.
- Dangerous pattern detection blocks: `<script>`, event handlers (`onclick=`), `javascript:` URIs, `data:text/html`, iframe/object/embed injection, SQL injection markers.
- Length limits enforced on all text fields (100 chars for names, 500 for short text, 5000 for long text, 2048 for URLs).
- URL validation: HTTPS required, domain allowlisting for storage URLs, dangerous pattern blocking.

### SEC-004: XSS Prevention
- **No WebView components** in the app — React Native renders native views, not HTML.
- **No `dangerouslySetInnerHTML`** usage anywhere in the codebase.
- All user text is rendered through React Native `<Text>` components (inherently safe).
- Visualization fields passed to AI prompts are read-only from DB (no user write path currently).

### SEC-005: Deep Linking
- URL scheme: `habit-tracker://` (defined in `app.json`).
- `Linking` usage is outbound-only (opening external URLs like terms/privacy pages).
- OAuth redirect uses `Linking.createURL('/')` — standard Expo auth flow.
- No inbound deep link parsing that could be exploited.

### SEC-006: Dependency Security
- `npm audit` reports **0 vulnerabilities** (as of 2026-02-16).
- 1,587 total dependencies (992 prod, 488 dev).

## Known Limitations & Recommendations

### No Server-Side Rate Limiting
- Convex does not provide built-in rate limiting on mutations.
- **Mitigation**: Convex's pricing model (function calls are metered) provides economic back-pressure. For additional protection, consider implementing application-level rate limiting using a token bucket pattern in Convex with a `rateLimits` table.

### Expo Updates (OTA)
- The app uses Expo's update mechanism. Code signing for OTA updates should be enabled for production to prevent tampered update injection.
- **Recommendation**: Enable `expo-updates` code signing in `app.json` before production launch.

### WOOP/Visualization Fields
- Schema defines WOOP and visualization fields, but no user-facing mutation currently writes to them.
- Validation has been pre-wired in `convex/habits/validation.ts` for when these features are enabled.

## Reporting Vulnerabilities

Please report security issues to the repository maintainers via GitHub Security Advisories (private disclosure).
