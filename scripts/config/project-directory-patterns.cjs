const path = require('node:path');

const PROJECT_ARTIFACT_DIRECTORIES = Object.freeze([
  'worktrees',
  '.worktrees',
  '.clonk-worktrees',
  'website/.next',
]);

const BUNDLE_EXCLUDED_DIRECTORIES = Object.freeze([
  '__tests__',
  'coverage',
  '.git',
  '.taskmaster',
  '.claude',
  'design-mockups',
  'HabitHome-FigmaCode',
  ...PROJECT_ARTIFACT_DIRECTORIES,
  'superdesign',
  '.superdesign',
]);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapePath(value) {
  return value
    .split(/[\\/]+/)
    .map(escapeRegex)
    .join('[/\\\\]');
}

function createRootedDirectoryPattern(rootDir, relativeDirectory) {
  const absoluteDirectory = path.resolve(rootDir, relativeDirectory);
  return new RegExp(`^${escapePath(absoluteDirectory)}(?:[/\\\\]|$)`);
}

function createJestRootPatterns() {
  return PROJECT_ARTIFACT_DIRECTORIES.map(
    (directory) => `<rootDir>/${directory}/`
  );
}

function createMetroBlockList(projectRoot) {
  return BUNDLE_EXCLUDED_DIRECTORIES.map((directory) =>
    createRootedDirectoryPattern(projectRoot, directory)
  );
}

module.exports = {
  createJestRootPatterns,
  createMetroBlockList,
  PROJECT_ARTIFACT_DIRECTORIES,
};
