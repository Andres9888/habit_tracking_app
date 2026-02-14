/**
 * Changelog entries for the "What's New" modal.
 * Add newest entries at the top. The modal shows the latest 3.
 */

export interface ChangelogEntry {
  emoji: string;
  title: string;
  description: string;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  entries: ChangelogEntry[];
}

export const changelog: ChangelogVersion[] = [
  {
    version: '1.0.0',
    date: '2026-02-14',
    entries: [
      {
        emoji: '✨',
        title: 'Smooth Animations',
        description:
          'Cards and screens now feature buttery entrance animations and press effects.',
      },
      {
        emoji: '🛡️',
        title: 'Error Boundaries',
        description:
          'Graceful error recovery on every major screen — no more blank crashes.',
      },
      {
        emoji: '💫',
        title: 'Skeleton Shimmer',
        description:
          'Beautiful gradient shimmer loading states while your data syncs.',
      },
    ],
  },
];

/** Returns the latest changelog version entry */
export function getLatestChangelog(): ChangelogVersion | undefined {
  return changelog[0];
}
