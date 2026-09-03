/**
 * Science drill-down copy — Recovery.
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const RECOVERY_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Consistent Wake Time': {
    suggestedWhy: 'A fixed wake time anchors your body clock, so falling asleep gets easier and Mondays stop feeling like jet lag.',
    tagline: 'Same wake time every day — including weekends.',
    lead: 'Your body clock is set by when light first hits your eyes, so a wandering wake time keeps rewriting your internal schedule. Holding it steady — weekends included — is what stops the Monday-morning feeling of jet lag you never travelled for.',
    cadenceLabel: 'Daily · same time, 7 days a week',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Waking gets easier',
        description: 'Your body starts pre-empting the alarm.',
      },
      {
        icon: 'moon',
        title: 'Falling asleep gets easier',
        description: 'A fixed wake time anchors the whole sleep window.',
      },
      {
        icon: 'target',
        title: 'No Monday jet lag',
        description: 'Weekend lie-ins stop costing you the start of the week.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'Harder before easier',
        description: 'Expect some friction while your clock catches up.',
      },
      {
        when: 'Week 2',
        title: 'Waking before the alarm',
        description: 'Your cortisol rhythm starts arriving on schedule.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The time holds itself, weekends included.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a wake time you can hold on a Saturday, not just a Tuesday.',
      'Get light in your eyes straight away — it locks the time in.',
      'If you sleep badly, still get up on time. Fix it with an earlier bedtime.',
    ],
    sources: [
      {
        authors: 'Roenneberg T',
        title:
          'Internal Time: Chronotypes, Social Jet Lag, and Why You’re So Tired',
        journal: 'Harvard University Press',
        year: '2012',
      },
    ],
  },

  'Power Nap': {
    suggestedWhy: 'A short nap clears sleep pressure without dropping into deep sleep, so alertness and mood recover for the afternoon.',
    tagline: 'Ten to twenty minutes, early afternoon.',
    lead: 'A short nap clears accumulated adenosine without letting you descend into deep sleep, which is what causes the groggy, worse-than-before feeling. Keeping it under about 25 minutes and before mid-afternoon is what separates a useful nap from a wrecked night.',
    evidence:
      'Brooks & Lack (2006) compared nap lengths and found a 10-minute nap produced immediate improvements in alertness and cognitive performance, while longer naps caused a period of grogginess first.',
    cadenceLabel: 'As needed · 10-20 min · before 3pm',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Restored alertness',
        description: 'A genuine reset rather than a caffeine patch.',
      },
      {
        icon: 'target',
        title: 'Better afternoon work',
        description: 'Attention and reaction time both recover.',
      },
      {
        icon: 'leaf',
        title: 'Steadier mood',
        description: 'Short sleep debt makes everything feel heavier.',
      },
    ],
    timeline: [
      {
        when: 'First nap',
        title: 'Immediate benefit',
        description: 'Keep it short and the payoff is same-day.',
      },
      {
        when: 'Week 2',
        title: 'Falling asleep faster',
        description: 'Napping is a skill and it improves quickly.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'The afternoon has a built-in reset.',
        peak: true,
      },
    ],
    howToStart: [
      'Set an alarm for 20 minutes and lie down somewhere dim.',
      'Before 3pm. Later naps eat into your night.',
      'If you wake groggy, shorten it — you went too deep.',
    ],
    sources: [
      {
        authors: 'Brooks A, Lack L',
        title:
          'A brief afternoon nap following nocturnal sleep restriction: which nap duration is most recuperative?',
        journal: 'Sleep',
        year: '2006',
      },
    ],
  },

  'Contrast Shower': {
    suggestedWhy: 'A cold finish is sharply activating and trial evidence links it to fewer sick days, so mornings start with a real jolt.',
    tagline: 'End hot showers with cold.',
    lead: 'Alternating hot and cold drives blood vessels to dilate then constrict, which is the mechanism behind the recovery claims. The alertness effect is immediate and reliable; the recovery effects are more modest than the internet suggests.',
    evidence:
      'Buijze et al. (2016) randomised over 3,000 adults to a routine of cold showers and found a 29% reduction in self-reported sickness absence from work.',
    cadenceLabel: 'Daily · 30-60 sec cold finish',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Sharp alertness',
        description: 'The cold finish is unmistakably activating.',
      },
      {
        icon: 'leaf',
        title: 'Fewer sick days',
        description: 'Trial evidence points to reduced absence.',
      },
      {
        icon: 'target',
        title: 'Daily discomfort rep',
        description: 'Practice choosing the harder option.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Unpleasant',
        description: 'Anticipation is the hardest part, not the cold.',
      },
      {
        when: 'Week 2',
        title: 'Controlled breathing',
        description: 'You stop gasping. That is real adaptation.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Showers end cold without a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Normal shower, then cold for the final 30 seconds.',
      'Breathe slowly and deliberately instead of holding your breath.',
      'Skip it if you have a cardiac condition — check with a clinician.',
    ],
    sources: [
      {
        authors: 'Buijze GA, et al.',
        title:
          'The effect of cold showering on health and work: a randomized controlled trial',
        journal: 'PLoS ONE',
        year: '2016',
      },
    ],
  },

  'Self-Massage/Foam Rolling': {
    suggestedWhy: 'Ten minutes of rolling improves short-term range of motion and eases soreness, so moving feels looser after training.',
    tagline: 'Ten minutes on a roller.',
    lead: 'Foam rolling reliably increases short-term range of motion and reduces the perception of soreness. It is not breaking up scar tissue or realigning anything — the effect is largely neural, which is fine, because the outcome is what you wanted.',
    evidence:
      'Cheatham et al. (2015) reviewed self-myofascial release studies and found consistent short-term improvements in joint range of motion and reductions in muscle soreness.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'More range of motion',
        description: 'A reliable short-term improvement.',
      },
      {
        icon: 'leaf',
        title: 'Less soreness',
        description: 'Perceived soreness drops after training.',
      },
      {
        icon: 'target',
        title: 'Finds the tight spots',
        description: 'You learn where you actually hold tension.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Tender',
        description: 'Tight tissue is uncomfortable to roll. Ease in.',
      },
      {
        when: 'Week 2',
        title: 'Less painful, more useful',
        description: 'Sensitivity drops as you go regularly.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Rolling becomes part of winding down.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with quads, glutes and lats — the big, forgiving areas.',
      '30-60 seconds per area, slow. Do not grind on one spot.',
      'Avoid rolling directly over joints, bone, or the lower back.',
    ],
    sources: [
      {
        authors: 'Cheatham SW, et al.',
        title:
          'The effects of self-myofascial release using a foam roll or roller massager: a systematic review',
        journal: 'International Journal of Sports Physical Therapy',
        year: '2015',
      },
    ],
  },

  'Epsom Salt Bath': {
    suggestedWhy: 'Warm water relaxes muscle and the cooldown afterwards helps sleep arrive, so evenings end with genuine stillness.',
    tagline: 'A long soak with magnesium salts.',
    lead: 'The warm water does most of the work here — it relaxes muscle and drives the post-bath temperature drop that helps sleep. Whether meaningful magnesium crosses the skin is genuinely unsettled, so value this as a bath with a good ritual attached.',
    cadenceLabel: '2-3x weekly · 20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Muscle relaxation',
        description: 'Warm water reliably reduces tension.',
      },
      {
        icon: 'moon',
        title: 'Better sleep onset',
        description: 'The cooldown afterwards is the active part.',
      },
      {
        icon: 'leaf',
        title: 'Enforced stillness',
        description: 'Twenty minutes you cannot do anything else in.',
      },
    ],
    timeline: [
      {
        when: 'First bath',
        title: 'Relaxed and sleepy',
        description: 'The effect on tension is immediate.',
      },
      {
        when: 'Week 2',
        title: 'A weekly anchor',
        description: 'It becomes the reset point of the week.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Built into your evenings.',
        peak: true,
      },
    ],
    howToStart: [
      'One to two cups of Epsom salts in a warm bath.',
      'Twenty minutes, ideally 60-90 minutes before bed.',
      'Hydrate afterwards, and stand up slowly.',
    ],
  },

  'Red Light Therapy': {
    suggestedWhy: 'Mitochondria absorb red and near-infrared light, so skin and recovery may benefit without disturbing your melatonin.',
    tagline: 'Red and near-infrared light exposure.',
    lead: 'Red and near-infrared wavelengths are absorbed by mitochondria and appear to modulate cellular energy production. The mechanism is real and actively researched; the strength of the practical effects is still being established, so keep expectations calibrated.',
    cadenceLabel: '3-5x weekly · 10-20 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Skin and tissue',
        description: 'The best-supported application so far.',
      },
      {
        icon: 'wave',
        title: 'Recovery support',
        description: 'Studied for muscle soreness after training.',
      },
      {
        icon: 'moon',
        title: 'Evening-safe light',
        description: 'Long wavelengths do not suppress melatonin like blue.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Nothing dramatic',
        description: 'This is a slow, cumulative intervention.',
      },
      {
        when: 'Week 6',
        title: 'Skin changes first',
        description: 'Where effects appear, they usually appear here.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Slots into an existing evening routine.',
        peak: true,
      },
    ],
    howToStart: [
      'Panels specifying 660nm and 850nm are the commonly studied wavelengths.',
      '10-20 minutes at the manufacturer’s stated distance.',
      'Do not look directly into the panel. Eye protection if it is bright.',
    ],
    sources: [
      {
        authors: 'Hamblin MR',
        title:
          'Mechanisms and applications of the anti-inflammatory effects of photobiomodulation',
        journal: 'AIMS Biophysics',
        year: '2017',
      },
    ],
  },

};
