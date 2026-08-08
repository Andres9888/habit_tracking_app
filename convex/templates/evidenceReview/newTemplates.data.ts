/**
 * New templates from the Aug 2026 catalog review.
 *
 * Each one fills a gap the existing 280-template catalog left open rather than
 * restating a habit already covered: no creatine anywhere in the library, no
 * pelvic floor work at all, a thin `subtraction` category, and no weekly-dose
 * framing for nature exposure.
 *
 * `scientificLink` is deliberately omitted throughout — a citation whose URL
 * has not been opened and confirmed is worse than no URL, and these are added
 * from the reference alone.
 */

import type { TemplateInsert } from '../types';

export const EVIDENCE_REVIEW_TEMPLATES: Omit<TemplateInsert, 'createdAt'>[] = [
  {
    category: 'health_fitness',
    description:
      'Take 3-5g of creatine monohydrate daily, at any time of day. It is the most thoroughly studied supplement in sport science: consistent gains in strength and lean mass alongside resistance training, with a long safety record in healthy adults.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'simple',
    icon: '💊',
    iconColor: '#8B5CF6',
    name: 'Daily Creatine',
    popularityScore: 86,
    scientificReference:
      'Kreider et al. (2017) - ISSN position stand: safety and efficacy of creatine supplementation, JISSN',
    startSmallVersion: 'Put the creatine tub next to your kettle.',
    tips: [
      'Monomeric creatine monohydrate is the studied form — the expensive variants add nothing',
      'Timing does not matter; consistency does',
      'Take it with water and expect a small, harmless weight gain from water retention',
    ],
  },
  {
    category: 'mindfulness',
    description:
      'Accumulate at least 120 minutes in nature across the week — parks, woodland, coastline, anything green or blue. In a survey of nearly 20,000 adults, reported health and wellbeing rose up to about two hours a week and then plateaued. How you split the time did not matter.',
    estimatedMinutes: 30,
    frequency: 'weekly',
    growthType: 'average',
    icon: '🌳',
    iconColor: '#16A34A',
    name: '120 Minutes in Nature',
    popularityScore: 84,
    scientificReference:
      'White et al. (2019) - Spending at least 120 minutes a week in nature is associated with good health and wellbeing, Scientific Reports',
    startSmallVersion: 'Walk one lap of the nearest park.',
    tips: [
      'Split it however you like — six twenty-minute walks count the same as one long one',
      'A city park counts; the threshold does not require wilderness',
      'Track the weekly total rather than a daily streak, or bad weather ends the habit',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Take one screen-free stretch every week — a half day or a full day with no feeds, no email, no short video. Sustained reductions in social media use lower loneliness and depressive symptoms; a weekly block is easier to keep than a daily cap.',
    estimatedMinutes: 240,
    frequency: 'weekly',
    growthType: 'complex',
    icon: '🌙',
    iconColor: '#7C3AED',
    name: 'Digital Sabbath',
    popularityScore: 80,
    scientificReference:
      'Hunt et al. (2018) - No more FOMO: limiting social media decreases loneliness and depression, Journal of Social and Clinical Psychology',
    startSmallVersion: 'Put your phone in a drawer for one hour.',
    tips: [
      'Pick the same window every week so nobody has to be told twice',
      'Decide the night before what you will actually do with the time',
      'Leave calls on if people rely on you — this is about feeds, not disappearing',
    ],
  },
  {
    category: 'mental_health',
    description:
      'Sit near a 10,000-lux light box for 20-30 minutes shortly after waking through the dark months. In controlled trials, bright light therapy produced effect sizes for seasonal depression comparable to antidepressant medication.',
    estimatedMinutes: 25,
    frequency: 'daily',
    growthType: 'average',
    icon: '💡',
    iconColor: '#F59E0B',
    name: 'Morning Bright Light',
    popularityScore: 79,
    scientificReference:
      'Golden et al. (2005) - The efficacy of light therapy in the treatment of mood disorders: a review and meta-analysis, American Journal of Psychiatry',
    startSmallVersion: 'Sit by the brightest window for 5 minutes.',
    tips: [
      'Morning matters — late-day sessions can push your sleep later',
      'Eyes open, light off to the side; you do not stare at it',
      'Talk to a clinician first if you have bipolar disorder or an eye condition',
    ],
  },
  {
    category: 'financial',
    description:
      'Pick one day a week and spend nothing beyond fixed bills. Naming the constraint in advance is what makes it work — a pre-committed rule is far harder to argue yourself out of than a vague intention to spend less.',
    estimatedMinutes: 1,
    frequency: 'weekly',
    growthType: 'average',
    icon: '🚫',
    iconColor: '#0891B2',
    name: 'No-Spend Day',
    popularityScore: 78,
    scientificReference:
      'Rogers, Milkman & Volpp (2014) - Commitment devices: using initiatives to change behavior, JAMA',
    startSmallVersion: 'Name tomorrow as your no-spend day.',
    tips: [
      'Pick a day you are usually busy — willpower is not the point, opportunity is',
      'Pack lunch the night before or the rule breaks at noon',
      'Tell someone which day it is; a stated commitment holds better than a private one',
    ],
  },
  {
    category: 'health_fitness',
    description:
      'Train the pelvic floor daily: contract, hold a few seconds, release fully, repeated in short sets. Cochrane reviews find supervised pelvic floor muscle training effective for urinary incontinence — an outcome that affects a large share of adults and is rarely trained deliberately.',
    estimatedMinutes: 5,
    frequency: 'daily',
    growthType: 'average',
    icon: '🧘',
    iconColor: '#DB2777',
    name: 'Pelvic Floor Training',
    popularityScore: 76,
    scientificReference:
      'Dumoulin et al. (2018) - Pelvic floor muscle training for urinary incontinence in women, Cochrane Database of Systematic Reviews',
    startSmallVersion: 'Do three slow contractions and releases.',
    tips: [
      'The release matters as much as the squeeze — a permanently clenched floor is its own problem',
      'Anchor it to something seated and routine, like a commute or the kettle boiling',
      'A pelvic health physiotherapist can check your technique; most people guess wrong at first',
    ],
  },
  {
    category: 'productivity',
    description:
      'Take one-on-one conversations on foot instead of around a table. In a series of Stanford experiments, walking raised output on creative divergent-thinking tasks substantially compared with sitting, and the effect carried over into the period just after sitting back down.',
    estimatedMinutes: 30,
    frequency: 'weekly',
    growthType: 'average',
    icon: '🚶',
    iconColor: '#0EA5E9',
    name: 'Walking Meeting',
    popularityScore: 81,
    scientificReference:
      'Oppezzo & Schwartz (2014) - Give your ideas some legs: the positive effect of walking on creative thinking, JEP: Learning, Memory, and Cognition',
    startSmallVersion: 'Take your next phone call standing and moving.',
    tips: [
      'Best for open-ended conversation; anything needing a screen stays at the desk',
      'Agree the route beforehand so nobody is navigating mid-sentence',
      'Bring the ideas straight back to paper — the boost fades within the hour',
    ],
  },
  {
    category: 'sleep',
    description:
      'Sleep with an eye mask and earplugs when your room is not fully dark or quiet. In controlled studies of noisy, lit sleeping environments, masking light and sound improved sleep quality and raised overnight melatonin.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'simple',
    icon: '😴',
    iconColor: '#4338CA',
    name: 'Eye Mask and Earplugs',
    popularityScore: 83,
    scientificReference:
      'Hu et al. (2010) - Effects of earplugs and eye masks on nocturnal sleep, melatonin and cortisol, Critical Care',
    startSmallVersion: 'Put the mask and plugs on your pillow tonight.',
    tips: [
      'Cheaper than blackout blinds and it travels with you',
      'Try a contoured mask if pressure on your eyes wakes you',
      'Keep a phone alarm you can still hear, or use a vibrating one',
    ],
  },
  {
    category: 'health_fitness',
    description:
      'Cook dinner at home more nights than not. Across large survey data, people who cook at home frequently eat measurably better — fewer calories, less sugar and fat — without following any particular diet.',
    estimatedMinutes: 40,
    frequency: 'weekly',
    growthType: 'average',
    icon: '🍳',
    iconColor: '#EA580C',
    name: 'Home-Cooked Dinner',
    popularityScore: 85,
    scientificReference:
      'Wolfson & Bleich (2015) - Is cooking at home associated with better diet quality or weight-loss intention?, Public Health Nutrition',
    startSmallVersion: 'Cook one thing tonight, even if it is eggs.',
    tips: [
      'Count nights per week rather than chasing a daily streak',
      'Repeat the same three meals until they are automatic — variety comes later',
      'Prep one component in advance and the decision at 7pm gets much easier',
    ],
  },
  {
    category: 'mental_health',
    description:
      'Do one small deliberate act of joy a day — send someone appreciation, take in something beautiful, do a small kindness. In a large online trial, a week of five-minute micro-acts improved emotional wellbeing and reduced stress, with bigger gains for people who started lower.',
    estimatedMinutes: 5,
    frequency: 'daily',
    growthType: 'simple',
    icon: '✨',
    iconColor: '#FACC15',
    name: 'Micro-Act of Joy',
    popularityScore: 82,
    scientificReference:
      'Fisher et al. (2025) - Micro-acts of joy and emotional wellbeing: the BIG JOY Project, Journal of Medical Internet Research',
    startSmallVersion: 'Send one message telling someone what you appreciate.',
    tips: [
      'Vary the act — the same one every day stops registering',
      'Small and specific beats grand and vague',
      'It works best when it is genuinely for someone else, not performed',
    ],
  },
];
