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

/**
 * WOOP steps with semantic theme keys for amber colors.
 * `bg` and `color` use NativeWind classes for non-amber colors;
 * amber steps use `themeKey: 'warning'` so the modal can resolve at render time.
 */
export const WOOP_STEPS: (WOOPStep & { themeKey?: string })[] = [
  {
    bg: '',
    color: '',
    desc: 'What do you want to achieve?',
    letter: 'W',
    themeKey: 'warning',
    title: 'Wish',
  },
  {
    bg: '',
    color: '',
    desc: 'Best result of fulfilling your wish?',
    letter: 'O',
    themeKey: 'warning',
    title: 'Outcome',
  },
  {
    bg: '',
    color: '',
    desc: 'Main inner obstacle preventing you?',
    letter: 'O',
    themeKey: 'error',
    title: 'Obstacle',
  },
  {
    bg: '',
    color: '',
    desc: 'If [obstacle], then I will [action]',
    letter: 'P',
    themeKey: 'success',
    title: 'Plan',
  },
];
