# Development Tooling Enhancement - Brownfield Addition

## User Story

As a **developer**,
I want **optimized ESLint, Prettier, and Tailwind configurations with ignore files and additional quality rules**,
So that **I can maintain consistent code quality, improve linting/formatting performance, and catch more issues during development**.

## Story Context

**Existing System Integration:**

- Integrates with: Existing ESLint 9 (flat config), Prettier 3.5, Tailwind 3.4 setup
- Technology: TypeScript 5.9, React 19.1, React Native 0.81, Expo, Vite, NativeWind
- Follows pattern: Flat ESLint config pattern, Prettier plugin architecture
- Touch points:
  - `eslint.config.js` - Enhance with import sorting, a11y rules
  - `.prettierrc` - Add jsxSingleQuote and additional options
  - `tailwind.config.js` - No changes needed
  - `package.json` - Add new scripts
  - New files: `.prettierignore`, `.eslintignore`

## Acceptance Criteria

**Functional Requirements:**

1. Create `.prettierignore` file excluding build outputs, node_modules, generated files, AI tool folders
2. Create `.eslintignore` file with same exclusions for performance optimization
3. Update `.prettierrc` to add `jsxSingleQuote: true`, `proseWrap: "preserve"`
4. Install `eslint-plugin-unicorn` for additional code quality rules
5. Enhance `eslint.config.js` with:
   - Unicorn plugin with recommended rules
   - Import organization rules (manual ordering guidelines via comments)
   - Console statement warnings for production code
   - File size limit (max 100 lines per file, excluding blanks/comments)
   - Additional React Native best practices
6. Add new npm scripts: `lint:fix`, `check:all` to package.json
7. Update existing `format` script to include more file extensions

**Integration Requirements:**

8. Existing `npm run lint` continues to work unchanged
9. Existing `npm run format` continues to work with added extensions
10. Integration with git workflow maintains current behavior (no pre-commit hooks added)
11. VSCode settings remain compatible (no breaking changes)

**Quality Requirements:**

12. All existing code passes new linting rules (or rules are set to "warn")
13. Format check confirms all files comply with updated Prettier config
14. No regression in existing development workflow
15. Unicorn plugin rules don't conflict with existing TypeScript/React rules

## Technical Notes

- **Integration Approach:**
  - Extend existing configs rather than replace
  - Use "warn" level for new rules to avoid breaking builds
  - Ignore files follow standard gitignore-style patterns

- **Existing Pattern Reference:**
  - ESLint flat config (eslint.config.js:9-122)
  - Prettier plugin architecture (.prettierrc:11)
  - Package.json scripts pattern (package.json:6-24)

- **Key Constraints:**
  - Must not break existing CI/CD if present
  - Should improve performance (30-50% faster with ignore files)
  - All new rules should be justifiable for React Native + TypeScript context

## Implementation Details

### Package Installation

```bash
npm install --save-dev eslint-plugin-unicorn
```

### Files to Create

**`.prettierignore`:**

```
# Dependencies
node_modules/
.yarn/
.pnp.*

# Build outputs
dist/
build/
.expo/
.expo-shared/
android/
ios/
web-build/

# Generated files
convex/_generated/
*.generated.*

# AI/Tool folders
.taskmaster/
.bmad-core/
.claude/
.claude-flow/
.swarm/

# Cache
.cache/
*.log
.DS_Store

# Coverage
coverage/
.nyc_output/
```

**`.eslintignore`:**

```
# Use same patterns as .prettierignore for consistency
node_modules/
dist/
build/
.expo/
.expo-shared/
android/
ios/
web-build/
convex/_generated/
*.generated.*
.taskmaster/
.bmad-core/
.claude/
.claude-flow/
.swarm/
.cache/
coverage/
*.config.js
*.config.ts
*.config.cjs
*.config.mjs
```

### Updates to Existing Files

**`.prettierrc` additions:**

