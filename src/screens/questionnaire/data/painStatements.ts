export interface PainStatement {
  id: string;
  quote: string;
}

export const PAIN_STATEMENTS: PainStatement[] = [
  {
    id: 'forgot-app',
    quote:
      "I've downloaded habit apps before — then forgot they were on my phone.",
  },
  {
    id: 'start-monday',
    quote: 'I tell myself I\'ll start Monday. It keeps being Monday.',
  },
  {
    id: 'third-day-wall',
    quote:
      'Day one and two feel great. By day three, the motivation just evaporates.',
  },
  {
    id: 'guilt-trip',
    quote:
      "Missing a day makes me feel like I've failed, so I drop the whole thing.",
  },
  {
    id: 'too-much',
    quote:
      "I start with five new habits at once and burn out before week two.",
  },
];
