---
title: Release Readiness Check Report
date: 2026-07-14
scope: Phase 4 native release proof
status: blocked
---

# Release Readiness Check Report

## Summary

Release readiness is not clean yet. Convex env access, Convex codegen/typecheck,
and TypeScript typecheck passed. The targeted Jest release slice has failing
auth, notification, and Sentry suites. The Maestro native smoke path is wired but
cannot run in this headless environment because no Java runtime is installed.
ESLint also reports a pre-existing repo backlog.

Convex environment output included server-side secrets. Values were intentionally
not copied into this report.

## Checks

| Check                       | Command                                                                                            | Result  | Notes                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| Convex environment access   | `npx convex env list`                                                                              | Pass    | Command completed and confirmed server env access. Output contained secrets and was not copied. |
| Convex codegen/typecheck    | `npx convex codegen --typecheck enable`                                                            | Pass    | Generated Convex types and completed TypeScript typecheck.                                      |
| Targeted release Jest slice | `npx jest --runInBand --runTestsByPath ... --testPathIgnorePatterns='<rootDir>/.clonk-worktrees/'` | Fail    | 31 suites passed, 4 failed; 292 tests passed, 23 failed.                                        |
| Scoped typecheck            | `npm run typecheck`                                                                                | Pass    | `tsc --noEmit` completed successfully.                                                          |
| ESLint-only lint            | `npm run lint:eslint`                                                                              | Fail    | 109 errors and 1507 warnings across existing source.                                            |
| Native smoke path           | `npm run test:e2e:maestro:smoke`                                                                   | Blocked | Maestro is installed, but Java is missing and the script's default `JAVA_HOME` path is invalid. |

## Targeted Jest Failures

The release-targeted Jest command was first run without ignoring `.clonk-worktrees`;
that run was polluted by duplicate manual mocks and tests from `.clonk-worktrees/wt-1-4`.
It was rerun with `--runTestsByPath` and an explicit `.clonk-worktrees` ignore.

Remaining main-checkout failures:

- `src/screens/auth/utils/__tests__/mapOAuthError.test.ts`: expected OAuth copy
  does not match current user-facing messages.
- `src/hooks/__tests__/useNotificationResponse.test.ts`: dynamic import of
  `expo-notifications` fails under Jest without `--experimental-vm-modules`, so
  listener registration assertions do not run as expected.
- `tests/integration/monitoring/sentry-integration.test.ts`: tests mutate
  `process.env.EXPO_PUBLIC_SENTRY_DSN`, but current Sentry config resolution
  still reports disabled/null.
- `src/lib/sentry/__tests__/ErrorBoundary.test.tsx`: expected fallback copy
  does not match current rendered fallback text.

## Native Smoke Path

The configured release smoke command is:

```bash
npm run test:e2e:maestro:smoke
```

It runs:

```bash
JAVA_HOME=${JAVA_HOME:-$HOME/java/jdk-21.0.10+7/Contents/Home} maestro test --include-tags smoke .maestro/e2e
```

Current blocker:

```text
ERROR: JAVA_HOME is set to an invalid directory: /Users/andres/java/jdk-21.0.10+7/Contents/Home
```

Additional checks found no alternate local Java runtime:

- `/usr/libexec/java_home` returned no path.
- `java -version` failed with no Java Runtime located.
- `maestro` is installed at `/Users/andres/.maestro/bin/maestro`.

## Relevant Native Config

- `eas.json` has a `development` profile with `developmentClient: true`.
- `eas.json` production iOS submit uses `ascAppId: 6758899638`.
- `app.json` uses bundle/package ID `com.chainday.app`.
- `.maestro/e2e/README.md` defines the Maestro smoke suite and device data
  contract.
- Specs require dev-client/TestFlight proof for native modules because Expo Go
  cannot prove RevenueCat IAP or Sentry native behavior.

## Follow-up Required

- Fix or update the four failing targeted Jest suites.
- Either fix the existing ESLint backlog or choose and document a narrower
  release lint gate.
- Install/configure a Java runtime, boot/install a development client or
  TestFlight build, and rerun `npm run test:e2e:maestro:smoke`.
