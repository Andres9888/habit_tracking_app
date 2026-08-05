export interface PainStatement {
  id: string;
  statement: string;
}

export const PAIN_STATEMENTS: readonly PainStatement[] = [
  {
    id: 'quit-first-week',
    statement:
      "I've quit habit apps in the first week more times than I'd like to admit.",
  },
  {
    id: 'identity-gap',
    statement:
      "I don't really believe I'm the kind of person who sticks to things.",
  },
  {
    id: 'all-or-nothing',
    statement:
      'One missed day and something in me wants to just stop entirely.',
  },
  {
    id: 'streaks-feel-fake',
    statement:
      "A streak number alone doesn't really tell me anything — I want to know it's actually sticking.",
  },
];
