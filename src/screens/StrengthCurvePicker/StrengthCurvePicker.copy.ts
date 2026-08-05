/** Copy for the Strength Curve full-screen picker (V5 + Option B). */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';

export const STRENGTH_CURVE_PICKER_COPY = {
  headerTitle: 'Habit strength',
  doneLabel: 'Done',
  heroTitle: 'Build a habit that sticks.',
  heroSubtitle: 'Strength grows with check-ins and dips when you skip.',
  pickerSectionLabel: 'What kind of habit is this?',
  premiumComplexLockedLabel: 'Premium',
  premiumComplexNote:
    'Complex uses deeper decay modeling for long routines, so your score reflects real consistency.',
  premiumComplexCta: 'Unlock Complex with Premium',
  freshStartLabel: 'Fresh start',
  automaticLabel: 'Automatic',
  checkInLabel: 'Check in',
  missLabel: 'Skip a day',
} as const;

export interface TierCopy {
  tierName: string;
  durationPerDay: string;
  formationWeeks: string;
  formationDays: string;
  examples: string;
  midpointLabel: string;
  midpointSub: string;
  automaticMilestone: string;
  fillPercent: string;
  dipPercent: string;
  detailHeading: string;
  description: string;
  exampleChips: readonly string[];
}

export const TIER_COPY: Record<AlgorithmMode, TierCopy> = {
  forgiving: {
    tierName: 'Simple',
    durationPerDay: 'seconds daily',
    formationWeeks: '~2.5 wk',
    formationDays: '18d',
    examples: 'water · vitamins · floss',
    midpointLabel: 'DAY 9',
    midpointSub: 'Catching on',
    automaticMilestone: 'DAY 18 ✨',
    fillPercent: '+5.6%',
    dipPercent: '−3%',
    detailHeading: 'Simple habit',
    description:
      'Quick actions you can do in seconds. Fast momentum, forgiving when life gets busy.',
    exampleChips: ['💧 Drink water', '🪥 Floss', '💊 Vitamins', '🌅 Make bed'],
  },
  balanced: {
    tierName: 'Average',
    durationPerDay: '5-15 min',
    formationWeeks: '~9 wk',
    formationDays: '66d',
    examples: 'read · walk · meditate',
    midpointLabel: 'DAY 33',
    midpointSub: 'Feels routine',
    automaticMilestone: 'DAY 66 ✨',
    fillPercent: '+1.5%',
    dipPercent: '−5%',
    detailHeading: 'Average habit',
    description:
      'A 5-15 minute daily routine. Steady progress with enough flexibility to recover from misses.',
    exampleChips: ['📖 Read 10 min', '🚶 Daily walk', '🧘 Meditate', '✏️ Journal'],
  },
  strict: {
    tierName: 'Complex',
    durationPerDay: '30+ min',
    formationWeeks: '~4 mo',
    formationDays: '120d',
    examples: 'run · write · workout',
    midpointLabel: 'DAY 60',
    midpointSub: 'Halfway there',
    automaticMilestone: 'DAY 120 ✨',
    fillPercent: '+0.8%',
    dipPercent: '−8%',
    detailHeading: 'Complex habit',
    description:
      'High-effort routines (30+ min) that take longer to automate, but create deeper behavior change.',
    exampleChips: ['🏃 Run 5K', '✍️ Write daily', '💪 Workout', '🧘 30-min meditate'],
  },
};