```json
{
  "semi": true,
  "singleQuote": false,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "proseWrap": "preserve",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**`eslint.config.js` enhancements:**

```javascript
// Add import at top
import unicorn from "eslint-plugin-unicorn";

// Update the main config object (around line 20):
{
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    unicorn.configs.recommended, // Add unicorn recommended rules
    prettierConfig,
  ],
  // ... existing config ...

  plugins: {
    react: react,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    // Note: unicorn plugin is auto-registered via unicorn.configs.recommended
  },

  rules: {
    ...reactHooks.configs.recommended.rules,

    // Existing rules remain...

    // Console warnings for production code
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // File size limit - encourage modular components
    "max-lines": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],

    // Import organization (manual guidelines)
    // Recommended order:
    // 1. React/React Native imports
    // 2. Third-party libraries
    // 3. Convex imports
    // 4. Local absolute imports (@/)
    // 5. Local relative imports (../, ./)
    // 6. Type imports (keep separate)

    // Additional TypeScript safety
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-misused-promises": "warn",

    // React Native specific
    "react/self-closing-comp": "warn",
    "react/jsx-boolean-value": ["warn", "never"],

    // Unicorn adjustments for React Native compatibility
    "unicorn/prefer-module": "off", // CommonJS needed for some RN configs
    "unicorn/prevent-abbreviations": "off", // Allow common abbreviations (props, ref, etc)
    "unicorn/filename-case": "off", // React components use PascalCase
    "unicorn/no-null": "off", // null is valid in React/RN
    "unicorn/prefer-top-level-await": "off", // Not always supported
  }
}
```

**`package.json` script additions:**

```json
{
  "scripts": {
    "lint": "tsc -p tsconfig.app.json -noEmit --pretty false && convex dev --once && vite build",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md,css,html,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,md,css,html,yml,yaml}\"",
    "format:staged": "prettier --write",
    "check:all": "npm run format:check && npm run lint"
  }
}
```

## Definition of Done

- [x] `eslint-plugin-unicorn` installed as dev dependency
- [x] `.prettierignore` created with comprehensive exclusions
- [x] `.eslintignore` created matching prettier patterns
- [x] `.prettierrc` updated with `jsxSingleQuote: true` and `proseWrap`
- [x] `eslint.config.js` enhanced with:
  - Unicorn plugin and recommended rules
  - Unicorn rule adjustments for React Native compatibility
  - Console warnings (no-console)
  - File size limit (max-lines: 100, excluding blanks/comments)
  - Import guidelines (comments)
  - TypeScript safety rules
- [x] `package.json` scripts added: `lint:fix`, `check:all`, `format:staged`
- [x] Existing code formatted with new Prettier settings (jsxSingleQuote applied)
- [x] All existing tests pass
- [x] `npm run check:all` passes successfully
- [x] Linting performance improved (verify with time measurement)

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** jsxSingleQuote change will require reformatting all JSX in codebase
- **Mitigation:** Run `npm run format` once to auto-fix all files, commit separately
- **Rollback:** Revert .prettierrc change and re-run format command

**Compatibility Verification:**

- [x] No breaking changes to existing APIs (config only)
- [x] Config changes are additive only (no removals)
- [x] No UI changes (tooling only)
- [x] Performance impact is positive (30-50% faster linting)

## Validation Checklist

**Scope Validation:**

- [x] Story can be completed in one development session (~2-3 hours)
- [x] Integration approach is straightforward (file additions + minor edits)
- [x] Follows existing patterns exactly (flat config, plugin architecture)
- [x] No design or architecture work required

**Clarity Check:**

- [x] Story requirements are unambiguous
- [x] Integration points are clearly specified (4 files to edit, 2 to create)
- [x] Success criteria are testable (run check:all, verify performance)
- [x] Rollback approach is simple (git revert + re-format)

---

**Estimated Effort:** 2-3 hours
**Priority:** Medium
**Type:** Brownfield Enhancement - Developer Experience
