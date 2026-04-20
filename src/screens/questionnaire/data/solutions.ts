export interface Solution {
  painId: string;
  title: string;
  body: string;
  icon: string;
}

export const DEFAULT_SOLUTIONS: Solution[] = [
  {
    painId: 'forget',
    title: 'Gentle daily reminders',
    body: 'One nudge at your best time of day — not five buzzes you tune out.',
    icon: '🔔',
  },
  {
    painId: 'motivation',
    title: 'Visible chain, not willpower',
    body: "Your streak builds momentum so you don't have to push from zero each day.",
    icon: '🔗',
  },
  {
    painId: 'progress',
    title: 'A year in one glance',
    body: 'The heatmap shows every check-in. Progress you can literally see.',
    icon: '📊',
  },
  {
    painId: 'chore',
    title: 'Two taps to check in',
    body: 'No forms, no streaks to maintain under pressure. Mark it, move on.',
    icon: '✅',
  },
  {
    painId: 'busy',
    title: 'Flexible week scheduling',
    body: 'Pick the days that fit. Miss one? No guilt, just keep going.',
    icon: '🗓️',
  },
  {
    painId: 'overcommit',
    title: 'Start with three',
    body: 'We cap your starter plan at 3 habits so you actually finish them.',
    icon: '3️⃣',
  },
  {
    painId: 'start',
    title: 'Science-backed templates',
    body: '200+ habits built on behavior research, ready in one tap.',
    icon: '🧪',
  },
];
