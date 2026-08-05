import { PainPoint } from './painPoints';

export interface SolutionMapping {
  painId: PainPoint['id'];
  pain: string;
  fix: string;
}

export const SOLUTION_MAPPINGS: readonly SolutionMapping[] = [
  {
    fix: 'Your strength dips. Your tier holds.',
    pain: 'Miss a day, lose everything.',
    painId: 'miss-a-day',
  },
  {
    fix: 'Watch it go copper → iron → gold. Real strength, not a streak count.',
    pain: "Can't tell if it's really sticking.",
    painId: 'cant-tell-sticking',
  },
  {
    fix: 'Pick 3. Focus. Go deep on them before adding more.',
    pain: 'Try too many habits at once.',
    painId: 'too-many-habits',
  },
  {
    fix: 'New material tier every 20 strength points. Milestones you earned.',
    pain: 'Novelty wears off before the habit does.',
    painId: 'novelty-fades',
  },
];
