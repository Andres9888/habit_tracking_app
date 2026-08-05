# Phase 06: Token Enforcement & Verification

**Goal:** Add ESLint rules to prevent future token drift, verify all changes from phases 01-05 are working, and run the full test suite.

**Context:** The root cause of design drift is that the token system is opt-in with no enforcement. Without automated checks, hardcoded values will reoccur after every manual cleanup pass (as evidenced by the March 5 consolidation leaving 60+ remaining bypasses). This phase adds guardrails.

---

- [ ] **Add ESLint rule to warn on hardcoded animation durations**: Create a custom ESLint rule or use `no-restricted-syntax` in `eslint.config.js` to warn when `duration:` appears with a numeric literal inside `withTiming` calls. The rule should suggest using `durations.*` tokens instead. Example config: `'no-restricted-syntax': ['warn', { selector: 'Property[key.name="duration"][value.type="Literal"]', message: 'Use durations.* tokens from @/theme/animations instead of hardcoded values' }]`. This should be a warning (not error) initially to avoid blocking PRs for edge cases. Add exemptions for test files and `src/theme/animations.ts` (where tokens are defined).

- [ ] **Add ESLint rule to warn on hardcoded hex colors in style objects**: Add `no-restricted-syntax` rule targeting string literals matching hex color patterns (`/#[0-9a-fA-F]{6}/`) inside objects with style-related property names (backgroundColor, color, borderColor, shadowColor, etc.). Warning message: 'Use colors.* tokens from @/theme/colors instead of hardcoded hex values'. Exempt: `src/theme/` directory (token definitions), test files, and `*.colors.ts` files (domain-specific color definitions). This should be a warning initially.

- [ ] **Add ESLint rule to warn on hardcoded borderRadius numeric literals**: Add `no-restricted-syntax` targeting `Property[key.name="borderRadius"][value.type="Literal"]` with message 'Use borderRadius.* tokens from @/theme/spacing'. Exempt `src/theme/` directory and test files.

- [ ] **Run full lint check and verify no new errors introduced**: Run `npx eslint src/ --max-warnings=999 2>&1 | head -100` to check for any errors (not warnings) introduced by phases 01-05. Fix any actual errors. The new rules should be warnings only, so they won't block.

- [ ] **Run TypeScript type check**: Run `npx tsc --noEmit 2>&1 | head -50` to verify no type errors were introduced by the token replacements and module consolidations. Fix any type errors found.

- [ ] **Run test suite for modified components**: Run tests for the key modified areas: `npx jest --testPathPattern="(animation|theme|HabitCard|DraggableHabit|HabitStrength|MilestoneCelebration|ArchiveUndo|DeleteUndo|EmojiPicker|StrengthRing|StrengthProgressBar)" --passWithNoTests 2>&1 | tail -30`. Fix any failing tests. If tests reference hardcoded values that were replaced with tokens, update the test expectations too.

- [ ] **Generate lint report for remaining design token violations**: Run `npm run lint:max-lines-report 2>/dev/null; npx eslint src/ --format json 2>/dev/null | head -200` to generate a baseline report of remaining warnings from the new rules. This establishes the "debt backlog" count for tracking progress over time. Save the count in a comment at the bottom of this file for reference.

- Human verification (not a checkbox):
  - Visually verify the app renders correctly on iOS simulator
  - Check that animations feel the same (token values should match the hardcoded values they replaced)
  - Verify web rendering matches native after CSS alignment changes
