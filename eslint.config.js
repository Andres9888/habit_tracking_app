import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'eslint.config.js',
      'convex/_generated',
      'postcss.config.js',
      'tailwind.config.js',
      'App.tsx',
      'index.ts',
      '__tests__/**',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      'docs/HabitHome-FigmaCode/**',
      'e2e/**',
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      unicorn.configs.recommended,
      prettierConfig,
    ],
    files: ['**/*.{ts,tsx}'],
    ignores: ['src/main.tsx'],
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
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      // All of these overrides ease getting into
      // TypeScript, and can be removed for stricter
      // linting down the line.

      // Only warn on unused variables, and ignore variables starting with `_`
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],

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
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // === Code Readability Initiative ===
      // File size limit - 100 lines max for PR-readable code
      // See: docs/DECOMPOSITION_PATTERNS.md for refactoring guidance
      // Current status: "warn" during migration, will become "error" after Phase 5
      'max-lines': [
        'warn',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      // Function size limit - keep functions focused and testable
      'max-lines-per-function': [
        'warn',
        { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
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
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',

      // React Native specific
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],

      // Sort object keys alphabetically (auto-fixable)
      'sort-keys-fix/sort-keys-fix': [
        'warn',
        'asc',
        { caseSensitive: false, natural: true },
      ],

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
  {
    files: [
      // Data files - static emoji, template, and configuration data
      '**/emojiData/categories.ts',
      '**/emojiKeywords/habitNameMap.ts',
      '**/emojiKeywords/keywords.ts',
      '**/templatesDataSeed.ts',
      // Example and debug files - development utilities
      '**/*Example.tsx',
      '**/*Example.ts',
      '**/*Debug.tsx',
      '**/*Debug.ts',
      '**/examples/**',
      // Theme files - large style configurations
      '**/theme/index.ts',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  }
);
