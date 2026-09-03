/**
 * Science drill-down copy — Breathing.
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const BREATHING_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Box Breathing (4-4-4-4)': {
    suggestedWhy: 'Slow, even breathing engages the parasympathetic brake on stress, so tension drops within a minute under pressure.',
    tagline: 'A four-count breath cycle that turns down stress on demand.',
    lead: 'Slowing your breath to roughly six cycles a minute, with an extended exhale, increases vagal tone — the parasympathetic brake on your stress response. It is one of the few levers that shifts your physiology in under a minute, deliberately.',
    evidence:
      'A 2018 review in Frontiers in Human Neuroscience found slow-breathing practices increase parasympathetic activity and are associated with reduced anxiety and improved emotional control.',
    cadenceLabel: 'Daily · 5 min, or on demand',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Calmer within a minute',
        description: 'Heart rate and muscle tension drop while you breathe.',
      },
      {
        icon: 'target',
        title: 'Clearer thinking under pressure',
        description: 'Less reactivity when something goes wrong.',
      },
      {
        icon: 'leaf',
        title: 'A portable reset',
        description: 'Works anywhere, needs nothing, nobody can tell.',
      },
    ],
    timeline: [
      {
        when: 'First round',
        title: 'Body settles',
        description: 'The relaxation response begins within a few cycles.',
      },
      {
        when: 'Week 2',
        title: 'You reach for it',
        description: 'It starts showing up automatically in stressful moments.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Slower breathing becomes your default under load.',
        peak: true,
      },
    ],
    howToStart: [
      'Inhale 4, hold 4, exhale 4, hold 4. That is one round.',
      'Start with four rounds — under two minutes.',
      'Anchor it to a trigger: before meetings, or the moment you feel tension.',
    ],
    sources: [
      {
        authors: 'Zaccaro A, et al.',
        title:
          'How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing',
        journal: 'Frontiers in Human Neuroscience',
        year: '2018',
        link: 'https://www.frontiersin.org/articles/10.3389/fnhum.2018.00353/full',
      },
    ],
  },

  'Resonant Breathing': {
    suggestedWhy: 'Breathing at your body’s resonant pace puts heart and breath in phase, so calm becomes something you can train.',
    tagline: 'Five and a half seconds in, five and a half out.',
    lead: 'At roughly 5.5 breaths a minute your heart rate and breathing fall into phase, and heart rate variability peaks. This is the resonant frequency of the cardiovascular system — the same rate HRV biofeedback training aims for.',
    cadenceLabel: 'Daily · 5-10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Peak HRV',
        description: 'The breathing rate your cardiovascular system resonates at.',
      },
      {
        icon: 'target',
        title: 'Trainable calm',
        description: 'Repetition raises your baseline stress tolerance.',
      },
      {
        icon: 'leaf',
        title: 'Nothing to buy',
        description: 'A timer or a count is the whole kit.',
      },
    ],
    timeline: [
      {
        when: 'First session',
        title: 'Noticeably slower',
        description: 'The pace feels long at first, then comfortable.',
      },
      {
        when: 'Week 3',
        title: 'Easier to hold',
        description: 'The rhythm stops needing a counter.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You drift toward this pace whenever you settle.',
        peak: true,
      },
    ],
    howToStart: [
      'Inhale 5.5 seconds, exhale 5.5 seconds. No holds.',
      'Five minutes to begin — a paced-breathing app helps.',
      'Sit upright and breathe through your nose, low into the belly.',
    ],
    sources: [
      {
        authors: 'Lehrer PM, Gevirtz R',
        title: 'Heart rate variability biofeedback: how and why does it work?',
        journal: 'Frontiers in Psychology',
        year: '2014',
      },
    ],
  },

  '4-7-8 Relaxing Breath': {
    suggestedWhy: 'A long exhale tips the nervous system toward rest, so the body winds down and sleep arrives more easily.',
    tagline: 'A long exhale to tip you toward sleep.',
    lead: 'The exhale is where parasympathetic activation lives, so making it roughly twice the inhale biases your nervous system toward rest. That makes this less of a workout than a wind-down — best used lying in bed.',
    cadenceLabel: 'Nightly · 4 cycles',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Faster sleep onset',
        description: 'A wind-down cue your body learns to recognise.',
      },
      {
        icon: 'wave',
        title: 'Drops arousal',
        description: 'The extended exhale slows heart rate directly.',
      },
      {
        icon: 'leaf',
        title: 'Works in bed',
        description: 'No sitting up, no equipment, lights already off.',
      },
    ],
    timeline: [
      {
        when: 'First night',
        title: 'A slower body',
        description: 'You may not sleep faster yet, but you will feel calmer.',
      },
      {
        when: 'Week 2',
        title: 'A real cue',
        description: 'Your body starts reading the pattern as bedtime.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'It becomes the last thing you do before sleep.',
        peak: true,
      },
    ],
    howToStart: [
      'Inhale through the nose 4, hold 7, exhale through the mouth 8.',
      'Four cycles is the standard dose. Do not push past it early on.',
      'If 7 and 8 feel long, halve every count and keep the ratio.',
    ],
  },

  'Energizing Breath (Kapalabhati)': {
    suggestedWhy: 'Short forceful exhales raise sympathetic drive, so you get a clean lift of alertness without caffeine.',
    tagline: 'Rapid breathing for alertness without caffeine.',
    lead: 'Short, forceful exhales with passive inhales raise sympathetic activity — the opposite of a calming practice. Used deliberately in the morning or before focused work, it is a stimulant you already own.',
    cadenceLabel: 'Daily · 1-3 min · morning',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Immediate alertness',
        description: 'A clean lift without a caffeine tail.',
      },
      {
        icon: 'target',
        title: 'Pre-work primer',
        description: 'Useful right before something demanding.',
      },
      {
        icon: 'wave',
        title: 'Breath control',
        description: 'Builds awareness of your own arousal dial.',
      },
    ],
    timeline: [
      {
        when: 'First try',
        title: 'Tingling and awake',
        description: 'The effect is immediate and unmistakable.',
      },
      {
        when: 'Week 2',
        title: 'Longer, smoother rounds',
        description: 'Technique settles and light-headedness fades.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'It replaces the reflex reach for a second coffee.',
        peak: true,
      },
    ],
    howToStart: [
      'Sharp exhales through the nose; let each inhale happen passively.',
      'Start at 20 breaths, rest, repeat. Build to 1-3 minutes.',
      'Stop if you feel dizzy. Never practise standing or in water.',
    ],
  },

  'CO2 Tolerance Training': {
    suggestedWhy: 'Training tolerance to the urge to breathe slows your resting breath, so exertion stops feeling like alarm.',
    tagline: 'Short breath holds to stop over-breathing.',
    lead: 'The urge to breathe is driven by rising carbon dioxide, not falling oxygen. Training tolerance to that signal means you breathe less, more slowly, and panic less when breathing feels restricted.',
    cadenceLabel: 'Daily · 2-5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Slower resting breath',
        description: 'Less air hunger through the day.',
      },
      {
        icon: 'target',
        title: 'Calmer under exertion',
        description: 'Breathlessness stops feeling like alarm.',
      },
      {
        icon: 'sparkle',
        title: 'A measurable score',
        description: 'Your hold time gives you visible progress.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Baseline set',
        description: 'Your first hold time is the number to beat.',
      },
      {
        when: 'Week 4',
        title: 'Longer holds',
        description: 'Tolerance climbs noticeably with consistent practice.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Nasal, low-volume breathing becomes your default.',
        peak: true,
      },
    ],
    howToStart: [
      'Exhale normally, then hold and time until the first strong urge.',
      'That is your score. Repeat 3-4 times with full recovery between.',
      'Always practise seated and never in or near water.',
    ],
  },

  'Wim Hof Breathing': {
    suggestedWhy: 'Breath rounds and retentions drive a sharp adrenaline rise, so mornings start alert and discomfort eases.',
    tagline: 'Cycles of deep breathing and retention.',
    lead: 'Rounds of rapid deep breaths followed by a long retention drive large swings in blood chemistry and adrenaline. The effects are real and measurable — which is also why the technique demands respect rather than enthusiasm.',
    evidence:
      'Kox et al. (2014), in PNAS, found trained practitioners of this breathing and cold protocol mounted a blunted inflammatory response to an injected bacterial toxin compared with untrained controls.',
    cadenceLabel: 'Daily · 10-15 min · morning',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Strong alertness spike',
        description: 'Adrenaline rises sharply during the rounds.',
      },
      {
        icon: 'leaf',
        title: 'Inflammatory response',
        description: 'Studied for effects on immune signalling.',
      },
      {
        icon: 'target',
        title: 'Discomfort tolerance',
        description: 'Practice sitting with a strong urge to breathe.',
      },
    ],
    timeline: [
      {
        when: 'First round',
        title: 'Tingling, then calm',
        description: 'Expect head-rush sensations — they are normal.',
      },
      {
        when: 'Week 2',
        title: 'Longer retentions',
        description: 'Hold times extend as the pattern becomes familiar.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The morning round becomes part of waking up.',
        peak: true,
      },
    ],
    howToStart: [
      'Lie or sit down first — fainting is a real possibility.',
      '30 deep breaths, exhale, hold as long as is comfortable. Repeat 3 rounds.',
      'Never in water, never while driving. Skip it if pregnant or if you have a heart or seizure condition.',
    ],
    sources: [
      {
        authors: 'Kox M, et al.',
        title:
          'Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans',
        journal: 'PNAS',
        year: '2014',
      },
    ],
  },

  'Daily Humming': {
    suggestedWhy: 'Humming raises nitric oxide in the nose and forces a long even exhale, so breathing feels easier and the mind settles.',
    tagline: 'Hum for a few minutes — your sinuses do the rest.',
    lead: 'Humming makes the air in your nasal passages oscillate, which sharply increases the nitric oxide released there. Nitric oxide is a vasodilator and antimicrobial, so it is doing useful work on the way into your lungs.',
    evidence:
      'Weitzberg & Lundberg (2002) measured nasal nitric oxide during humming and found it rose roughly fifteen-fold compared with quiet exhalation.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Nasal nitric oxide',
        description: 'A large, measurable rise while you hum.',
      },
      {
        icon: 'leaf',
        title: 'Slower exhales',
        description: 'Humming forces a long, even out-breath.',
      },
      {
        icon: 'sparkle',
        title: 'Absurdly easy',
        description: 'No technique to learn and no way to fail.',
      },
    ],
    timeline: [
      {
        when: 'First session',
        title: 'A settled feeling',
        description: 'The extended exhale is calming on its own.',
      },
      {
        when: 'Week 2',
        title: 'Slots into the day',
        description: 'Easy to attach to a commute or a shower.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You hum without deciding to.',
        peak: true,
      },
    ],
    howToStart: [
      'Hum any note on the out-breath, lips closed, through the nose.',
      'One minute to start. Build toward five.',
      'Pair it with something you already do alone — showering, driving.',
    ],
    sources: [
      {
        authors: 'Weitzberg E, Lundberg JON',
        title: 'Humming greatly increases nasal nitric oxide',
        journal: 'American Journal of Respiratory and Critical Care Medicine',
        year: '2002',
      },
    ],
  },

  'Mouth Taping Sleep': {
    suggestedWhy: 'Nudging yourself toward nasal breathing overnight may mean less dry mouth and quieter, better-feeling nights.',
    tagline: 'Encourages nasal breathing overnight.',
    lead: 'Nasal breathing filters and humidifies air and supports better overnight oxygenation than mouth breathing. Taping is one way people nudge themselves toward it — but the evidence base here is thin, and it is only appropriate if you can breathe freely through your nose.',
    cadenceLabel: 'Nightly',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Less dry mouth',
        description: 'Often the first thing people notice.',
      },
      {
        icon: 'wave',
        title: 'Nasal breathing',
        description: 'Filtered, humidified air instead of mouth air.',
      },
      {
        icon: 'leaf',
        title: 'Quieter nights',
        description: 'Some people report reduced snoring.',
      },
    ],
    timeline: [
      {
        when: 'Night 1-3',
        title: 'Odd, then unnoticed',
        description: 'Most of the adjustment is psychological.',
      },
      {
        when: 'Week 2',
        title: 'Waking less parched',
        description: 'Dry mouth and throat typically improve first.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of getting into bed.',
        peak: true,
      },
    ],
    howToStart: [
      'Only if you can breathe comfortably through your nose with your mouth shut.',
      'Try it awake for 20 minutes first. Use tape made for skin.',
      'Do not do this with a blocked nose, a cold, after alcohol, or if you may have sleep apnoea — talk to a clinician instead.',
    ],
  },
};
