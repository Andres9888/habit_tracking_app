# Contributing to Chain Day

Thank you for your interest in contributing to Chain Day! This guide will help you get started with development.

## Development Workflow

### 1. Getting Started

```bash
# Clone the repository
git clone https://github.com/Andres9888/habit_tracking_app.git
cd habit_tracking_app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run expo:start
```

### 2. Creating a Branch

Always create a new branch for your work:

```bash
# For bug fixes
git checkout -b fix/description

# For new features
git checkout -b feature/description

# For documentation
git checkout -b docs/description
```

### 3. Making Changes

1. Make your changes following our coding standards
2. Write tests for new functionality
3. Run the linter and formatter
4. Commit with a descriptive message

### 4. Submitting a Pull Request

1. Push your branch to GitHub
2. Create a Pull Request against `main`
3. Fill out the PR template
4. Wait for review and address feedback

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Avoid `any`, use proper types
- Use interfaces over types for object shapes
- Export types that are used across modules

### React Native

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Extract reusable logic into custom hooks

### File Organization

```
ComponentName/
├── ComponentName.tsx        # Main component
├── ComponentName.types.ts  # TypeScript types
├── ComponentName.test.tsx  # Tests
└── index.ts                # Barrel export
```

### Naming Conventions

- **Components**: PascalCase (e.g., `HabitCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useHabitStrength.ts`)
- **Utilities**: camelCase (e.g., `dateUtils.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `habitEmojis.ts`)
- **Files**: kebab-case (e.g., `habit-detail-screen.tsx`)

### Import Order

```typescript
// 1. React/React Native imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party imports
import { useQuery } from 'convex/react';
import { Button } from 'react-native-paper';

// 3. Internal imports (absolute paths)
import { colors, spacing } from '@/theme';
import { useAppTheme } from '@/theme';

// 4. Relative imports
import { HabitCard } from '../components/HabitCard';

// 5. Types (can be interspersed or at the end)
import type { Habit } from '@/types';
```

## Code Style

### Formatting

We use Prettier for code formatting. Run before committing:

```bash
npm run format
```

### Linting

We use ESLint with custom rules. Check your code:

```bash
npm run lint
```

### Type Checking

Always verify TypeScript compiles:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

## Design System Reference

All UI components should use our design system tokens. See [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for details.

### Quick Reference

```typescript
import { colors, spacing, borderRadius, shadows, typography } from '@/theme';

// Colors
colors.primary[500]  // Primary brand color
colors.gray[600]     // Body text
colors.error         // Error states

// Spacing (8px grid)
spacing.xs   // 4px
spacing.sm   // 8px
spacing.md   // 12px
spacing.base // 16px
spacing.lg   // 24px
spacing.xl   // 32px

// Border Radius
borderRadius.small   // 8px  - chips, badges
borderRadius.medium  // 12px - buttons
borderRadius.large    // 16px - cards
borderRadius.xl      // 24px - modals

// Shadows
shadows.card       // Level 1 - cards at rest
shadows.floatingActionButton  // Level 2 - FAB
shadows.modal      // Level 3 - modals
shadows.alert      // Level 4 - alerts
```

### Typography Scale

| Style | Size | Weight | Line Height |
|-------|------|--------|-------------|
| displayLarge | 38px | Bold | 45px |
| heading1 | 30px | Bold | 36px |
| heading2 | 24px | Semibold | 30px |
| heading3 | 20px | Semibold | 26px |
| body | 16px | Regular | 24px |
| bodySmall | 14px | Regular | 21px |
| caption | 12px | Medium | 18px |

### Animation Guidelines

- **Entry animations**: 280ms with 60ms stagger
- **Button feedback**: Spring-based, ~100ms
- **Page transitions**: 300ms ease-out
- **No decorative loops** or idle animations

See [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for complete animation values.

## Pull Request Process

### PR Titles

Use conventional commits format:

```
fix: resolve habit completion bug
feat: add calendar view
docs: update README
refactor: simplify habit strength calculation
```

### PR Description Template

```markdown
## Summary
Brief description of changes

## Changes
- Change 1
- Change 2

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web
- [ ] Added unit tests

## Screenshots (if UI changes)
<!-- Add screenshots here -->

## Related Issues
Closes #XXX
```

### Review Checklist

Before requesting review:

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] PR description is complete

## Parallel Development

When multiple developers work simultaneously, use git worktrees to avoid conflicts:

```bash
# Create a worktree for your feature
git worktree add /tmp/my-feature-worktree -b feature/my-feature origin/main

# Work in the worktree
cd /tmp/my-feature-worktree

# Clean up when done
git worktree remove /tmp/my-feature-worktree
```

## Need Help?

- Check existing issues and discussions
- Ask in the project Discord (if available)
- Review the architecture docs in `docs/`

## Recognition

Contributors will be acknowledged in the project README and changelog.
