import type { MotivationFieldKey } from '../../../../convex/habits/validateMotivationFields';

export interface MotivationFieldConfig {
  hint: string;
  key: MotivationFieldKey;
  label: string;
  maxLength: number;
  short?: boolean;
}

export const DETAIL_FIELDS: MotivationFieldConfig[] = [
  {
    hint: 'One line. This is the sentence above Complete today.',
    key: 'why',
    label: 'Your why',
    maxLength: 140,
    short: true,
  },
  {
    hint: 'Optional. Used on Detail only if the why is empty.',
    key: 'identity',
    label: "Who you're becoming",
    maxLength: 160,
    short: true,
  },
];

export const WOOP_FIELDS: MotivationFieldConfig[] = [
  {
    hint: 'The habit you want, in plain language.',
    key: 'woopWish',
    label: 'Wish',
    maxLength: 160,
    short: true,
  },
  {
    hint: 'The best realistic result if it sticks.',
    key: 'woopOutcome',
    label: 'Outcome',
    maxLength: 200,
    short: true,
  },
  {
    hint: 'The thing in you that usually stops it — not traffic, not “life.”',
    key: 'woopObstacle',
    label: 'Obstacle',
    maxLength: 280,
  },
  {
    hint: 'One if-then tied to that obstacle.',
    key: 'woopPlan',
    label: 'Plan',
    maxLength: 280,
  },
];

export const COPY = {
  detailLabel: 'Shown on Habit Detail',
  emptyPreview:
    'Nothing shown on Detail until you write a why, identity, or wish.',
  footnote:
    'Habit Detail only shows the why line. A hard morning uses the plan; it does not need this whole page in the way.',
  previewLabel: 'Preview on Detail',
  woopBody:
    'Wish, Outcome, Obstacle, Plan. Naming the obstacle is the useful part — wishing alone often feels finished.',
  woopLabel: 'WOOP',
  woopSection: 'Written here, not on Detail',
} as const;
