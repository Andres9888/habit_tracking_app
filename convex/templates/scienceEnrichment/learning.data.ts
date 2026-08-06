/**
 * Science drill-down copy — Learning, memory, cognition.
 *
 * This category has unusually good evidence behind it — spacing, retrieval
 * practice and interleaving are among the most replicated findings in
 * cognitive psychology. Where a claim is weaker (brain training, learning
 * styles, specific retention percentages), the copy says so rather than
 * repeating the number.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const LEARNING_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Active Recall': {
    tagline: 'Close the book and try to remember.',
    lead: 'Retrieving information strengthens memory far more than reviewing it does — the effort of pulling something out is what consolidates it. Rereading feels productive and mostly is not, which is why most people study inefficiently for years.',
    evidence:
      'Roediger & Karpicke (2006) found that students who practised retrieval retained substantially more after a week than those who spent the same time repeatedly rereading.',
    cadenceLabel: 'Daily · 15 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Far better retention',
        description: 'One of the largest effects in learning research.',
      },
      {
        icon: 'wave',
        title: 'Exposes what you missed',
        description: 'Rereading hides gaps; recall reveals them.',
      },
      {
        icon: 'sparkle',
        title: 'Same time, more learning',
        description: 'A pure efficiency gain.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Uncomfortable',
        description: 'Failing to recall feels like failing. It is not.',
      },
      {
        when: 'Week 3',
        title: 'Recall gets easier',
        description: 'And retention noticeably improves.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You test rather than reread by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Close the book and recall one fact.',
      'Write down what you remember before checking.',
      'The struggle is the mechanism. Do not peek early.',
    ],
    sources: [
      {
        authors: 'Roediger HL, Karpicke JD',
        title:
          'Test-enhanced learning: taking memory tests improves long-term retention',
        journal: 'Psychological Science',
        year: '2006',
      },
    ],
  },

  'Spaced Repetition': {
    tagline: 'Review at widening intervals.',
    lead: 'Reviewing just as you are about to forget produces far more durable memory than massing the same reviews together. It is the single most efficient learning technique available, and it has been replicated for over a century.',
    evidence:
      'Cepeda et al. (2006) reviewed 254 studies and found distributed practice reliably outperformed massed practice for verbal recall, with benefits increasing at longer retention intervals.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Durable memory',
        description: 'Built for months, not for Friday.',
      },
      {
        icon: 'sparkle',
        title: 'Less total time',
        description: 'Fewer reviews for better retention.',
      },
      {
        icon: 'wave',
        title: 'Software handles it',
        description: 'The scheduling is solved.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels slow',
        description: 'The payoff is deliberately deferred.',
      },
      {
        when: 'Month 2',
        title: 'Retention is obvious',
        description: 'You remember things you would have lost.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The daily queue becomes routine.',
        peak: true,
      },
    ],
    howToStart: [
      'Review one flashcard.',
      'Use software that schedules for you — Anki or similar.',
      'Make cards atomic: one fact each. Big cards fail.',
    ],
    sources: [
      {
        authors: 'Cepeda NJ, Pashler H, Vul E, Wixted JT, Rohrer D',
        title:
          'Distributed practice in verbal recall tasks: a review and quantitative synthesis',
        journal: 'Psychological Bulletin',
        year: '2006',
      },
    ],
  },

  'Same-Day Review': {
    tagline: 'Revisit today’s material today.',
    lead: 'Forgetting is steepest immediately after learning, so a single review inside the first day catches material before most of it has gone. The specific retention percentages people quote are folklore, but the shape of the curve is real and old.',
    cadenceLabel: 'Daily · within 24 hours',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Catches the steep drop',
        description: 'Forgetting is fastest right after learning.',
      },
      {
        icon: 'sparkle',
        title: 'Cheap',
        description: 'A few minutes, while it is still fresh.',
      },
      {
        icon: 'wave',
        title: 'Sets up spacing',
        description: 'The first review of a longer schedule.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Quick',
        description: 'Same-day review takes very little time.',
      },
      {
        when: 'Week 2',
        title: 'Retention improves',
        description: 'Less relearning from scratch.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Reviewing closes each learning session.',
        peak: true,
      },
    ],
    howToStart: [
      'Re-read one paragraph from today — then close it and recall the rest.',
      'Recall beats rereading, even here.',
      'Five minutes in the evening is enough.',
    ],
    sources: [
      {
        authors: 'Ebbinghaus H',
        title: 'Memory: A Contribution to Experimental Psychology',
        journal: 'Teachers College, Columbia University',
        year: '1885',
      },
    ],
  },

  'Interleaved Practice': {
    tagline: 'Mix the topics instead of blocking them.',
    lead: 'Practising one thing until it clicks feels better and works worse. Mixing related material forces you to identify which approach applies — which is the skill you actually need, and the reason interleaving beats blocking on later tests.',
    evidence:
      'Rohrer (2012) found that interleaving different problem types improved students’ ability to distinguish between concepts and led to better performance on delayed tests than blocked practice.',
    cadenceLabel: 'Every session · mix topics',
    benefitDetails: [
      {
        icon: 'target',
        title: 'You learn to discriminate',
        description: 'Knowing which method applies is the real skill.',
      },
      {
        icon: 'wave',
        title: 'Better delayed performance',
        description: 'Worse in practice, better on the test.',
      },
      {
        icon: 'leaf',
        title: 'Same material',
        description: 'Only the order changes.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Feels worse',
        description: 'Performance drops during practice. Expected.',
      },
      {
        when: 'Week 4',
        title: 'Transfer improves',
        description: 'You handle unfamiliar problems better.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You mix by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Alternate between two or three related topics in one session.',
      'Do not finish one before starting another. That is the point.',
      'Accept feeling less competent while practising — it is the trade.',
    ],
    sources: [
      {
        authors: 'Rohrer D',
        title:
          'Interleaving helps students distinguish among similar concepts',
        journal: 'Educational Psychology Review',
        year: '2012',
      },
    ],
  },

  'Feynman Technique': {
    tagline: 'Explain it simply and find the gaps.',
    lead: 'Explaining something in plain language forces you to generate the connections rather than recognise them — and the exact point where your explanation stumbles is the exact point you did not understand. That diagnostic is the whole value.',
    evidence:
      'Chi et al. (1989) found that students who generated self-explanations while studying learned significantly more than those who did not, and that explanation quality predicted understanding.',
    cadenceLabel: 'Daily · after learning',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Finds your gaps',
        description: 'Where you stumble is what you missed.',
      },
      {
        icon: 'sparkle',
        title: 'Forces real understanding',
        description: 'Jargon can hide confusion; plain words cannot.',
      },
      {
        icon: 'wave',
        title: 'Needs no audience',
        description: 'Out loud to yourself works.',
      },
    ],
    timeline: [
      {
        when: 'Attempt 1',
        title: 'Humbling',
        description: 'Most people stall almost immediately.',
      },
      {
        when: 'Week 3',
        title: 'Explanations tighten',
        description: 'And understanding tightens with them.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You explain to check yourself.',
        peak: true,
      },
    ],
    howToStart: [
      'Explain one idea out loud to yourself.',
      'No jargon. If you need the technical term, you may not have it.',
      'When you stall, go back to the source at exactly that point.',
    ],
    sources: [
      {
        authors: 'Chi MTH, Bassok M, Lewis MW, Reimann P, Glaser R',
        title:
          'Self-explanations: how students study and use examples in learning to solve problems',
        journal: 'Cognitive Science',
        year: '1989',
      },
    ],
  },

  'Weekly Teaching': {
    tagline: 'Teach someone what you learned.',
    lead: 'Preparing to teach changes how you encode material — you organise it for someone else, which forces structure you would otherwise skip. Treat the specific retention percentages floating around online with suspicion; the effect is real, the numbers are invented.',
    cadenceLabel: 'Weekly · one explanation',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Encoding changes',
        description: 'Teaching-prep organises knowledge differently.',
      },
      {
        icon: 'sparkle',
        title: 'Gaps surface fast',
        description: 'Questions find what you skipped.',
      },
      {
        icon: 'leaf',
        title: 'Useful to someone else',
        description: 'Two people gain from one review.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Harder than expected',
        description: 'Explaining exposes shaky foundations.',
      },
      {
        when: 'Week 4',
        title: 'Clearer thinking',
        description: 'You start learning with teaching in mind.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A weekly explanation becomes normal.',
        peak: true,
      },
    ],
    howToStart: [
      'Explain one idea to someone in one sentence.',
      'A colleague, a partner, or a written post all count.',
      'Invite questions. That is where the value is.',
    ],
    sources: [
      {
        authors: 'Chi MTH, Bassok M, Lewis MW, Reimann P, Glaser R',
        title: 'Self-explanations: how students study and use examples',
        journal: 'Cognitive Science',
        year: '1989',
      },
    ],
  },

  'Pre-Sleep Review': {
    tagline: 'Read it over just before bed.',
    lead: 'Sleep consolidates what you learned that day, and material reviewed shortly before sleeping appears to benefit from that process. Keep it light — this is a gentle review, not a study session that costs you sleep.',
    cadenceLabel: 'Nightly · 5-10 min',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Sleep does the work',
        description: 'Consolidation happens overnight regardless.',
      },
      {
        icon: 'target',
        title: 'Well-timed review',
        description: 'Last-in, first consolidated.',
      },
      {
        icon: 'wave',
        title: 'Calm activity',
        description: 'Gentler than screens before bed.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Easy',
        description: 'Light review, no effort required.',
      },
      {
        when: 'Week 3',
        title: 'Better morning recall',
        description: 'Material is more available the next day.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of the wind-down.',
        peak: true,
      },
    ],
    howToStart: [
      'Re-read one paragraph from today.',
      'Keep it brief and low-effort. Do not start real studying.',
      'Paper rather than a screen, given the hour.',
    ],
  },

  'Daily Reading': {
    tagline: 'Thirty minutes with a book.',
    lead: 'Extended reading builds vocabulary and background knowledge in a way no other activity matches, largely because it is the only place most people meet complex sentences and unfamiliar words in context. Volume matters more than difficulty.',
    cadenceLabel: 'Daily · 30 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Vocabulary and knowledge',
        description: 'Words learned in context, not from lists.',
      },
      {
        icon: 'target',
        title: 'Sustained attention',
        description: 'One of the few activities that trains it.',
      },
      {
        icon: 'wave',
        title: 'Calmer than screens',
        description: 'Reading is a different kind of tired.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Attention wanders',
        description: 'If you read mostly online, this is expected.',
      },
      {
        when: 'Week 4',
        title: 'Longer stretches',
        description: 'Reading stamina rebuilds quickly.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A protected reading slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Read one page.',
      'Keep the book visible — a book on the pillow is the strongest cue.',
      'Abandon books you are not enjoying. Volume beats duty.',
    ],
    sources: [
      {
        authors: 'Krashen S',
        title: 'The Power of Reading',
        journal: 'Libraries Unlimited',
        year: '2004',
      },
    ],
  },

  'Handwritten Notes': {
    tagline: 'Take notes by hand.',
    lead: 'Writing by hand is slower than typing, which forces you to summarise rather than transcribe — and that summarising is where the understanding happens. The mechanism is processing, not the pen.',
    evidence:
      'Mueller & Oppenheimer (2014) found students taking longhand notes performed better on conceptual questions than laptop note-takers, who tended to transcribe verbatim.',
    cadenceLabel: 'While learning',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Forces summarising',
        description: 'Too slow to transcribe, so you process.',
      },
      {
        icon: 'sparkle',
        title: 'Better on concepts',
        description: 'Measured directly against typing.',
      },
      {
        icon: 'wave',
        title: 'No notifications',
        description: 'Paper does not interrupt you.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Frustratingly slow',
        description: 'That slowness is doing the work.',
      },
      {
        when: 'Week 3',
        title: 'Better summaries',
        description: 'You get faster at capturing the point.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Notebook out by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Write one sentence by hand.',
      'Summarise in your own words — never transcribe.',
      'Leave margin space for later questions and links.',
    ],
    sources: [
      {
        authors: 'Mueller PA, Oppenheimer DM',
        title:
          'The pen is mightier than the keyboard: advantages of longhand over laptop note taking',
        journal: 'Psychological Science',
        year: '2014',
      },
    ],
  },

  'Deliberate Skill Practice': {
    tagline: 'Work at the edge of what you can do.',
    lead: 'Ordinary repetition plateaus quickly. Deliberate practice is specifically effortful — targeting what you cannot yet do, with immediate feedback, at a level that is uncomfortable. That discomfort is the difference between practising and improving.',
    evidence:
      'Ericsson, Krampe & Tesch-Römer (1993) found that expert performance was associated with accumulated deliberate practice — effortful activity specifically designed to improve current performance.',
    cadenceLabel: 'Daily · 30-60 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Breaks plateaus',
        description: 'Comfortable repetition does not.',
      },
      {
        icon: 'sparkle',
        title: 'Fast improvement',
        description: 'Per hour, nothing else compares.',
      },
      {
        icon: 'wave',
        title: 'Feedback loop',
        description: 'Knowing immediately is half the method.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Tiring',
        description: 'Real deliberate practice is mentally exhausting.',
      },
      {
        when: 'Week 4',
        title: 'Visible progress',
        description: 'On the specific things you targeted.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A protected practice block.',
        peak: true,
      },
    ],
    howToStart: [
      'Practice one rep at the edge of your skill.',
      'Pick the specific weakness, not the whole skill.',
      'Arrange feedback — recording, a coach, or a checkable answer.',
    ],
    sources: [
      {
        authors: 'Ericsson KA, Krampe RT, Tesch-Römer C',
        title:
          'The role of deliberate practice in the acquisition of expert performance',
        journal: 'Psychological Review',
        year: '1993',
      },
    ],
  },

  'Novel Learning Session': {
    tagline: 'Learn something genuinely new.',
    lead: 'Learning an unfamiliar skill demands more of the brain than getting better at a familiar one — new representations rather than refined ones. Novelty is the active ingredient, which means the subject matters less than its unfamiliarity.',
    cadenceLabel: 'Daily · 15-30 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Novelty is the stimulus',
        description: 'New skills demand more than familiar ones.',
      },
      {
        icon: 'target',
        title: 'Cognitive flexibility',
        description: 'Beginner discomfort is a trainable state.',
      },
      {
        icon: 'leaf',
        title: 'Subject is irrelevant',
        description: 'Pick whatever you would enjoy.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Incompetent',
        description: 'Being bad at things is the whole exercise.',
      },
      {
        when: 'Week 6',
        title: 'Basic competence',
        description: 'Fast early progress is very motivating.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A learning slot in the day.',
        peak: true,
      },
    ],
    howToStart: [
      'Look up one fact about something new.',
      'Pick something you would do for fun, not for a CV.',
      'Fifteen minutes daily beats a weekend intensive.',
    ],
  },

  'Daily Language Practice': {
    tagline: 'One new word a day.',
    lead: 'Vocabulary is the rate-limiting factor in language learning, and it accumulates rather than arriving. A word a day is unglamorous and adds up to a few hundred a year — which is a meaningful fraction of conversational fluency.',
    cadenceLabel: 'Daily · one word',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Vocabulary is the bottleneck',
        description: 'Grammar matters less than words known.',
      },
      {
        icon: 'sparkle',
        title: 'Compounds',
        description: 'Hundreds a year from one a day.',
      },
      {
        icon: 'leaf',
        title: 'Too small to skip',
        description: 'Survives busy weeks intact.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels trivial',
        description: 'One word looks like nothing. It is not.',
      },
      {
        when: 'Month 3',
        title: 'Words start appearing',
        description: 'You recognise them in the wild.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A daily word, unremarkable.',
        peak: true,
      },
    ],
    howToStart: [
      'Look up one new word.',
      'Learn it in a sentence — isolated words do not stick.',
      'Put it in a spaced-repetition deck so it survives.',
    ],
    sources: [
      {
        authors: 'Nation ISP',
        title: 'Learning Vocabulary in Another Language',
        journal: 'Cambridge University Press',
        year: '2001',
      },
    ],
  },

  'Language Word Learning': {
    tagline: 'Three words a day in another language.',
    lead: 'Bilingualism is associated with a later onset of dementia symptoms — the leading interpretation being cognitive reserve, where managing two languages builds capacity that masks decline for years. You do not need fluency to be building it.',
    evidence:
      'Bialystok et al. (2007) found that lifelong bilinguals showed symptoms of dementia several years later on average than comparable monolinguals.',
    cadenceLabel: 'Daily · 3 words',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Cognitive reserve',
        description: 'Associated with delayed dementia symptoms.',
      },
      {
        icon: 'target',
        title: 'Effortful in a useful way',
        description: 'Switching between languages is real work.',
      },
      {
        icon: 'sparkle',
        title: 'Compounds fast',
        description: 'Three a day is over a thousand a year.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Slow going',
        description: 'Early vocabulary has nothing to attach to.',
      },
      {
        when: 'Month 3',
        title: 'Comprehension starts',
        description: 'You catch words in speech and text.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A daily language slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Look up one new word.',
      'Three words, in sentences, reviewed with spacing.',
      'Pick a language you have a reason to use. Motivation decides this one.',
    ],
    sources: [
      {
        authors: 'Bialystok E, Craik FIM, Freedman M',
        title: 'Bilingualism as a protection against the onset of symptoms of dementia',
        journal: 'Neuropsychologia',
        year: '2007',
      },
    ],
  },

  'Music Practice': {
    tagline: 'Twenty minutes on an instrument.',
    lead: 'Musical training produces some of the clearest structural and functional brain changes documented in adults, because it demands motor control, listening, memory and timing simultaneously. Few activities load that many systems at once.',
    evidence:
      'Herholz & Zatorre (2012) reviewed evidence that musical training induces measurable structural and functional plasticity in the brain.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Documented plasticity',
        description: 'Among the clearest examples in adults.',
      },
      {
        icon: 'target',
        title: 'Many systems at once',
        description: 'Motor, auditory, memory, timing.',
      },
      {
        icon: 'wave',
        title: 'Intrinsically rewarding',
        description: 'Which is why it survives as a habit.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Clumsy',
        description: 'Fingers lag intention. Normal.',
      },
      {
        when: 'Month 2',
        title: 'Real pieces',
        description: 'Daily practice compounds quickly here.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'The instrument gets picked up unprompted.',
        peak: true,
      },
    ],
    howToStart: [
      'Play one scale.',
      'Keep the instrument out and visible. Cases kill practice.',
      'Twenty minutes daily beats two hours on Sunday.',
    ],
    sources: [
      {
        authors: 'Herholz SC, Zatorre RJ',
        title:
          'Musical training as a framework for brain plasticity: behavior, function, and structure',
        journal: 'Neuron',
        year: '2012',
      },
    ],
  },

  'Daily Logic Puzzle': {
    tagline: 'One puzzle a day.',
    lead: 'Frequent participation in cognitively demanding leisure activities is associated with lower dementia risk in large cohorts. Note the honest limit: this is association, and puzzles mainly make you better at puzzles — the general transfer claims are weak.',
    evidence:
      'Verghese et al. (2003) followed older adults and found frequent participation in cognitively stimulating leisure activities was associated with a lower risk of dementia.',
    cadenceLabel: 'Daily · 10-25 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Associated with lower risk',
        description: 'Observed across large cohorts.',
      },
      {
        icon: 'target',
        title: 'Genuine engagement',
        description: 'Cognitively demanding, not passive.',
      },
      {
        icon: 'sparkle',
        title: 'Enjoyable',
        description: 'Which is what makes it sustainable.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Fun or frustrating',
        description: 'Pick a difficulty that is neither trivial nor hopeless.',
      },
      {
        when: 'Week 4',
        title: 'Better at that puzzle',
        description: 'Honest about the scope of the gain.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A daily puzzle with coffee.',
        peak: true,
      },
    ],
    howToStart: [
      'Solve one easy puzzle.',
      'Vary the type — sudoku, chess, crosswords, cryptics.',
      'Pick the difficulty that makes you think but not quit.',
    ],
    sources: [
      {
        authors: 'Verghese J, et al.',
        title: 'Leisure activities and the risk of dementia in the elderly',
        journal: 'New England Journal of Medicine',
        year: '2003',
      },
    ],
  },

  'Memory Challenges': {
    tagline: 'Memorise something on purpose.',
    lead: 'Deliberate memorisation has largely disappeared from modern life because we outsource it — and the capacity is trainable in a way most people never discover. A poem a month is a small, satisfying way to find out.',
    cadenceLabel: 'Monthly · one piece',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Trainable capacity',
        description: 'Memory improves with deliberate use.',
      },
      {
        icon: 'sparkle',
        title: 'You own it',
        description: 'A memorised poem is yours permanently.',
      },
      {
        icon: 'wave',
        title: 'Focused attention',
        description: 'Memorising demands full engagement.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Harder than expected',
        description: 'The skill has gone unused for years.',
      },
      {
        when: 'Month 2',
        title: 'Noticeably faster',
        description: 'Memorisation improves with practice.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A monthly piece becomes routine.',
        peak: true,
      },
    ],
    howToStart: [
      'Memorise one phone number digit by digit.',
      'Then a short poem — a few lines a day, reviewed cumulatively.',
      'Say it out loud. Sound anchors memory better than reading.',
    ],
    sources: [
      {
        authors: 'Nyberg L, et al.',
        title: 'Neural correlates of training-related memory improvement',
        journal: 'PNAS',
        year: '2003',
      },
    ],
  },

  'Navigation Novelty': {
    tagline: 'Take a different route.',
    lead: 'Spatial navigation engages the hippocampus, and the well-known study of London taxi drivers found structural differences associated with years of navigating. Following turn-by-turn directions outsources exactly that work.',
    evidence:
      'Maguire et al. (2000) found that London taxi drivers had greater posterior hippocampal grey matter volume than controls, correlating with years of navigation experience.',
    cadenceLabel: 'Weekly · one new route',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Engages the hippocampus',
        description: 'Navigation is the activity that loads it.',
      },
      {
        icon: 'target',
        title: 'Beats GPS-following',
        description: 'Directions do the work for you.',
      },
      {
        icon: 'leaf',
        title: 'You see new things',
        description: 'A genuine side benefit.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Mildly disorienting',
        description: 'Which is the point.',
      },
      {
        when: 'Month 2',
        title: 'Better mental map',
        description: 'Your area starts connecting up.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You vary routes instinctively.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one new turn on your walk.',
      'Try navigating without the phone, then check if you were right.',
      'Look at a map first and build the route in your head.',
    ],
    sources: [
      {
        authors: 'Maguire EA, et al.',
        title:
          'Navigation-related structural change in the hippocampi of taxi drivers',
        journal: 'PNAS',
        year: '2000',
      },
    ],
  },

  'Documentary Learning': {
    tagline: 'Watch something about a topic you know nothing about.',
    lead: 'Curiosity itself improves memory — when you are in a curious state, you retain incidental information better, not just the thing you were curious about. Unfamiliar topics are the cheapest way to induce it.',
    evidence:
      'Gruber et al. (2014) found that states of curiosity enhanced hippocampal activity and improved memory for both the material of interest and incidental information encountered while curious.',
    cadenceLabel: 'Weekly · one documentary',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Curiosity aids memory',
        description: 'Including for incidental material.',
      },
      {
        icon: 'target',
        title: 'Unfamiliar is better',
        description: 'Novel topics induce the state.',
      },
      {
        icon: 'leaf',
        title: 'Low effort',
        description: 'Watching is an easy way in.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Enjoyable',
        description: 'This is one of the easier habits to keep.',
      },
      {
        when: 'Month 2',
        title: 'Connections form',
        description: 'Unrelated topics start linking up.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A weekly slot for something new.',
        peak: true,
      },
    ],
    howToStart: [
      'Watch a 60-second clip of something new.',
      'Deliberately choose a topic you know nothing about.',
      'Tell someone one thing you learned — that makes it stick.',
    ],
    sources: [
      {
        authors: 'Gruber MJ, Gelman BD, Ranganath C',
        title:
          'States of curiosity modulate hippocampus-dependent learning via the dopaminergic circuit',
        journal: 'Neuron',
        year: '2014',
      },
    ],
  },

  'Audio Learning': {
    tagline: 'Learn during time you cannot read.',
    lead: 'Commutes, chores and walks are hours that cannot be spent reading, and audio converts them. Two honest caveats: retention from listening is lower than from active study, and "learning styles" as a theory has not held up — this is about reclaiming time, not matching a style.',
    cadenceLabel: 'Daily · during commute or chores',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Reclaims dead time',
        description: 'Hours that could not be read in.',
      },
      {
        icon: 'sparkle',
        title: 'Wide exposure',
        description: 'Good for breadth rather than depth.',
      },
      {
        icon: 'leaf',
        title: 'No extra time needed',
        description: 'Uses time already committed.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy',
        description: 'Lowest-friction learning habit here.',
      },
      {
        when: 'Week 3',
        title: 'You notice retention limits',
        description: 'Take notes on anything worth keeping.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Part of the commute.',
        peak: true,
      },
    ],
    howToStart: [
      'Listen to a podcast for 60 seconds.',
      'Note anything worth keeping — listening alone retains poorly.',
      'Skip the unstructured-walk slot if you also do that habit.',
    ],
  },

  'Educational Videos': {
    tagline: 'One short explainer a day.',
    lead: 'Video handles things text struggles with — processes, spatial relationships, anything that moves. It works best when it complements words rather than replacing them, which is the core finding of the multimedia learning literature.',
    cadenceLabel: 'Daily · one video',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Good for the visual stuff',
        description: 'Processes and spatial relationships.',
      },
      {
        icon: 'target',
        title: 'Concentrated',
        description: 'A good explainer beats a chapter.',
      },
      {
        icon: 'leaf',
        title: 'Low friction',
        description: 'Easy to start on a tired evening.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy and enjoyable',
        description: 'Almost no activation energy.',
      },
      {
        when: 'Week 3',
        title: 'Passive watching creeps in',
        description: 'Pause and recall to counter it.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A daily explainer.',
        peak: true,
      },
    ],
    howToStart: [
      'Watch a 60-second educational clip.',
      'Pause and explain it back to yourself before moving on.',
      'One deliberate video, not an autoplay chain.',
    ],
    sources: [
      {
        authors: 'Mayer RE',
        title: 'Multimedia Learning',
        journal: 'Cambridge University Press',
        year: '2009',
      },
    ],
  },

  'Study Groups': {
    tagline: 'Learn with other people.',
    lead: 'Cooperative learning outperforms solo study in a large body of educational research, partly through explanation and partly through accountability. The second mechanism is often the bigger one — you turn up because someone expects you.',
    cadenceLabel: 'Weekly · one session',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Explaining consolidates',
        description: 'Teaching each other is the mechanism.',
      },
      {
        icon: 'leaf',
        title: 'Accountability',
        description: 'You show up because others do.',
      },
      {
        icon: 'wave',
        title: 'Gaps get exposed',
        description: 'Other people ask what you skipped.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Socially awkward',
        description: 'And often unproductive at first.',
      },
      {
        when: 'Week 4',
        title: 'Finds its rhythm',
        description: 'Structure is what makes groups work.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A standing weekly session.',
        peak: true,
      },
    ],
    howToStart: [
      'Send one "want to study?" message.',
      'Two or three people beats a large group.',
      'Agree the material in advance or it becomes a chat.',
    ],
    sources: [
      {
        authors: 'Slavin RE',
        title: 'Research on cooperative learning and achievement',
        journal: 'Contemporary Educational Psychology',
        year: '1996',
      },
    ],
  },

  'Dual N-Back Training': {
    tagline: 'A working-memory training task.',
    lead: 'Be sceptical here. The original study reported transfer from n-back training to fluid intelligence, but replication attempts have largely failed and the consensus now is that brain training mostly makes you better at the trained task. Included because you may want it; framed honestly because the claim did not hold.',
    cadenceLabel: 'Daily · 20 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'You improve at n-back',
        description: 'That much is not in dispute.',
      },
      {
        icon: 'wave',
        title: 'Sustained concentration',
        description: 'The task demands genuine focus.',
      },
      {
        icon: 'leaf',
        title: 'Transfer is doubtful',
        description: 'Broader gains have not replicated well.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Very hard',
        description: 'The task is genuinely demanding.',
      },
      {
        when: 'Week 4',
        title: 'Much better at it',
        description: 'Task-specific improvement is real.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A daily session if you enjoy it.',
        peak: true,
      },
    ],
    howToStart: [
      'Do one round of N-back.',
      'Start at 2-back and progress only when consistently accurate.',
      'If you want general cognitive benefit, exercise and sleep have far better evidence.',
    ],
    sources: [
      {
        authors: 'Jaeggi SM, Buschkuehl M, Jonides J, Perrig WJ',
        title: 'Improving fluid intelligence with training on working memory',
        journal: 'PNAS',
        year: '2008',
      },
    ],
  },

  'Non-Dominant Hand Training': {
    tagline: 'Use your other hand for routine tasks.',
    lead: 'Using the non-dominant hand recruits motor pathways that ordinarily sit idle, and motor learning does show cross-education effects between limbs. Keep expectations modest — this is a small, pleasant novelty exercise, not a cognitive intervention.',
    cadenceLabel: 'Daily · routine tasks',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Underused pathways',
        description: 'Motor control you rarely ask for.',
      },
      {
        icon: 'target',
        title: 'Forces attention',
        description: 'Impossible to do on autopilot.',
      },
      {
        icon: 'leaf',
        title: 'Free',
        description: 'Tasks you were doing anyway.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Comically bad',
        description: 'Expect mess. That is the exercise.',
      },
      {
        when: 'Week 3',
        title: 'Noticeably better',
        description: 'Motor learning is fast at this level.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You switch hands without thinking.',
        peak: true,
      },
    ],
    howToStart: [
      'Brush your teeth with the other hand tomorrow.',
      'Add low-stakes tasks — stirring, using a mouse.',
      'Not with knives, hot pans, or anything you would rather not drop.',
    ],
  },
};
