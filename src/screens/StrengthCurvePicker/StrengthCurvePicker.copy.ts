/** Copy for the Strength Curve full-screen picker (V5 + Option B). */
import type { AlgorithmMode } from '@/components/AlgorithmPicker';

export const STRENGTH_CURVE_PICKER_COPY = {
  headerTitle: 'Habit strength',
  doneLabel: 'Done',
  heroTitle: 'Strength fills like this.',
  heroSubtitle: 'Check in to grow it. Miss a day and it dips.',
  pickerSectionLabel: 'What kind of habit is this?',
  freshStartLabel: 'Fresh start',
  automaticLabel: 'Automatic',
  checkInLabel: 'Check in',
  missLabel: 'Skip a day',
  checkInUnit: 'per check-in',
  missUnit: 'per missed day',
} as const;

export interface TierCopy {
  emoji: string;
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
  ctaSubtitle: string;
  exampleChips: readonly string[];
}

export const TIER_COPY: Record<AlgorithmMode, TierCopy> = {
  forgiving: {
    emoji: '⚡',
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
    description: 'Takes seconds a day. Forms fast and forgives slips.',
    ctaSubtitle: 'Day 1 → automatic in ~2.5 weeks',
    exampleChips: ['💧 Drink water', '🪥 Floss', '💊 Vitamins', '🌅 Make bed'],
  },
  balanced: {
    emoji: '🌱',
    tierName: 'Regular',
    durationPerDay: '5-15 min',
    formationWeeks: '~9 wk',
    formationDays: '66d',
    examples: 'read · walk · meditate',
    midpointLabel: 'DAY 33',
    midpointSub: 'Feels routine',
    automaticMilestone: 'DAY 66 ✨',
    fillPercent: '+1.5%',
    dipPercent: '−5%',
    detailHeading: 'Regular habit',
    description:
      "5–15 minutes a day. Builds steadily — honest slips don't erase your progress.",
    ctaSubtitle: 'Day 1 → automatic in ~9 weeks',
    exampleChips: ['📖 Read 10 min', '🚶 Daily walk', '🧘 Meditate', '✏️ Journal'],
  },
  strict: {
    emoji: '🏔️',
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
    description: '30+ minutes a day. Months to build, but the habit goes deeper.',
    ctaSubtitle: 'Day 1 → automatic in ~4 months',
    exampleChips: ['🏃 Run 5K', '✍️ Write daily', '💪 Workout', '🧘 30-min meditate'],
  },
};
