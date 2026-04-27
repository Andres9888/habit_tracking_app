import { PainPoint } from './painPoints';

export interface SolutionMapping {
  painId: PainPoint['id'];
  /** User's pain echoed back (struck through in UI). */
  pain: string;
  /** Transformation outcome. The bold lead line per row. */
  outcome: string;
  /** Mechanic that delivers the outcome. The small support line. */
  mechanic: string;
}

export const SOLUTION_MAPPINGS: readonly SolutionMapping[] = [
  {
    mechanic: 'Strength dips when you miss. Your tier holds.',
    outcome: "You won't quit on day 42 again.",
    pain: 'I quit when I miss a day.',
    painId: 'miss-a-day',
  },
  {
    mechanic: 'The chain upgrades from copper to gold as you build.',
    outcome: "You'll watch it become real.",
    pain: "I can't tell if it's sticking.",
    painId: 'cant-tell-sticking',
  },
  {
    mechanic: "Pick 3 to begin. Add more once they're holding.",
    outcome: "You'll finish what you started.",
    pain: 'I try too many at once.',
    painId: 'too-many-habits',
  },
  {
    mechanic: 'Each tier is a new milestone — copper, iron, gold, legendary.',
    outcome: "Day 60 won't feel like a slog.",
    pain: 'The novelty wears off.',
    painId: 'novelty-fades',
  },
];
