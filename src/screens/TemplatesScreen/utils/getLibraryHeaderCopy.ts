/**
 * Context-aware header copy for the Habit Library main browse view.
 */

export interface LibraryHeaderCopy {
  subtitle: string;
  title: string;
}

export function getLibraryHeaderCopy(
  isFirstTimeUser: boolean,
  sessionImportCount: number
): LibraryHeaderCopy {
  if (isFirstTimeUser) {
    return {
      subtitle: 'Science-backed habits to start your transformation.',
      title: 'What do you want to work on?',
    };
  }

  if (sessionImportCount > 0) {
    const label =
      sessionImportCount === 1
        ? '1 habit added this visit'
        : `${sessionImportCount} habits added this visit`;
    return {
      subtitle: `${label} — keep building your stack.`,
      title: 'Habit Library',
    };
  }

  return {
    subtitle: 'Search, pick a path, or add a quick win.',
    title: 'Habit Library',
  };
}
