# Contributing to Chain Day

Thank you for your interest in contributing to Chain Day! This document outlines the process for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/habit_tracking_app.git`
3. **Install dependencies**: `npm install`
4. **Create a branch**: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 20+ (required — the metro config uses `Array.prototype.toReversed()`; `engines.node >= 20`)
- npm or bun
- Convex CLI (`npx convex dev`)
- Expo CLI (for mobile development)

### Running the App

```bash
# Start Convex backend (separate terminal)
npm run dev:backend

# Start Expo dev server
npm run expo:start

# Run on iOS
npm run expo:ios
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `EXPO_PUBLIC_CONVEX_URL` — Convex deployment URL (required)
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_AUTH_DOMAIN` — Clerk auth
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` / `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` — RevenueCat SDK
- `REVENUECAT_WEBHOOK_SECRET` — verifies RevenueCat → Convex webhooks (**server-side only**: set in the Convex dashboard, never in a client `.env` file)
- `EXPO_PUBLIC_SENTRY_DSN` — Sentry error reporting

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (run `npm run format` before committing)
- **Linting**: ESLint (run `npm run lint` before committing)
- **File length**: production files ≤100 lines (excl. blanks/comments) — see `docs/DECOMPOSITION_PATTERNS.md`; `npm run lint:max-lines` reports violations
- **Dead code**: `npm run lint:dead` (knip)

### File Naming Conventions

| Kind                          | Convention                  | Example                                |
| ----------------------------- | --------------------------- | -------------------------------------- |
| Component file/dir            | `PascalCase`                | `HabitCard.tsx`, `HabitCard/`          |
| Hook                          | `camelCase`, `use` prefix   | `useHabitCard.ts`                      |
| Component types / hooks split | `*.types.ts` / `*.hooks.ts` | `HabitCard.types.ts`                   |
| Convex module                 | `camelCase`                 | `analyticsWeekly.ts`                   |
| Constants / utils             | `camelCase`                 | `featureFlags.ts`                      |
| Config                        | dot-separated               | `jest.config.js`, `tailwind.config.js` |
| Test                          | `*.test.ts(x)`              | `habitStrength.test.ts`                |

New files should follow the convention for their kind; when in doubt, match the
nearest sibling.

### Pre-commit Hooks

The project uses Husky for pre-commit hooks. Make sure to install:

```bash
npm run prepare
```

## Testing

**Framework:** Jest with `jest-expo`. Config in `jest.config.js`, global setup in
`jest.setup.js`, shared mocks in `__mocks__/`.

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run a single file / pattern
npx jest convex/habitStrength.test.ts
```

### Layout

- `tests/unit/**` — unit tests (`convex/`, `components/`, `theme/`)
- `tests/integration/**`, `tests/e2e/**`, `tests/e2e-scenarios/**`, `tests/performance/**`
- `src/**/__tests__/**` and colocated `convex/*.test.ts` — near the code they cover
- E2E device flows use Maestro (`.maestro/`)

### Mocking

- React Native / Reanimated / Expo native modules are mocked via `__mocks__/` and
  `jest.setup.js` — expect some RN matchers to need these; don't test against real
  native modules.
- Convex functions are tested as **pure logic** (import and call directly, e.g.
  `habitStrength.ts`), not through a running Convex server.

### Writing good tests

- Cover edge/error cases (invalid, out-of-range, empty), not just the happy path.
- When asserting exact numeric output (e.g. strength), keep the expected value in
  sync with the source constants — see the strength invariant in
  [ARCHITECTURE.md](./ARCHITECTURE.md#backend-data-model--api-convex).

## Submitting Changes

1. **Commit your changes**: `git commit -m "feat: add new feature"`
2. **Push to your fork**: `git push origin feature/your-feature-name`
3. **Create a Pull Request**: Use GitHub to submit

### PR Guidelines

- Include a clear description of the changes
- Link any related issues
- Ensure all tests pass
- Update documentation if needed

## Reporting Bugs

Use GitHub Issues to report bugs. Include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## Feature Requests

Open a GitHub Issue with the `enhancement` label. Describe:

- The feature you'd like
- Why it's useful
- Any implementation ideas

## Branch Protection & Merging

`main` is protected — **do not commit directly to `main`.**

- Branch off `main`, open a PR into `main`.
- PRs require review and passing CI before merge.
- Merges are squash-merges (`gh pr merge <n> --squash`).
- Admin bypass is reserved for fixing pre-existing red CI that a PR does not
  itself cause — never for skipping review of new logic.

## Build & Deploy

| Task                             | Command                               |
| -------------------------------- | ------------------------------------- |
| Build (JS bundle, all platforms) | `npm run build` (`expo export`)       |
| Bundle analysis                  | `npm run analyze:bundle` (Expo Atlas) |
| Backend deploy (Convex → prod)   | `npx convex deploy`                   |

Merging to `main` does **not** auto-deploy the backend — `npx convex deploy`
is explicit. App/native builds go through EAS. Backend API + auth/ownership/
entitlement rules are documented in `docs/API.md`.

## License

This project is proprietary — see [`LICENSE`](./LICENSE). All rights reserved;
no contributions are accepted from outside the copyright holder without prior
written permission.
