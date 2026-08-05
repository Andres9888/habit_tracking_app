/**
 * Science drill-down copy — Andrew Huberman protocols.
 *
 * These templates ship with podcast episodes as their `scientificReference`.
 * A podcast is not a paper: `evidence` and `sources` are only filled in here
 * where a real primary study supports the claim. Where none is cited, the UI
 * omits the Science-backed badge.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const HUBERMAN_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Morning Sunlight Viewing': {
    tagline: 'Two minutes of outdoor light to set your body clock.',
    lead: 'Bright light in the first hour after waking is the strongest signal your circadian clock receives. It shuts down melatonin, triggers the morning cortisol rise that drives alertness, and starts the ~16-hour timer that decides when you get sleepy tonight.',
    cadenceLabel: 'Daily · 2-10 min · within an hour of waking',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Faster wake-up',
        description: 'Grogginess lifts in minutes instead of an hour.',
      },
      {
        icon: 'moon',
        title: 'Earlier sleep pressure',
        description: 'Morning light pulls tonight’s sleepiness earlier.',
      },
      {
        icon: 'target',
        title: 'Steadier daytime energy',
        description: 'A cleaner cortisol peak means fewer afternoon crashes.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Noticeably more awake',
        description: 'The alertness effect is immediate, even before the habit sticks.',
      },
      {
        when: 'Week 1-2',
        title: 'Bedtime drifts earlier',
        description: 'Your sleep window starts shifting without forcing it.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Stepping outside becomes part of how your morning starts.',
        peak: true,
      },
    ],
    howToStart: [
      'Step outside within an hour of waking — no sunglasses.',
      'Two minutes on a bright day, longer when overcast.',
      'Pair it with something you already do outdoors: coffee, the dog, the bins.',
    ],
  },

  'Delay Caffeine 90 Minutes': {
    tagline: 'Wait a little before the first coffee.',
    lead: 'Caffeine works by blocking adenosine, the molecule that makes you feel tired. Drinking it before your natural cortisol rise has done its job means the adenosine is still waiting for you later — which is the afternoon crash people blame on lunch.',
    cadenceLabel: 'Daily · delay 60-120 min after waking',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'No afternoon crash',
        description: 'Adenosine clears properly instead of being deferred.',
      },
      {
        icon: 'target',
        title: 'Caffeine works better',
        description: 'The same cup gives you a bigger lift.',
      },
      {
        icon: 'moon',
        title: 'Earlier last cup',
        description: 'Shifting coffee later in the morning protects your sleep.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'The wait is the hard part',
        description: 'The morning gap feels long before it feels normal.',
      },
      {
        when: 'Week 2',
        title: 'Flatter afternoons',
        description: 'The 3pm dip gets noticeably shallower.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You stop reaching for the kettle first thing.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with a 30-minute delay, not 90. Build from there.',
      'Drink water first — much of morning fog is dehydration.',
      'Get outside during the wait. Light does some of caffeine’s job for free.',
    ],
  },

  'Physiological Sigh': {
    tagline: 'Two inhales and a long exhale — the fastest way down.',
    lead: 'A double inhale reinflates collapsed air sacs in your lungs, and the long exhale offloads carbon dioxide while slowing your heart. It is the body’s own built-in reset, which is why it works in seconds rather than minutes.',
    evidence:
      'Balban et al. (2023) compared breathwork styles over a month and found cyclic sighing — emphasising the extended exhale — produced the largest improvement in mood and the biggest reduction in breathing rate.',
    cadenceLabel: 'As needed · under a minute',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Works in seconds',
        description: 'Heart rate drops on the exhale itself.',
      },
      {
        icon: 'leaf',
        title: 'Nobody notices',
        description: 'Usable mid-conversation or mid-meeting.',
      },
      {
        icon: 'target',
        title: 'Interrupts the spiral',
        description: 'Breaks a stress response before it builds.',
      },
    ],
    timeline: [
      {
        when: 'First try',
        title: 'Immediate drop',
        description: 'The calming effect arrives on the first long exhale.',
      },
      {
        when: 'Week 1',
        title: 'You remember it in time',
        description: 'You start using it during stress, not after.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'It becomes your reflex response to tension.',
        peak: true,
      },
    ],
    howToStart: [
      'Inhale through your nose, then take a second short sip of air.',
      'Exhale slowly through your mouth until your lungs feel empty.',
      'One to three rounds. More is rarely needed.',
    ],
    sources: [
      {
        authors: 'Balban MY, et al.',
        title:
          'Brief structured respiration practices enhance mood and reduce physiological arousal',
        journal: 'Cell Reports Medicine',
        year: '2023',
        link: 'https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(22)00474-8',
      },
    ],
  },

  'Zone 2 Cardio Training': {
    tagline: 'Easy-paced cardio you can hold a conversation through.',
    lead: 'Zone 2 is the intensity where you are still burning fat and can talk in full sentences. It is dull on purpose: the adaptations are mitochondrial, and they come from accumulated time at low intensity rather than from suffering.',
    cadenceLabel: '3x weekly · 45 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Mitochondrial capacity',
        description: 'The adaptation that underpins endurance.',
      },
      {
        icon: 'wave',
        title: 'Sustainable',
        description: 'Low intensity means you recover and repeat.',
      },
      {
        icon: 'target',
        title: 'Aerobic base',
        description: 'Everything harder is built on top of this.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Frustratingly easy',
        description: 'Most people go too hard. Slow down.',
      },
      {
        when: 'Week 6',
        title: 'Faster at the same effort',
        description: 'Your pace at that heart rate improves.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Three sessions a week is just your routine.',
        peak: true,
      },
    ],
    howToStart: [
      'The test: you can hold a conversation but would rather not.',
      'Start at 20-30 minutes and build toward 45.',
      'Walking uphill, cycling, or rowing all work. Consistency beats mode.',
    ],
  },

  'Deliberate Cold Exposure': {
    tagline: 'A short weekly total of genuinely cold water.',
    lead: 'Cold exposure produces a large, sustained rise in noradrenaline and dopamine, which is the mechanism behind the mood and alertness effects people report. The metabolic claims are weaker than the marketing; the alertness effect is not.',
    cadenceLabel: '~11 min total per week, split across sessions',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Mood and alertness',
        description: 'A prolonged catecholamine rise after exposure.',
      },
      {
        icon: 'target',
        title: 'Stress tolerance',
        description: 'Deliberate practice at staying calm under stress.',
      },
      {
        icon: 'wave',
        title: 'Short doses work',
        description: 'Minutes per week, not hours.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Shocking',
        description: 'The gasp reflex is strong and normal.',
      },
      {
        when: 'Week 3',
        title: 'Calm on entry',
        description: 'Controlling your breathing gets much easier.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A fixed, unremarkable part of the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Cold enough to want out, safe enough to stay. Start with cold showers.',
      'Aim for ~11 minutes total across the week, split into 2-4 sessions.',
      'Never alone in open water. Avoid if pregnant or you have a heart condition.',
    ],
  },

  'NSDR Practice': {
    tagline: 'Guided deep rest without sleeping.',
    lead: 'A guided body-scan drops you into a state between waking and sleep. It restores focus without the sleep inertia a nap can cause, which makes it usable in the middle of a working day.',
    cadenceLabel: 'Daily · 10-20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Rest without sleeping',
        description: 'No grogginess to climb out of.',
      },
      {
        icon: 'target',
        title: 'Focus restored',
        description: 'Useful between demanding blocks of work.',
      },
      {
        icon: 'moon',
        title: 'Sleep-safe',
        description: 'Unlike a long nap, it does not steal from tonight.',
      },
    ],
    timeline: [
      {
        when: 'First session',
        title: 'You may fall asleep',
        description: 'Common early on, and not a failure.',
      },
      {
        when: 'Week 2',
        title: 'Staying on the edge',
        description: 'You learn to hover rather than drop off.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A tool you reach for without deliberating.',
        peak: true,
      },
    ],
    howToStart: [
      'Lie down, headphones on, follow a guided recording.',
      'Ten minutes is enough to feel it.',
      'Early afternoon is the highest-value slot.',
    ],
  },

  'Evening Light Dimming': {
    tagline: 'Dim the lights for the last hours of the day.',
    lead: 'Your circadian system reads both intensity and the angle light arrives from. Bright overhead light late in the evening reads as daytime; low, warm lamps do not. Dimming is the cheapest evening sleep intervention there is.',
    evidence:
      'Gooley et al. (2011) found ordinary room light before bed suppressed melatonin onset and shortened melatonin duration by around 90 minutes compared with dim light.',
    cadenceLabel: 'Nightly · last 2-3 hours',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Melatonin on schedule',
        description: 'Dim light lets the signal arrive on time.',
      },
      {
        icon: 'wave',
        title: 'Natural wind-down',
        description: 'Low light lowers activity without effort.',
      },
      {
        icon: 'sparkle',
        title: 'Free',
        description: 'A switch and a lamp is the whole intervention.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Feels like evening',
        description: 'The change in atmosphere is immediate.',
      },
      {
        when: 'Week 2',
        title: 'Sleepier earlier',
        description: 'Bedtime starts arriving on its own.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Overheads go off without a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Overhead lights off, low lamps on, 2-3 hours before bed.',
      'Warm bulbs beat cool ones. Low and off to the side beats above you.',
      'Dim your screens too, or the lamps are doing half a job.',
    ],
    sources: [
      {
        authors: 'Gooley JJ, et al.',
        title:
          'Exposure to room light before bedtime suppresses melatonin onset and shortens melatonin duration in humans',
        journal: 'Journal of Clinical Endocrinology & Metabolism',
        year: '2011',
      },
    ],
  },

  'Cool Sleep Temperature': {
    tagline: 'Keep the bedroom cool — around 18-20°C.',
    lead: 'Sleep onset depends on your core temperature falling, and a cool room makes that drop easier to achieve and hold. This is why an overheated bedroom fragments sleep even when nothing else is wrong.',
    cadenceLabel: 'Nightly · 18-20°C',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Faster sleep onset',
        description: 'A cool room assists the temperature drop.',
      },
      {
        icon: 'wave',
        title: 'Deeper sleep',
        description: 'Overheating pulls you toward lighter stages.',
      },
      {
        icon: 'sparkle',
        title: 'Set and forget',
        description: 'A thermostat setting, not a daily habit.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Often immediate',
        description: 'Especially if your room was too warm.',
      },
      {
        when: 'Week 1',
        title: 'Fewer wake-ups',
        description: 'Overheating awakenings drop away.',
      },
      {
        when: '~14 days',
        title: 'Automatic',
        description: 'The setting does the work.',
        peak: true,
      },
    ],
    howToStart: [
      'Aim for 18-20°C. Cooler beats warmer if you are unsure.',
      'Warm feet, cool room — socks help without heating the space.',
      'Crack a window if you cannot control the heating.',
    ],
  },

  'Morning Protein Protocol': {
    tagline: 'Get real protein in early.',
    lead: 'Protein at breakfast is where most people fall shortest, and muscle protein synthesis responds to per-meal dose rather than daily total. It also blunts the mid-morning hunger that drives snacking.',
    evidence:
      'Mamerow et al. (2014) found protein distributed evenly across three meals stimulated 24-hour muscle protein synthesis roughly 25% more than a dinner-skewed pattern with the same daily total.',
    cadenceLabel: 'Daily · 30g+ within an hour of waking',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Better protein use',
        description: 'Even distribution beats a single large dose.',
      },
      {
        icon: 'wave',
        title: 'Steadier morning',
        description: 'Less hunger and fewer energy swings.',
      },
      {
        icon: 'leaf',
        title: 'Muscle maintenance',
        description: 'The habit that protects lean mass over decades.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Harder than expected',
        description: '30g is more than most breakfasts contain.',
      },
      {
        when: 'Week 3',
        title: 'No mid-morning crash',
        description: 'Snacking pressure noticeably drops.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Breakfast is built around protein by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Three eggs, Greek yoghurt, or a shake — pick the one you will repeat.',
      'Prepare it the night before if mornings are tight.',
      'Check with a clinician first if you have kidney disease.',
    ],
    sources: [
      {
        authors: 'Mamerow MM, et al.',
        title:
          'Dietary protein distribution positively influences 24-h muscle protein synthesis in healthy adults',
        journal: 'Journal of Nutrition',
        year: '2014',
      },
    ],
  },

  'Time-Restricted Eating': {
    tagline: 'Keep eating inside a consistent 10-12 hour window.',
    lead: 'Your gut, liver and pancreas run on circadian schedules of their own, and eating late in the evening asks them to work off-shift. Compressing intake into a consistent daytime window aligns fuel with the clock — the consistency matters as much as the length.',
    evidence:
      'Wilkinson et al. (2020) put adults with metabolic syndrome on a 10-hour eating window for 12 weeks and saw reductions in weight, blood pressure and atherogenic lipids.',
    cadenceLabel: 'Daily · 10-12 hour eating window',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Metabolic markers',
        description: 'Trial evidence on weight, lipids and blood pressure.',
      },
      {
        icon: 'moon',
        title: 'Better sleep',
        description: 'Not digesting a large meal at bedtime helps.',
      },
      {
        icon: 'target',
        title: 'A simple rule',
        description: 'A window is easier to keep than a food list.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Evening hunger',
        description: 'The late-night habit protests before it fades.',
      },
      {
        when: 'Week 4',
        title: 'Window feels natural',
        description: 'Appetite re-times itself to the schedule.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You stop eating late without tracking it.',
        peak: true,
      },
    ],
    howToStart: [
      'Set the window by your last meal first — that is the easier end to move.',
      'Twelve hours is a real intervention. Start there, not at eight.',
      'Not appropriate in pregnancy, with diabetes medication, or with a history of eating disorders — ask a clinician.',
    ],
    sources: [
      {
        authors: 'Wilkinson MJ, et al.',
        title:
          'Ten-hour time-restricted eating reduces weight, blood pressure, and atherogenic lipids in patients with metabolic syndrome',
        journal: 'Cell Metabolism',
        year: '2020',
      },
    ],
  },

  'Sauna Therapy': {
    tagline: 'Heat exposure, two or three times a week.',
    lead: 'Sauna use raises heart rate and core temperature in a way that resembles moderate exercise, and long-running Finnish cohort data links frequent use with better cardiovascular outcomes. Frequency matters more than heroics in any single session.',
    evidence:
      'Laukkanen et al. (2015) followed Finnish men for over 20 years and found 4-7 sauna sessions weekly were associated with substantially lower cardiovascular and all-cause mortality than one session weekly.',
    cadenceLabel: '2-3x weekly · 20-30 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Cardiovascular signal',
        description: 'Frequency tracks with better long-term outcomes.',
      },
      {
        icon: 'wave',
        title: 'Deep relaxation',
        description: 'Heat drops muscle tension fast.',
      },
      {
        icon: 'moon',
        title: 'Better sleep',
        description: 'The cooldown afterwards helps sleep onset.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Relaxed and drained',
        description: 'Start short — tolerance builds quickly.',
      },
      {
        when: 'Week 3',
        title: 'Longer sessions',
        description: 'Heat tolerance improves noticeably.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A fixed part of your week.',
        peak: true,
      },
    ],
    howToStart: [
      'Start at 10 minutes and build up.',
      'Hydrate before and after. No alcohol beforehand.',
      'Check with a clinician if pregnant or if you have a cardiac condition.',
    ],
    sources: [
      {
        authors: 'Laukkanen T, et al.',
        title:
          'Association between sauna bathing and fatal cardiovascular and all-cause mortality events',
        journal: 'JAMA Internal Medicine',
        year: '2015',
      },
    ],
  },

  'Darkness Before Sleep': {
    tagline: 'An hour or two of genuine dimness before bed.',
    lead: 'Melatonin release is gated by light, and the threshold is lower than most people assume — ordinary indoor lighting is enough to hold it back. Giving yourself a properly dim run-in lets the sleep signal build before you are in bed.',
    cadenceLabel: 'Nightly · 1-2 hours',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Melatonin builds',
        description: 'Darkness is the permission the system waits for.',
      },
      {
        icon: 'wave',
        title: 'Sleepy on time',
        description: 'You arrive at bed already tired.',
      },
      {
        icon: 'leaf',
        title: 'Calmer evenings',
        description: 'Low light slows everything down.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Noticeably drowsier',
        description: 'Often obvious on the very first evening.',
      },
      {
        when: 'Week 2',
        title: 'Consistent bedtime',
        description: 'Sleepiness starts arriving at the same hour.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The evening dims itself.',
        peak: true,
      },
    ],
    howToStart: [
      'One low lamp instead of overhead lighting.',
      'Screens dimmed to minimum, or put away entirely.',
      'Start with 45 minutes if two hours is unrealistic.',
    ],
  },

};
