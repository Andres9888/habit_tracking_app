# Stories Folder Structure

This directory contains all user stories organized by their development status.

## Folder Structure (Workflow Order)

```
stories/
├── 1-needs-approve/    # Stories requiring approval before development
├── 2-approved/         # Stories approved and ready for development
├── 3-in-progress/      # Stories currently being developed
├── 4-needs-review/     # Stories completed and pending review
├── 5-completed/        # Stories fully completed and approved
└── 6-draft/            # Stories in draft status (not yet approved)
```

## Status Descriptions

### needs-approve
Stories that need stakeholder review and approval before moving to development.

### draft
Stories being written or refined. Not ready for development or approval.

### approved
Stories that have been approved and are ready for development by the dev team.

### in-progress
Stories currently being implemented by developers.

### needs-review
Stories completed by development and pending QA/review approval.

### completed
Stories that have been fully implemented, tested, and approved.

## Current Status Summary

- **needs-approve:** 0 stories
- **draft:** 15 stories
- **approved:** 1 story
- **in-progress:** 1 story
- **needs-review:** 0 stories
- **completed:** 0 stories

## Story Naming Convention

Stories follow the naming pattern: `{ID}-{story-title}.story.md`

## Workflow Process (Linear Flow)

1. **Needs Approval** (1-needs-approve/) → Stories requiring stakeholder review and approval
2. **Approved** (2-approved/) → Stories approved and ready for development
3. **In Progress** (3-in-progress/) → Development begins, stories being implemented
4. **Needs Review** (4-needs-review/) → Development complete, ready for QA
5. **Completed** (5-completed/) → After QA approval, stories are fully complete
6. **Draft** (6-draft/) → Stories in draft status (not yet ready for approval)

*Note: Stories typically start in Draft (6-draft/) and move to Needs Approval (1-needs-approve/) for review.*

## Development Priority

Stories should be developed in this order:
1. Complete any stories in `in-progress/`
2. Work on stories in `approved/` (based on priority)
3. Stories in `draft/` need approval before development

## Current Ready for Development

**approved/1.2-compact-mode-for-habit-cards.story.md**
- Status: Approved ✅
- Priority: P0-Critical
- Ready for immediate development

**in-progress/1.1-habit-home-page-redesign-with-emoji-support.story.md**
- Status: 80% Complete (Quality Enhancement Phase)
- Priority: P0-Critical
- Needs quality improvements: tests, cleanup, accessibility