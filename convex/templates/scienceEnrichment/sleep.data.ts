/**
 * Science drill-down copy — Sleep.
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const SLEEP_ENRICHMENT: Record<string, ScienceEnrichment> = {
  '7-9 Hours Sleep': {
    tagline: 'Give sleep the window it actually needs.',
    lead: 'Sleep is when memory gets consolidated, hormones get rebalanced, and the brain clears metabolic waste. Most of that work is back-loaded into the later hours, so cutting the window short cuts the restoration, not the filler.',
    evidence:
      'The National Sleep Foundation’s 2015 expert consensus recommends 7-9 hours nightly for adults, with under 6 hours judged inappropriate for nearly all healthy adults.',
    cadenceLabel: 'Nightly · 7-9 hours in bed',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Sharper thinking',
        description: 'Attention, memory and judgement all depend on it.',
      },
      {
        icon: 'leaf',
        title: 'Steadier mood',
        description: 'Short sleep makes everything feel worse than it is.',
      },
      {
        icon: 'wave',
        title: 'Better recovery',
        description: 'Training and stress both get repaired overnight.',
      },
    ],
    timeline: [
      {
        when: 'Night 1-3',
        title: 'Paying down debt',
        description: 'Early nights may feel heavy as you catch up.',
      },
      {
        when: 'Week 2',
        title: 'Sharper days',
        description: 'The cognitive difference becomes hard to miss.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The window defends itself without negotiation.',
        peak: true,
      },
    ],
    howToStart: [
      'Work backwards from your fixed wake time to set a bedtime.',
      'Budget time in bed, not time asleep — allow about 30 minutes extra.',
      'Set an alarm for going to bed, not just for getting up.',
    ],
    sources: [
      {
        authors: 'Hirshkowitz M, et al.',
        title:
          'National Sleep Foundation’s sleep time duration recommendations: methodology and results summary',
        journal: 'Sleep Health',
        year: '2015',
      },
    ],
  },

  'Consistent Bedtime': {
    tagline: 'Same bedtime, so sleep stops being a negotiation.',
    lead: 'A stable bedtime lets your body start the wind-down before you do — melatonin release and core temperature drop begin on schedule rather than on demand. Irregularity, not just short sleep, is independently linked to worse outcomes.',
    cadenceLabel: 'Nightly · same time',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Falling asleep faster',
        description: 'Your body pre-empts the routine.',
      },
      {
        icon: 'wave',
        title: 'Fewer wake-ups',
        description: 'Regular timing stabilises sleep architecture.',
      },
      {
        icon: 'target',
        title: 'Predictable mornings',
        description: 'A fixed bedtime makes the wake time survivable.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'Lying awake early',
        description: 'Expect friction while your clock catches up.',
      },
      {
        when: 'Week 2',
        title: 'Sleepy on cue',
        description: 'Tiredness starts arriving near your target time.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The bedtime holds itself.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a time you can keep on a Friday, not just a Monday.',
      'Set a wind-down alarm 30 minutes before it.',
      'Hold the wake time steady too — the two anchor each other.',
    ],
    sources: [
      {
        authors: 'Walker M',
        title: 'Why We Sleep: Unlocking the Power of Sleep and Dreams',
        journal: 'Scribner',
        year: '2017',
      },
    ],
  },

  'No Screens Before Bed': {
    tagline: 'Put the screens down an hour before bed.',
    lead: 'Evening light — especially the short-wavelength light screens are rich in — suppresses melatonin and pushes your body clock later. The content keeps you alert too, but the light alone is enough to move your sleep.',
    evidence:
      'Chang et al. (2015) found that reading on a light-emitting device before bed suppressed melatonin, delayed sleep onset, and reduced next-morning alertness compared with a printed book.',
    cadenceLabel: 'Nightly · last 60 min',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Melatonin on time',
        description: 'Your sleep signal is not held back by light.',
      },
      {
        icon: 'wave',
        title: 'Falling asleep sooner',
        description: 'Less alerting input right before bed.',
      },
      {
        icon: 'sparkle',
        title: 'Better mornings',
        description: 'Undelayed sleep means less morning grogginess.',
      },
    ],
    timeline: [
      {
        when: 'Night 1-3',
        title: 'The hard part is boredom',
        description: 'Have a replacement ready or you will reach for the phone.',
      },
      {
        when: 'Week 2',
        title: 'Earlier sleepiness',
        description: 'The wind-down starts arriving on its own.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The phone goes down without a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Charge your phone outside the bedroom — distance beats willpower.',
      'Pick the replacement first: a book, a shower, a stretch.',
      'Start with 20 minutes if an hour is unrealistic.',
    ],
    sources: [
      {
        authors: 'Chang A-M, et al.',
        title:
          'Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness',
        journal: 'PNAS',
        year: '2015',
      },
    ],
  },

  'No Afternoon Caffeine': {
    tagline: 'Cut caffeine after early afternoon.',
    lead: 'Caffeine has a half-life of roughly five to six hours, so an afternoon coffee still has meaningful levels in your blood at bedtime. It blocks adenosine — the signal that makes you sleepy — so sleep gets lighter even when you fall asleep fine.',
    evidence:
      'Drake et al. (2013) found that 400 mg of caffeine taken even six hours before bed measurably disrupted sleep, often without participants noticing.',
    cadenceLabel: 'Daily · nothing after 2pm',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Deeper sleep',
        description: 'Less caffeine on board means less fragmented sleep.',
      },
      {
        icon: 'wave',
        title: 'Less next-day dependence',
        description: 'Better sleep reduces the morning caffeine debt.',
      },
      {
        icon: 'target',
        title: 'Truer tiredness',
        description: 'You start reading your real energy levels.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'A flat afternoon',
        description: 'The 3pm dip is real while you adjust.',
      },
      {
        when: 'Week 2',
        title: 'Better nights',
        description: 'Sleep quality improves, which flattens the dip.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Afternoon coffee stops occurring to you.',
        peak: true,
      },
    ],
    howToStart: [
      'Set a hard cutoff time and treat it as fixed.',
      'Swap the ritual, not just the drink — decaf or tea still counts as a break.',
      'Move the cutoff 30 minutes earlier each week if you are starting late.',
    ],
    sources: [
      {
        authors: 'Drake C, et al.',
        title:
          'Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
        journal: 'Journal of Clinical Sleep Medicine',
        year: '2013',
      },
    ],
  },

  'Pre-Sleep Warm Bath': {
    tagline: 'A warm bath about 90 minutes before bed.',
    lead: 'Warming your skin pulls blood to the surface, and the heat you shed afterwards accelerates the core-temperature drop that triggers sleep. The counter-intuitive part is that getting warm helps by making you cool faster.',
    evidence:
      'Haghayegh et al. (2019) reviewed water-based passive body heating and found bathing 1-2 hours before bed shortened the time taken to fall asleep by around 10 minutes on average.',
    cadenceLabel: 'Nightly · 10-20 min, ~90 min before bed',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Faster sleep onset',
        description: 'The post-bath temperature drop is the active ingredient.',
      },
      {
        icon: 'wave',
        title: 'Physical wind-down',
        description: 'Muscles let go before you get into bed.',
      },
      {
        icon: 'leaf',
        title: 'A clear boundary',
        description: 'Marks the end of the day, not just the end of work.',
      },
    ],
    timeline: [
      {
        when: 'First night',
        title: 'Sleepy afterwards',
        description: 'The drowsiness as you cool down is the mechanism.',
      },
      {
        when: 'Week 2',
        title: 'A reliable cue',
        description: 'Your body reads the bath as the start of sleep.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The evening has a shape you do not have to plan.',
        peak: true,
      },
    ],
    howToStart: [
      'Warm, not scalding — around 40°C for 10-20 minutes.',
      'Timing matters more than length: aim for 60-120 minutes before bed.',
      'A hot shower or even a foot bath gives a smaller version of the effect.',
    ],
    sources: [
      {
        authors: 'Haghayegh S, et al.',
        title:
          'Before-bedtime passive body heating by warm shower or bath to improve sleep: a systematic review and meta-analysis',
        journal: 'Sleep Medicine Reviews',
        year: '2019',
      },
    ],
  },

  'No Evening Alcohol': {
    tagline: 'Leave a few hours between the last drink and bed.',
    lead: 'Alcohol is sedating, which is why it feels like it helps. But as your body metabolises it, sleep rebounds into fragmentation and REM gets suppressed — you fall asleep faster and sleep worse.',
    cadenceLabel: 'Nightly · none within 3-4 hours',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'REM returns',
        description: 'The stage alcohol suppresses most comes back.',
      },
      {
        icon: 'wave',
        title: 'Fewer 3am wake-ups',
        description: 'The rebound arousal is what wakes you.',
      },
      {
        icon: 'sparkle',
        title: 'Real mornings',
        description: 'Waking rested rather than merely functional.',
      },
    ],
    timeline: [
      {
        when: 'Night 1-3',
        title: 'Harder to switch off',
        description: 'You lose a sedative and have to wind down properly.',
      },
      {
        when: 'Week 2',
        title: 'Vivid dreams return',
        description: 'A sign REM is rebounding to normal.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The nightcap stops being part of the evening.',
        peak: true,
      },
    ],
    howToStart: [
      'Set a last-drink time, not a drink limit.',
      'Have the replacement ready — sparkling water, tea, anything with a ritual.',
      'Start with the three nights a week that matter most.',
    ],
    sources: [
      {
        authors: 'Ebrahim IO, et al.',
        title: 'Alcohol and sleep I: effects on normal sleep',
        journal: 'Alcoholism: Clinical and Experimental Research',
        year: '2013',
      },
    ],
  },

  'Stimulus Control (CBT-I)': {
    tagline: 'Bed is for sleeping — retrain the association.',
    lead: 'If you spend hours awake and frustrated in bed, your brain learns that bed means wakefulness. Stimulus control breaks that link by only allowing you in bed when sleepy, and out of it when you are not. It is one of the most effective components of insomnia treatment.',
    cadenceLabel: 'Nightly · ongoing practice',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Bed means sleep again',
        description: 'Rebuilds the association insomnia erodes.',
      },
      {
        icon: 'wave',
        title: 'Less bedtime dread',
        description: 'You stop lying there fighting yourself.',
      },
      {
        icon: 'target',
        title: 'Clinically established',
        description: 'A core component of CBT for insomnia.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Worse before better',
        description: 'Getting out of bed at 2am is genuinely unpleasant.',
      },
      {
        when: 'Week 3',
        title: 'Shorter awakenings',
        description: 'Time spent awake in bed starts dropping.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Getting into bed makes you sleepy again.',
        peak: true,
      },
    ],
    howToStart: [
      'Only get into bed when actually sleepy — not merely tired.',
      'Awake more than ~20 minutes? Get up, dim light, do something dull, return when sleepy.',
      'No phone, work, or TV in bed. Keep your wake time fixed regardless.',
    ],
    sources: [
      {
        authors: 'Bootzin RR',
        title: 'Stimulus control treatment for insomnia',
        journal: 'Proceedings of the American Psychological Association',
        year: '1972',
      },
    ],
  },

  'Evening Brain Dump': {
    tagline: 'Write tomorrow down so you can stop rehearsing it.',
    lead: 'Unfinished tasks stay active in working memory, and lying still in the dark is when they surface. Writing them out hands the tracking job to paper — the point is offloading, not planning.',
    evidence:
      'Scullin et al. (2018) found participants who spent five minutes writing a specific to-do list before bed fell asleep significantly faster than those who journalled about completed tasks.',
    cadenceLabel: 'Nightly · 5 min',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Faster sleep onset',
        description: 'Fewer loops to run through in the dark.',
      },
      {
        icon: 'wave',
        title: 'Quieter mind',
        description: 'Worries have somewhere to go besides your head.',
      },
      {
        icon: 'target',
        title: 'A head start',
        description: 'Tomorrow is already sketched when you wake.',
      },
    ],
    timeline: [
      {
        when: 'First night',
        title: 'Often works immediately',
        description: 'The effect on sleep onset can show up straight away.',
      },
      {
        when: 'Week 2',
        title: 'Less rumination',
        description: 'You stop carrying tasks to bed at all.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The list is part of shutting the day down.',
        peak: true,
      },
    ],
    howToStart: [
      'Paper and pen by the bed. No phone — that defeats the point.',
      'Write specific next actions, not vague worries.',
      'Five minutes, then close the notebook. It is a dump, not a planning session.',
    ],
    sources: [
      {
        authors: 'Scullin MK, et al.',
        title:
          'The effects of bedtime writing on difficulty falling asleep: a polysomnographic study',
        journal: 'Journal of Experimental Psychology: General',
        year: '2018',
      },
    ],
  },

  'Blue Light Blocking': {
    tagline: 'Amber glasses for the last hours of the evening.',
    lead: 'The receptors that set your body clock are most sensitive to blue wavelengths. Filtering those in the evening lets you keep using screens while cutting most of their effect on melatonin — a workaround, not a substitute for dimming.',
    evidence:
      'Shechter et al. (2018) ran a randomised trial of amber lenses worn before bed in people with insomnia and found improvements in sleep duration and quality versus clear lenses.',
    cadenceLabel: 'Nightly · last 2-3 hours',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Melatonin protected',
        description: 'Filters the wavelengths that suppress it most.',
      },
      {
        icon: 'sparkle',
        title: 'No behaviour change',
        description: 'You put glasses on instead of giving screens up.',
      },
      {
        icon: 'wave',
        title: 'A visual cue',
        description: 'Putting them on marks the start of the evening.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Everything looks amber',
        description: 'Odd for an evening, then unremarkable.',
      },
      {
        when: 'Week 2',
        title: 'Earlier sleepiness',
        description: 'The wind-down starts arriving on schedule.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'On with the glasses when the evening starts.',
        peak: true,
      },
    ],
    howToStart: [
      'Choose genuinely amber or red-tinted lenses — faintly yellow ones do little.',
      'Put them on 2-3 hours before bed, not five minutes before.',
      'Dim the room lights too. Glasses help; darkness helps more.',
    ],
    sources: [
      {
        authors: 'Shechter A, et al.',
        title:
          'Blocking nocturnal blue light for insomnia: a randomized controlled trial',
        journal: 'Journal of Psychiatric Research',
        year: '2018',
      },
    ],
  },

  'Evening Magnesium': {
    tagline: 'A magnesium dose in the evening.',
    lead: 'Magnesium is a cofactor in hundreds of reactions, including the GABA signalling that quiets the nervous system. Trial evidence is modest and mostly in older or deficient adults, so treat it as a small nudge rather than a sleep fix.',
    cadenceLabel: 'Nightly · 30-60 min before bed',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Supports wind-down',
        description: 'A cofactor in the systems that calm you.',
      },
      {
        icon: 'leaf',
        title: 'Muscle relaxation',
        description: 'Often noticed before any sleep effect.',
      },
      {
        icon: 'wave',
        title: 'An evening anchor',
        description: 'Taking it marks the start of the routine.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Subtle at most',
        description: 'Do not expect a sedative — this is not one.',
      },
      {
        when: 'Week 3',
        title: 'Cumulative effect',
        description: 'Any benefit tends to build rather than spike.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of the pre-bed sequence.',
        peak: true,
      },
    ],
    howToStart: [
      'Glycinate or threonate are gentler on the gut than oxide or citrate.',
      'Take it 30-60 minutes before bed with a little food.',
      'Check with a clinician first if you take other medication or have kidney issues.',
    ],
    sources: [
      {
        authors: 'Abbasi B, et al.',
        title:
          'The effect of magnesium supplementation on primary insomnia in elderly: a double-blind placebo-controlled clinical trial',
        journal: 'Journal of Research in Medical Sciences',
        year: '2012',
      },
    ],
  },

  'Weighted Blanket Sleep': {
    tagline: 'Deep pressure that settles the nervous system.',
    lead: 'Broad, even pressure across the body appears to reduce arousal — the same principle behind swaddling and firm hugs. For people whose sleep is disrupted by anxiety rather than schedule, it is a low-effort intervention.',
    cadenceLabel: 'Nightly · one-time purchase',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower arousal',
        description: 'Deep pressure reduces the feeling of being wired.',
      },
      {
        icon: 'moon',
        title: 'Less tossing',
        description: 'The weight discourages restless movement.',
      },
      {
        icon: 'sparkle',
        title: 'Zero maintenance',
        description: 'Buy once; it works every night after that.',
      },
    ],
    timeline: [
      {
        when: 'Night 1-2',
        title: 'Heavy and strange',
        description: 'Most people adapt within a couple of nights.',
      },
      {
        when: 'Week 2',
        title: 'Settling faster',
        description: 'The weight starts reading as comfort.',
      },
      {
        when: '~14 days',
        title: 'Automatic',
        description: 'Sleeping without it feels unmoored.',
        peak: true,
      },
    ],
    howToStart: [
      'Around 10% of body weight is the usual starting point.',
      'Try it over a normal duvet for the first few nights.',
      'Skip it if you overheat easily or have circulatory or respiratory conditions.',
    ],
    sources: [
      {
        authors: 'Ekholm B, Spulber S, Adler M',
        title:
          'A randomized controlled study of weighted chain blankets for insomnia in psychiatric disorders',
        journal: 'Journal of Clinical Sleep Medicine',
        year: '2020',
      },
    ],
  },

  'Sleep Sound Machine': {
    tagline: 'Steady background sound to mask disruptions.',
    lead: 'What wakes you is usually not absolute noise but sudden change in it — a door, a car, a voice. A constant broadband sound raises the floor so those spikes stop standing out.',
    cadenceLabel: 'Nightly · all night',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Fewer disruptions',
        description: 'Sudden noises stop cutting through.',
      },
      {
        icon: 'wave',
        title: 'Faster sleep onset',
        description: 'Steady sound gives attention somewhere dull to rest.',
      },
      {
        icon: 'leaf',
        title: 'Works in cities',
        description: 'Useful where you cannot control the noise.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Often immediate',
        description: 'Masking works the first time you use it.',
      },
      {
        when: 'Week 1',
        title: 'A sleep cue',
        description: 'The sound itself starts signalling bedtime.',
      },
      {
        when: '~14 days',
        title: 'Automatic',
        description: 'Switching it on is part of getting into bed.',
        peak: true,
      },
    ],
    howToStart: [
      'Pink or brown noise is usually easier on the ear than white.',
      'Keep the volume low — masking, not drowning.',
      'A fan works. So does a cheap speaker on a loop.',
    ],
    sources: [
      {
        authors: 'Messineo L, et al.',
        title:
          'Broadband sound administration improves sleep onset latency in healthy subjects in a model of transient insomnia',
        journal: 'Frontiers in Neurology',
        year: '2017',
      },
    ],
  },

  'Next-Day Prep': {
    tagline: 'Set tomorrow out before you go to bed.',
    lead: 'Every decision you make in the morning draws on the same limited pool of attention as your actual work. Making those choices the night before — clothes, bag, breakfast — removes them from the moment you are least equipped to handle them.',
    cadenceLabel: 'Nightly · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Frictionless mornings',
        description: 'Nothing to decide before you are awake.',
      },
      {
        icon: 'wave',
        title: 'Closure for the day',
        description: 'A clear endpoint rather than a fade-out.',
      },
      {
        icon: 'sparkle',
        title: 'Habits get easier',
        description: 'Kit laid out is the strongest cue there is.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'A smoother morning',
        description: 'The payoff arrives the very next day.',
      },
      {
        when: 'Week 2',
        title: 'Mornings on rails',
        description: 'You stop making early decisions at all.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Prepping is just how the evening ends.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with one thing: tomorrow’s clothes.',
      'Add the bag, then the coffee, then breakfast.',
      'Do it at the same point each evening so it has a slot.',
    ],
  },

};
