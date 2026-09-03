/**
 * Science drill-down copy — Productivity, focus and workspace.
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const PRODUCTIVITY_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Deep Work Session': {
    suggestedWhy: 'One uninterrupted block spares you the climb back into context, so busy days turn into visible progress.',
    tagline: 'One protected block for the work that actually matters.',
    lead: 'Demanding work needs uninterrupted runway — every interruption costs you the climb back into context. Blocking a single distraction-free stretch is what converts a day of being busy into a day of visible progress.',
    cadenceLabel: 'Daily · 90 min · one protected block',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Real progress, daily',
        description: 'One block a day moves work nothing else does.',
      },
      {
        icon: 'wave',
        title: 'Less scattered',
        description: 'Sustained attention feels calmer than task-switching.',
      },
      {
        icon: 'sparkle',
        title: 'Better thinking',
        description: 'Hard problems need depth, and depth needs time.',
      },
    ],
    timeline: [
      {
        when: 'First session',
        title: 'Uncomfortable, then absorbing',
        description: 'The first 15 minutes are the hardest part.',
      },
      {
        when: 'Week 2',
        title: 'Settling in faster',
        description: 'You drop into focus with less resistance.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The block becomes the fixed point of your day.',
        peak: true,
      },
    ],
    howToStart: [
      'Decide the one task before you start — not during.',
      'Phone in another room. Notifications off, not just quiet.',
      'Start at 45 minutes and build up. A short real block beats a long broken one.',
    ],
    sources: [
      {
        authors: 'Newport C',
        title: 'Deep Work: Rules for Focused Success in a Distracted World',
        journal: 'Grand Central Publishing',
        year: '2016',
      },
    ],
  },

  'Single-Tasking': {
    suggestedWhy: 'Finishing one thing before starting the next removes switching residue, so work gets done with fewer errors.',
    tagline: 'One thing at a time, finished.',
    lead: 'What feels like multitasking is rapid switching, and each switch leaves residue — part of your attention stays on the previous task. The cost is invisible from the inside, which is why people who do it most rate themselves best at it.',
    evidence:
      'Ophir et al. (2009) found that people who multitasked most heavily with media performed worse on tests of filtering irrelevant information and task-switching than light multitaskers.',
    cadenceLabel: 'Daily · ongoing',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Things get finished',
        description: 'Sequential beats simultaneous for completion.',
      },
      {
        icon: 'wave',
        title: 'Less mental noise',
        description: 'No residue from three other open tasks.',
      },
      {
        icon: 'sparkle',
        title: 'Fewer errors',
        description: 'Switching is where mistakes get made.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Restless',
        description: 'The urge to check something else is strong.',
      },
      {
        when: 'Week 2',
        title: 'Longer stretches',
        description: 'Sustained attention rebuilds with practice.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Switching starts to feel unpleasant.',
        peak: true,
      },
    ],
    howToStart: [
      'One window, one tab group, one task.',
      'Keep a scratch list for intrusions instead of acting on them.',
      'Close the task before opening the next.',
    ],
    sources: [
      {
        authors: 'Ophir E, Nass C, Wagner AD',
        title: 'Cognitive control in media multitaskers',
        journal: 'PNAS',
        year: '2009',
      },
    ],
  },

  'If-Then Planning': {
    suggestedWhy: 'Deciding the exact cue in advance lets the moment trigger the action, so follow-through stops needing willpower.',
    tagline: 'Decide in advance exactly when and where.',
    lead: 'Vague intentions fail at the moment of action. An if-then plan pre-loads the decision — "if it is 9am, then I start X" — so the cue triggers the behaviour without requiring you to deliberate. This is one of the most reliably replicated effects in behaviour change.',
    evidence:
      'Gollwitzer & Sheeran (2006) meta-analysed 94 studies and found implementation intentions had a medium-to-large effect on goal attainment over goal intentions alone.',
    cadenceLabel: 'Daily · 2 min · one plan',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Much higher follow-through',
        description: 'One of the best-evidenced planning techniques.',
      },
      {
        icon: 'wave',
        title: 'No willpower needed',
        description: 'The cue does the deciding.',
      },
      {
        icon: 'sparkle',
        title: 'Takes two minutes',
        description: 'One sentence is the whole intervention.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Works immediately',
        description: 'The effect does not need a build-up.',
      },
      {
        when: 'Week 2',
        title: 'Sharper plans',
        description: 'You get better at picking cues that actually fire.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You plan in if-then by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Format: "If [specific time/place/event], then I will [specific action]."',
      'Be concrete. "If I finish lunch" beats "in the afternoon".',
      'One plan a day. Write it down the night before.',
    ],
    sources: [
      {
        authors: 'Gollwitzer PM, Sheeran P',
        title:
          'Implementation intentions and goal achievement: a meta-analysis of effects and processes',
        journal: 'Advances in Experimental Social Psychology',
        year: '2006',
      },
    ],
  },

  'Daily Top 3 Priorities': {
    suggestedWhy: 'Writing down three specific things stops unfinished goals intruding, so the day is quieter and finishable.',
    tagline: 'Write down three things, not thirteen.',
    lead: 'Unfinished goals keep intruding on attention until they are either done or planned. Writing a specific plan releases that grip — the point is not the list itself but that your mind stops rehearsing it.',
    evidence:
      'Masicampo & Baumeister (2011) found that making a specific plan for an unfulfilled goal eliminated the intrusive thoughts and performance costs that the unfinished goal otherwise caused.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Quieter mind',
        description: 'Planned goals stop intruding.',
      },
      {
        icon: 'target',
        title: 'Forced prioritisation',
        description: 'Three slots make you choose.',
      },
      {
        icon: 'sparkle',
        title: 'A finishable day',
        description: 'You can actually complete three things.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Clarifying',
        description: 'Choosing three exposes what you were avoiding.',
      },
      {
        when: 'Week 2',
        title: 'More realistic',
        description: 'You get better at sizing a day.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The day starts with the three.',
        peak: true,
      },
    ],
    howToStart: [
      'Exactly three. A fourth means one is not a priority.',
      'Write them the night before or first thing.',
      'Make each concrete enough to know when it is finished.',
    ],
    sources: [
      {
        authors: 'Masicampo EJ, Baumeister RF',
        title:
          'Consider it done! Plan making can eliminate the cognitive effects of unfulfilled goals',
        journal: 'Journal of Personality and Social Psychology',
        year: '2011',
      },
    ],
  },

  'Batch Check Messages': {
    suggestedWhy: 'Checking messages in a few windows cuts the switching cost, so stress drops and focus blocks stay intact.',
    tagline: 'Two or three inbox windows a day, not constant checking.',
    lead: 'Constant checking keeps you in a low-grade state of readiness that never resolves. Batching does not reduce the volume of email — it reduces the number of times per day you pay the switching cost.',
    evidence:
      'Kushlev & Dunn (2015) ran a field experiment limiting email checking to three times daily and found participants reported significantly lower daily stress than when checking freely.',
    cadenceLabel: 'Daily · 2-3 windows',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Lower stress',
        description: 'Measured directly in a randomised field study.',
      },
      {
        icon: 'target',
        title: 'Protects deep work',
        description: 'No interruptions inside a focus block.',
      },
      {
        icon: 'sparkle',
        title: 'Faster processing',
        description: 'Batching is more efficient per message.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Anxious',
        description: 'Fear of missing something is the main obstacle.',
      },
      {
        when: 'Week 2',
        title: 'Nothing broke',
        description: 'Almost nothing needed a faster reply.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Constant checking feels absurd.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick your windows — e.g. 11am, 3pm, 5pm — and close the tab between.',
      'Turn off all mail and message notifications. That is the actual change.',
      'Tell colleagues your response pattern so expectations match.',
    ],
    sources: [
      {
        authors: 'Kushlev K, Dunn EW',
        title:
          'Checking email less frequently reduces stress',
        journal: 'Computers in Human Behavior',
        year: '2015',
      },
    ],
  },

  'Pomodoro Technique': {
    suggestedWhy: 'Short timed sprints make starting cheap and give breaks a place, so more real work actually gets finished.',
    tagline: 'Twenty-five minutes on, five off.',
    lead: 'The value is less about the specific numbers than about making starting cheap: twenty-five minutes is short enough that you cannot really justify avoiding it. The timer also gives you permission to ignore everything else while it runs.',
    cadenceLabel: 'Daily · 25/5 intervals',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Starting gets easy',
        description: 'A short commitment defeats procrastination.',
      },
      {
        icon: 'wave',
        title: 'Built-in recovery',
        description: 'Breaks are scheduled, not stolen.',
      },
      {
        icon: 'sparkle',
        title: 'Visible output',
        description: 'Completed intervals are a real progress measure.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Interrupted mid-flow',
        description: 'The break can feel like it comes too soon.',
      },
      {
        when: 'Week 2',
        title: 'A natural rhythm',
        description: 'You start sensing the interval without the timer.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Work happens in intervals by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Timer for 25 minutes, one task, no tabs.',
      'Five-minute break away from the screen — stand up, look out a window.',
      'A longer break after four intervals. Adjust the numbers to suit you.',
    ],
    sources: [
      {
        authors: 'Cirillo F',
        title: 'The Pomodoro Technique',
        journal: 'FC Garage',
        year: '2006',
      },
    ],
  },

  'Time Blocking': {
    suggestedWhy: 'Giving each hour a job turns intentions into appointments, so the time gets defended and capacity stays honest.',
    tagline: 'Give every hour a job in advance.',
    lead: 'An open calendar defaults to whatever arrives. Assigning blocks converts intentions into appointments, which both protects the time and forces you to confront how much of it you actually have.',
    cadenceLabel: 'Daily · 5-10 min planning',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Time gets defended',
        description: 'Blocked time is harder to give away.',
      },
      {
        icon: 'wave',
        title: 'Honest capacity',
        description: 'You see what will not fit.',
      },
      {
        icon: 'sparkle',
        title: 'No deciding mid-day',
        description: 'The what-next question is pre-answered.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Wildly optimistic',
        description: 'Everyone underestimates how long things take.',
      },
      {
        when: 'Week 3',
        title: 'Realistic estimates',
        description: 'Your blocks start matching reality.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The day is planned before it starts.',
        peak: true,
      },
    ],
    howToStart: [
      'Block tomorrow at the end of today, in about five minutes.',
      'Leave deliberate white space — plans that assume perfection fail.',
      'Re-block when the day derails. That is using it, not failing at it.',
    ],
  },

  'Work Breaks': {
    suggestedWhy: 'Short breaks that genuinely detach let attention recover, so the afternoon holds up instead of collapsing.',
    tagline: 'Five minutes off, every hour.',
    lead: 'Attention is a depleting resource across a working day, and breaks are how it recovers. Breaks that actually detach — away from the screen, not scrolling on it — restore more than breaks that merely change task.',
    evidence:
      'Trougakos et al. (2014) found that breaks involving genuine respite predicted lower end-of-day fatigue, while breaks spent on work-related or effortful activity did not.',
    cadenceLabel: 'Hourly · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less end-of-day fatigue',
        description: 'Real respite is what recovers attention.',
      },
      {
        icon: 'target',
        title: 'Sustained focus',
        description: 'Afternoon quality holds up better.',
      },
      {
        icon: 'leaf',
        title: 'Bodies too',
        description: 'Standing hourly breaks up prolonged sitting.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels unproductive',
        description: 'Stopping when it is going well is counter-intuitive.',
      },
      {
        when: 'Week 2',
        title: 'Better afternoons',
        description: 'The 3pm collapse gets shallower.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You stand up on the hour without prompting.',
        peak: true,
      },
    ],
    howToStart: [
      'Set an hourly reminder and actually leave the desk.',
      'No phone. Scrolling is not a break from a screen.',
      'Look out a window, walk, or get water. Five minutes.',
    ],
    sources: [
      {
        authors: 'Trougakos JP, et al.',
        title:
          'Lunch breaks unpacked: the role of autonomy as a moderator of recovery during lunch',
        journal: 'Academy of Management Journal',
        year: '2014',
      },
    ],
  },

  'Social Media Limit': {
    suggestedWhy: 'Capping daily scrolling cuts volume and comparison, so loneliness eases and hours come back to your week.',
    tagline: 'Half an hour a day, deliberately.',
    lead: 'The harm is less about the content than the volume and the comparison. Capping time — rather than trying to use it more wisely — is the intervention that has actually been tested, and it moved loneliness and mood.',
    evidence:
      'Hunt et al. (2018) randomised students to limit social media to 30 minutes daily for three weeks and found significant reductions in loneliness and depressive symptoms versus unrestricted use.',
    cadenceLabel: 'Daily · 30 min cap',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Less loneliness',
        description: 'Measured directly in a randomised trial.',
      },
      {
        icon: 'wave',
        title: 'Better mood',
        description: 'Depressive symptoms fell in the limited group.',
      },
      {
        icon: 'target',
        title: 'Time back',
        description: 'Usually hours a week, not minutes.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Reaching for it constantly',
        description: 'The habit is more automatic than intentional.',
      },
      {
        when: 'Week 2',
        title: 'Less pull',
        description: 'The compulsion genuinely weakens.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You open it deliberately or not at all.',
        peak: true,
      },
    ],
    howToStart: [
      'Use the OS screen-time limit — do not rely on self-monitoring.',
      'Remove the apps from your home screen so opening takes a search.',
      'Decide what the reclaimed time is for before you reclaim it.',
    ],
    sources: [
      {
        authors: 'Hunt MG, et al.',
        title:
          'No more FOMO: limiting social media decreases loneliness and depression',
        journal: 'Journal of Social and Clinical Psychology',
        year: '2018',
      },
    ],
  },

  'Grayscale Phone Mode': {
    suggestedWhy: 'Stripping colour removes the salience your apps rely on, so you reach for the phone far less by reflex.',
    tagline: 'Take the colour out of your phone.',
    lead: 'App icons and notification badges are engineered to exploit colour-based salience. Removing colour strips out a layer of that pull without removing any function — the phone still works, it just stops advertising.',
    cadenceLabel: 'Always on · one-time setup',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Less compulsive opening',
        description: 'Colour cues stop triggering the reach.',
      },
      {
        icon: 'wave',
        title: 'Duller feeds',
        description: 'Image-heavy apps lose most of their pull.',
      },
      {
        icon: 'sparkle',
        title: 'One switch',
        description: 'Set once in accessibility settings.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Jarring',
        description: 'Your phone suddenly looks broken. Good.',
      },
      {
        when: 'Week 1',
        title: 'Less picking it up',
        description: 'The idle reach drops noticeably.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Colour looks garish when you switch back.',
        peak: true,
      },
    ],
    howToStart: [
      'iOS: Accessibility → Display & Text Size → Colour Filters → Greyscale.',
      'Android: Developer options or Digital Wellbeing → Bedtime mode.',
      'Bind it to the accessibility shortcut so you can flip it for photos.',
    ],
    sources: [
      {
        authors: 'Alter A',
        title:
          'Irresistible: The Rise of Addictive Technology and the Business of Keeping Us Hooked',
        journal: 'Penguin Press',
        year: '2017',
      },
    ],
  },

  'Temptation Bundling': {
    suggestedWhy: 'Pairing a reward with the thing you avoid moves the pull to where you need it, so starting stops being a fight.',
    tagline: 'Only let yourself have the good thing during the hard thing.',
    lead: 'Pairing something you want with something you avoid makes the avoided thing carry the reward. The constraint is what makes it work — if the podcast is available any time, the gym stops being the price of admission.',
    evidence:
      'Milkman et al. (2014) gave gym-goers access to audiobooks only at the gym and found a significant increase in attendance versus unrestricted access.',
    cadenceLabel: 'Ongoing · one bundle',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Makes the hard thing attractive',
        description: 'The reward moves to where you need it.',
      },
      {
        icon: 'sparkle',
        title: 'No self-denial',
        description: 'You still get the thing you wanted.',
      },
      {
        icon: 'wave',
        title: 'Trial-tested',
        description: 'Measured on real gym attendance.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Works surprisingly well',
        description: 'Anticipation starts doing the pulling.',
      },
      {
        when: 'Week 3',
        title: 'The pairing sticks',
        description: 'One starts cueing the other.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The habit carries its own reward.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick one thing you love and one you avoid.',
      'Make the loved thing exclusive to that context. Exclusivity is the mechanism.',
      'If you break the rule a few times, the bundle stops working. Reset it.',
    ],
    sources: [
      {
        authors: 'Milkman KL, Minson JA, Volpp KGM',
        title:
          'Holding the Hunger Games hostage at the gym: an evaluation of temptation bundling',
        journal: 'Management Science',
        year: '2014',
      },
    ],
  },

  'Weekly Review': {
    suggestedWhy: 'A fixed weekly checkpoint catches drift early and counts the wins, so the next week starts already decided.',
    tagline: 'Twenty minutes to close the week and open the next.',
    lead: 'Without a review, weeks blur and the same things slip repeatedly. A fixed checkpoint turns scattered activity into something you can actually steer — and it is the point where planning intentions get set for the week ahead.',
    cadenceLabel: 'Weekly · 15-20 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Course correction',
        description: 'Drift gets caught within a week, not a quarter.',
      },
      {
        icon: 'sparkle',
        title: 'Wins get counted',
        description: 'Progress is invisible unless you look.',
      },
      {
        icon: 'wave',
        title: 'A clean start',
        description: 'Monday begins already decided.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels like overhead',
        description: 'The value is not obvious the first time.',
      },
      {
        when: 'Week 4',
        title: 'Patterns emerge',
        description: 'You see what keeps slipping and why.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The week does not end without it.',
        peak: true,
      },
    ],
    howToStart: [
      'Same slot every week — Friday afternoon or Sunday evening.',
      'Three questions: what worked, what slipped, what matters next week.',
      'Twenty minutes maximum. It is a checkpoint, not a project.',
    ],
    sources: [
      {
        authors: 'Gollwitzer PM',
        title: 'Implementation intentions: strong effects of simple plans',
        journal: 'American Psychologist',
        year: '1999',
      },
    ],
  },

  'Quarterly Quest Setting': {
    suggestedWhy: 'A ninety-day horizon stays vivid enough to feel urgent, so goals get finished instead of drifting for a year.',
    tagline: 'Ninety-day goals instead of annual resolutions.',
    lead: 'A year is long enough that nothing feels urgent until it is too late. Ninety days is short enough to stay vivid and long enough for real work — and the shorter feedback loop is what keeps persistence up.',
    cadenceLabel: 'Quarterly · 30 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Urgency without panic',
        description: 'Close enough to matter, long enough to deliver.',
      },
      {
        icon: 'wave',
        title: 'Four chances a year',
        description: 'A bad quarter is not a lost year.',
      },
      {
        icon: 'sparkle',
        title: 'Higher completion',
        description: 'Shorter horizons get finished more often.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Ambitious',
        description: 'First quarters are usually overloaded.',
      },
      {
        when: 'Quarter 2',
        title: 'Right-sized',
        description: 'You learn what ninety days actually holds.',
      },
      {
        when: '~90 days',
        title: 'Automatic',
        description: 'The quarterly rhythm sets itself.',
        peak: true,
      },
    ],
    howToStart: [
      'Two or three quests per quarter. Not eight.',
      'Make each one measurable enough to score at the end.',
      'Book the review date now, at the start.',
    ],
    sources: [
      {
        authors: 'Locke EA, Latham GP',
        title:
          'Building a practically useful theory of goal setting and task motivation',
        journal: 'American Psychologist',
        year: '2002',
      },
    ],
  },

  'Ultradian Work Cycles': {
    suggestedWhy: 'Matching effort to natural alertness and resting between waves tends to give more output for less grind.',
    tagline: 'Work in 90-minute waves, then rest properly.',
    lead: 'Alertness rises and falls in cycles through the day rather than holding steady. Working with that rhythm — a sustained push followed by a genuine break — tends to beat grinding through the trough and getting less for more effort.',
    cadenceLabel: 'Daily · 90 min on, 20 min off',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Works with the rhythm',
        description: 'Effort matched to natural alertness.',
      },
      {
        icon: 'wave',
        title: 'Real recovery',
        description: 'Long enough breaks to actually restore.',
      },
      {
        icon: 'sparkle',
        title: 'Sustainable output',
        description: 'Two or three good cycles beats eight mediocre hours.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'The break feels wrong',
        description: 'Twenty minutes off is hard to permit yourself.',
      },
      {
        when: 'Week 2',
        title: 'You feel the dip coming',
        description: 'The cycle becomes perceptible.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The day organises into waves.',
        peak: true,
      },
    ],
    howToStart: [
      '90 minutes of one task, then 20 minutes genuinely away.',
      'Two or three cycles is a full, productive day.',
      'Adjust the length to your own rhythm — 90 is an average, not a law.',
    ],
  },

  'Inbox Zero': {
    suggestedWhy: 'Deciding once per message instead of re-reading it closes the loop, so the inbox stops running in the background.',
    tagline: 'Empty the inbox once a day.',
    lead: 'An inbox is a list of other people’s requests in arrival order — a poor to-do list. Processing to empty is not about speed of reply; it is about deciding once per message so nothing sits there being re-read.',
    cadenceLabel: 'Daily · one pass',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less background load',
        description: 'Unprocessed mail is a standing open loop.',
      },
      {
        icon: 'target',
        title: 'Decide once',
        description: 'No re-reading the same message five times.',
      },
      {
        icon: 'sparkle',
        title: 'Nothing lost',
        description: 'Everything is either done, filed, or scheduled.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'A long first pass',
        description: 'Archive the backlog in bulk and start fresh.',
      },
      {
        when: 'Week 2',
        title: 'Fast daily passes',
        description: 'Maintenance is far cheaper than the first clear-out.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Empty is the resting state.',
        peak: true,
      },
    ],
    howToStart: [
      'Declare the backlog bankrupt: archive everything older than a month.',
      'Each message gets one decision: do, delegate, defer, delete.',
      'Do it once a day, not continuously.',
    ],
  },

  'Two-Minute Tidy': {
    suggestedWhy: 'Two minutes on one surface removes clutter that quietly competes for attention, so rooms hold their shape.',
    tagline: 'Two minutes on one small surface.',
    lead: 'Visual clutter competes for attention whether or not you are looking at it. A two-minute reset on one surface is small enough to actually do daily, which is what makes it accumulate.',
    evidence:
      'Saxbe & Repetti (2010) found that people who described their homes as cluttered showed flatter, less healthy daily cortisol patterns than those who described them as restorative.',
    cadenceLabel: 'Daily · 2 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less visual noise',
        description: 'Clutter competes for attention.',
      },
      {
        icon: 'target',
        title: 'Impossible to skip',
        description: 'Two minutes defeats every excuse.',
      },
      {
        icon: 'leaf',
        title: 'Compounds',
        description: 'Daily beats an occasional deep clean.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'One clear surface',
        description: 'Small, and immediately visible.',
      },
      {
        when: 'Week 2',
        title: 'Rooms hold their shape',
        description: 'Mess stops accumulating faster than you clear it.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You tidy as you pass.',
        peak: true,
      },
    ],
    howToStart: [
      'Set a timer for two minutes and pick one surface.',
      'Stop when the timer goes. Do not escalate into a deep clean.',
      'Same surface each day until it stays clear, then move on.',
    ],
    sources: [
      {
        authors: 'Saxbe DE, Repetti R',
        title:
          'No place like home: home tours correlate with daily patterns of mood and cortisol',
        journal: 'Personality and Social Psychology Bulletin',
        year: '2010',
      },
    ],
  },

  'Daily Declutter': {
    suggestedWhy: 'Removing one item a day is small enough to keep doing, so space gets calmer without a demoralising project.',
    tagline: 'Remove one item a day.',
    lead: 'Decluttering fails when it is a weekend project — the scale is demoralising and the result reverts. One item a day is slow enough to be sustainable and fast enough to be visible within a month.',
    cadenceLabel: 'Daily · one item',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Steady progress',
        description: 'Thirty items a month, without a project.',
      },
      {
        icon: 'wave',
        title: 'Calmer spaces',
        description: 'Less to look at and less to manage.',
      },
      {
        icon: 'target',
        title: 'Decision practice',
        description: 'You get faster at letting things go.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Easy wins',
        description: 'The obvious rubbish goes first.',
      },
      {
        when: 'Week 4',
        title: 'Harder choices',
        description: 'Now it needs actual decisions.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You notice what does not belong.',
        peak: true,
      },
    ],
    howToStart: [
      'One item. Bin, donate, or sell — but out of the house.',
      'Keep a donation box by the door so the exit route exists.',
      'Do not upgrade to a whole-room purge. The pace is the point.',
    ],
  },

  'Weekly Desk Cleanup': {
    suggestedWhy: 'Clearing the desk removes objects that bid for your attention, so focus is easier and starting costs less.',
    tagline: 'Reset the workspace once a week.',
    lead: 'Attention is drawn by salient objects whether or not they are relevant — a cluttered desk is a set of competing bids. Clearing it weekly resets the visual field your focus has to work against.',
    cadenceLabel: 'Weekly · 5-10 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Fewer distractions',
        description: 'Less in your visual field to bid for attention.',
      },
      {
        icon: 'wave',
        title: 'Easier starts',
        description: 'A clear desk lowers the cost of beginning.',
      },
      {
        icon: 'sparkle',
        title: 'A weekly reset',
        description: 'Marks a boundary between weeks.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Immediately better',
        description: 'The effect on focus is same-day.',
      },
      {
        when: 'Week 3',
        title: 'Less to clear',
        description: 'The desk starts staying tidier between resets.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of closing the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Friday afternoon, before you finish.',
      'Everything off the surface, then only what you use back on.',
      'Include the digital desktop — same principle applies.',
    ],
    sources: [
      {
        authors: 'McMains S, Kastner S',
        title:
          'Interactions of top-down and bottom-up mechanisms in human visual cortex',
        journal: 'Journal of Neuroscience',
        year: '2011',
      },
    ],
  },

  'Digital File Organization': {
    suggestedWhy: 'Consistent folders and names make files findable months later, so every future search costs you less time.',
    tagline: 'Fifteen minutes on folders and naming.',
    lead: 'Search only works if you remember what you called things. A shallow, consistent folder structure plus predictable names is what makes files findable months later — and the time saved compounds every time you look for something.',
    cadenceLabel: 'Weekly · 15 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Faster retrieval',
        description: 'Less time hunting for things you already have.',
      },
      {
        icon: 'wave',
        title: 'Less low-grade stress',
        description: 'Not being able to find things is its own tax.',
      },
      {
        icon: 'sparkle',
        title: 'Compounds',
        description: 'Every future search gets cheaper.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Chaotic',
        description: 'The first pass is the worst one.',
      },
      {
        when: 'Week 4',
        title: 'Structure holds',
        description: 'New files land in the right place by default.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Filing happens as you save.',
        peak: true,
      },
    ],
    howToStart: [
      'Shallow beats deep — two levels of folders is usually enough.',
      'Date-prefix names (2026-07-24-thing) sort themselves.',
      'Fifteen minutes weekly, most recent files first.',
    ],
    sources: [
      {
        authors: 'Jones W',
        title:
          'Keeping Found Things Found: The Study and Practice of Personal Information Management',
        journal: 'Morgan Kaufmann',
        year: '2007',
      },
    ],
  },

  'Energy Level Tracking': {
    suggestedWhy: 'A few ratings a day reveal where your real peaks are, so demanding work lands when you can actually do it.',
    tagline: 'Note your energy a few times a day.',
    lead: 'Most people schedule by availability rather than capability, and then wonder why hard work goes badly at 3pm. A week of simple ratings shows you where your real peaks are so you can put demanding work inside them.',
    cadenceLabel: 'Daily · 3 ratings',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Find your peaks',
        description: 'Schedule hard work where capacity actually is.',
      },
      {
        icon: 'wave',
        title: 'Spot the drains',
        description: 'Patterns in what flattens you become visible.',
      },
      {
        icon: 'sparkle',
        title: 'Cheap data',
        description: 'Three numbers a day.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Just collecting',
        description: 'One week is the minimum useful sample.',
      },
      {
        when: 'Week 3',
        title: 'Clear pattern',
        description: 'Your peaks and troughs stop being guesswork.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You plan around your own rhythm.',
        peak: true,
      },
    ],
    howToStart: [
      'Rate 1-10 at three fixed times: mid-morning, after lunch, late afternoon.',
      'Note what you had been doing. The context is the useful part.',
      'After two weeks, move your hardest task into your best window.',
    ],
    sources: [
      {
        authors: 'Kühnel J, Zacher H, de Bloom J, Bledow R',
        title:
          'Take a break! Benefits of sleep and short breaks for daily work engagement',
        journal: 'European Journal of Work and Organizational Psychology',
        year: '2017',
      },
    ],
  },

  'Work Insights Journal': {
    suggestedWhy: 'Writing one lesson a day forces the reflection that turns experience into skill, so you stop re-learning things.',
    tagline: 'One lesson written down each day.',
    lead: 'Experience alone does not produce expertise — reflected-on experience does. Writing one concrete lesson forces the reflection step that otherwise gets skipped, and it accumulates into a record you can actually reread.',
    evidence:
      'Di Stefano et al. (2016) found that workers who spent 15 minutes reflecting in writing at the end of the day performed significantly better than those who spent the same time on additional practice.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Faster skill growth',
        description: 'Reflection beats extra practice in trials.',
      },
      {
        icon: 'sparkle',
        title: 'A personal knowledge base',
        description: 'Lessons stop being re-learned.',
      },
      {
        icon: 'wave',
        title: 'Clean end to the day',
        description: 'A defined stopping point.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Thin entries',
        description: 'Finding a real lesson daily takes practice.',
      },
      {
        when: 'Week 4',
        title: 'Patterns appear',
        description: 'Rereading is where the value shows up.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The entry closes the working day.',
        peak: true,
      },
    ],
    howToStart: [
      'One specific lesson, not a summary of the day.',
      'Five minutes at the end of work.',
      'Reread the last month once a month — that is where it pays off.',
    ],
    sources: [
      {
        authors: 'Di Stefano G, Gino F, Pisano G, Staats B',
        title:
          'Making experience count: the role of reflection in individual learning',
        journal: 'Harvard Business School Working Paper',
        year: '2016',
      },
    ],
  },

  'Phone-Free Meals': {
    suggestedWhy: 'Taking phones off the table restores undivided attention, so meals and the people at them are more enjoyable.',
    tagline: 'Phones off the table.',
    lead: 'Even a phone present but unused reduces how much people enjoy time with others. Meals are the easiest place to enforce a boundary because they are bounded, recurring, and usually social.',
    evidence:
      'Dwyer et al. (2018) found that diners with phones on the table reported less enjoyment of the meal and more distraction than those without.',
    cadenceLabel: 'Every meal',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'More enjoyment',
        description: 'Measured directly against phone-present meals.',
      },
      {
        icon: 'target',
        title: 'Better conversation',
        description: 'Attention is undivided.',
      },
      {
        icon: 'wave',
        title: 'You notice the food',
        description: 'Slower eating and more satiety cues.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Reaching for nothing',
        description: 'The reflex is startlingly strong.',
      },
      {
        when: 'Week 2',
        title: 'Longer meals',
        description: 'They stretch out and get better.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A phone on the table looks wrong.',
        peak: true,
      },
    ],
    howToStart: [
      'Phones face-down in another room, not just face-down on the table.',
      'Agree it with whoever you eat with so it is a shared rule.',
      'Start with dinner and extend from there.',
    ],
    sources: [
      {
        authors: 'Dwyer RJ, Kushlev K, Dunn EW',
        title:
          'Smartphone use undermines enjoyment of face-to-face social interactions',
        journal: 'Journal of Experimental Social Psychology',
        year: '2018',
      },
    ],
  },

  'House Plant Care': {
    suggestedWhy: 'Tending something alive gives a small completable task and a greener room, so the space may feel a little better.',
    tagline: 'Two minutes tending something alive.',
    lead: 'Indoor plants are associated with modest improvements in mood and perceived air quality, and the care routine itself provides a small, reliably completable task. Neither effect is large; together they are worth two minutes.',
    cadenceLabel: 'Daily · 2-5 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A pleasant space',
        description: 'Greenery measurably shifts how a room feels.',
      },
      {
        icon: 'target',
        title: 'A completable task',
        description: 'Small, finite, and visibly done.',
      },
      {
        icon: 'wave',
        title: 'A moment away',
        description: 'A short break with something physical.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Easy to forget',
        description: 'Attach it to an existing routine.',
      },
      {
        when: 'Week 4',
        title: 'Visible growth',
        description: 'The feedback loop starts closing.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You notice a drooping leaf in passing.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with one hard-to-kill plant. Pothos or snake plant.',
      'Check rather than water daily — overwatering kills more plants than neglect.',
      'Put it where you already stand each morning.',
    ],
    sources: [
      {
        authors: 'Lohr VI, Pearson-Mims CH, Goodwin GK',
        title:
          'Interior plants may improve worker productivity and reduce stress in a windowless environment',
        journal: 'Journal of Environmental Horticulture',
        year: '1996',
      },
    ],
  },

  'Career Documentation': {
    suggestedWhy: 'Recording wins while they are fresh keeps the detail accurate, so opportunities never wait on a panic rewrite.',
    tagline: 'Keep the record current before you need it.',
    lead: 'Achievements are vivid the week they happen and vague six months later. Updating as you go means the evidence exists when an opportunity appears — and it removes the panic rewrite that otherwise gates applying.',
    cadenceLabel: 'Weekly · 30 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Ready when it matters',
        description: 'Opportunities do not wait for a rewrite.',
      },
      {
        icon: 'sparkle',
        title: 'Accurate detail',
        description: 'Specifics captured while still fresh.',
      },
      {
        icon: 'wave',
        title: 'You see your progress',
        description: 'Growth is invisible without a record.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'A long catch-up',
        description: 'The backlog is the hard part.',
      },
      {
        when: 'Week 4',
        title: 'Quick top-ups',
        description: 'Maintenance takes minutes.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The record stays current on its own.',
        peak: true,
      },
    ],
    howToStart: [
      'Keep a running "wins" file — raw notes, not polished prose.',
      'Record numbers and outcomes, not responsibilities.',
      'Thirty minutes weekly. Polish only when applying.',
    ],
    sources: [
      {
        authors: 'Seibert SE, Crant JM, Kraimer ML',
        title: 'Proactive personality and career success',
        journal: 'Journal of Applied Psychology',
        year: '1999',
      },
    ],
  },

  'Professional Networking': {
    suggestedWhy: 'A short weekly message keeps weak ties alive, so the bridges that carry most opportunities stay open.',
    tagline: 'One message a week to someone you barely know.',
    lead: 'Opportunities travel disproportionately through weak ties — people outside your immediate circle, who know different things and different people. Maintaining those links costs one short message a week.',
    evidence:
      'Granovetter (1973) showed that job information more often reached people through weak ties than close friends, because weak ties bridge otherwise separate social clusters.',
    cadenceLabel: 'Weekly · one message',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Weak ties carry opportunity',
        description: 'They bridge networks your close circle does not.',
      },
      {
        icon: 'sparkle',
        title: 'Compounds quietly',
        description: 'Fifty contacts a year from five minutes a week.',
      },
      {
        icon: 'wave',
        title: 'Low stakes',
        description: 'One message is not a networking event.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Awkward',
        description: 'Reaching out cold always is.',
      },
      {
        when: 'Week 6',
        title: 'Replies and threads',
        description: 'Some turn into real conversations.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'A standing weekly habit.',
        peak: true,
      },
    ],
    howToStart: [
      'Be specific about why you are writing to them in particular.',
      'Ask nothing the first time. Offer something if you can.',
      'One message a week. Keep a short list so you never have to think of who.',
    ],
    sources: [
      {
        authors: 'Granovetter MS',
        title: 'The strength of weak ties',
        journal: 'American Journal of Sociology',
        year: '1973',
      },
    ],
  },

  'Public Speaking Practice': {
    suggestedWhy: 'Repeated low-stakes exposure is what shrinks speaking anxiety, so speaking up stops requiring a decision.',
    tagline: 'Ten minutes talking out loud, daily.',
    lead: 'Speaking anxiety maintains itself through avoidance — every skipped opportunity confirms the threat. Graded, repeated exposure is the mechanism that reduces it, and recording yourself is the lowest-stakes rung on that ladder.',
    evidence:
      'Hofmann et al. (2008) reviewed exposure-based treatments for social and speaking anxiety and found consistent, durable reductions in anxiety across trials.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Exposure works',
        description: 'The best-supported route out of avoidance.',
      },
      {
        icon: 'sparkle',
        title: 'Visible improvement',
        description: 'Recordings show progress you cannot feel.',
      },
      {
        icon: 'wave',
        title: 'Clearer thinking aloud',
        description: 'Speaking is a separate skill from knowing.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Excruciating',
        description: 'Watching yourself back is the hard part.',
      },
      {
        when: 'Week 4',
        title: 'Noticeably smoother',
        description: 'Fillers drop and pacing improves.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Speaking up stops requiring a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Record two minutes on your phone about anything. Watch it back once.',
      'Build up: mirror, then recording, then one person, then a group.',
      'If anxiety is severe or disabling, work with a therapist — exposure is best done supported.',
    ],
    sources: [
      {
        authors: 'Hofmann SG, Smits JAJ',
        title:
          'Cognitive-behavioral therapy for adult anxiety disorders: a meta-analysis of randomized placebo-controlled trials',
        journal: 'Journal of Clinical Psychiatry',
        year: '2008',
      },
    ],
  },

  'Fresh Air Ventilation': {
    suggestedWhy: 'Airing the room clears built-up CO2, so the afternoon fog lifts and thinking stays noticeably sharper.',
    tagline: 'Air the room out daily.',
    lead: 'CO2 builds quickly in an occupied closed room and cognitive performance falls as it climbs. Ten minutes of proper cross-ventilation resets it — the cheapest focus intervention available.',
    evidence:
      'Allen et al. (2016) found cognitive test scores were substantially higher under well-ventilated, low-CO2 conditions than in conventional office air.',
    cadenceLabel: 'Daily · 10-15 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Sharper thinking',
        description: 'Cognitive scores track with ventilation.',
      },
      {
        icon: 'wave',
        title: 'Less fog',
        description: 'Stuffy air causes more of it than people realise.',
      },
      {
        icon: 'leaf',
        title: 'Free',
        description: 'A window and ten minutes.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediately noticeable',
        description: 'Especially in a small closed room.',
      },
      {
        when: 'Week 2',
        title: 'You detect stale air',
        description: 'You catch it before the fog arrives.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Airing out is part of the routine.',
        peak: true,
      },
    ],
    howToStart: [
      'Wide open for 10 minutes beats slightly open for an hour.',
      'Two openings on different walls clears air far faster than one.',
      'Do it morning and mid-afternoon.',
    ],
    sources: [
      {
        authors: 'Allen JG, et al.',
        title:
          'Associations of cognitive function scores with carbon dioxide, ventilation, and volatile organic compound exposures in office workers',
        journal: 'Environmental Health Perspectives',
        year: '2016',
      },
    ],
  },
};
