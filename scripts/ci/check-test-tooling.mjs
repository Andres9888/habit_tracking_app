import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { minimatch } from 'minimatch';

import jestConfig from '../../jest.config.js';
import scenarioJestConfig from '../../tests/e2e-scenarios/jest.scenarios.config.cjs';
import projectDirectoryPatterns from '../config/project-directory-patterns.cjs';

const { createMetroBlockList } = projectDirectoryPatterns;
const requireFromProject = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const normalizedProjectRoot = projectRoot.replaceAll(path.sep, '/');
const sampleSourcePath = path.join(projectRoot, 'src', 'tooling-check.ts');
const sampleTestPath = `${normalizedProjectRoot}/src/tooling-check.test.ts`;
const nestedArtifactTestPath = `${normalizedProjectRoot}/worktrees/example/test.ts`;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesJestPath(pattern, filePath) {
  const expandedPattern = pattern.replaceAll(
    '<rootDir>',
    escapeRegex(normalizedProjectRoot)
  );
  return new RegExp(expandedPattern).test(filePath);
}

function assertResolvableJestTransforms(transforms) {
  for (const [pattern, definition] of Object.entries(transforms ?? {})) {
    const transformer = Array.isArray(definition) ? definition[0] : definition;
    if (typeof transformer !== 'string') {
      throw new Error(`Jest transform ${pattern} has no module name`);
    }
    try {
      requireFromProject.resolve(transformer);
    } catch (error) {
      throw new Error(
        `Jest transform ${pattern} cannot resolve ${transformer}`,
        {
          cause: error,
        }
      );
    }
  }
}

const ignoreGroups = [
  ['testPathIgnorePatterns', jestConfig.testPathIgnorePatterns],
  ['modulePathIgnorePatterns', jestConfig.modulePathIgnorePatterns],
  ['watchPathIgnorePatterns', jestConfig.watchPathIgnorePatterns],
];

const blockingJestPatterns = ignoreGroups.flatMap(([name, patterns]) =>
  patterns
    .filter((pattern) => matchesJestPath(pattern, sampleTestPath))
    .map((pattern) => `${name}: ${pattern}`)
);

if (blockingJestPatterns.length > 0) {
  throw new Error(
    `Jest ignores this checkout's source tree:\n${blockingJestPatterns.join('\n')}`
  );
}

if (
  !jestConfig.testPathIgnorePatterns.some((pattern) =>
    matchesJestPath(pattern, nestedArtifactTestPath)
  )
) {
  throw new Error('Jest does not ignore project-local worktree artifacts');
}

const metroBlockList = createMetroBlockList(projectRoot);
const blockingMetroPatterns = metroBlockList.filter((pattern) =>
  pattern.test(sampleSourcePath)
);

if (blockingMetroPatterns.length > 0) {
  throw new Error(
    `Metro ignores this checkout's source tree:\n${blockingMetroPatterns.join('\n')}`
  );
}

const nestedArtifactSourcePath = path.join(
  projectRoot,
  'worktrees',
  'example',
  'index.ts'
);

if (!metroBlockList.some((pattern) => pattern.test(nestedArtifactSourcePath))) {
  throw new Error('Metro does not ignore project-local worktree artifacts');
}

if (!minimatch('src/example.test.ts', '**/*.{ts,tsx}')) {
  throw new Error(
    'minimatch brace expansion is incompatible with this install'
  );
}

assertResolvableJestTransforms(scenarioJestConfig.transform);

console.log('Project tooling checks passed');
