# Phase 03: Story-to-Task Traceability

This phase establishes bidirectional links between stories and TaskMaster tasks. Currently, tasks exist in isolation from stories, making it difficult to track implementation against requirements. This creates a clear thread from requirement to implementation.

## Tasks

- [ ] Add `relatedTasks` field to each story file's frontmatter listing the TaskMaster task IDs that implement it
- [ ] Update `.taskmaster/tasks/tasks.json` to add `storyId` field to each task linking back to its parent story
- [ ] Create `docs/specs/TRACEABILITY-MATRIX.md` with a table: Story ID | Story Title | Task IDs | Implementation Status | Test Coverage
- [ ] For Story 1.1 (habit-home-page-redesign): identify and link all related tasks from tasks.json
- [ ] For Story 1.2 (compact-mode-for-habit-cards): identify and link all related tasks or create placeholder task entries
- [ ] For each Epic in `docs/stories/`: add an `_epic-summary.md` file listing all child stories and their aggregate status
- [ ] Add acceptance criteria IDs (AC-1, AC-2, etc.) to each story's acceptance criteria for precise reference
- [ ] Create cross-reference comments in key implementation files linking to their story IDs (e.g., `// Implements Story 1.2 AC-3`)
- [ ] Update MASTER-INDEX.md dependency map section with the new bidirectional links
- [ ] Validate traceability by selecting 2 completed tasks and verifying they link to stories with matching acceptance criteria
