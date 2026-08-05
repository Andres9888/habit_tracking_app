/**
 * Science drill-down copy — Mental Health.
 *
 * These are evidence-based self-help skills, not treatment. Copy here must
 * never imply a habit replaces professional care.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const MENTAL_HEALTH_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Self-Compassion Break': {
    tagline: 'Three sentences to say when you are struggling.',
    lead: 'Self-compassion works on a different mechanism from self-esteem: instead of arguing that you are doing fine, it acknowledges that this is hard and that struggling is ordinary. That distinction is why it holds up when things are genuinely going badly.',
    cadenceLabel: 'As needed · 1-2 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Less self-attack',
        description: 'Interrupts the pile-on that follows a setback.',
      },
      {
        icon: 'wave',
        title: 'Faster recovery',
        description: 'You return to the problem sooner.',
      },
      {
        icon: 'target',
        title: 'Works when things are bad',
        description: 'It does not require pretending otherwise.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Awkward',
        description: 'Talking to yourself kindly feels false at first.',
      },
      {
        when: 'Week 3',
        title: 'Available under stress',
        description: 'The phrasing starts arriving when you need it.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'It becomes your default response to failure.',
        peak: true,
      },
    ],
    howToStart: [
      'Name it: "this is a moment of suffering."',
      'Normalise it: "suffering is part of being human."',
      'Offer something: "may I be kind to myself right now."',
    ],
    sources: [
      {
        authors: 'Neff KD',
        title: 'Self-Compassion: The Proven Power of Being Kind to Yourself',
        journal: 'William Morrow',
        year: '2011',
        link: 'https://self-compassion.org/the-research/',
      },
    ],
  },

  'Expressive Writing': {
    tagline: 'Twenty minutes on what is actually bothering you.',
    lead: 'Writing continuously about a difficult experience — including how you felt about it, not just what happened — appears to help by forcing a coherent narrative onto something that was previously a loop. The effect shows up in health measures, not only mood.',
    evidence:
      'Pennebaker’s programme of research found that writing about emotionally difficult experiences for 15-20 minutes over several days was associated with improved health outcomes, including fewer physician visits.',
    cadenceLabel: '3-4 consecutive days · 20 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Less rumination',
        description: 'A written account loops less than a mental one.',
      },
      {
        icon: 'target',
        title: 'Makes sense of it',
        description: 'Narrative structure is the working mechanism.',
      },
      {
        icon: 'wave',
        title: 'Physical measures',
        description: 'Effects appear in health, not just feelings.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Often feels worse',
        description: 'Expected. The dip is part of the protocol.',
      },
      {
        when: 'Day 3-4',
        title: 'Shift in perspective',
        description: 'The account starts to hold together.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Writing becomes how you process hard things.',
        peak: true,
      },
    ],
    howToStart: [
      'Twenty minutes, continuous, no editing. Nobody else reads it.',
      'Write about the event and how you felt — both parts matter.',
      'If it becomes overwhelming, stop. This is not a substitute for therapy.',
    ],
    sources: [
      {
        authors: 'Pennebaker JW',
        title: 'Writing about emotional experiences as a therapeutic process',
        journal: 'Psychological Science',
        year: '1997',
      },
    ],
  },

  'Emotion Granularity': {
    tagline: 'Name the feeling precisely, not just "bad".',
    lead: 'Putting a specific label on an emotion reduces activity in the amygdala and increases it in regulatory prefrontal regions — naming appears to be part of regulating. "Disappointed" gives you somewhere to go in a way "bad" does not.',
    evidence:
      'Lieberman et al. (2007) found that labelling emotional images with a specific word reduced amygdala response and increased activity in right ventrolateral prefrontal cortex.',
    cadenceLabel: 'Daily · a few seconds, several times',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower reactivity',
        description: 'Labelling itself dampens the response.',
      },
      {
        icon: 'target',
        title: 'Actionable feelings',
        description: 'A precise name suggests a next step.',
      },
      {
        icon: 'leaf',
        title: 'Better communication',
        description: 'You can tell people what is actually going on.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Limited vocabulary',
        description: 'Most people start with about four words.',
      },
      {
        when: 'Week 3',
        title: 'Finer distinctions',
        description: 'You start separating anxious from frustrated.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The specific word arrives on its own.',
        peak: true,
      },
    ],
    howToStart: [
      'When you notice something, ask "which word exactly?"',
      'Push past good/bad — aim for disappointed, restless, resentful.',
      'A feelings-wheel list helps until the vocabulary is yours.',
    ],
    sources: [
      {
        authors: 'Lieberman MD, et al.',
        title:
          'Putting feelings into words: affect labeling disrupts amygdala activity in response to affective stimuli',
        journal: 'Psychological Science',
        year: '2007',
      },
    ],
  },

  'Self-Distancing': {
    tagline: 'Ask what you would tell a friend.',
    lead: 'Shifting from an immersed first-person view to a distanced one reliably lowers emotional intensity and reduces catastrophising. The trick is not pretending to be calm — it is changing the vantage point you are reasoning from.',
    cadenceLabel: 'As needed · 1-2 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower intensity',
        description: 'Distance takes the heat out of the thought.',
      },
      {
        icon: 'target',
        title: 'Better decisions',
        description: 'You reason more clearly about your own situation.',
      },
      {
        icon: 'leaf',
        title: 'Less spiralling',
        description: 'Interrupts catastrophising directly.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Surprisingly effective',
        description: 'Most people notice the shift immediately.',
      },
      {
        when: 'Week 2',
        title: 'Remembered in time',
        description: 'You reach for it during the spiral, not after.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The distanced view becomes a reflex.',
        peak: true,
      },
    ],
    howToStart: [
      'Ask: "what would I tell a friend in this exact situation?"',
      'Or use your own name: "what should [name] do here?"',
      'Write the answer down — it lands harder than thinking it.',
    ],
    sources: [
      {
        authors: 'Kross E, Ayduk O',
        title:
          'Making meaning out of negative experiences by self-distancing',
        journal: 'Current Directions in Psychological Science',
        year: '2011',
      },
    ],
  },

  'Cognitive Defusion': {
    tagline: 'Put "I notice I am having the thought that…" in front of it.',
    lead: 'Defusion does not argue with a thought or try to replace it. It changes your relationship to it — from something you are inside of to something you are observing. That distinction is the core move of acceptance-based therapy.',
    cadenceLabel: 'As needed · seconds',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Thoughts lose grip',
        description: 'Observed thoughts pull less than inhabited ones.',
      },
      {
        icon: 'target',
        title: 'No arguing required',
        description: 'You do not have to prove the thought wrong.',
      },
      {
        icon: 'leaf',
        title: 'Works on stubborn ones',
        description: 'Useful where reframing keeps failing.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Small but real',
        description: 'A slight loosening rather than relief.',
      },
      {
        when: 'Week 3',
        title: 'Faster to spot',
        description: 'You catch thoughts as thoughts sooner.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Observing becomes the default stance.',
        peak: true,
      },
    ],
    howToStart: [
      'Restate it: "I notice I am having the thought that I will fail."',
      'Do not debate the content. Just relabel it.',
      'Saying it aloud in a silly voice works too, for the persistent ones.',
    ],
    sources: [
      {
        authors: 'Hayes SC, Strosahl KD, Wilson KG',
        title:
          'Acceptance and Commitment Therapy: The Process and Practice of Mindful Change',
        journal: 'Guilford Press',
        year: '2011',
      },
    ],
  },

  'Behavioral Activation': {
    tagline: 'Do the small thing you have been avoiding.',
    lead: 'Low mood shrinks activity, and shrinking activity lowers mood further. Behavioural activation attacks that loop from the behaviour side — you act first and let motivation follow, rather than waiting for motivation that low mood is suppressing.',
    evidence:
      'Cuijpers et al. (2007) meta-analysed behavioural activation trials for depression and found effects comparable to cognitive therapy.',
    cadenceLabel: 'Daily · one small action',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Breaks the loop',
        description: 'Action first, motivation second.',
      },
      {
        icon: 'sparkle',
        title: 'Momentum',
        description: 'One completed task makes the next cheaper.',
      },
      {
        icon: 'leaf',
        title: 'Well-supported',
        description: 'One of the better-evidenced behavioural approaches.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Hardest day',
        description: 'Starting is the whole difficulty.',
      },
      {
        when: 'Week 2',
        title: 'Mood follows action',
        description: 'The sequence starts to become believable.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You act without waiting to feel like it.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick something absurdly small — smaller than feels worth doing.',
      'Schedule it rather than leaving it to willpower.',
      'Do it whether or not you feel like it. That is the entire point.',
    ],
    sources: [
      {
        authors: 'Cuijpers P, van Straten A, Warmerdam L',
        title:
          'Behavioral activation treatments of depression: a meta-analysis',
        journal: 'Clinical Psychology Review',
        year: '2007',
      },
    ],
  },

  'Values Clarification': {
    tagline: 'Re-read what you actually care about.',
    lead: 'Reflecting on a core value before or during stress reduces the defensive response to threatening information — you become better able to take in something difficult without needing to protect yourself from it.',
    cadenceLabel: 'Weekly · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Clearer decisions',
        description: 'Values make trade-offs easier to resolve.',
      },
      {
        icon: 'wave',
        title: 'Less defensiveness',
        description: 'Criticism gets easier to actually hear.',
      },
      {
        icon: 'leaf',
        title: 'Resilience',
        description: 'A stable reference point when things wobble.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Harder than expected',
        description: 'Naming real values takes more than one sitting.',
      },
      {
        when: 'Week 4',
        title: 'They start guiding',
        description: 'Decisions begin referencing them unprompted.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A weekly checkpoint you rely on.',
        peak: true,
      },
    ],
    howToStart: [
      'Write down three to five values in your own words.',
      'Re-read them weekly and ask where last week diverged.',
      'Revise them when they stop being true. That is not failure.',
    ],
    sources: [
      {
        authors: 'Cohen GL, Sherman DK',
        title:
          'The psychology of change: self-affirmation and social psychological intervention',
        journal: 'Annual Review of Psychology',
        year: '2014',
      },
    ],
  },

  'Pleasant Activity Scheduling': {
    tagline: 'Put one thing you enjoy in the day, on purpose.',
    lead: 'When mood drops, enjoyable activity is usually the first thing to go — and its absence deepens the drop. Scheduling it deliberately, rather than waiting to feel like it, is a core component of behavioural depression treatment.',
    cadenceLabel: 'Daily · one scheduled activity',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Reliable positives',
        description: 'Good moments stop depending on mood.',
      },
      {
        icon: 'target',
        title: 'Counters withdrawal',
        description: 'Directly refills what low mood empties.',
      },
      {
        icon: 'sparkle',
        title: 'Something to look forward to',
        description: 'Anticipation is part of the effect.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'May feel flat',
        description: 'Enjoyment can lag the activity at first.',
      },
      {
        when: 'Week 2',
        title: 'Enjoyment returns',
        description: 'The pleasure starts arriving with the activity.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Good things are built into the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Write down ten small things you have enjoyed before.',
      'Schedule one a day at a specific time.',
      'Do it even if you do not feel like it — especially then.',
    ],
    sources: [
      {
        authors: 'Lewinsohn PM',
        title: 'A behavioral approach to depression',
        journal: 'The Psychology of Depression: Contemporary Theory and Research',
        year: '1974',
      },
    ],
  },

  'Opposite Action': {
    tagline: 'When the urge does not serve you, do the reverse.',
    lead: 'Emotions come with action urges — withdraw when sad, attack when angry, avoid when afraid. When the emotion does not fit the facts, acting opposite to the urge changes the emotion. It is a core DBT skill and it is genuinely difficult.',
    cadenceLabel: 'As needed',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Changes the emotion',
        description: 'Behaviour is the lever when thinking will not move.',
      },
      {
        icon: 'wave',
        title: 'Breaks avoidance',
        description: 'Avoidance is what keeps fear alive.',
      },
      {
        icon: 'leaf',
        title: 'Clinically grounded',
        description: 'A central skill in DBT emotion regulation.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Genuinely hard',
        description: 'You are acting directly against a strong pull.',
      },
      {
        when: 'Week 3',
        title: 'The emotion shifts',
        description: 'You start trusting that it actually works.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'You notice the urge and choose separately.',
        peak: true,
      },
    ],
    howToStart: [
      'First check: does the emotion fit the facts? If it does, do not override it.',
      'If not, name the urge and do the opposite — fully, not half-heartedly.',
      'Best learned with a therapist. This is a summary, not training.',
    ],
    sources: [
      {
        authors: 'Linehan MM',
        title: 'DBT Skills Training Manual, Second Edition',
        journal: 'Guilford Press',
        year: '2014',
      },
    ],
  },
};
