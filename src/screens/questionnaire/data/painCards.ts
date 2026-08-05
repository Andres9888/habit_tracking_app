/**
 * Pain amplification cards for the swipe screen.
 * Each card maps to a pain point ID for prioritized ordering.
 */

export interface PainCard {
  id: string;
  painPointId: string;
  text: string;
}

export const PAIN_CARDS: PainCard[] = [
  { id: 'c1', painPointId: 'lose-motivation', text: 'You start strong on Monday\u2026 but by Thursday it feels pointless.' },
  { id: 'c2', painPointId: 'too-busy', text: 'Your to-do list is so long that self-improvement always gets bumped.' },
  { id: 'c3', painPointId: 'forget', text: 'You genuinely want to do it \u2014 you just\u2026 forget. Every. Single. Day.' },
  { id: 'c4', painPointId: 'overwhelmed', text: 'You downloaded 3 apps, bought a journal, and still couldn\u2019t stick to one thing.' },
  { id: 'c5', painPointId: 'no-accountability', text: 'Nobody notices if you skip a day, so eventually you stop caring.' },
  { id: 'c6', painPointId: 'unsure-what', text: 'You know you should build better habits but have no idea where to start.' },
  { id: 'c7', painPointId: 'lose-motivation', text: 'The excitement of a fresh start fades faster than your phone battery.' },
  { id: 'c8', painPointId: 'too-busy', text: 'Between work, errands, and life \u2014 "me time" is a myth.' },
];
