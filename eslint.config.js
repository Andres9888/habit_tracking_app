import js from '@eslint/js';
import { createRequire } from 'node:module';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintReact from '@eslint-react/eslint-plugin';

const require = createRequire(import.meta.url);
const eslintComments = require('eslint-plugin-eslint-comments');
const factoryPlugin = require('@factory/eslint-plugin');
const factoryFrontend = require('@factory/eslint-plugin/configs/frontend');
const jestPlugin = require('eslint-plugin-jest');
const noBarrelFiles = require('eslint-plugin-no-barrel-files');
const reactCompiler = require('eslint-plugin-react-compiler');
const unusedImports = require('eslint-plugin-unused-imports');

const filterUnsupportedRules = (rules = {}) =>
  Object.fromEntries(
    Object.entries(rules).filter(
      ([ruleName]) => !ruleName.startsWith('import/')
    )
  );

const factoryRuleOverrides = {
  '@factory/constants-file-organization': 'off',
  '@factory/enum-file-organization': 'off',
  '@factory/errors-file-organization': 'off',
  '@factory/filename-match-export': 'warn',
  '@factory/no-exported-function-expressions': 'warn',
  '@factory/no-exported-string-union-types': 'off',
  '@factory/no-plain-html-text-elements': 'off',
  '@factory/structured-logging': 'off',
  '@factory/no-use-effect-in-hooks': 'off',
  '@factory/require-test-files': 'off',
  '@factory/require-tsx-test-stories-files': 'off',
  '@factory/test-file-location': 'off',
  '@factory/test-utils-organization': 'off',
  '@factory/types-file-organization': 'off',
  '@eslint-react/no-array-index-key': 'off',
  'class-methods-use-this': 'off',
  'no-barrel-files/no-barrel-files': 'off',
  'default-case': 'off',
  'no-restricted-globals': 'off',
  'no-restricted-syntax': 'off',
  'no-param-reassign': 'off',
  'prefer-promise-reject-errors': 'off',
  'react/button-has-type': 'off',
  'react/destructuring-assignment': 'off',
  'react/forbid-component-props': 'off',
  'react/forbid-dom-props': 'off',
  'react/jsx-max-depth': 'off',
  'react/jsx-filename-extension': 'off',
  'react/jsx-no-script-url': 'off',
  'react/no-danger': 'off',
  'react/no-danger-with-children': 'off',
  'react/no-unused-prop-types': 'off',
  'no-void': 'off',
  'react/prefer-stateless-function': 'off',
  'react/prop-types': 'off',
  'react-compiler/react-compiler': 'off',
};
const factoryFrontendRules = filterUnsupportedRules(factoryFrontend.rules);
const factoryFrontendOverrides = (factoryFrontend.overrides ?? []).map(
  ({ files, rules }) => ({
    files,
    plugins: { '@factory': factoryPlugin },
    rules: {
      ...filterUnsupportedRules(rules),
      ...factoryRuleOverrides,
    },
  })
);
const globalIgnores = [
  'dist',
  'eslint.config.js',
  'convex/_generated',
  'worktrees/**',
  '.worktrees/**',
  '**/worktrees/**',
  '**/.worktrees/**',
  'postcss.config.js',
  'tailwind.config.js',
  'App.tsx',
  '__tests__/**',
  '**/__tests__/**',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/tests/**',
  'docs/HabitHome-FigmaCode/**',
  'e2e/**',
  '.next/**',
  '**/.next/**',
  'website/**',
  'vite.config.ts',
];
const sourceIgnores = [
  ...globalIgnores,
  '**/website/**',
  'build/**/*',
  'coverage/**/*',
];

