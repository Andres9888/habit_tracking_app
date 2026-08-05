export interface PainPoint {
  id: string;
  label: string;
}

export const PAIN_POINTS: readonly PainPoint[] = [
  {
    id: 'miss-a-day',
    label: '"I quit when I miss a day and feel like I\'ve lost everything."',
  },
  {
    id: 'cant-tell-sticking',
    label:
      '"The app tracks that I showed up, but I can\'t tell if it\'s really sticking."',
  },
  {
    id: 'too-many-habits',
    label: '"I can\'t tell which habits to focus on, so I try too many at once."',
  },
  {
    id: 'novelty-fades',
    label: '"The novelty wears off before the habit does."',
  },
];
