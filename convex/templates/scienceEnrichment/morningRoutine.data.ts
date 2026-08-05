/**
 * Science drill-down copy — Morning Routine.
 *
 * '5-Minute Meditation' is deliberately absent: it is already fully authored
 * inline in templatesDataSeed, and the patch mutation would overwrite it.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const MORNING_ROUTINE_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Wake-Up Movement': {
    tagline: 'Five minutes of easy movement before anything else.',
    lead: 'Light movement on waking raises core body temperature and speeds the clearance of adenosine — the molecule behind that groggy, still-half-asleep feeling. It shifts you into an alert state faster than sitting still and waiting does.',
    cadenceLabel: 'Daily · 5 min · on waking',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Faster wake-up',
        description: 'Grogginess fades in minutes instead of an hour.',
      },
      {
        icon: 'target',
        title: 'Morning momentum',
        description: 'One easy win makes the next habit easier to start.',
      },
      {
        icon: 'moon',
        title: 'Better sleep pressure',
        description: 'Earlier activity helps you feel sleepy at the right time.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Noticeably more awake',
        description: 'The alertness boost is immediate, even if the habit is not.',
      },
      {
        when: 'Week 2',
        title: 'Reaching for it without thinking',
        description: 'Your body starts expecting movement as part of waking.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'It is just how your mornings start now.',
        peak: true,
      },
    ],
    howToStart: [
      'Start small: 10 seconds of arm circles before you leave the bed.',
      'Add 2 minutes of gentle stretching once standing feels routine.',
      'Build to 5 minutes — a short walk or full-body stretch.',
    ],
  },

  'Hydration First': {
    tagline: 'A glass of water before anything else.',
    lead: 'You lose water steadily overnight through breathing and sweat, so you wake mildly dehydrated. Even small fluid deficits measurably affect alertness and concentration — and the fix takes ten seconds.',
    cadenceLabel: 'Daily · 1 glass on waking',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Clearer head',
        description: 'Mild dehydration is a real drag on attention.',
      },
      {
        icon: 'target',
        title: 'An easy first win',
        description: 'The smallest possible habit to succeed at.',
      },
      {
        icon: 'leaf',
        title: 'Anchors the rest',
        description: 'A reliable hook to attach other morning habits to.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediate and small',
        description: 'Subtle, but you will notice it on a dry morning.',
      },
      {
        when: 'Week 2',
        title: 'You feel it when you skip',
        description: 'The absence becomes more obvious than the habit.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'The glass is the first thing your hand goes to.',
        peak: true,
      },
    ],
    howToStart: [
      'Fill the glass the night before and leave it by the bed.',
      'One glass. Do not turn it into a litre challenge.',
      'Drink it before your phone — that ordering is the actual habit.',
    ],
    sources: [
      {
        authors: 'Popkin BM, D’Anci KE, Rosenberg IH',
        title: 'Water, hydration, and health',
        journal: 'Nutrition Reviews',
        year: '2010',
      },
    ],
  },

  'Make Your Bed': {
    tagline: 'One finished task before the day starts.',
    lead: 'This is not really about the bed. It is a two-minute action you can complete before anything has a chance to go wrong, which makes the next small task marginally easier to start. Treat the tidiness as a side effect.',
    cadenceLabel: 'Daily · 2 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'A completed task',
        description: 'The day opens with something finished.',
      },
      {
        icon: 'leaf',
        title: 'A calmer room',
        description: 'Order you walk back into that evening.',
      },
      {
        icon: 'sparkle',
        title: 'Momentum',
        description: 'Small wins make the next action cheaper.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Mildly satisfying',
        description: 'Do not expect transformation — expect a tidy bed.',
      },
      {
        when: 'Week 2',
        title: 'Bothered when you skip',
        description: 'The unmade bed starts to register.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You do it without noticing you did.',
        peak: true,
      },
    ],
    howToStart: [
      'Pull the duvet up and smooth it once. That counts.',
      'Do it immediately on getting up, before leaving the room.',
      'Skip the hotel-grade version. Consistency beats presentation.',
    ],
    sources: [
      {
        authors: 'McRaven WH',
        title: 'Make Your Bed: Little Things That Can Change Your Life',
        journal: 'Grand Central Publishing',
        year: '2017',
      },
    ],
  },

  'Morning Pages': {
    tagline: 'Three pages, unedited, first thing.',
    lead: 'Writing without stopping or editing empties the loop of half-formed thoughts before they can occupy your day. The output is not meant to be good — it is meant to be gone, which is why nobody, including you, should reread it.',
    cadenceLabel: 'Daily · 15-20 min · on waking',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Clearer head',
        description: 'Mental clutter goes onto paper instead of into the day.',
      },
      {
        icon: 'target',
        title: 'Problems surface',
        description: 'Things you were avoiding tend to appear in writing.',
      },
      {
        icon: 'leaf',
        title: 'No standards',
        description: 'Nothing to live up to means nothing to avoid.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels pointless',
        description: 'The first pages are usually complaints and lists.',
      },
      {
        when: 'Week 3',
        title: 'Real thinking appears',
        description: 'Past the surface noise, useful things show up.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The pages become how the day starts.',
        peak: true,
      },
    ],
    howToStart: [
      'Longhand, first thing, before email. One page is a fine start.',
      'Never stop to edit. If you stall, write about stalling.',
      'Do not reread it. That is what makes it safe to be honest.',
    ],
  },

  'Sun Salutation Flow': {
    tagline: 'A few rounds to move every joint.',
    lead: 'A sun salutation runs your spine, hips and shoulders through their full range in one continuous sequence. As a morning practice its value is coverage — you touch most of the body in five minutes without needing a plan.',
    cadenceLabel: 'Daily · 5-10 min · morning',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Full-body mobility',
        description: 'Most major joints in a single sequence.',
      },
      {
        icon: 'sparkle',
        title: 'Wakes you up',
        description: 'Movement plus breath beats stretching alone.',
      },
      {
        icon: 'leaf',
        title: 'No equipment',
        description: 'A mat’s worth of floor is the entire requirement.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Stiff and clumsy',
        description: 'Morning bodies are tight. That is expected.',
      },
      {
        when: 'Week 3',
        title: 'Smoother and deeper',
        description: 'The sequence starts flowing rather than stopping.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Your body asks for it before your mind does.',
        peak: true,
      },
    ],
    howToStart: [
      'Learn the sequence once from a video, slowly.',
      'Three rounds to start. Build to eight or ten.',
      'Move with the breath — one movement per inhale or exhale.',
    ],
  },

  'Airplane Mode Morning': {
    tagline: 'Keep the phone offline for the first hour.',
    lead: 'Opening your phone hands the first hour of your attention to whatever is loudest in it. Staying offline is not about discipline — it is about not starting the day in a reactive posture you then have to climb out of.',
    cadenceLabel: 'Daily · first 60 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Your agenda first',
        description: 'The day starts with your priorities, not other people’s.',
      },
      {
        icon: 'wave',
        title: 'Calmer start',
        description: 'No news or inbox spike before you are awake.',
      },
      {
        icon: 'sparkle',
        title: 'Room for everything else',
        description: 'Every other morning habit becomes possible.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Twitchy',
        description: 'The reach for the phone is more automatic than you think.',
      },
      {
        when: 'Week 2',
        title: 'Slower mornings',
        description: 'The hour starts feeling like yours.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Checking first thing stops appealing.',
        peak: true,
      },
    ],
    howToStart: [
      'Charge the phone outside the bedroom and buy a real alarm clock.',
      'Start with 20 minutes if an hour is not realistic.',
      'Decide the night before what fills the time.',
    ],
    sources: [
      {
        authors: 'Newport C',
        title: 'Digital Minimalism: Choosing a Focused Life in a Noisy World',
        journal: 'Portfolio',
        year: '2019',
      },
    ],
  },

  'Morning Mirror Smile': {
    tagline: 'Smile at yourself for a minute.',
    lead: 'Facial expression feeds back into emotional state, not only the other way round — holding a genuine smile measurably affects stress recovery. It feels ridiculous, which is part of why it works.',
    evidence:
      'Kraft & Pressman (2012) found participants holding a genuine (Duchenne) smile during a stressful task had lower heart rates during recovery than those holding a neutral expression.',
    cadenceLabel: 'Daily · 1 min · on waking',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Mood nudge',
        description: 'Expression feeds back into how you feel.',
      },
      {
        icon: 'wave',
        title: 'Faster stress recovery',
        description: 'Smiling blunts the physiological stress response.',
      },
      {
        icon: 'sparkle',
        title: 'Impossible to fail',
        description: 'No skill, no equipment, one minute.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Deeply awkward',
        description: 'Everyone finds this silly at first. Do it anyway.',
      },
      {
        when: 'Week 2',
        title: 'Genuinely amusing',
        description: 'The absurdity itself starts producing a real smile.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Part of being in front of the mirror.',
        peak: true,
      },
    ],
    howToStart: [
      'Hold it long enough to reach your eyes — that is the version that counts.',
      'Thirty seconds is plenty to start.',
      'Attach it to brushing your teeth so the cue already exists.',
    ],
    sources: [
      {
        authors: 'Kraft TL, Pressman SD',
        title:
          'Grin and bear it: the influence of manipulated facial expression on the stress response',
        journal: 'Psychological Science',
        year: '2012',
      },
    ],
  },

  'Bilateral Eye Movements': {
    tagline: 'Look left and right to shake off sleep inertia.',
    lead: 'Deliberate horizontal eye movements engage attentional and oculomotor systems and are used clinically as bilateral stimulation. As a morning habit the evidence is thin — treat it as a cheap experiment rather than an established protocol.',
    cadenceLabel: 'Daily · 1 min · on waking',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Quick activation',
        description: 'A deliberate action to break sleep inertia.',
      },
      {
        icon: 'target',
        title: 'Attention engaged',
        description: 'Tracking demands focus straight away.',
      },
      {
        icon: 'leaf',
        title: 'Costs nothing',
        description: 'A minute, in bed, with no equipment.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Mild and immediate',
        description: 'A small nudge toward alertness.',
      },
      {
        when: 'Week 2',
        title: 'Part of waking',
        description: 'Easiest to do before you get out of bed.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A reflex on opening your eyes.',
        peak: true,
      },
    ],
    howToStart: [
      'Keep your head still and move your eyes side to side.',
      '30-50 passes, slow and controlled.',
      'Stop if it makes you dizzy or your eyes ache.',
    ],
  },
};
