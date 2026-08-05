/**
 * Science drill-down copy — Creativity, play, expression.
 *
 * Much of this category cites books rather than trials, and the honest framing
 * is that these habits are worth doing because they are absorbing and
 * restorative — not because a study proved they raise creativity scores.
 * Where a real trial exists (coloring, dance, gardening, singing), it is cited.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const CREATIVITY_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Morning Freewriting': {
    tagline: 'Write fast, without stopping to judge.',
    lead: 'Freewriting separates generating from editing, which is the whole trick — the internal critic cannot operate at speed. What comes out is mostly unusable, and the point is that the unusable material had to move before anything better could.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Bypasses the critic',
        description: 'Speed is what leaves it behind.',
      },
      {
        icon: 'target',
        title: 'Clears the surface',
        description: 'The obvious thoughts have to go first.',
      },
      {
        icon: 'leaf',
        title: 'Nothing to live up to',
        description: 'It is not meant to be good.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels like nonsense',
        description: 'It largely is. Keep the pen moving.',
      },
      {
        when: 'Week 3',
        title: 'Real thinking appears',
        description: 'Usually a page or two in.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Writing becomes how you think.',
        peak: true,
      },
    ],
    howToStart: [
      'Write one sentence as fast as you can.',
      'Never stop to fix anything. If you stall, write about stalling.',
      'Ten minutes on a timer. Do not reread immediately.',
    ],
    sources: [
      {
        authors: 'Elbow P',
        title: 'Writing Without Teachers',
        journal: 'Oxford University Press',
        year: '1998',
      },
    ],
  },

  'Idea Generation': {
    tagline: 'Ten ideas, quality irrelevant.',
    lead: 'Fluency — the sheer number of ideas you can produce — is trainable, and quantity is what makes quality possible. Insisting on good ideas immediately is the most reliable way to produce none.',
    cadenceLabel: 'Daily · 10 ideas',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Fluency is trainable',
        description: 'The tenth idea comes faster over time.',
      },
      {
        icon: 'target',
        title: 'Quantity enables quality',
        description: 'Good ideas arrive inside bad batches.',
      },
      {
        icon: 'wave',
        title: 'Low stakes',
        description: 'Nobody sees the list.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Stuck at four',
        description: 'Almost everyone is. Push to ten anyway.',
      },
      {
        when: 'Week 3',
        title: 'Ten gets easy',
        description: 'The block moves later in the list.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Ideas start arriving unprompted.',
        peak: true,
      },
    ],
    howToStart: [
      'Write down one idea.',
      'Ten on any topic — silly ones count and help.',
      'Never evaluate while generating. Those are separate sessions.',
    ],
    sources: [
      {
        authors: 'Altucher J',
        title: 'Become an Idea Machine',
        journal: 'Choose Yourself Media',
        year: '2014',
      },
    ],
  },

  'Divergent Thinking': {
    tagline: 'Find several answers, not the answer.',
    lead: 'Divergent thinking — generating many possible solutions — is a distinct capacity from the convergent kind schooling trains, and it responds to practice. The classic exercise is deliberately absurd: how many uses can you find for a brick.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'A separate skill',
        description: 'Distinct from finding the right answer.',
      },
      {
        icon: 'target',
        title: 'Breaks fixedness',
        description: 'Objects stop having one purpose.',
      },
      {
        icon: 'leaf',
        title: 'Five minutes',
        description: 'Small enough to keep daily.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Two or three answers',
        description: 'Then a wall. That wall is the target.',
      },
      {
        when: 'Week 3',
        title: 'Past the obvious',
        description: 'Interesting answers live after answer five.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You look for alternatives by reflex.',
        peak: true,
      },
    ],
    howToStart: [
      'List two different uses for one object.',
      'Push for ten. The good ones are always late.',
      'Absurd answers are useful — they widen the search.',
    ],
    sources: [
      {
        authors: 'Guilford JP',
        title: 'The Nature of Human Intelligence',
        journal: 'McGraw-Hill',
        year: '1967',
      },
    ],
  },

  'Idea Mashup': {
    tagline: 'Force two unrelated things together.',
    lead: 'Most innovation is recombination rather than invention — an existing idea moved into a field that had not seen it. Deliberately colliding unrelated concepts manufactures the conditions for that, instead of waiting for it.',
    cadenceLabel: 'Daily · one mashup',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Recombination',
        description: 'How most new ideas actually arise.',
      },
      {
        icon: 'target',
        title: 'Manufactures collisions',
        description: 'Rather than waiting to be struck.',
      },
      {
        icon: 'wave',
        title: 'Rewards breadth',
        description: 'Unrelated interests become an asset.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Nonsense',
        description: 'Most pairings go nowhere. Expected.',
      },
      {
        when: 'Week 3',
        title: 'Occasionally striking',
        description: 'One in twenty is genuinely interesting.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You start seeing cross-domain parallels.',
        peak: true,
      },
    ],
    howToStart: [
      'Combine two random words into a phrase.',
      'Pull two concepts from unrelated fields and force a connection.',
      'Keep the interesting ones. Bin the rest without ceremony.',
    ],
    sources: [
      {
        authors: 'Johansson F',
        title: 'The Medici Effect',
        journal: 'Harvard Business Review Press',
        year: '2004',
      },
    ],
  },

  'Daily Sketching': {
    tagline: 'Draw badly, on purpose.',
    lead: 'Sketching forces you to actually look at something rather than recognise it, which is a different and more demanding kind of attention. The drawing is a by-product; the looking is the practice.',
    cadenceLabel: 'Daily · 15 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Trains real looking',
        description: 'Recognition is not observation.',
      },
      {
        icon: 'sparkle',
        title: 'Thinking on paper',
        description: 'Some problems only yield visually.',
      },
      {
        icon: 'leaf',
        title: 'No talent required',
        description: 'Badly is a legitimate way to draw.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Self-conscious',
        description: 'Nobody has to see it.',
      },
      {
        when: 'Week 4',
        title: 'Visibly better',
        description: 'Daily drawing improves fast from zero.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You sketch while thinking.',
        peak: true,
      },
    ],
    howToStart: [
      'Doodle for 30 seconds.',
      'Draw what is in front of you, not from imagination.',
      'One notebook, kept visible. Never tear pages out.',
    ],
    sources: [
      {
        authors: 'Brown S',
        title: 'The Doodle Revolution',
        journal: 'Portfolio',
        year: '2014',
      },
    ],
  },

  'Creative Writing': {
    tagline: 'Write something invented.',
    lead: 'Fiction requires you to model minds other than your own, hold an imagined world consistent, and choose words for effect. It is demanding in a way that is also genuinely enjoyable, which is a rare combination in a daily habit.',
    cadenceLabel: 'Daily · 5-15 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Perspective-taking',
        description: 'You have to inhabit other minds.',
      },
      {
        icon: 'target',
        title: 'Language precision',
        description: 'Word choice becomes deliberate.',
      },
      {
        icon: 'wave',
        title: 'Absorbing',
        description: 'One of the easier routes into flow.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Blank page',
        description: 'Start mid-scene. Beginnings are the hardest part.',
      },
      {
        when: 'Week 4',
        title: 'It flows',
        description: 'Starting stops being the obstacle.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A daily writing slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Write one sentence of fiction.',
      'Start in the middle of something happening.',
      'Nobody has to read it. That is what makes it possible.',
    ],
    sources: [
      {
        authors: 'Kaufman SB, Gregoire C',
        title: 'Wired to Create',
        journal: 'Perigee',
        year: '2015',
      },
    ],
  },

  'Daily Photography': {
    tagline: 'Take one photograph a day.',
    lead: 'Carrying an intention to photograph changes how you move through a familiar place — you start noticing light, shape and detail that were always there. The habit is really an attention habit wearing a camera.',
    cadenceLabel: 'Daily · one photo',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Trains noticing',
        description: 'Looking for a photo changes what you see.',
      },
      {
        icon: 'sparkle',
        title: 'Familiar gets interesting',
        description: 'Your own street becomes material.',
      },
      {
        icon: 'leaf',
        title: 'Already in your pocket',
        description: 'No equipment decision to make.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Nothing worth shooting',
        description: 'That perception is exactly what changes.',
      },
      {
        when: 'Week 3',
        title: 'Seeing more',
        description: 'Light and composition start registering.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You notice photographs before taking them.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one photo of something around you.',
      'One deliberate photo beats forty casual ones.',
      'Same walk, different day — constraint helps.',
    ],
    sources: [
      {
        authors: 'Csikszentmihalyi M',
        title: 'Creativity: Flow and the Psychology of Discovery and Invention',
        journal: 'HarperCollins',
        year: '1996',
      },
    ],
  },

  'Art Appreciation': {
    tagline: 'Look at art, properly.',
    lead: 'Aesthetic experience involves genuine cognitive work — you are resolving ambiguity and building interpretation, not passively receiving. The main obstacle is speed: most gallery visits move too fast to let any of that happen.',
    cadenceLabel: 'Weekly · 5-20 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Active interpretation',
        description: 'Aesthetic response is cognitive work.',
      },
      {
        icon: 'wave',
        title: 'Absorbing',
        description: 'Slow looking is unexpectedly restful.',
      },
      {
        icon: 'target',
        title: 'Reference material',
        description: 'You accumulate visual vocabulary.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'You rush',
        description: 'Most people give a work seconds.',
      },
      {
        when: 'Week 4',
        title: 'You see more',
        description: 'Slow looking is a trainable skill.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You linger without forcing it.',
        peak: true,
      },
    ],
    howToStart: [
      'Open one art image and look for 30 seconds.',
      'One work for five minutes beats forty works in an hour.',
      'Note what you notice before reading the label.',
    ],
    sources: [
      {
        authors: 'Leder H, Belke B, Oeberst A, Augustin D',
        title: 'A model of aesthetic appreciation and aesthetic judgments',
        journal: 'British Journal of Psychology',
        year: '2004',
      },
    ],
  },

  'Unstructured Play Time': {
    tagline: 'Do something with no point.',
    lead: 'Play is activity without an outcome, which makes it almost impossible for adults to permit. That is the reason to schedule it — the absence of purpose is the active ingredient, and productivity framing destroys it.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Genuinely restorative',
        description: 'Different from rest and from entertainment.',
      },
      {
        icon: 'sparkle',
        title: 'No performance',
        description: 'Nothing to be assessed against.',
      },
      {
        icon: 'leaf',
        title: 'Reduces stress',
        description: 'Purposelessness is the mechanism.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels wasteful',
        description: 'That discomfort is the point.',
      },
      {
        when: 'Week 3',
        title: 'Looked forward to',
        description: 'You stop justifying it.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Play has a slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Play with no goal for 60 seconds.',
      'No outcome, no tracking, no improvement.',
      'If you catch yourself optimising it, you are not playing.',
    ],
    sources: [
      {
        authors: 'Brown S',
        title: 'Play: How It Shapes the Brain, Opens the Imagination',
        journal: 'Avery',
        year: '2009',
      },
    ],
  },

  'Hands-On Building': {
    tagline: 'Make something physical.',
    lead: 'Physical making has a property screens lack — immediate, honest feedback, and a result you can hold. That combination makes it unusually good at producing absorption, which is most of why it reduces anxiety.',
    cadenceLabel: 'Daily · 15-30 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Absorbing',
        description: 'Hands busy, rumination quiet.',
      },
      {
        icon: 'target',
        title: 'Honest feedback',
        description: 'It works or it does not.',
      },
      {
        icon: 'sparkle',
        title: 'Something real',
        description: 'A finished object, not a metric.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Fiddly',
        description: 'Hands are out of practice.',
      },
      {
        when: 'Week 3',
        title: 'Flow arrives faster',
        description: 'You drop in more easily.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You reach for it instead of a screen.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick up the materials and lay them out. That is the hard part done.',
      'Leave the project out — packing away kills momentum.',
      'LEGO, knitting, wood, clay. Whichever you would actually touch.',
    ],
    sources: [
      {
        authors: 'Csikszentmihalyi M',
        title: 'Flow: The Psychology of Optimal Experience',
        journal: 'Harper & Row',
        year: '1990',
      },
    ],
  },

  'Experimental Cooking': {
    tagline: 'Cook something new, phone away.',
    lead: 'Cooking engages every sense and gives immediate feedback, which makes it one of the most reliably absorbing everyday activities. Cooking frequency also tracks with better diet quality — you get the creative benefit and the nutritional one together.',
    cadenceLabel: 'Weekly · one new recipe',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Every sense engaged',
        description: 'Hard to be elsewhere while cooking.',
      },
      {
        icon: 'leaf',
        title: 'Better diet quality',
        description: 'Cooking frequency tracks with it.',
      },
      {
        icon: 'target',
        title: 'Immediate result',
        description: 'You eat the outcome.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Slow and messy',
        description: 'New recipes always take longer.',
      },
      {
        when: 'Week 4',
        title: 'Improvising',
        description: 'You start deviating on purpose.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Cooking becomes something you want to do.',
        peak: true,
      },
    ],
    howToStart: [
      'Add one new spice to your next dish.',
      'Read the whole recipe before starting. Genuinely.',
      'Phone in another room — that is what makes it absorbing.',
    ],
    sources: [
      {
        authors: 'Farmer N, Touchton-Leonard K, Ross A',
        title:
          'Psychosocial benefits of cooking interventions: a systematic review',
        journal: 'Health Education & Behavior',
        year: '2018',
      },
    ],
  },

  'Gardening Therapy': {
    tagline: 'Fifteen minutes with plants.',
    lead: 'Gardening combines light physical activity, time outdoors and a slow feedback loop, and a controlled study found it produced greater cortisol reduction and mood recovery after stress than indoor reading did.',
    evidence:
      'Van Den Berg & Custers (2011) found that 30 minutes of gardening after a stressful task produced a greater decrease in cortisol and better mood recovery than 30 minutes of indoor reading.',
    cadenceLabel: 'Daily · 15 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Measured cortisol drop',
        description: 'Compared directly against reading.',
      },
      {
        icon: 'leaf',
        title: 'Outdoors and moving',
        description: 'Several benefits in one activity.',
      },
      {
        icon: 'target',
        title: 'Slow feedback',
        description: 'A welcome change of timescale.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediately calming',
        description: 'The effect does not need weeks.',
      },
      {
        when: 'Week 4',
        title: 'Things grow',
        description: 'Visible progress is its own reward.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Tending becomes part of the day.',
        peak: true,
      },
    ],
    howToStart: [
      'Touch the soil of one plant.',
      'Herbs on a windowsill count. No garden required.',
      'Start with something hard to kill — mint, or a spider plant.',
    ],
    sources: [
      {
        authors: 'Van Den Berg AE, Custers MHG',
        title: 'Gardening promotes neuroendocrine and affective restoration from stress',
        journal: 'Journal of Health Psychology',
        year: '2011',
      },
    ],
  },

  'Daily Singing': {
    tagline: 'Sing, badly, for ten minutes.',
    lead: 'Singing combines controlled breathing with vocal and social engagement, and studies find changes in mood and stress markers afterwards. Skill is irrelevant — the mechanism is breath and expression, not performance.',
    evidence:
      'Grape et al. (2003) found that singing produced improvements in wellbeing and changes in stress-related hormones, in both amateur and professional singers.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Breath control',
        description: 'Singing enforces long, controlled exhales.',
      },
      {
        icon: 'leaf',
        title: 'Mood and stress markers',
        description: 'Measured in amateurs too.',
      },
      {
        icon: 'sparkle',
        title: 'Skill irrelevant',
        description: 'Badly is fine. Nobody is scoring it.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Self-conscious',
        description: 'The shower and the car exist for this.',
      },
      {
        when: 'Week 3',
        title: 'Genuinely enjoyable',
        description: 'Self-consciousness fades fast.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You sing without deciding to.',
        peak: true,
      },
    ],
    howToStart: [
      'Hum one verse of a song.',
      'Shower, car, kitchen — anywhere you are alone.',
      'Loud and wrong beats quiet and careful.',
    ],
    sources: [
      {
        authors: 'Grape C, Sandgren M, Hansson L-O, Ericson M, Theorell T',
        title:
          'Does singing promote well-being? An empirical study of professional and amateur singers during a singing lesson',
        journal: 'Integrative Physiological and Behavioral Science',
        year: '2003',
      },
    ],
  },

  'Free Dance Session': {
    tagline: 'Move to music with no steps.',
    lead: 'Dance movement interventions show effects on depressive symptoms in trial data, combining physical activity, music and non-verbal expression. Choreography is not required and mostly gets in the way.',
    evidence:
      'Koch et al. (2019) meta-analysed dance movement therapy trials and found significant effects on depression, anxiety and quality of life.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Trial evidence on mood',
        description: 'Meta-analysed across studies.',
      },
      {
        icon: 'wave',
        title: 'Exercise plus expression',
        description: 'Both at once, neither feeling like work.',
      },
      {
        icon: 'sparkle',
        title: 'No technique',
        description: 'Choreography would spoil it.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Absurd',
        description: 'Alone, with the door shut, is fine.',
      },
      {
        when: 'Week 2',
        title: 'Actually fun',
        description: 'The self-consciousness burns off.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A reliable mood lever.',
        peak: true,
      },
    ],
    howToStart: [
      'Sway for 30 seconds.',
      'One song, alone, no mirror.',
      'Let the body lead. Thinking about it is the obstacle.',
    ],
    sources: [
      {
        authors: 'Koch SC, et al.',
        title:
          'Effects of dance movement therapy and dance on health-related psychological outcomes: a meta-analysis update',
        journal: 'Frontiers in Psychology',
        year: '2019',
      },
    ],
  },

  'Coloring Practice': {
    tagline: 'Colour inside the lines.',
    lead: 'Structured colouring reduces anxiety in trial conditions — the constraint appears to matter, with mandala-style patterns outperforming free drawing. It occupies attention just enough to crowd out rumination without demanding decisions.',
    evidence:
      'Curry & Kasser (2005) found that colouring a structured mandala reduced anxiety more than free-form colouring or unstructured drawing.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Measured anxiety drop',
        description: 'Structured patterns did best.',
      },
      {
        icon: 'target',
        title: 'Occupies attention',
        description: 'Enough to displace rumination.',
      },
      {
        icon: 'leaf',
        title: 'No skill, no decisions',
        description: 'The lines are already there.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Surprisingly calming',
        description: 'Works from the first session.',
      },
      {
        when: 'Week 2',
        title: 'A reliable tool',
        description: 'You start using it deliberately.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A default wind-down option.',
        peak: true,
      },
    ],
    howToStart: [
      'Fill in one shape with colour.',
      'Structured patterns beat blank pages for the anxiety effect.',
      'No music with words — quiet works better here.',
    ],
    sources: [
      {
        authors: 'Curry NA, Kasser T',
        title: 'Can coloring mandalas reduce anxiety?',
        journal: 'Art Therapy',
        year: '2005',
      },
    ],
  },

  'Skill Exploration': {
    tagline: 'Pick up something new each month.',
    lead: 'Being a beginner is a specific, uncomfortable state that adults get very little practice at — and tolerating it is what makes learning anything possible later. A monthly rotation keeps that tolerance in working order.',
    cadenceLabel: 'Monthly · one new skill',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Beginner tolerance',
        description: 'A capacity that atrophies with age.',
      },
      {
        icon: 'target',
        title: 'Fast early gains',
        description: 'The first weeks of anything are steep.',
      },
      {
        icon: 'leaf',
        title: 'You find keepers',
        description: 'Some rotations become long-term.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Bad at it',
        description: 'Which is the exercise, not the failure.',
      },
      {
        when: 'Week 3',
        title: 'Basically competent',
        description: 'Enough to know if you want more.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A monthly rotation you look forward to.',
        peak: true,
      },
    ],
    howToStart: [
      'Watch a 60-second tutorial on a new skill.',
      'One month, then decide whether to keep or rotate.',
      'Pick for curiosity, not usefulness.',
    ],
    sources: [
      {
        authors: 'Carson S',
        title: 'Your Creative Brain',
        journal: 'Jossey-Bass',
        year: '2010',
      },
    ],
  },

  'Break Routines': {
    tagline: 'Go a different way.',
    lead: 'Habitual routes are run on autopilot, and autopilot means you stop noticing. Deliberately breaking one small pattern restores attention to a stretch of your day that had gone invisible — a very cheap intervention.',
    cadenceLabel: 'Daily · one small change',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Interrupts autopilot',
        description: 'Novelty restores attention.',
      },
      {
        icon: 'target',
        title: 'You notice again',
        description: 'Familiar routes go invisible.',
      },
      {
        icon: 'leaf',
        title: 'Costs nothing',
        description: 'A different turn is free.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Mildly disorienting',
        description: 'A good sign, in this case.',
      },
      {
        when: 'Week 3',
        title: 'You see more',
        description: 'Attention widens generally.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You vary things by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one different turn on your next walk.',
      'Different route, different café, different order of tasks.',
      'One small change a day. Not a reinvented life.',
    ],
    sources: [
      {
        authors: 'Rock D',
        title: 'Your Brain at Work',
        journal: 'HarperBusiness',
        year: '2009',
      },
    ],
  },
};
