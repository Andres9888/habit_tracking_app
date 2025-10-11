# User Story: Add Prettier Configuration - Brownfield Addition

## User Story

As a **developer**,
I want **Prettier and ESLint properly configured to work together**,
So that **code formatting is consistent and automated across the project**.

## Story Context

**Existing System Integration:**

- Integrates with: Existing ESLint setup (`eslint.config.js`)
- Technology: ESLint 9.x (flat config), Prettier 3.x, TypeScript 5.x
- Follows pattern: Modern JavaScript tooling configuration
- Touch points:
  - `package.json` (scripts)
  - `eslint.config.js` (needs prettier integration)
  - Root config files (new `.prettierrc` and `.prettierignore`)

## Acceptance Criteria

**Functional Requirements:**

1. Create `.prettierrc` configuration with project-appropriate settings
2. Create `.prettierignore` to exclude generated/build files
3. Add `eslint-config-prettier` to prevent ESLint/Prettier rule conflicts
4. Add format scripts to `package.json` (`format`, `format:check`)

**Integration Requirements:**

5. Existing ESLint configuration continues to work unchanged
6. New Prettier config follows React/TypeScript best practices
7. Integration with existing lint script maintains current behavior

**Quality Requirements:**

8. Prettier can format all TypeScript/JavaScript/TSX files successfully
9. No conflicts between ESLint and Prettier rules
10. Documentation added to README or relevant docs (if applicable)

## Technical Notes

- **Integration Approach:**
  - Add `eslint-config-prettier` as last item in ESLint extends array to disable conflicting rules
  - Prettier config should match team preferences (suggest: semi, single quotes, 2-space indent for React)
  - Use `.prettierignore` to skip `node_modules`, `dist`, `convex/_generated`, etc.

- **Existing Pattern Reference:**
  - ESLint uses flat config format (modern approach)
  - TypeScript strict mode with some relaxed rules for developer experience
  - Multiple tsconfig files for different contexts (app, node, convex)

- **Key Constraints:**
  - Must not break existing lint script
  - Should work with TypeScript, TSX, JavaScript, JSON, Markdown
  - Must be compatible with React Native and Vite tooling

## Definition of Done

- [ ] `.prettierrc` config file created with appropriate settings
- [ ] `.prettierignore` file created excluding build/generated files
- [ ] `eslint-config-prettier` installed and integrated into `eslint.config.js`
- [ ] `format` and `format:check` scripts added to `package.json`
- [ ] All existing files can be formatted without errors
- [ ] No ESLint/Prettier rule conflicts exist
- [ ] Existing lint script still passes
- [ ] README or docs updated with formatting instructions (if applicable)

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Prettier auto-formatting changes many files, could create large diff
- **Mitigation:** Run `npm run format:check` first to preview changes; format in separate commit
- **Rollback:** Remove config files, uninstall eslint-config-prettier, remove scripts

**Compatibility Verification:**

- [ ] No breaking changes to existing APIs
- [ ] Configuration changes are additive only (new files + package.json scripts)
- [ ] ESLint integration follows best practice (eslint-config-prettier)
- [ ] Performance impact is negligible (formatting is opt-in via scripts)

## Implementation Checklist

**Scope Validation:**

- [x] Story can be completed in one development session (≤4 hours)
- [x] Integration approach is straightforward (standard Prettier + ESLint setup)
- [x] Follows existing patterns exactly (modern flat config, TypeScript tooling)
- [x] No design or architecture work required

**Clarity Check:**

- [x] Story requirements are unambiguous
- [x] Integration points are clearly specified (eslint.config.js, package.json)
- [x] Success criteria are testable (run format scripts, check for conflicts)
- [x] Rollback approach is simple (remove added files and config)

## Summary

This story adds Prettier configuration to the existing codebase with proper ESLint integration.

**Implementation Steps:**

1. Install `eslint-config-prettier`
2. Create `.prettierrc` and `.prettierignore`
3. Update `eslint.config.js` to extend prettier config
4. Add format scripts to `package.json`
5. **ENHANCEMENT:** Add Tailwind CSS class sorting via `prettier-plugin-tailwindcss`
6. **ENHANCEMENT:** Add alphabetical JSX prop sorting via `eslint-plugin-react`

**Estimated Effort:** 1-2 hours
**Files to Create:** 2 (`.prettierrc`, `.prettierignore`)
**Files to Modify:** 2 (`package.json`, `eslint.config.js`)

## Enhancements Added

### Tailwind Class Sorting

- **Plugin:** `prettier-plugin-tailwindcss`
- **Benefit:** Automatically sorts Tailwind classes in the recommended order
- **Usage:** Runs automatically with `npm run format`

### JSX Prop Sorting

- **Plugin:** `eslint-plugin-react`
- **Rule:** `react/jsx-sort-props`
- **Configuration:**
  - Alphabetical sorting (case-insensitive)
  - Shorthand props first
  - Reserved props (key, ref) first
  - Callbacks last
- **Enforcement:** Warnings during lint/development
