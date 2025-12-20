# Phase 06: TaskMaster Task Refinement

This phase improves TaskMaster task quality by adding story links, clarifying descriptions, and ensuring proper dependency chains. Well-defined tasks with clear context enable faster autonomous implementation by AI agents.

## Tasks

- [ ] Run `task-master validate-dependencies` to identify any circular or missing dependencies in tasks.json
- [ ] Run `task-master fix-dependencies` if validation finds issues
- [ ] Update each MVP task (1-11) to include `storyId` reference linking to parent story
- [ ] Expand task descriptions for vague tasks - ensure each task has: clear deliverable, file paths affected, acceptance criteria summary
- [ ] Review MVP-iOS refactoring tasks and add specific component file paths for the hook extraction pattern (e.g., `src/components/SettingsModal/useSettingsModalLogic.ts`)
- [ ] Add implementation notes to edge-case handling subtasks (Story 1.2.1) with code patterns to follow
- [ ] Prioritize Post-MVP tasks (25 total) into P0 (revenue-critical), P1 (user-retention), P2 (nice-to-have) categories
- [ ] Create dependency chain for critical path: Authentication → Onboarding → Core Habit Management → Analytics
- [ ] Add `testStrategy` field to each task indicating unit test, integration test, or manual test requirements
- [ ] Run `task-master generate` to regenerate task markdown files with updated metadata
- [ ] Update MASTER-INDEX.md task statistics with new categorization and priority breakdown
