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

- `EXPO_PUBLIC_CONVEX_URL` - Your Convex deployment URL

## Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (run `npm run format` before committing)
- **Linting**: ESLint (run `npm run lint` before committing)

### Pre-commit Hooks

The project uses Husky for pre-commit hooks. Make sure to install:

```bash
npm run prepare
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

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
