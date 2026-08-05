/**
 * Science drill-down copy — Health & Fitness: preventive care, hygiene,
 * protection, self-monitoring.
 *
 * These are the least glamorous habits in the library and among the
 * highest-value. Copy leans on the boring-but-real framing rather than
 * manufacturing excitement.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const HEALTH_PREVENTIVE_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Preventive Health Checkups': {
    tagline: 'Book the screenings for your age, and go.',
    lead: 'Screening finds the things that are silent until they are not — blood pressure, cholesterol, glucose, and the cancers with good outcomes when caught early. Nothing in a habit app competes with catching something early.',
    cadenceLabel: 'Annually · per age guidance',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Catches silent problems',
        description: 'The conditions with no symptoms until late.',
      },
      {
        icon: 'target',
        title: 'A baseline to compare against',
        description: 'One reading means little; a trend means everything.',
      },
      {
        icon: 'wave',
        title: 'Removes low-grade worry',
        description: 'Knowing beats wondering.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Booking is the hard part',
        description: 'The appointment itself is easy.',
      },
      {
        when: 'After the visit',
        title: 'Numbers to work with',
        description: 'Now other habits have a target.',
      },
      {
        when: 'Annually',
        title: 'Automatic',
        description: 'It becomes a standing yearly item.',
        peak: true,
      },
    ],
    howToStart: [
      'Open the calendar and pick a checkup date.',
      'Ask which screenings apply to your age, sex and family history.',
      'Write the results down so next year has something to compare to.',
    ],
    sources: [
      {
        authors: 'Centers for Disease Control and Prevention',
        title: 'Preventive care guidelines for adults',
        journal: 'CDC',
        year: '2024',
      },
    ],
  },

  'Blood Pressure Check': {
    tagline: 'Take your own reading and log it.',
    lead: 'High blood pressure has no symptoms until it causes damage, and clinic readings are a poor sample — one measurement, on an unusual day, often elevated by the appointment itself. Home monitoring gives you the real number, and it improves control.',
    evidence:
      'Uhlig et al. (2013) reviewed self-measured blood pressure monitoring and found it improved blood pressure control compared with usual care, particularly when combined with additional support.',
    cadenceLabel: 'Weekly · 1 reading',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Better control',
        description: 'Self-monitoring measurably improves outcomes.',
      },
      {
        icon: 'target',
        title: 'A real average',
        description: 'Many readings beat one anxious clinic sample.',
      },
      {
        icon: 'wave',
        title: 'Feedback on everything else',
        description: 'Exercise, salt, sleep and alcohol all show up here.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Baseline',
        description: 'Take several readings; ignore the first.',
      },
      {
        when: 'Week 6',
        title: 'A trend appears',
        description: 'Lifestyle changes become visible.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A standing weekly check.',
        peak: true,
      },
    ],
    howToStart: [
      'Strap on the cuff and take one reading.',
      'Sit still five minutes first, feet flat, arm supported at heart height.',
      'Take a validated upper-arm monitor. Show a persistently high or very high reading to a clinician — do not self-manage it.',
    ],
    sources: [
      {
        authors: 'Uhlig K, et al.',
        title:
          'Self-measured blood pressure monitoring in the management of hypertension: a systematic review and meta-analysis',
        journal: 'Annals of Internal Medicine',
        year: '2013',
      },
    ],
  },

  'Daily Flossing': {
    tagline: 'Clean between the teeth, not just across them.',
    lead: 'A brush cannot reach the surfaces between teeth, which is exactly where gum disease starts. Interdental cleaning measurably reduces inflammation and bleeding — and gum health tracks with cardiovascular and metabolic health more closely than most people expect.',
    cadenceLabel: 'Daily · 2 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Less gum inflammation',
        description: 'Measured in bleeding and plaque scores.',
      },
      {
        icon: 'target',
        title: 'Reaches what brushing misses',
        description: 'Roughly a third of each tooth surface.',
      },
      {
        icon: 'wave',
        title: 'Cheap prevention',
        description: 'Far cheaper than periodontal treatment.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-5',
        title: 'Some bleeding',
        description: 'Usually a sign of existing inflammation, not damage.',
      },
      {
        when: 'Week 3',
        title: 'Bleeding stops',
        description: 'Gums firm up noticeably.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of brushing, not a separate task.',
        peak: true,
      },
    ],
    howToStart: [
      'Floss between two teeth. Genuinely — that is the start.',
      'Interdental brushes are easier than string for most people.',
      'Do it before brushing so fluoride reaches the gaps you just cleaned.',
    ],
    sources: [
      {
        authors: 'SHIP-TREND Study',
        title: 'Interdental cleaning, plaque and gingival bleeding',
        journal: 'Journal of Clinical Periodontology',
        year: '2024',
      },
    ],
  },

  'Regular Dental Checkups': {
    tagline: 'A dental visit roughly twice a year.',
    lead: 'Dental problems are progressive and almost entirely painless until they are expensive. A checkup catches decay and gum disease at the stage where the fix is small — this is a habit that protects your money as much as your teeth.',
    cadenceLabel: 'Every 6 months',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Caught early',
        description: 'Decay is silent until it is not.',
      },
      {
        icon: 'target',
        title: 'Professional cleaning',
        description: 'Removes hardened deposits you cannot.',
      },
      {
        icon: 'wave',
        title: 'Cheaper',
        description: 'A checkup costs a fraction of a root canal.',
      },
    ],
    timeline: [
      {
        when: 'Booking',
        title: 'The only real friction',
        description: 'Avoidance is the actual obstacle here.',
      },
      {
        when: 'After the visit',
        title: 'Clean slate',
        description: 'Plus a specific list of what to watch.',
      },
      {
        when: 'Every 6 months',
        title: 'Automatic',
        description: 'Book the next one before leaving.',
        peak: true,
      },
    ],
    howToStart: [
      'Open the calendar and pick a dentist date.',
      'Book the next appointment while you are still at the desk.',
      'If anxiety is the barrier, say so when booking — most practices adapt.',
    ],
    sources: [
      {
        authors: 'American Dental Association',
        title: 'Preventive dental care recommendations',
        journal: 'ADA Clinical Guidance',
        year: '2023',
      },
    ],
  },

  'Hand Hygiene (Key Times)': {
    tagline: 'Wash at the moments that matter.',
    lead: 'Hand hygiene is among the most cost-effective health interventions ever measured, and the timing matters more than the frequency — before eating, after the bathroom, after public transport. Those three cover most of the transmission risk.',
    evidence:
      'Aiello et al. (2008) meta-analysed hand-hygiene interventions and found they reduced the risk of respiratory and gastrointestinal illness.',
    cadenceLabel: 'Daily · at key moments',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Fewer infections',
        description: 'Respiratory and gastrointestinal both.',
      },
      {
        icon: 'target',
        title: 'Timing beats frequency',
        description: 'Three key moments do most of the work.',
      },
      {
        icon: 'wave',
        title: 'Protects other people',
        description: 'Especially anyone vulnerable around you.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Just remembering',
        description: 'The habit is the trigger, not the technique.',
      },
      {
        when: 'Week 2',
        title: 'Cues fire on their own',
        description: 'Arriving home starts prompting it.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You do it without deciding.',
        peak: true,
      },
    ],
    howToStart: [
      'Wash your hands once before your next meal.',
      'Twenty seconds with soap. Backs of hands and between fingers.',
      'Anchor it to three fixed events rather than trying to wash more often.',
    ],
    sources: [
      {
        authors: 'Aiello AE, Coulborn RM, Perez V, Larson EL',
        title:
          'Effect of hand hygiene on infectious disease risk in the community setting: a meta-analysis',
        journal: 'American Journal of Public Health',
        year: '2008',
      },
    ],
  },

  'Daily Sunscreen': {
    tagline: 'Face and neck, every morning.',
    lead: 'Regular sunscreen use lowers melanoma incidence — one of the few cosmetic-adjacent habits with hard randomised-trial evidence behind it. It also does more for visible skin ageing than any product marketed for that purpose.',
    evidence:
      'Green et al. (2011) reported long-term follow-up of the Nambour trial, finding regular sunscreen use reduced melanoma incidence compared with discretionary use.',
    cadenceLabel: 'Daily · morning',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Lower melanoma risk',
        description: 'Randomised trial evidence, with follow-up.',
      },
      {
        icon: 'sparkle',
        title: 'Less photoageing',
        description: 'The most effective anti-ageing step there is.',
      },
      {
        icon: 'target',
        title: 'Thirty seconds',
        description: 'Attaches to a routine you already have.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy',
        description: 'The only friction is remembering.',
      },
      {
        when: 'Week 2',
        title: 'Part of the routine',
        description: 'Keep it next to the toothbrush.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You notice when you have not.',
        peak: true,
      },
    ],
    howToStart: [
      'Dot sunscreen on your nose. Start ridiculous, build up.',
      'SPF 30+, broad spectrum. Do not forget ears and the back of the neck.',
      'Find a texture you actually like — that decides whether this survives.',
    ],
    sources: [
      {
        authors: 'Green AC, et al.',
        title:
          'Reduced melanoma after regular sunscreen use: randomized trial follow-up',
        journal: 'Journal of Clinical Oncology',
        year: '2011',
      },
    ],
  },

  'Hearing Protection': {
    tagline: 'Carry earplugs and actually use them.',
    lead: 'Noise-induced hearing loss is permanent, cumulative, and almost entirely preventable — hair cells in the inner ear do not regenerate. The tinnitus after a loud night is not a hangover; it is a warning.',
    cadenceLabel: 'Every loud environment',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Permanent damage avoided',
        description: 'Hair cells do not come back.',
      },
      {
        icon: 'target',
        title: 'Cumulative protection',
        description: 'Every exposure you skip counts.',
      },
      {
        icon: 'wave',
        title: 'Better sound, oddly',
        description: 'Musician plugs cut volume without killing clarity.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Muffled at first',
        description: 'Filtered plugs are much better than foam here.',
      },
      {
        when: 'Week 2',
        title: 'No ringing afterwards',
        description: 'The absence is the evidence.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'They live in your bag.',
        peak: true,
      },
    ],
    howToStart: [
      'Tuck earplugs into your bag. That is the habit — availability.',
      'Filtered "musician" plugs for gigs; foam for power tools.',
      'Ringing or muffled hearing after an event means it was too loud. See an audiologist if it persists.',
    ],
    sources: [
      {
        authors: 'National Institute on Deafness and Other Communication Disorders',
        title: 'Noise-induced hearing loss',
        journal: 'NIDCD',
        year: '2021',
      },
    ],
  },

  'Safe Listening Volume': {
    tagline: 'Keep headphones at or below sixty percent.',
    lead: 'Personal audio is the most common avoidable source of hearing damage, and the risk is a product of volume and duration — loud for a short time or moderate all day both add up. Sixty percent is the widely used rule of thumb.',
    cadenceLabel: 'Daily · ongoing',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Hearing preserved',
        description: 'The damage is permanent; the prevention is free.',
      },
      {
        icon: 'target',
        title: 'Volume × time',
        description: 'Both halves of the dose matter.',
      },
      {
        icon: 'wave',
        title: 'Less listening fatigue',
        description: 'Lower volume is simply less tiring.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels quiet',
        description: 'Your ears are calibrated to too loud.',
      },
      {
        when: 'Week 2',
        title: 'Recalibrated',
        description: 'The old volume starts sounding excessive.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You keep it down without thinking.',
        peak: true,
      },
    ],
    howToStart: [
      'Lower your headphone volume two notches.',
      'Noise-cancelling helps more than volume — you turn it up to beat noise.',
      'Use your phone’s built-in volume limit and headphone-safety warnings.',
    ],
    sources: [
      {
        authors: 'World Health Organization',
        title: 'Safe listening devices and systems: a WHO-ITU standard',
        journal: 'WHO',
        year: '2019',
      },
    ],
  },
};
