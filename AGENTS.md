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

## Project Patterns

- RevenueCat SDK v10 is installed as `react-native-purchases@10.4.2`; keep `com.android.vending.BILLING` in Expo Android permissions and verify Android API 23+ native builds plus one-time product consumable/non-consumable dashboard setup before restore testing.
- Convex is installed as `convex@1.42.1`; keep the matching package override in `package.json`, preserve the generated `components` export in `convex/_generated/api.js`, and review changelog notes before future SDK bumps.
- If `pod install` or `pod update` needs to run in the sandbox, redirect CocoaPods state with `HOME=/private/tmp/codex-cocoapods CP_HOME_DIR=/private/tmp/codex-cocoapods`; the current native project may still fail in React Native's SPM post-install hook before saving `Podfile.lock`.
- Sentry replay/profiling/logs are opt-in via `EXPO_PUBLIC_SENTRY_ENABLE_REPLAY`, `EXPO_PUBLIC_SENTRY_ENABLE_PROFILING`, and `EXPO_PUBLIC_SENTRY_ENABLE_LOGS`; keep screenshots, view hierarchy, default PII, failed-request capture, and automatic console-log capture disabled unless privacy/store-label review is repeated.
- Settings open timing content-ready marks must use the derived Settings modal loading state from `useHabitsSettings`, not only `SettingsModal` defaults, so unresolved settings/archive-count queries do not log as ready.
- Settings lazy boundaries must use the full-screen `SettingsModalLoadingFallback` shell with `SettingsModalSkeleton`; do not use `fallback={null}` for Settings code-split paths that run after the Settings button is tapped.
- Habit Library click-to-visible instrumentation uses `src/features/habits/templatesModalOpenPerformance.ts`: mark open intent from the bottom bar and modal state boundary, then capture first visible timing from `TemplatesModalSection`.
- Post-launch Habit Library preload lives in the frequent idle tier of `src/features/habits/postLaunchPreload.ts`: `TemplatesModalSection` and `TemplatesScreen` warm only after `homeReady`, while paywall/settings remain in the delayed secondary tier.
- Habit Library lazy fallback lives in `TemplatesModalFallback.tsx`: keep full-screen modal chrome outside the lazy `TemplatesModalSection` boundary and reuse `TemplatesLoadingState`.
- Advanced Options row geometry is centralized in `src/components/AdvancedOptions/advancedRowSpec.ts` (icon `36×36` / radius `11` / gap `12`, derived `advancedRowTextInset = 48`). All row heads (`StreakGoalSectionHead`, `GrowthIconsHead`) and the `StrengthCurveToggleRow` / `AdvancedOptionRow` share this so the icon column + text left-edge can't drift — never re-hardcode 32/r9/gap10 per head.

---

_Generated by BMAD Method installer for Codex CLI_