export default tseslint.config(
  {
    ignores: globalIgnores,
  },
  {
    linterOptions: { reportUnusedDisableDirectives: 'warn' },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: sourceIgnores,
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        FileSystemDirectoryHandle: true,
        FileSystemFileHandle: true,
        FileSystemHandle: true,
        FileSystemHandlePermissionDescriptor: true,
        FileSystemPermissionMode: true,
        FileSystemWritableFileStream: true,
        NodeJS: true,
        globalThis: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: ['./tsconfig.app.json', './convex/tsconfig.json'],
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    plugins: {
      '@eslint-react': eslintReact,
      '@factory': factoryPlugin,
      '@typescript-eslint': tseslint.plugin,
      'eslint-comments': eslintComments,
      jest: jestPlugin,
      'no-barrel-files': noBarrelFiles,
      react,
      'react-compiler': reactCompiler,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    settings: {
      ...factoryFrontend.settings,
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...factoryFrontendRules,
      ...factoryRuleOverrides,
    },
  },
  ...factoryFrontendOverrides,
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      unicorn.configs.recommended,
      prettierConfig,
    ],
    files: ['**/*.{ts,tsx}'],
    ignores: sourceIgnores,
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './convex/tsconfig.json'],
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'sort-keys-fix': sortKeysFix,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
      'react/jsx-sort-props': 'off',
      // All of these overrides ease getting into
      // TypeScript, and can be removed for stricter
      // linting down the line.

      // Only warn on unused variables, and ignore variables starting with `_`
      '@typescript-eslint/no-unused-vars': 'off',

      // Allow escaping the compiler
      '@typescript-eslint/ban-ts-comment': 'error',

      // Allow explicit `any`s
      '@typescript-eslint/no-explicit-any': 'off',

      // START: Allow implicit `any`s
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      // END: Allow implicit `any`s

      // Allow async functions without await
      // for consistency (esp. Convex `handler`s)
      '@typescript-eslint/require-await': 'off',

      // Console warnings for production code
      'no-console': 'off',

      // === Code Readability Initiative ===
      // File size limit - 100 lines max for PR-readable code
      // See: docs/DECOMPOSITION_PATTERNS.md for refactoring guidance
      // Status: "error" - all production files now comply with 100-line limit
      'max-lines': [
        'error',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      // Function size limit - keep functions focused and testable
      'max-lines-per-function': [
        'warn',
        { max: 40, skipBlankLines: true, skipComments: true },
      ],

      // Import organization (manual guidelines)
      // Recommended order:
      // 1. React/React Native imports
      // 2. Third-party libraries
      // 3. Convex imports
      // 4. Local absolute imports (@/)
      // 5. Local relative imports (../, ./)
      // 6. Type imports (keep separate)

      // Additional TypeScript safety
      complexity: ['warn', 10],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off', // RevenueCat SDK has type mismatches
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-imports': 'warn',

      // React Native specific
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': 'off',

      // Sort object keys alphabetically (auto-fixable)
      'sort-keys-fix/sort-keys-fix': 'off',

      // Unicorn adjustments for React Native compatibility
      'unicorn/prefer-module': 'off', // CommonJS needed for some RN configs
      'unicorn/prevent-abbreviations': 'off', // Allow common abbreviations (props, ref, etc)
      'unicorn/filename-case': 'off', // React components use PascalCase
      'unicorn/no-null': 'off', // null is valid in React/RN
      'unicorn/prefer-top-level-await': 'off', // Not always supported
      'unicorn/no-array-sort': 'off', // toSorted() not supported in React Native (ES2023)
      'unicorn/no-array-reverse': 'off', // toReversed() not supported in React Native (ES2023)
    },
  },
  // === max-lines Rule Exemptions ===
  // Data files: Static data arrays/objects that are inherently large
  // Example/Debug files: Development utilities not subject to production constraints
  // Schema files: Database schema definitions (data contracts, not logic)
  // Note: These need explicit paths to work with flat config
  {
    files: [
      // Data files - static emoji, template, and configuration data
      '**/emojiData/categories.ts',
      '**/emojiData/keywords.ts',
      '**/emojiKeywords/habitNameMap.ts',
      '**/emojiKeywords/keywords.ts',
      '**/templatesDataSeed.ts',
      '**/templates/curatedEnrichment.ts',
      '**/templates/curatedSeedTemplates.ts',
      '**/SmartSuggestions/suggestions.data.ts', // Curated habit suggestions array
      '**/templates/youtubeLinks.data.ts', // YouTube links mapping for 280+ habit templates
      '**/templates/scienceEnrichment.data.ts', // Authored science drill-down copy per template
      '**/templates/scienceEnrichment/*.data.ts', // Per-category authored drill-down copy
      '**/TipQuickActionsSheet/quickActionsByType.ts', // Quick action configurations
      '**/constants/habitEmojis.data.ts', // Static emoji category data arrays
      '**/constants/habitEmojis.ts', // Emoji category exports (mostly re-exports)
      // Schema files - database schema definitions (data contracts)
      '**/convex/schema.ts',
      // Example and debug files - development utilities
      '**/*Example.tsx',
      '**/*Example.ts',
      '**/*Debug.tsx',
      '**/*Debug.ts',
      '**/examples/**/*.{ts,tsx}',
      // Diagnostic/test components (not unit tests - those are in __tests__)
      'src/components/HapticTest.tsx',
      'src/components/NativeWindTest.tsx',
      // Deprecated components (scheduled for removal)
      '**/ProgressSection/PersonalBestsCard.tsx',
      // CalendarTimeline variant implementations (A/B testing experiments)
      '**/CalendarTimeline/CalendarTimelineWithPulse.tsx',
      '**/CalendarTimeline/CalendarTimelineWithEdgeFade.tsx',
      '**/CalendarTimeline/CalendarTimelineComparison.tsx',
      // Theme files - large style configurations
      '**/theme/index.ts',
      // Test setup files - configuration, not production code
      '**/jest.setup.js',
      // External tooling - not production app code
      '**/figma-mcp-server.js',
      // Duplicate/backup files (should be cleaned up but exempt for now)
      '**/affirmations 2.ts',
      '**/habitStrength.test 2.ts',
      '**/visionBoard 2.ts',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  // === Design-System Lint Guards — long-haul metrics (warn) ===
  // Rules with many pre-existing violations; tracked as warnings, not build-blockers.
  // Fix opportunistically as files are touched. Graduate to error once count → 0.
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [...sourceIgnores, '**/theme/**'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: "Property[key.name='fontSize'][value.type='Literal']",
          message:
            'Use typography tokens from @/theme/typography instead of raw fontSize values',
        },
        {
          selector:
            'Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
          message:
            'Use color tokens from @/theme/colors instead of raw hex values',
        },
      ],
    },
  },
  // Haptics guard: route all haptic feedback through the wrapper so reduce-motion
  // and the global enabled/intensity settings apply. The wrapper itself is exempt.
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [...sourceIgnores, '**/utils/haptics/**'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'expo-haptics',
              message:
                'Use triggerHaptic / useHaptics / HapticPatterns from @/utils/haptics instead of raw expo-haptics, so reduce-motion and intensity settings apply.',
            },
          ],
        },
      ],
    },
  },
  // === Design-System Lint Guards — ratcheted (error) ===
  // Violations have been eliminated; these rules now hard-fail to prevent regression.
  // NOTE: ESLint flat config merges rules per-file and the last matching block wins.
  // This 'error' block overrides the 'warn' block above for no-restricted-syntax.
  // fontSize/hex enforcement is intentionally in the warn block above; re-add here
  // once a custom plugin supports per-selector severity (or violations reach zero).
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [...sourceIgnores, '**/theme/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.property.name='springify']",
          message:
            'Use .easing(enterEasing) instead of .springify() for entrance animations. See src/theme/animations.ts',
        },
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/shadow-sm|shadow-md|shadow-lg|shadow-xl|shadow-2xl/]",
          message:
            'Use theme shadow tokens (shadows.*) instead of Tailwind shadow-* classes. See src/theme/spacing.ts',
        },
        {
          selector:
            "ObjectExpression:has(> Property[key.name='damping']):has(> Property[key.name='stiffness'])",
          message:
            'Use spring presets from @/theme/animations (springs.*) instead of inline {damping, stiffness} configs',
        },
        {
          selector: "Property[key.name='borderRadius'][value.value=9999]",
          message: 'Use borderRadius.full from theme instead of 9999',
        },
      ],
    },
  }
);
