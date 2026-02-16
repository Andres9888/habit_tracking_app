/**
 * Changelog Data
 *
 * Contains feature announcements for each version.
 * Add new versions at the TOP of the array (latest first).
 *
 * Guidelines:
 * - Keep it concise and user-focused
 * - Use emojis that represent the feature
 * - Highlight benefits, not implementation details
 * - Max 5-6 features per version to avoid overwhelming users
 */

import type { ChangelogEntry } from './types';

export const CHANGELOG: ChangelogEntry[] = [
  {
    features: [
      {
        description:
          'Build lasting habits with beautiful chain tracking and visual progress indicators.',
        icon: '🔗',
        title: 'Chain Tracking',
      },
      {
        description:
          'Gain insights with detailed statistics, streak counts, and performance analytics.',
        icon: '📊',
        title: 'Smart Analytics',
      },
      {
        description:
          'Seamlessly switch between light and dark modes, or follow your system preference.',
        icon: '🌓',
        title: 'Dark Mode',
      },
      {
        description:
          'Set daily reminders to stay on track and never miss a day on your chain.',
        icon: '⏰',
        title: 'Streak Reminders',
      },
      {
        description:
          'Personalize your experience with custom sounds, icons, and celebration effects.',
        icon: '✨',
        title: 'Customization',
      },
      {
        description:
          'Your data syncs across all your devices in real-time with secure cloud backup.',
        icon: '☁️',
        title: 'Cloud Sync',
      },
    ],
    version: '1.0.0',
  },
];
