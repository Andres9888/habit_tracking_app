/**
 * Science drill-down copy — Mindfulness, reflection and nature.
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const MINDFULNESS_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Gratitude Journaling': {
    tagline: 'Write down a few good things — briefly, but regularly.',
    lead: 'Naming specific good things forces your attention off what went wrong and onto what went right. Done regularly it shifts your baseline read of your own life, which is why the effect shows up in wellbeing measures rather than just mood in the moment.',
    evidence:
      'In Emmons & McCullough’s 2003 experiments, participants who wrote weekly gratitude lists reported greater wellbeing and more optimism about the coming week than those who listed hassles.',
    cadenceLabel: 'Daily · 5 min · evening',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Better baseline mood',
        description: 'A steadier sense that things are broadly going okay.',
      },
      {
        icon: 'moon',
        title: 'Easier wind-down',
        description: 'Ending the day on the ledger’s credit side helps you sleep.',
      },
      {
        icon: 'target',
        title: 'Notice more as you go',
        description: 'You start spotting good moments while they happen.',
      },
    ],
    timeline: [
      {
        when: 'First week',
        title: 'A small lift',
        description: 'Most people notice a mild mood effect straight away.',
      },
      {
        when: 'Week 3',
        title: 'Easier to fill',
        description: 'Finding three things stops feeling like a stretch.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The evening list becomes part of shutting the day down.',
        peak: true,
      },
    ],
    howToStart: [
      'Write three specific things — "the coffee" beats "my family".',
      'Two minutes is enough. Depth beats length.',
      'Keep it by the bed so the cue is unmissable.',
    ],
    sources: [
      {
        authors: 'Emmons RA, McCullough ME',
        title:
          'Counting blessings versus burdens: an experimental investigation of gratitude and subjective well-being in daily life',
        journal: 'Journal of Personality and Social Psychology',
        year: '2003',
      },
    ],
  },

  'Body Scan Meditation': {
    tagline: 'Move attention through the body, part by part.',
    lead: 'A body scan trains interoception — the ability to notice internal signals accurately. That is why it shows up in chronic pain programmes: you are not trying to remove sensation, you are changing how you relate to it.',
    cadenceLabel: 'Daily · 10-20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Notice tension earlier',
        description: 'You catch it before it becomes pain.',
      },
      {
        icon: 'leaf',
        title: 'Changed pain relationship',
        description: 'A core component of mindfulness pain programmes.',
      },
      {
        icon: 'moon',
        title: 'Good before sleep',
        description: 'Settles the body without requiring effort.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Restless',
        description: 'Attention wanders constantly. That is the practice.',
      },
      {
        when: 'Week 4',
        title: 'Finer resolution',
        description: 'You start noticing subtler sensations.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Body awareness carries into the rest of the day.',
        peak: true,
      },
    ],
    howToStart: [
      'Lie down and move attention slowly from toes to head.',
      'Note what is there without trying to change it.',
      'A guided recording helps for the first few weeks.',
    ],
    sources: [
      {
        authors: 'Kabat-Zinn J',
        title: 'Full Catastrophe Living',
        journal: 'Delacorte Press',
        year: '1990',
      },
    ],
  },

  'Loving-Kindness Meditation': {
    tagline: 'Deliberately wish people well — including yourself.',
    lead: 'Loving-kindness practice trains warmth as a skill rather than waiting for it to arrive. Over weeks it appears to raise the frequency of positive emotion in daily life, which in turn builds durable personal resources.',
    evidence:
      'Fredrickson et al. (2008) randomised adults to seven weeks of loving-kindness meditation and found increases in daily positive emotions, which in turn predicted growth in personal resources and life satisfaction.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'More positive emotion',
        description: 'Measured as a daily-life increase, not a session high.',
      },
      {
        icon: 'target',
        title: 'Warmer relationships',
        description: 'Practised goodwill transfers to real interactions.',
      },
      {
        icon: 'wave',
        title: 'Less self-criticism',
        description: 'You are included in the wishing.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels false',
        description: 'Wishing yourself well is the hardest part for most.',
      },
      {
        when: 'Week 4',
        title: 'Genuine warmth',
        description: 'The phrases start carrying real feeling.',
      },
      {
        when: '~50 days',
        title: 'Automatic',
        description: 'Goodwill becomes a default stance.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with someone easy to love, then yourself, then a stranger.',
      'Repeat simple phrases: may you be well, may you be at ease.',
      'Ten minutes. Do not force feeling — the repetition is the practice.',
    ],
    sources: [
      {
        authors: 'Fredrickson BL, et al.',
        title:
          'Open hearts build lives: positive emotions, induced through loving-kindness meditation, build consequential personal resources',
        journal: 'Journal of Personality and Social Psychology',
        year: '2008',
      },
    ],
  },

  '13-Minute Focus Meditation': {
    tagline: 'Thirteen minutes of breath anchoring, daily.',
    lead: 'This is a specific, tested dose rather than an open-ended practice. Eight weeks of short daily meditation improved attention, memory and mood in people who had never meditated before — the point is that the effective dose is small.',
    evidence:
      'Basso et al. (2019) found eight weeks of 13-minute daily meditation improved attention, working memory, recognition memory and mood in non-experienced meditators, while shorter periods did not.',
    cadenceLabel: 'Daily · 13 min · 8 weeks minimum',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Measured attention gains',
        description: 'Sustained attention improved in a controlled trial.',
      },
      {
        icon: 'sparkle',
        title: 'Memory too',
        description: 'Both working and recognition memory improved.',
      },
      {
        icon: 'leaf',
        title: 'A known dose',
        description: '13 minutes for 8 weeks is what was actually tested.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Mostly restlessness',
        description: 'Do not judge the practice by the first fortnight.',
      },
      {
        when: 'Week 8',
        title: 'The tested milestone',
        description: 'This is where the trial measured its effects.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'The session holds its slot without negotiation.',
        peak: true,
      },
    ],
    howToStart: [
      'Same time daily. Thirteen minutes, breath as the anchor.',
      'When attention wanders, return to the breath. That return is the rep.',
      'Commit to eight weeks before judging it.',
    ],
    sources: [
      {
        authors: 'Basso JC, et al.',
        title:
          'Brief, daily meditation enhances attention, memory, mood, and emotional regulation in non-experienced meditators',
        journal: 'Behavioural Brain Research',
        year: '2019',
      },
    ],
  },

  'Progressive Muscle Relaxation': {
    tagline: 'Tense each muscle group, then let go.',
    lead: 'Deliberately tensing before releasing makes the relaxation obvious — you cannot notice letting go of tension you did not know you were holding. It is one of the oldest and best-established anxiety-reduction techniques.',
    cadenceLabel: 'Daily · 10-15 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Physical tension released',
        description: 'Works on the body, not the thoughts.',
      },
      {
        icon: 'moon',
        title: 'Good before sleep',
        description: 'A reliable wind-down for a tense body.',
      },
      {
        icon: 'target',
        title: 'You learn your holding spots',
        description: 'Jaw, shoulders, hands — everyone has favourites.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Surprising contrast',
        description: 'You discover how much tension was baseline.',
      },
      {
        when: 'Week 3',
        title: 'Faster release',
        description: 'You can let go without tensing first.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You notice and drop tension through the day.',
        peak: true,
      },
    ],
    howToStart: [
      'Work foot to head: tense 5 seconds, release 15, notice the difference.',
      'Do not tense to the point of pain or cramp.',
      'Lying down before bed is the easiest slot.',
    ],
    sources: [
      {
        authors: 'Jacobson E',
        title: 'Progressive Relaxation',
        journal: 'University of Chicago Press',
        year: '1929',
      },
    ],
  },

  'Scheduled Worry Time': {
    tagline: 'Give worry an appointment instead of the whole day.',
    lead: 'Worry expands to fill available time, and trying to suppress it makes it rebound. Containing it to a fixed window gives you something to say to an intruding worry — not "stop", which fails, but "later, at six", which works.',
    evidence:
      'Borkovec et al. (1983) found that participants trained to postpone worry to a designated 30-minute period reported significant reductions in overall daily worrying.',
    cadenceLabel: 'Daily · 15-30 min · same time',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less all-day worry',
        description: 'Containment beats suppression.',
      },
      {
        icon: 'target',
        title: 'Something to say to it',
        description: '"Later" is a credible answer; "stop" is not.',
      },
      {
        icon: 'moon',
        title: 'Quieter nights',
        description: 'Worry has already had its slot.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Hard to postpone',
        description: 'Worries do not respect appointments at first.',
      },
      {
        when: 'Week 3',
        title: 'Postponement works',
        description: 'You start genuinely deferring rather than suppressing.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Worry mostly stays in its window.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a fixed 15-30 minute slot, not close to bedtime.',
      'Outside it, note the worry and say "at six" — then actually turn up.',
      'In the slot, write them down. Close the notebook when time is up.',
    ],
    sources: [
      {
        authors: 'Borkovec TD, Wilkinson L, Folensbee R, Lerman C',
        title: 'Stimulus control applications to the treatment of worry',
        journal: 'Behaviour Research and Therapy',
        year: '1983',
      },
    ],
  },

  'Walking in Nature': {
    tagline: 'Twenty minutes among trees.',
    lead: 'Natural environments appear to restore attention in a way urban ones do not — the effect shows up in cortisol and blood pressure as well as self-report. Twenty minutes is enough to register; the greenery is doing work the walking alone would not.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower stress markers',
        description: 'Cortisol and blood pressure both respond.',
      },
      {
        icon: 'target',
        title: 'Attention restored',
        description: 'Nature recovers focus better than urban walking.',
      },
      {
        icon: 'leaf',
        title: 'Mood lift',
        description: 'Reliable, and larger than most people expect.',
      },
    ],
    timeline: [
      {
        when: 'First walk',
        title: 'Immediate',
        description: 'The mood effect arrives during the walk.',
      },
      {
        when: 'Week 2',
        title: 'You seek it out',
        description: 'The contrast with indoor days becomes obvious.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The green route becomes the default route.',
        peak: true,
      },
    ],
    howToStart: [
      'Twenty minutes somewhere with trees or water. A park counts.',
      'Leave the headphones out — the soundscape is part of it.',
      'Take the greener route on a walk you already make.',
    ],
    sources: [
      {
        authors: 'Hansen MM, Jones R, Tocchini K',
        title:
          'Shinrin-yoku (forest bathing) and nature therapy: a state-of-the-art review',
        journal:
          'International Journal of Environmental Research and Public Health',
        year: '2017',
      },
    ],
  },

  'Unstimulated Walk': {
    tagline: 'Walk with nothing in your ears.',
    lead: 'Constant audio input means your attention never has slack. A walk with no podcast is where unresolved thinking surfaces and finishes — it is boring on purpose, and the boredom is the mechanism.',
    cadenceLabel: 'Daily · 30 min · no audio',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Thinking finishes',
        description: 'Unresolved problems surface and resolve.',
      },
      {
        icon: 'wave',
        title: 'Attention restored',
        description: 'Input-free time is what recovers focus.',
      },
      {
        icon: 'leaf',
        title: 'Tolerance for boredom',
        description: 'A capacity that constant audio erodes.',
      },
    ],
    timeline: [
      {
        when: 'Walk 1',
        title: 'Uncomfortable',
        description: 'The urge to put something on is strong.',
      },
      {
        when: 'Week 2',
        title: 'Ideas arrive',
        description: 'This is when people start valuing it.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You leave the headphones behind deliberately.',
        peak: true,
      },
    ],
    howToStart: [
      'Phone in your pocket, headphones left at home.',
      'Thirty minutes. Let your mind go where it wants.',
      'Take a note only if something genuinely needs capturing.',
    ],
    sources: [
      {
        authors: 'Kaplan S',
        title:
          'The restorative benefits of nature: toward an integrative framework',
        journal: 'Journal of Environmental Psychology',
        year: '1995',
      },
    ],
  },

  'Blue Space Time': {
    tagline: 'Time near moving water.',
    lead: 'Water environments show up in the wellbeing literature as at least as restorative as green ones. The mechanism is probably a combination of soft fascination, open sightlines and steady sound — none of which requires a coastline.',
    cadenceLabel: '2-3x weekly · 20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower distress',
        description: 'Blue space exposure tracks with better wellbeing.',
      },
      {
        icon: 'leaf',
        title: 'Effortless attention',
        description: 'Moving water holds focus without demanding it.',
      },
      {
        icon: 'target',
        title: 'Steady sound',
        description: 'A natural mask for urban noise.',
      },
    ],
    timeline: [
      {
        when: 'First visit',
        title: 'Immediately calming',
        description: 'The effect does not need repetition.',
      },
      {
        when: 'Week 2',
        title: 'Becomes a destination',
        description: 'You start routing walks toward water.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A standing part of your week.',
        peak: true,
      },
    ],
    howToStart: [
      'A canal, river, fountain or pond all count. Ocean not required.',
      'Twenty minutes, sitting or walking.',
      'Phone away — the point is undemanding attention.',
    ],
    sources: [
      {
        authors: 'White M, et al.',
        title:
          'Blue space: the importance of water for preference, affect, and restorativeness ratings of natural and built scenes',
        journal: 'Journal of Environmental Psychology',
        year: '2010',
      },
    ],
  },

  'Bird Watching': {
    tagline: 'Fifteen quiet minutes watching birds.',
    lead: 'Neighbourhood bird abundance is associated with lower depression and anxiety, and the watching itself is a form of undemanding attention that recovers focus. It also makes an ordinary street interesting, which is its own benefit.',
    evidence:
      'Cox et al. (2017) found that lower levels of depression, anxiety and stress were associated with higher neighbourhood vegetation cover and afternoon bird abundance.',
    cadenceLabel: 'Daily · 15 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Associated with better mood',
        description: 'Bird abundance tracks with lower distress.',
      },
      {
        icon: 'wave',
        title: 'Undemanding focus',
        description: 'Attention rests while still being engaged.',
      },
      {
        icon: 'sparkle',
        title: 'Noticing improves',
        description: 'You start seeing what was always there.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Mostly pigeons',
        description: 'Recognition takes a little practice.',
      },
      {
        when: 'Week 4',
        title: 'Real variety',
        description: 'You start distinguishing species and calls.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You notice birds everywhere now.',
        peak: true,
      },
    ],
    howToStart: [
      'A window seat is enough to start.',
      'Fifteen minutes, sitting still. Stillness brings more birds than searching.',
      'An ID app makes the first month far more rewarding.',
    ],
    sources: [
      {
        authors: 'Cox DTC, et al.',
        title:
          'Doses of neighborhood nature: the benefits for mental health of living with nature',
        journal: 'BioScience',
        year: '2017',
      },
    ],
  },

  Stargazing: {
    tagline: 'Ten minutes looking up.',
    lead: 'Awe — the response to something vast that does not fit your current frame — reliably shrinks the sense of self-importance and increases prosocial behaviour. A clear night sky is the most accessible source of it there is.',
    evidence:
      'Piff et al. (2015) found experimentally induced awe produced a diminished sense of self and increased prosocial and generous behaviour.',
    cadenceLabel: 'Weekly · 10 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Awe',
        description: 'Measurably shifts self-focus and generosity.',
      },
      {
        icon: 'wave',
        title: 'Perspective',
        description: 'Today’s problems resize themselves.',
      },
      {
        icon: 'moon',
        title: 'A dark-adapted end to the day',
        description: 'No screens involved, by definition.',
      },
    ],
    timeline: [
      {
        when: 'First night',
        title: 'Works immediately',
        description: 'Awe does not require practice.',
      },
      {
        when: 'Week 3',
        title: 'You see more',
        description: 'Dark adaptation and familiarity both build.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You look up as a matter of course.',
        peak: true,
      },
    ],
    howToStart: [
      'Get away from direct light and let your eyes adapt for 10 minutes.',
      'No phone — one look at a screen resets your night vision.',
      'A star app helps, used before you go out rather than while you are there.',
    ],
    sources: [
      {
        authors: 'Piff PK, et al.',
        title: 'Awe, the small self, and prosocial behavior',
        journal: 'Journal of Personality and Social Psychology',
        year: '2015',
      },
    ],
  },

  'Mindful Eating': {
    tagline: 'Eat slowly and actually taste it.',
    lead: 'Satiety signals arrive on a delay, so eating fast means you finish before your body reports. Slowing down and paying attention lets those signals land — and food eaten with attention is more satisfying at smaller volume.',
    cadenceLabel: 'Every meal · start with one',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Satiety signals land',
        description: 'You notice fullness before you have overshot.',
      },
      {
        icon: 'leaf',
        title: 'More enjoyment',
        description: 'Attention is most of what makes food good.',
      },
      {
        icon: 'target',
        title: 'Less autopilot eating',
        description: 'You catch the mindless middle of a meal.',
      },
    ],
    timeline: [
      {
        when: 'Meal 1',
        title: 'Harder than expected',
        description: 'Eating fast is deeply automatic.',
      },
      {
        when: 'Week 3',
        title: 'Naturally slower',
        description: 'You stop needing to remind yourself.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Attention comes with the meal.',
        peak: true,
      },
    ],
    howToStart: [
      'Put the fork down between mouthfuls. That single rule does most of it.',
      'No screens. One meal a day to start.',
      'Notice the first three bites properly — that is where most flavour is.',
    ],
    sources: [
      {
        authors: 'Kristeller JL, Wolever RQ',
        title:
          'Mindfulness-based eating awareness training for treating binge eating disorder',
        journal: 'Eating Disorders',
        year: '2011',
      },
    ],
  },

  'Evening Reflection': {
    tagline: 'What went well, what to change.',
    lead: 'Experience does not teach on its own — reflection is the step that converts it into something usable. Two questions at the end of the day is the smallest version of that loop that still works.',
    cadenceLabel: 'Nightly · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Learning compounds',
        description: 'Reflected experience beats accumulated experience.',
      },
      {
        icon: 'leaf',
        title: 'Progress becomes visible',
        description: 'Days blur without a record.',
      },
      {
        icon: 'moon',
        title: 'Closes the day',
        description: 'A defined end rather than a fade-out.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Repetitive',
        description: 'Early entries all look the same.',
      },
      {
        when: 'Week 4',
        title: 'Patterns visible',
        description: 'The same friction shows up repeatedly — usefully.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The day is not over until it is written.',
        peak: true,
      },
    ],
    howToStart: [
      'Two questions: what went well, what would I change.',
      'Five minutes. Bullet points, not prose.',
      'Reread the week on Sundays — that is where the value surfaces.',
    ],
    sources: [
      {
        authors: 'Kolb DA',
        title:
          'Experiential Learning: Experience as the Source of Learning and Development',
        journal: 'Prentice Hall',
        year: '1984',
      },
    ],
  },

  'Single-Sentence Journal': {
    tagline: 'One sentence about today.',
    lead: 'The barrier is the whole design. A single sentence is small enough that you cannot reasonably skip it, and it still forces the brief act of summarising a day — which is most of what journalling does.',
    cadenceLabel: 'Nightly · 1 sentence',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Impossible to skip',
        description: 'One sentence defeats every excuse.',
      },
      {
        icon: 'target',
        title: 'Forces a summary',
        description: 'You have to decide what mattered.',
      },
      {
        icon: 'leaf',
        title: 'A real record',
        description: 'A year of sentences is worth rereading.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Trivially easy',
        description: 'That is the point — it should feel too small.',
      },
      {
        when: 'Week 4',
        title: 'Often becomes more',
        description: 'Sentences grow into paragraphs on their own.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'The sentence happens without deciding.',
        peak: true,
      },
    ],
    howToStart: [
      'One sentence. If you write more, fine — but one is success.',
      'Keep it by the bed, on paper.',
      'Never skip on a bad day. That is when the streak matters.',
    ],
  },

  'Identity Journaling': {
    tagline: 'What did I do that matches who I want to be?',
    lead: 'Habits that attach to an identity persist longer than habits attached to an outcome — "I am someone who trains" survives a missed week better than "I want to lose weight". Weekly reflection is how that identity gets reinforced.',
    cadenceLabel: 'Weekly · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Identity beats outcome',
        description: 'Self-concept sustains habits through setbacks.',
      },
      {
        icon: 'sparkle',
        title: 'Evidence accumulates',
        description: 'You build a record of who you are becoming.',
      },
      {
        icon: 'leaf',
        title: 'Kinder framing',
        description: 'One missed week does not break an identity.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Vague',
        description: 'Naming the identity takes a couple of attempts.',
      },
      {
        when: 'Week 4',
        title: 'Concrete evidence',
        description: 'You start citing specific actions.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The identity starts making decisions for you.',
        peak: true,
      },
    ],
    howToStart: [
      'Name the identity first: "someone who…"',
      'Weekly, write down actions from the week that fit it.',
      'When you find none, pick one small action for next week.',
    ],
  },

  'Post-Behavior Celebration': {
    tagline: 'Celebrate the instant you finish.',
    lead: 'Emotion is what wires a habit in, and it has to arrive immediately — a reward tomorrow does nothing for a behaviour today. A two-second fist pump feels ridiculous and works anyway.',
    cadenceLabel: 'Every repetition · 2 sec',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Wires the habit',
        description: 'Immediate emotion is the encoding mechanism.',
      },
      {
        icon: 'target',
        title: 'No delay',
        description: 'Works where deferred rewards fail.',
      },
      {
        icon: 'leaf',
        title: 'Free and instant',
        description: 'Two seconds, no equipment, no cost.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Absurd',
        description: 'Everyone feels silly. Do it anyway.',
      },
      {
        when: 'Week 2',
        title: 'Genuinely reinforcing',
        description: 'The habit starts feeling good to complete.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'The celebration comes unprompted.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick your move: fist pump, "yes!", a genuine smile.',
      'Do it within a second of finishing, every single time.',
      'It has to actually feel good. If it does not, change the move.',
    ],
    sources: [
      {
        authors: 'Fogg BJ',
        title: 'Tiny Habits: The Small Changes That Change Everything',
        journal: 'Houghton Mifflin Harcourt',
        year: '2020',
      },
    ],
  },

  'Digital Detox Hour': {
    tagline: 'One screen-free hour before bed.',
    lead: 'Bedtime screen use delays sleep both by light exposure and by keeping you cognitively engaged. An hour is enough to matter, and it is easier to defend as a block than to police app by app.',
    evidence:
      'Exelmans & Van den Bulck (2016) found that mobile phone use after lights out was associated with longer sleep onset latency, shorter sleep duration and worse sleep quality.',
    cadenceLabel: 'Nightly · last 60 min',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Faster sleep onset',
        description: 'Less light and less stimulation before bed.',
      },
      {
        icon: 'wave',
        title: 'Calmer evenings',
        description: 'No last-minute email or news spike.',
      },
      {
        icon: 'sparkle',
        title: 'Time reappears',
        description: 'An hour a night is a lot of reclaimed time.',
      },
    ],
    timeline: [
      {
        when: 'Nights 1-3',
        title: 'Restless',
        description: 'Have a replacement ready or you will relapse.',
      },
      {
        when: 'Week 2',
        title: 'Sleep improves',
        description: 'Onset and quality both start shifting.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The phone goes away without a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Charge the phone in another room. Distance beats discipline.',
      'Decide the replacement first — book, shower, conversation.',
      'Start with 30 minutes if an hour is too much.',
    ],
    sources: [
      {
        authors: 'Exelmans L, Van den Bulck J',
        title:
          'Bedtime mobile phone use and sleep in adults',
        journal: 'Social Science & Medicine',
        year: '2016',
      },
    ],
  },

  'Dopamine Reset': {
    tagline: 'Periodic breaks from high-stimulation activities.',
    lead: 'The popular framing is overstated — you cannot "reset dopamine" in a day, and the term is not a clinical one. What the practice does do is reduce tolerance to constant novelty, so ordinary activities start feeling worthwhile again.',
    cadenceLabel: 'Weekly · a few hours',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Ordinary things regain appeal',
        description: 'Less constant novelty lowers the bar.',
      },
      {
        icon: 'wave',
        title: 'Less compulsive checking',
        description: 'The reach for stimulation weakens.',
      },
      {
        icon: 'leaf',
        title: 'You notice the habit',
        description: 'Removing it shows how automatic it was.',
      },
    ],
    timeline: [
      {
        when: 'Hour 1-2',
        title: 'Restless and bored',
        description: 'The discomfort is the informative part.',
      },
      {
        when: 'Week 3',
        title: 'Easier and useful',
        description: 'The breaks stop feeling like deprivation.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A regular, unremarkable part of the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a block — a morning, an evening — and name what is out.',
      'Have a low-stimulation alternative ready: walk, book, chores.',
      'Ignore the "dopamine fasting" mythology. The behaviour change is the real part.',
    ],
  },

  'Daily Laughter': {
    tagline: 'Find something genuinely funny.',
    lead: 'Laughter reduces circulating stress hormones and briefly improves mood and pain tolerance. The effect is modest and short-lived, which is exactly why doing it daily rather than occasionally is the sensible framing.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Lower stress hormones',
        description: 'A measurable, if short-lived, drop.',
      },
      {
        icon: 'wave',
        title: 'Immediate mood lift',
        description: 'One of the fastest available.',
      },
      {
        icon: 'sparkle',
        title: 'Better shared',
        description: 'Laughter is amplified by company.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Works immediately',
        description: 'No build-up required.',
      },
      {
        when: 'Week 2',
        title: 'You notice more of it',
        description: 'Looking for funny things means finding them.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A deliberate part of your day.',
        peak: true,
      },
    ],
    howToStart: [
      'Keep a list of things that reliably work on you.',
      'Five minutes. Stand-up, a friend, a specific show.',
      'With someone else if possible — it multiplies.',
    ],
    sources: [
      {
        authors: 'Bennett MP, Lengacher C',
        title: 'Humor and laughter may influence health',
        journal: 'Evidence-Based Complementary and Alternative Medicine',
        year: '2009',
      },
    ],
  },

  'Tension Release Shaking': {
    tagline: 'Shake it out for a few minutes.',
    lead: 'Shaking is what many animals do after a threat passes, and the practice borrows that idea to discharge held muscular tension. The clinical evidence base is thin; the immediate physical relief is easy to verify yourself.',
    cadenceLabel: 'Daily · 3-5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Physical discharge',
        description: 'Tension you were holding lets go.',
      },
      {
        icon: 'sparkle',
        title: 'Fast and physical',
        description: 'Works on the body rather than the thoughts.',
      },
      {
        icon: 'leaf',
        title: 'No technique needed',
        description: 'You already know how to shake.',
      },
    ],
    timeline: [
      {
        when: 'First try',
        title: 'Silly, then loose',
        description: 'The self-consciousness passes quickly.',
      },
      {
        when: 'Week 2',
        title: 'A reliable reset',
        description: 'Useful after stressful events specifically.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You shake out tension without thinking.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand, loose knees, and shake arms, legs and shoulders.',
      'Three to five minutes. Let the movement be untidy.',
      'Stop if anything hurts. Go gently with joint problems.',
    ],
  },

  'Self-Massage Ritual': {
    tagline: 'Five minutes on hands, feet or face.',
    lead: 'Massage is associated with reduced cortisol and increased serotonin and dopamine, and self-massage gets a meaningful share of that without an appointment. Hands and feet are dense in receptors, which is why they respond well.',
    evidence:
      'Field et al. (2005) reviewed massage therapy studies and reported decreases in cortisol alongside increases in serotonin and dopamine.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower cortisol',
        description: 'A consistent finding across massage studies.',
      },
      {
        icon: 'leaf',
        title: 'Parasympathetic shift',
        description: 'Touch moves you toward rest.',
      },
      {
        icon: 'target',
        title: 'No appointment',
        description: 'Available any time, at no cost.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediately pleasant',
        description: 'The relaxation effect is same-session.',
      },
      {
        when: 'Week 2',
        title: 'Tension spots identified',
        description: 'You learn where you actually hold it.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Part of the evening.',
        peak: true,
      },
    ],
    howToStart: [
      'Hands and feet first — highest return per minute.',
      'Firm but not painful, slow circles, five minutes.',
      'A little oil or lotion makes it considerably better.',
    ],
    sources: [
      {
        authors: 'Field T, Hernandez-Reif M, Diego M, Schanberg S, Kuhn C',
        title:
          'Cortisol decreases and serotonin and dopamine increase following massage therapy',
        journal: 'International Journal of Neuroscience',
        year: '2005',
      },
    ],
  },

  'Foot Grounding': {
    tagline: 'Bare feet on the ground, paying attention.',
    lead: 'This is an interoception exercise, not an electrical one — ignore the "earthing" claims about ground charge. Attending closely to physical sensation is a trainable skill that supports emotional regulation, and feet are a convenient place to practise it.',
    cadenceLabel: 'Daily · 2 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Interoceptive practice',
        description: 'Noticing internal signals is trainable.',
      },
      {
        icon: 'target',
        title: 'Fast grounding',
        description: 'Pulls attention out of thought and into body.',
      },
      {
        icon: 'leaf',
        title: 'Two minutes',
        description: 'Short enough to actually repeat.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Surprisingly detailed',
        description: 'There is more sensation there than you expect.',
      },
      {
        when: 'Week 3',
        title: 'Faster to arrive',
        description: 'You drop into the body more quickly.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A reflex when you notice you are spiralling.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand barefoot — grass, floorboards, tiles all work.',
      'Two minutes noticing pressure, temperature, texture.',
      'Outdoors is pleasanter but not required. Watch for sharp objects.',
    ],
    sources: [
      {
        authors: 'Farb N, et al.',
        title: 'Interoception, contemplative practice, and health',
        journal: 'Frontiers in Psychology',
        year: '2015',
      },
    ],
  },

  'Purpose Statement Review': {
    tagline: 'Re-read what you are for.',
    lead: 'Having a clear sense of purpose is associated with longer life and better health, independent of mood. A written statement you actually revisit is what keeps that sense concrete rather than vaguely assumed.',
    evidence:
      'Hill & Turiano (2014) followed over 6,000 adults for 14 years and found greater purpose in life predicted lower mortality risk across all adult age groups.',
    cadenceLabel: 'Weekly · 5 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Associated with longevity',
        description: 'Purpose predicts mortality independently.',
      },
      {
        icon: 'target',
        title: 'Clearer decisions',
        description: 'A reference point for trade-offs.',
      },
      {
        icon: 'wave',
        title: 'Resilience',
        description: 'Setbacks land differently against a purpose.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Hard to write',
        description: 'First drafts are usually borrowed language.',
      },
      {
        when: 'Week 6',
        title: 'It becomes yours',
        description: 'Revision is how it gets true.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A weekly checkpoint you rely on.',
        peak: true,
      },
    ],
    howToStart: [
      'Two or three sentences, in your own words. Nobody else reads it.',
      'Re-read weekly and ask whether the week matched it.',
      'Revise it when it stops being true.',
    ],
    sources: [
      {
        authors: 'Hill PL, Turiano NA',
        title: 'Purpose in life as a predictor of mortality across adulthood',
        journal: 'Psychological Science',
        year: '2014',
      },
    ],
  },

  'Future Self Visualization': {
    tagline: 'Spend time with the person you will become.',
    lead: 'People who feel connected to their future self make better long-term decisions — they save more and discount the future less. Vividly imagining that person is what closes the psychological distance.',
    evidence:
      'Hershfield et al. (2011) found that increasing vividness of and connection to the future self led participants to allocate more money to long-term saving.',
    cadenceLabel: 'Weekly · 10 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Better long-term choices',
        description: 'Future-self connection predicts saving behaviour.',
      },
      {
        icon: 'sparkle',
        title: 'Motivation with substance',
        description: 'A concrete destination rather than a vague wish.',
      },
      {
        icon: 'wave',
        title: 'Less impulsivity',
        description: 'The future stops being someone else’s problem.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Fuzzy',
        description: 'Specificity takes practice.',
      },
      {
        when: 'Week 4',
        title: 'Decisions shift',
        description: 'You start noticing choices that affect that person.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The future self is present in decisions.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a horizon — five or ten years — and imagine a specific ordinary day.',
      'Concrete details, not achievements: where, with whom, doing what.',
      'Then name one thing this week that person would thank you for.',
    ],
    sources: [
      {
        authors: 'Hershfield HE, et al.',
        title:
          'Increasing saving behavior through age-progressed renderings of the future self',
        journal: 'Journal of Marketing Research',
        year: '2011',
      },
    ],
  },

  'Letter to Future Self': {
    tagline: 'Write to yourself, one year out.',
    lead: 'A sealed letter does two things: it forces you to articulate where you currently are, and it gives your future self an honest record rather than a reconstructed memory. Most people badly misremember what they wanted a year ago.',
    cadenceLabel: 'Yearly · 20 min to write',
    benefitDetails: [
      {
        icon: 'target',
        title: 'An honest baseline',
        description: 'Memory rewrites; the letter does not.',
      },
      {
        icon: 'sparkle',
        title: 'Visible progress',
        description: 'Opening it is where the payoff lands.',
      },
      {
        icon: 'leaf',
        title: 'Clarifies now',
        description: 'Writing it makes the present legible.',
      },
    ],
    timeline: [
      {
        when: 'Writing it',
        title: 'Clarifying',
        description: 'Articulating the present is the first benefit.',
      },
      {
        when: 'Months later',
        title: 'Mostly forgotten',
        description: 'Which is what makes opening it worthwhile.',
      },
      {
        when: '1 year',
        title: 'The payoff',
        description: 'A genuine, unedited comparison point.',
        peak: true,
      },
    ],
    howToStart: [
      'Write about where you are now, not just what you want.',
      'Include fears and open questions — those are the interesting parts later.',
      'Schedule the opening date now so it actually happens.',
    ],
  },

  'Mortality Reflection': {
    tagline: 'Memento mori — briefly, deliberately.',
    lead: 'Reflecting on mortality in a considered way tends to shift values toward the intrinsic: relationships and meaning over status and acquisition. Done briefly it clarifies; dwelt on, it does the opposite, so keep it short.',
    cadenceLabel: 'Weekly · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Priorities clarify',
        description: 'Trivial concerns resize themselves.',
      },
      {
        icon: 'leaf',
        title: 'More gratitude',
        description: 'Finitude makes the ordinary noticeable.',
      },
      {
        icon: 'wave',
        title: 'Less status-chasing',
        description: 'Intrinsic values move up the list.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Uncomfortable',
        description: 'That discomfort is the point, briefly.',
      },
      {
        when: 'Week 4',
        title: 'Clarifying rather than grim',
        description: 'The tone shifts with familiarity.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A weekly recalibration.',
        peak: true,
      },
    ],
    howToStart: [
      'Five minutes, then stop. Brevity is what keeps it useful.',
      'Ask what you would regret not doing, then name one small step.',
      'If it triggers real distress or intrusive thoughts, skip it and talk to someone.',
    ],
    sources: [
      {
        authors: 'Cozzolino PJ, et al.',
        title: 'Greed, death, and values: from terror management to transcendence management theory',
        journal: 'Personality and Social Psychology Bulletin',
        year: '2004',
      },
    ],
  },

  'Legacy Action': {
    tagline: 'Do one thing whose impact outlasts you.',
    lead: 'Generativity — investing in things and people that continue after you — is associated with higher wellbeing in adulthood. It does not need to be grand: teaching someone, planting something, writing something down all qualify.',
    cadenceLabel: 'Weekly · one action',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Higher wellbeing',
        description: 'Generativity tracks with adult life satisfaction.',
      },
      {
        icon: 'target',
        title: 'Meaning, not achievement',
        description: 'A different axis from personal success.',
      },
      {
        icon: 'sparkle',
        title: 'Small counts',
        description: 'Teaching one person qualifies.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels grandiose',
        description: '"Legacy" is an intimidating word. Start small.',
      },
      {
        when: 'Week 4',
        title: 'Genuinely satisfying',
        description: 'The outward focus is the active part.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You look for these opportunities.',
        peak: true,
      },
    ],
    howToStart: [
      'One action a week. Teach, mentor, plant, write, give.',
      'It should benefit someone who cannot repay you.',
      'Small and real beats ambitious and hypothetical.',
    ],
    sources: [
      {
        authors: 'McAdams DP, de St. Aubin E',
        title:
          'A theory of generativity and its assessment through self-report, behavioral acts, and narrative themes in autobiography',
        journal: 'Journal of Personality and Social Psychology',
        year: '1992',
      },
    ],
  },
};
