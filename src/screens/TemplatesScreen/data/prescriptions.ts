/**
 * Static prescription entries — "Your way in" for each goal.
 * Templates referenced by name + category; resolved at runtime.
 */

export interface PrescriptionStepRef {
  reason: string;
  templateCategory: string;
  templateName: string;
}

export interface PrescriptionEntry {
  goalId: string;
  insight: string;
  steps: [PrescriptionStepRef, PrescriptionStepRef];
  why: string;
}

export const PRESCRIPTIONS: PrescriptionEntry[] = [
  {
    goalId: 'sleep-better',
    insight: 'Start with a wind-down, not a wake-up',
    why: 'Most sleep problems are evening problems. These two habits fix the input — when and how your body powers down.',
    steps: [
      {
        templateName: 'No Screens Before Bed',
        templateCategory: 'sleep',
        reason: 'Blue light delays melatonin ~90 min',
      },
      {
        templateName: 'Daily Reading',
        templateCategory: 'learning',
        reason: 'Replaces scrolling, drops heart rate · 10 min',
      },
    ],
  },
  {
    goalId: 'more-energy',
    insight: 'Light first, then move',
    why: 'Energy is a circadian problem before it is a motivation problem. Lock in morning light and a quick burst of movement.',
    steps: [
      {
        templateName: 'Hydration First',
        templateCategory: 'morning_routine',
        reason: 'Rehydration kickstarts metabolism after sleep',
      },
      {
        templateName: '7-Minute Workout',
        templateCategory: 'health_fitness',
        reason: 'HIIT spikes alertness for hours · 7 min',
      },
    ],
  },
  {
    goalId: 'less-stress',
    insight: 'Calm the body before the mind',
    why: 'Stress lives in the nervous system. These two habits downshift it in under five minutes.',
    steps: [
      {
        templateName: 'Physiological Sigh',
        templateCategory: 'breathing',
        reason: 'Fastest way to lower arousal · 2 min',
      },
      {
        templateName: '5-Minute Meditation',
        templateCategory: 'morning_routine',
        reason: 'Builds a daily reset ritual · 5 min',
      },
    ],
  },
  {
    goalId: 'be-productive',
    insight: 'Protect focus, then ship one thing',
    why: 'Distraction is the enemy. Block deep work first, then use a timer to keep momentum.',
    steps: [
      {
        templateName: 'Deep Work Session',
        templateCategory: 'productivity',
        reason: 'Uninterrupted blocks multiply output',
      },
      {
        templateName: 'Pomodoro Technique',
        templateCategory: 'productivity',
        reason: 'Sprints prevent burnout · 25 min',
      },
    ],
  },
  {
    goalId: 'get-healthier',
    insight: 'Move daily, walk often',
    why: 'Health compounds from small daily inputs. Start with a quick workout, then add steps.',
    steps: [
      {
        templateName: '7-Minute Workout',
        templateCategory: 'health_fitness',
        reason: 'Science-backed HIIT · 7 min',
      },
      {
        templateName: '10,000 Steps',
        templateCategory: 'health_fitness',
        reason: 'Cardio baseline most people skip',
      },
    ],
  },
];
