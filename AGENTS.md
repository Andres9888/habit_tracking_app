# BMAD Method - Agent Directory

This document contains all available BMAD agents and tasks for use with Codex CLI.

## Quick Start

Activate agents in CLI:

1. Reference agents using `@{agent-name}`
2. Execute tasks using `@task-{task-name}`
3. Agents remain active for the conversation

---

## Available Agents

### CORE Module

#### 🧙 BMad Master Task Executor (`@bmad-master`)

**When to use:** Use for BMad Master Task Executor tasks

**Activation:** Type `@bmad-master` to activate this agent.

### BMM Module

#### 📊 Business Analyst (`@analyst`)

**When to use:** Use for Business Analyst tasks

**Activation:** Type `@analyst` to activate this agent.

#### 🏗️ Architect (`@architect`)

**When to use:** Use for Architect tasks

**Activation:** Type `@architect` to activate this agent.

#### 💻 Developer Agent (`@dev`)

**When to use:** Use for Developer Agent tasks

**Activation:** Type `@dev` to activate this agent.

#### 🏛️ Game Architect (`@game-architect`)

**When to use:** Use for Game Architect tasks

**Activation:** Type `@game-architect` to activate this agent.

#### 🎲 Game Designer (`@game-designer`)

**When to use:** Use for Game Designer tasks

**Activation:** Type `@game-designer` to activate this agent.

#### 🕹️ Game Developer (`@game-dev`)

**When to use:** Use for Game Developer tasks

**Activation:** Type `@game-dev` to activate this agent.

#### 📋 Product Manager (`@pm`)

**When to use:** Use for Product Manager tasks

**Activation:** Type `@pm` to activate this agent.

#### 📝 Product Owner (`@po`)

**When to use:** Use for Product Owner tasks

**Activation:** Type `@po` to activate this agent.

#### 🏃 Scrum Master (`@sm`)

**When to use:** Use for Scrum Master tasks

**Activation:** Type `@sm` to activate this agent.

#### 🧪 Master Test Architect (`@tea`)

**When to use:** Use for Master Test Architect tasks

**Activation:** Type `@tea` to activate this agent.

#### 🎨 UX Expert (`@ux-expert`)

**When to use:** Use for UX Expert tasks

**Activation:** Type `@ux-expert` to activate this agent.

---

## Available Tasks

### CORE Module Tasks

- **Adv Elicit** (`@task-adv-elicit`)
- **Index Docs** (`@task-index-docs`)
- **Shard Doc** (`@task-shard-doc`)
- **Validate Workflow** (`@task-validate-workflow`)
- **Workflow** (`@task-workflow`)

### BMM Module Tasks

- **Daily Standup** (`@task-daily-standup`)
- **Retrospective** (`@task-retrospective`)

---

## Usage Guidelines

1. **One agent at a time**: Activate a single agent for focused assistance
2. **Task execution**: Tasks are one-time workflows, not persistent personas
3. **Module organization**: Agents and tasks are grouped by their source module
4. **Context preservation**: Conversations maintain agent context

---

## Cursor Cloud specific instructions

### Architecture Overview

Chain Day is a React Native/Expo habit tracking app with a cloud-only backend:

- **Frontend**: React Native 0.81 + Expo SDK 54 (iOS, Android, Web)
- **Backend**: Convex (cloud BaaS - no self-hosted DB/Docker needed)
- **Auth**: Clerk (cloud auth provider)
- **Payments**: RevenueCat (optional, for premium features)

### Running the App

The Expo web dev server can be started without Convex/Clerk credentials (it will bundle but show a startup error in the browser):

```bash
bash scripts/expo-start.sh --web
```

The full `npm run dev` command requires valid `.env.local` with `EXPO_PUBLIC_CONVEX_URL` and `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`. It runs Convex dev sync + Expo web in parallel.

### Key Commands

| Action               | Command                                                                          |
| -------------------- | -------------------------------------------------------------------------------- |
| Install deps         | `npm install --legacy-peer-deps`                                                 |
| Run tests            | `npm test`                                                                       |
| TypeScript check     | `npx convex codegen --typecheck disable && npx tsc -p tsconfig.app.json -noEmit` |
| Start web dev server | `bash scripts/expo-start.sh --web`                                               |
| Format code          | `npm run format`                                                                 |

### Gotchas

- **`npm install` requires `--legacy-peer-deps`**: The `@eslint-react/eslint-plugin@3.0.0` package requires `eslint@^10` but the project uses `eslint@^9`. Without this flag, install fails with ERESOLVE errors.
- **ESLint config references `@factory/eslint-plugin`**: This is a private/internal package not available publicly. ESLint will fail to load the full config. TypeScript checking (`npx tsc`) works independently.
- **`.env.local` needed for dev server**: Copy `.env.example` to `.env.local` and fill in real Convex/Clerk values. The app bundles without them but won't render past the startup error.
- **`postinstall` runs `patch-package`**: No patches currently exist but the hook is active.
- **Pre-commit hook**: Runs `lint-staged` (eslint --fix + prettier) on staged files. Requires `npm run prepare` (husky) to be run once.
- **Convex codegen**: The `convex codegen` command generates types in `convex/_generated/`. Run it before TypeScript checks.

---

_Generated by BMAD Method installer for Codex CLI_
