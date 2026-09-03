/**
 * Science drill-down copy — Financial.
 *
 * Much of this category cites popular finance books rather than journals.
 * Where the underlying mechanism is genuinely from behavioural economics
 * (automation, commitment, present bias), the copy says so; where the source
 * is a book, `sources` names the book honestly rather than dressing it up.
 *
 * Nothing here is financial advice, and the copy avoids implying returns.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const FINANCIAL_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Automatic Savings': {
    suggestedWhy: 'Moving money on payday takes willpower out of the loop, so savings build while your spending quietly adapts.',
    tagline: 'Move money before you can spend it.',
    lead: 'Saving fails as a monthly decision and succeeds as a default. Automating the transfer on payday removes willpower from the loop entirely — you are not resisting spending, the money simply is not there to spend.',
    evidence:
      'Benartzi & Thaler’s Save More Tomorrow programme showed that automatic enrolment and automatic escalation dramatically raised savings rates compared with relying on active decisions.',
    cadenceLabel: 'Monthly · automated on payday',
    benefitDetails: [
      {
        icon: 'target',
        title: 'No willpower needed',
        description: 'The default does the work.',
      },
      {
        icon: 'leaf',
        title: 'You adjust quickly',
        description: 'Spending adapts to what is left.',
      },
      {
        icon: 'sparkle',
        title: 'Set up once',
        description: 'Then it runs for years unattended.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Slightly tighter',
        description: 'The adjustment is real but brief.',
      },
      {
        when: 'Month 3',
        title: 'Unnoticed',
        description: 'Spending recalibrates to the new balance.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Literally — the transfer needs no attention.',
        peak: true,
      },
    ],
    howToStart: [
      'Move $1 to savings. Prove the mechanism, then raise it.',
      'Schedule the transfer for payday, not month end.',
      'Increase it whenever your income does — that is where the escalation effect lives.',
    ],
    sources: [
      {
        authors: 'Benartzi S, Thaler RH',
        title: 'Heuristics and biases in retirement savings behavior',
        journal: 'Journal of Economic Perspectives',
        year: '2007',
      },
    ],
  },

  'Retirement Contributions': {
    suggestedWhy: 'Claiming the full match and letting it compound turns part of your salary into wealth you would otherwise forfeit.',
    tagline: 'Contribute enough to get the full match.',
    lead: 'An employer match is the one place you get an immediate, guaranteed return on your own money — leaving it unclaimed is declining part of your salary. Tax-advantaged accounts then compound that decision for decades.',
    cadenceLabel: 'Monthly · at least to the match',
    benefitDetails: [
      {
        icon: 'target',
        title: 'The match is free',
        description: 'Not claiming it is a pay cut you chose.',
      },
      {
        icon: 'leaf',
        title: 'Tax-advantaged',
        description: 'Compounding without annual tax drag.',
      },
      {
        icon: 'sparkle',
        title: 'Time does the work',
        description: 'Early contributions matter most.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Smaller paycheque',
        description: 'Pre-tax contributions cost less than they look.',
      },
      {
        when: 'Year 1',
        title: 'Balance is real',
        description: 'Contributions plus match add up fast.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Payroll handles it permanently.',
        peak: true,
      },
    ],
    howToStart: [
      'Move $1 to your retirement account to break the inertia.',
      'Find out your employer match and contribute at least that much.',
      'General information, not advice — a regulated adviser can look at your actual situation.',
    ],
    sources: [
      {
        authors: 'Benartzi S, Thaler RH',
        title: 'Heuristics and biases in retirement savings behavior',
        journal: 'Journal of Economic Perspectives',
        year: '2007',
      },
    ],
  },

  'Regular Investing': {
    suggestedWhy: 'A fixed schedule removes timing calls and the emotion behind them, so you keep investing through highs and lows.',
    tagline: 'Invest a fixed amount on a fixed schedule.',
    lead: 'Investing the same amount regularly removes the two hardest questions — when to buy and whether now is a good time. It is not a way to beat the market; it is a way to keep participating without needing to be right about timing.',
    cadenceLabel: 'Monthly · fixed amount',
    benefitDetails: [
      {
        icon: 'target',
        title: 'No timing decisions',
        description: 'The schedule replaces the judgement call.',
      },
      {
        icon: 'wave',
        title: 'Smooths entry price',
        description: 'You buy across highs and lows alike.',
      },
      {
        icon: 'leaf',
        title: 'Removes the emotion',
        description: 'Which is where most damage happens.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Feels trivial',
        description: 'Small amounts look pointless. They are not.',
      },
      {
        when: 'Year 2',
        title: 'Habit outweighs amount',
        description: 'Consistency is the variable you control.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A standing order you stop noticing.',
        peak: true,
      },
    ],
    howToStart: [
      'Invest $1 today, purely to learn the mechanics.',
      'Automate it so the decision happens once.',
      'General information, not investment advice. Investments can lose value — costs and your own risk tolerance matter.',
    ],
    sources: [
      {
        authors: 'Bogle JC',
        title: 'The Little Book of Common Sense Investing',
        journal: 'Wiley',
        year: '2007',
      },
    ],
  },

  'Expense Tracking': {
    suggestedWhy: 'Writing spending down replaces guesswork with measurement, and the awareness alone starts closing the leaks.',
    tagline: 'Write down what you spent.',
    lead: 'People underestimate their discretionary spending consistently and substantially. Tracking is not a budget — it is measurement, and measurement alone changes behaviour before you have decided to change anything.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'You find the leaks',
        description: 'Usually somewhere you did not suspect.',
      },
      {
        icon: 'wave',
        title: 'Measuring changes spending',
        description: 'Awareness works before any rule does.',
      },
      {
        icon: 'leaf',
        title: 'Budgets get realistic',
        description: 'Built on data instead of hope.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Uncomfortable',
        description: 'The first honest week usually stings.',
      },
      {
        when: 'Week 4',
        title: 'Patterns visible',
        description: 'You see categories, not just totals.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Logging becomes part of spending.',
        peak: true,
      },
    ],
    howToStart: [
      'Log one expense from today.',
      'Notes app is fine. Perfect categorisation can wait.',
      'Log at point of purchase — recall at day end is unreliable.',
    ],
    sources: [
      {
        authors: 'Thaler RH, Sunstein CR',
        title: 'Nudge: Improving Decisions About Health, Wealth, and Happiness',
        journal: 'Yale University Press',
        year: '2008',
      },
    ],
  },

  'Weekly Budget Review': {
    suggestedWhy: 'A weekly look keeps overspending small enough to correct, so money stops being a source of quiet anxiety.',
    tagline: 'Look at the numbers once a week.',
    lead: 'A monthly review is too late to correct anything — by the time you see the overspend, it has happened. Weekly is short enough a loop that a bad Tuesday is still recoverable by Sunday.',
    cadenceLabel: 'Weekly · 5-10 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Correctable loop',
        description: 'A week of drift is fixable; a month is not.',
      },
      {
        icon: 'wave',
        title: 'Less money anxiety',
        description: 'Not knowing is worse than knowing.',
      },
      {
        icon: 'leaf',
        title: 'No surprises',
        description: 'Nothing arrives out of nowhere.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Avoidant',
        description: 'Looking is the hard part, not the maths.',
      },
      {
        when: 'Week 4',
        title: 'Routine',
        description: 'It stops carrying dread.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A standing weekly slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Open your bank app and look once. That counts.',
      'Same time weekly — Sunday works for most people.',
      'Two questions: what surprised me, what changes this week.',
    ],
    sources: [
      {
        authors: 'Ramsey D',
        title: 'The Total Money Makeover',
        journal: 'Thomas Nelson',
        year: '2013',
      },
    ],
  },

  'Net Worth Check': {
    suggestedWhy: 'One monthly number holds assets and debts together, so attention shifts from income to actual progress.',
    tagline: 'Total it up monthly — even when it is negative.',
    lead: 'Net worth is the only number that captures the whole picture, and watching it monthly shifts your attention from income to accumulation. A negative figure is still information, and it is the trend that matters, not the level.',
    cadenceLabel: 'Monthly · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'The whole picture',
        description: 'Assets and debts in one number.',
      },
      {
        icon: 'wave',
        title: 'Trend over level',
        description: 'Direction is what you can influence.',
      },
      {
        icon: 'leaf',
        title: 'Shifts focus to wealth',
        description: 'Income is not the same as progress.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Possibly grim',
        description: 'Negative is common and still worth knowing.',
      },
      {
        when: 'Month 6',
        title: 'A trend line',
        description: 'Direction becomes visible and motivating.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A monthly checkpoint.',
        peak: true,
      },
    ],
    howToStart: [
      'Open your finance app and look once.',
      'Assets minus debts. A rough figure is enough.',
      'Same day each month so the comparison is fair.',
    ],
    sources: [
      {
        authors: 'Fernandes D, Lynch JG, Netemeyer RG',
        title:
          'Financial literacy, financial education, and downstream financial behaviors',
        journal: 'Management Science',
        year: '2014',
      },
    ],
  },

  '24-Hour Purchase Rule': {
    suggestedWhy: 'Waiting a day lets the spike of wanting decay, so you buy what you actually wanted and skip the rest.',
    tagline: 'Sleep on anything over fifty.',
    lead: 'Impulse purchases are driven by a spike of wanting that decays fast — waiting does not require more discipline, it just lets the spike pass. Most of what survives a day was worth buying; most of what does not, was not.',
    cadenceLabel: 'Every purchase over $50',
    benefitDetails: [
      {
        icon: 'target',
        title: 'The urge decays',
        description: 'You are outlasting it, not resisting it.',
      },
      {
        icon: 'wave',
        title: 'Wanting gets tested',
        description: 'A day separates want from whim.',
      },
      {
        icon: 'leaf',
        title: 'Fewer regrets',
        description: 'And fewer returns to organise.',
      },
    ],
    timeline: [
      {
        when: 'Purchase 1',
        title: 'Genuinely hard',
        description: 'Closing the tab feels like losing something.',
      },
      {
        when: 'Week 3',
        title: 'Most urges die',
        description: 'You notice how many you forgot entirely.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Waiting becomes the default.',
        peak: true,
      },
    ],
    howToStart: [
      'Wait 60 seconds before clicking buy. Start there.',
      'Add it to a list with the date instead of a basket.',
      'For anything large, extend to a week.',
    ],
    sources: [
      {
        authors: 'Mischel W',
        title: 'The Marshmallow Test: Mastering Self-Control',
        journal: 'Little, Brown',
        year: '2014',
      },
    ],
  },

  'Subscription Audit': {
    suggestedWhy: 'A monthly cancellation counters the inertia subscriptions rely on, so recurring costs stop quietly stacking up.',
    tagline: 'Cancel one subscription a month.',
    lead: 'Subscriptions exploit inertia — they are designed so that not deciding means continuing to pay. A recurring cancellation habit is the counter-default, and one a month is enough to keep the drift in check.',
    cadenceLabel: 'Monthly · cancel one',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Beats inertia',
        description: 'A default against their default.',
      },
      {
        icon: 'leaf',
        title: 'Recurring savings',
        description: 'Each cancellation pays every month after.',
      },
      {
        icon: 'wave',
        title: 'Less to manage',
        description: 'Fewer accounts, fewer passwords, less noise.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Easy wins',
        description: 'There is always one you forgot about.',
      },
      {
        when: 'Month 3',
        title: 'Harder calls',
        description: 'Now you are judging actual value.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A monthly sweep.',
        peak: true,
      },
    ],
    howToStart: [
      'Open one subscription and check the price.',
      'Search your statement for recurring charges — you will find surprises.',
      'Cancel first. You can always resubscribe, and rarely do.',
    ],
    sources: [
      {
        authors: 'Ariely D',
        title: 'Predictably Irrational',
        journal: 'HarperCollins',
        year: '2008',
      },
    ],
  },

  'Round-Up Savings': {
    suggestedWhy: 'Spare change moves across without registering as a loss, so a first cushion builds with no felt sacrifice.',
    tagline: 'Save the spare change automatically.',
    lead: 'Rounding each purchase up to the nearest pound or dollar saves money you never perceive leaving, which is precisely why it works. It will not fund a retirement, but it builds a balance without any felt sacrifice.',
    cadenceLabel: 'Ongoing · automated',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Painless',
        description: 'Amounts too small to register as loss.',
      },
      {
        icon: 'target',
        title: 'Fully automated',
        description: 'No decision after setup.',
      },
      {
        icon: 'leaf',
        title: 'A starter buffer',
        description: 'Good for a first emergency cushion.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Pennies',
        description: 'It looks trivial. That is the design.',
      },
      {
        when: 'Month 6',
        title: 'A real balance',
        description: 'Hundreds, from money you never missed.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Invisible and ongoing.',
        peak: true,
      },
    ],
    howToStart: [
      'Move spare change to savings manually once to see it work.',
      'Most banks offer round-ups natively — enable it there.',
      'Keep it separate from your current account so it is not casually spent.',
    ],
    sources: [
      {
        authors: 'Thaler RH, Benartzi S',
        title: 'Save More Tomorrow: using behavioral economics to increase employee saving',
        journal: 'Journal of Political Economy',
        year: '2004',
      },
    ],
  },

  'Bring Lunch': {
    suggestedWhy: 'Cutting the most frequent discretionary spend compounds into a large annual saving, with better food alongside.',
    tagline: 'Pack it instead of buying it.',
    lead: 'This is the highest-frequency discretionary spend most people have, which is what makes it worth attacking — five days a week compounds into a genuinely large annual number. The health effect comes along free.',
    cadenceLabel: 'Weekdays',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Large annual saving',
        description: 'Frequency is what makes it add up.',
      },
      {
        icon: 'target',
        title: 'Better food',
        description: 'You control what is in it.',
      },
      {
        icon: 'wave',
        title: 'Time back',
        description: 'No queue at lunchtime.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels like effort',
        description: 'Evening prep is the whole difficulty.',
      },
      {
        when: 'Week 3',
        title: 'Routine',
        description: 'Packing becomes part of clearing up dinner.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Buying lunch feels wasteful.',
        peak: true,
      },
    ],
    howToStart: [
      'Make one item for tomorrow’s lunch.',
      'Cook extra dinner — leftovers are the easiest lunch there is.',
      'Three days a week is a win. Do not aim for five immediately.',
    ],
  },

  'Negotiate Bills': {
    suggestedWhy: 'One uncomfortable ask can unlock a retention discount, so twenty minutes lowers every bill that follows.',
    tagline: 'Ask for a better rate on one bill.',
    lead: 'Retention discounts exist and are routinely given to people who ask, because acquiring you costs more than keeping you. The reason most people pay more is not that the discount is unavailable — it is that asking is uncomfortable.',
    cadenceLabel: 'Monthly · one bill',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Recurring saving',
        description: 'One call reduces every future bill.',
      },
      {
        icon: 'target',
        title: 'High hourly rate',
        description: 'Twenty minutes for a year of savings.',
      },
      {
        icon: 'wave',
        title: 'Asking gets easier',
        description: 'A transferable skill, honestly.',
      },
    ],
    timeline: [
      {
        when: 'Call 1',
        title: 'Awkward',
        description: 'Ask for retention. Be pleasant and specific.',
      },
      {
        when: 'Month 3',
        title: 'Practised',
        description: 'You know what to say and it takes minutes.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'You check rates before renewals.',
        peak: true,
      },
    ],
    howToStart: [
      'Open one bill and find the customer service number.',
      'Know a competitor’s price before you call — that is your leverage.',
      'Ask for the retention or cancellations team. They hold the discounts.',
    ],
  },

  'Pre-Purchase Gratitude': {
    suggestedWhy: 'Noticing what you already own competes with the urge to acquire, so fewer purchases happen on impulse.',
    tagline: 'Name three things you already own.',
    lead: 'Materialism and gratitude pull in opposite directions — deliberately noticing what you already have measurably reduces the urge to acquire more. Done at the point of purchase, it competes directly with the wanting.',
    evidence:
      'Lambert et al. (2009) found that inducing gratitude reduced materialistic striving, with gratitude and materialism showing a consistent inverse relationship.',
    cadenceLabel: 'Before purchases · 1 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Reduces wanting',
        description: 'Gratitude and materialism are opposed.',
      },
      {
        icon: 'target',
        title: 'Acts at the decision',
        description: 'Right where the impulse lives.',
      },
      {
        icon: 'wave',
        title: 'Costs nothing',
        description: 'One minute, no tools.',
      },
    ],
    timeline: [
      {
        when: 'Purchase 1',
        title: 'Feels like a delay tactic',
        description: 'It partly is — that is fine.',
      },
      {
        when: 'Week 3',
        title: 'Genuinely dampens urges',
        description: 'The comparison stops flattering the new thing.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'It runs before you reach for your card.',
        peak: true,
      },
    ],
    howToStart: [
      'Name one thing you already own and love.',
      'Ideally something in the same category as the purchase.',
      'Then decide. You are allowed to still buy it.',
    ],
    sources: [
      {
        authors: 'Lambert NM, Fincham FD, Stillman TF, Dean LR',
        title: 'More gratitude, less materialism',
        journal: 'The Journal of Positive Psychology',
        year: '2009',
      },
    ],
  },

  'Loud Budgeting': {
    suggestedWhy: 'Saying a limit out loud turns it into a social commitment, so declining things gets easier and less awkward.',
    tagline: 'Say out loud what you are not buying.',
    lead: 'Announcing an intention to someone turns a private plan into a small social commitment, and commitments made publicly are kept more often. It also removes the awkwardness of declining things — you have already declared the reason.',
    cadenceLabel: 'Ongoing · before purchases',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Social commitment',
        description: 'Stated intentions get followed through more.',
      },
      {
        icon: 'wave',
        title: 'Easier to say no',
        description: 'The reason is already on the table.',
      },
      {
        icon: 'leaf',
        title: 'Removes the shame',
        description: 'Saying it out loud normalises it.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Exposing',
        description: 'Talking about money is the hard part.',
      },
      {
        when: 'Week 3',
        title: 'Others join in',
        description: 'It gives people around you permission too.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You just say it.',
        peak: true,
      },
    ],
    howToStart: [
      'Tell one person what you are skipping today.',
      'Pick someone who will not judge it — a partner or a friend.',
      'Say what you are saving for, not only what you are cutting.',
    ],
  },

  'Financial Education': {
    suggestedWhy: 'Understanding how money works makes fees and traps visible, and tends to show up in saving and debt over time.',
    tagline: 'Fifteen minutes learning about money.',
    lead: 'Financial literacy predicts real outcomes — saving, debt, retirement planning. The honest caveat is that education alone shifts behaviour less than people assume, so pair the reading with one automated change and you get both.',
    evidence:
      'Lusardi & Mitchell (2014) review evidence that financial literacy is strongly associated with retirement planning, wealth accumulation, and better debt management.',
    cadenceLabel: 'Daily · 15 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Literacy predicts outcomes',
        description: 'Associated with saving and lower debt.',
      },
      {
        icon: 'wave',
        title: 'You spot bad products',
        description: 'Fees and traps become visible.',
      },
      {
        icon: 'sparkle',
        title: 'Compounds',
        description: 'Understanding gets cheaper over time.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Jargon-heavy',
        description: 'The vocabulary is the first barrier.',
      },
      {
        when: 'Week 6',
        title: 'It clicks',
        description: 'Concepts start connecting to your own situation.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A protected daily slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Read one paragraph about money.',
      'Start with one book, not a feed of hot takes.',
      'Pair each concept with one concrete change — reading alone changes little.',
    ],
    sources: [
      {
        authors: 'Lusardi A, Mitchell OS',
        title: 'The economic importance of financial literacy: theory and evidence',
        journal: 'Journal of Economic Literature',
        year: '2014',
      },
    ],
  },
};
