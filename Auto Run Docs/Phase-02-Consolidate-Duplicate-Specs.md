# Phase 02: Consolidate Duplicate Specifications

This phase eliminates specification fragmentation by merging duplicate files and archiving deprecated versions. The codebase has numerous files with " 2", " 3", " 4" suffixes and scattered story variants that create confusion. Clean consolidation ensures a single source of truth for each spec.

## Tasks

- [ ] Create `docs/specs/archive/` directory for deprecated spec versions
- [ ] Move all files with " 2", " 3", " 4" numeric suffixes from root and src/ directories to `docs/specs/archive/duplicates/`
- [ ] Review story files in `docs/stories/4-needs-review/` and merge any that cover the same feature into single canonical versions
- [ ] For `home-page-redesign.story.md` - verify it's the canonical version and remove any duplicate story files covering the same scope
- [ ] Consolidate the multiple PRD files in `.taskmaster/docs/` - merge `habit-app-prd.md` content into a comprehensive `product-requirements.md`
- [ ] Update `ux-specification.md` to include any unique content from `ux-implementation-prd.md` and `create-habit-ux-spec.md`
- [ ] Create `docs/specs/architecture/` directory and move all technical specs (`tech-spec.md`, etc.) into it
- [ ] Create `docs/specs/design/` directory and move all design specs (`figma-design-spec.md`, `figma-components-spec.json`) into it
- [ ] Update MASTER-INDEX.md with new file locations after consolidation
- [ ] Delete empty directories left after file moves
- [ ] Run `git status` to verify all moves are tracked and no important files were accidentally removed
