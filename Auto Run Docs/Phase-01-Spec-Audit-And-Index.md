# Phase 01: Specification Audit & Master Index

This phase audits all existing BMAD specifications, stories, and PRDs to create a unified master index. By the end, you'll have a single source of truth document that maps every spec artifact, its status, and its relationships. This foundation enables all subsequent refinement work.

## Tasks

- [ ] Create `docs/specs/MASTER-INDEX.md` with header sections: PRDs, Architecture, Epics, Stories, Tasks, Design Specs
- [ ] Scan `.taskmaster/docs/` and catalog all PRD files with their titles, status (draft/active/deprecated), and line counts
- [ ] Scan `docs/stories/` across all status folders (1-needs-approve through 6-draft) and list every story with ID, title, and current status
- [ ] Scan `.taskmaster/tasks/tasks.json` and extract task categories (MVP, Post-MVP, MVP-iOS) with task counts and completion percentages
- [ ] Identify and list all duplicate/conflicting files (e.g., "story 2.md" vs "story 3.md" variants, files with " 2", " 3" suffixes)
- [ ] Create a dependency map section showing: Epic → Stories → Tasks relationships based on ID patterns (e.g., epic-1 → story 1.x → task 1.x.x)
- [ ] Add a "Gaps Identified" section listing stories without matching tasks and tasks without parent stories
- [ ] Add a "Refinement Queue" section with prioritized list of specs needing attention (incomplete, conflicting, or outdated)
- [ ] Generate summary statistics at the top: total PRDs, total stories by status, total tasks by status, coverage percentage
- [ ] Validate the master index by cross-referencing 3 random stories against their task mappings to confirm accuracy
