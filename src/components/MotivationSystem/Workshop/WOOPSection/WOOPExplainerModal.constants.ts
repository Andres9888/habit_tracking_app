/**
 * Constants for WOOPExplainerModal
 */

export interface WOOPStep {
  bg: string;
  color: string;
  desc: string;
  letter: string;
  title: string;
}

export const WOOP_STEPS: WOOPStep[] = [
  {
    bg: 'bg-amber-100',
    color: 'text-amber-600',
    desc: 'What do you want to achieve?',
    letter: 'W',
    title: 'Wish',
  },
  {
    bg: 'bg-amber-100',
    color: 'text-amber-600',
    desc: 'Best result of fulfilling your wish?',
    letter: 'O',
    title: 'Outcome',
  },
  {
    bg: 'bg-rose-100',
    color: 'text-rose-500',
    desc: 'Main inner obstacle preventing you?',
    letter: 'O',
    title: 'Obstacle',
  },
  {
    bg: 'bg-emerald-100',
    color: 'text-emerald-500',
    desc: 'If [obstacle], then I will [action]',
    letter: 'P',
    title: 'Plan',
  },
];
