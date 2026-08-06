/**
 * Science drill-down copy — habit design, subtraction, environment, and the
 * remaining longevity/cognition templates.
 *
 * IMPORTANT: many templates in this group ship with blogs, coaching sites or
 * app marketing as their `scientificReference` (Ahead App, Neuroscience
 * School, R1SE Wellness, Psychology Today, and similar). Those are not
 * citations. Where the real underlying literature is known it is cited
 * instead; otherwise `evidence` and `sources` are omitted so the
 * Science-backed badge stays hidden.
 *
 * `Power Posture Practice` is deliberately framed around the replication
 * failure rather than the original claim.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const BEHAVIOR_DESIGN_ENRICHMENT: Record<string, ScienceEnrichment> = {
  '66-Day Habit Commitment': {
    tagline: 'Give it about two months, not three weeks.',
    lead: 'The "21 days" figure is folklore with no evidence behind it. When automaticity was actually measured, the median was around 66 days with enormous variation between people and behaviours — which means quitting at week three is quitting before the experiment finished.',
    evidence:
      'Lally et al. (2010) tracked people forming new habits and found automaticity plateaued after a median of 66 days, ranging from 18 to over 250 depending on the behaviour and person.',
    cadenceLabel: 'Daily · commit 66 days',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Realistic horizon',
        description: '21 days is a myth; 66 is the measured median.',
      },
      {
        icon: 'leaf',
        title: 'Survives the dip',
        description: 'Most quitting happens in weeks 2 to 4.',
      },
      {
        icon: 'sparkle',
        title: 'Variation is normal',
        description: 'Some habits take far longer. That is expected.',
      },
    ],
    timeline: [
      {
        when: 'Week 3',
        title: 'The myth deadline',
        description: 'Nothing is automatic yet. Keep going anyway.',
      },
      {
        when: 'Week 6',
        title: 'Easier',
        description: 'Effort required starts dropping noticeably.',
      },
      {
        when: '~66 days',
        title: 'Automatic',
        description: 'The measured median for automaticity.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick one habit and commit to 66 days before judging it.',
      'Track only whether you did it — not how well.',
      'A missed day does not reset anything. Missing repeatedly does.',
    ],
    sources: [
      {
        authors: 'Lally P, van Jaarsveld CHM, Potts HWW, Wardle J',
        title: 'How are habits formed: modelling habit formation in the real world',
        journal: 'European Journal of Social Psychology',
        year: '2010',
      },
    ],
  },

  'Habit Anchoring Practice': {
    tagline: 'Bolt the new habit onto an existing one.',
    lead: 'New behaviours need a trigger, and the most reliable trigger is something you already do without fail. Anchoring borrows the existing routine’s consistency instead of asking you to remember something new.',
    cadenceLabel: 'Daily · after an existing routine',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Cue already exists',
        description: 'No new reminder to build.',
      },
      {
        icon: 'sparkle',
        title: 'Nothing to remember',
        description: 'The anchor does the remembering.',
      },
      {
        icon: 'wave',
        title: 'Stacks up',
        description: 'Routines can carry several small habits.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Needs a note',
        description: 'The link is not there yet.',
      },
      {
        when: 'Week 3',
        title: 'The anchor pulls it',
        description: 'One triggers the other.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'They become one behaviour.',
        peak: true,
      },
    ],
    howToStart: [
      'Format: "after I [existing habit], I will [new habit]."',
      'Pick an anchor you genuinely never skip — coffee, teeth, keys.',
      'One new habit per anchor. Do not stack five onto breakfast.',
    ],
    sources: [
      {
        authors: 'Lally P, van Jaarsveld CHM, Potts HWW, Wardle J',
        title: 'How are habits formed: modelling habit formation in the real world',
        journal: 'European Journal of Social Psychology',
        year: '2010',
      },
    ],
  },

  'Habit Tracking': {
    tagline: 'Mark it done.',
    lead: 'Self-monitoring is one of the better-supported behaviour-change techniques — the act of recording creates accountability and makes progress visible when it is otherwise invisible. The chain of marks becomes its own reason to continue.',
    cadenceLabel: 'Daily · mark it',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Self-monitoring works',
        description: 'A well-supported behaviour-change technique.',
      },
      {
        icon: 'sparkle',
        title: 'Progress becomes visible',
        description: 'Otherwise it is invisible day to day.',
      },
      {
        icon: 'wave',
        title: 'The chain motivates',
        description: 'You protect a streak you can see.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Trivial',
        description: 'One mark. That is the whole action.',
      },
      {
        when: 'Week 2',
        title: 'The chain matters',
        description: 'You start not wanting to break it.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Marking is part of doing.',
        peak: true,
      },
    ],
    howToStart: [
      'Mark one habit done today.',
      'Track whether, not how well. Binary beats scored.',
      'Keep it somewhere you already look daily.',
    ],
  },

  'Morning Habit Initiation': {
    tagline: 'Put new habits early in the day.',
    lead: 'Later in the day, habits compete with fatigue and everything that has gone wrong since morning. Front-loading a new behaviour means it runs before the day has a chance to consume it — this is scheduling logic more than neuroscience.',
    cadenceLabel: 'Daily · morning',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Fewer competitors',
        description: 'The day has not started making demands.',
      },
      {
        icon: 'sparkle',
        title: 'Done is done',
        description: 'It cannot be displaced once complete.',
      },
      {
        icon: 'wave',
        title: 'Momentum',
        description: 'An early win makes the next one cheaper.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Morning is crowded',
        description: 'Start with something tiny.',
      },
      {
        when: 'Week 3',
        title: 'It defends its slot',
        description: 'The routine starts protecting itself.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of how mornings run.',
        peak: true,
      },
    ],
    howToStart: [
      'Move one habit to before 9am.',
      'Anchor it to something already fixed in your morning.',
      'Not everything belongs in the morning. One or two, not eight.',
    ],
  },

  'Self-Compassion After Setbacks': {
    tagline: 'A missed day is not a failed habit.',
    lead: 'Self-criticism after a lapse predicts giving up, not trying harder — shame makes the whole habit aversive, so you avoid it rather than resume it. Self-compassion is the intervention that gets people back the next day.',
    cadenceLabel: 'After any lapse',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'You resume faster',
        description: 'Shame delays restarting; kindness does not.',
      },
      {
        icon: 'target',
        title: 'Breaks all-or-nothing',
        description: 'One miss stops meaning it is over.',
      },
      {
        icon: 'wave',
        title: 'Less avoidance',
        description: 'The habit does not become something you dread.',
      },
    ],
    timeline: [
      {
        when: 'First lapse',
        title: 'Self-criticism is automatic',
        description: 'It arrives before you choose anything.',
      },
      {
        when: 'Week 4',
        title: 'You catch it',
        description: 'A gap opens between lapse and verdict.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Missing a day stops being a crisis.',
        peak: true,
      },
    ],
    howToStart: [
      'After a miss, say: "that happened, and I start again today."',
      'Never double up to punish yourself for missing.',
      'Two in a row is the signal to act. One is just a day.',
    ],
    sources: [
      {
        authors: 'Sirois FM, Kitner R, Hirsch JK',
        title: 'Self-compassion, affect, and health-promoting behaviors',
        journal: 'Health Psychology',
        year: '2015',
      },
    ],
  },

  'Prep Workout Clothes Night Before': {
    tagline: 'Lay the kit out where you will trip over it.',
    lead: 'A visible cue plus removed friction is the whole mechanism of habit design in one action. The decision that would otherwise happen at 6am — sleepy, negotiable — gets made the night before, when you had capacity for it.',
    cadenceLabel: 'Nightly · 2 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Cue plus low friction',
        description: 'Both levers, one action.',
      },
      {
        icon: 'sparkle',
        title: 'Decision pre-made',
        description: 'Your sleepy self does not get a vote.',
      },
      {
        icon: 'wave',
        title: 'Two minutes',
        description: 'Buys a whole session.',
      },
    ],
    timeline: [
      {
        when: 'Night 1',
        title: 'Next morning is easier',
        description: 'Immediate, obvious payoff.',
      },
      {
        when: 'Week 2',
        title: 'Sessions get missed less',
        description: 'The cue does real work.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Laying it out is part of the evening.',
        peak: true,
      },
    ],
    howToStart: [
      'Put tomorrow’s kit somewhere you cannot walk past it.',
      'Everything, including shoes and headphones.',
      'Do it at the same point each evening.',
    ],
    sources: [
      {
        authors: 'Lally P, van Jaarsveld CHM, Potts HWW, Wardle J',
        title: 'How are habits formed: modelling habit formation in the real world',
        journal: 'European Journal of Social Psychology',
        year: '2010',
      },
    ],
  },

  'Water Bottle Always Visible': {
    tagline: 'Keep water in your line of sight.',
    lead: 'Hydration fails through forgetting rather than unwillingness, and a visible bottle solves forgetting without requiring any discipline. Mild dehydration measurably degrades concentration and mood, so the fix is worth the shelf space.',
    evidence:
      'Ganio et al. (2011) found that mild dehydration impaired vigilance and working memory and increased tension and fatigue in healthy men.',
    cadenceLabel: 'Always · one-time setup',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Clearer thinking',
        description: 'Mild dehydration measurably costs attention.',
      },
      {
        icon: 'target',
        title: 'Solves forgetting',
        description: 'Which is the actual failure mode.',
      },
      {
        icon: 'sparkle',
        title: 'Set once',
        description: 'The bottle keeps working by existing.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'You drink more',
        description: 'Visibility alone changes intake.',
      },
      {
        when: 'Week 2',
        title: 'Automatic sipping',
        description: 'You reach for it without deciding.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Its absence feels wrong.',
        peak: true,
      },
    ],
    howToStart: [
      'Fill a bottle and put it where you work.',
      'One you know the volume of makes tracking trivial.',
      'A second by the bed covers the morning glass too.',
    ],
    sources: [
      {
        authors: 'Ganio MS, et al.',
        title:
          'Mild dehydration impairs cognitive performance and mood of men',
        journal: 'British Journal of Nutrition',
        year: '2011',
      },
    ],
  },

  'Healthy Food at Eye Level': {
    tagline: 'Rearrange the shelf, not your willpower.',
    lead: 'What you eat is heavily determined by what is easiest to see and reach. Moving good options to eye level and burying the rest is choice architecture — it changes behaviour without requiring a decision each time.',
    evidence:
      'Thorndike et al. (2012) found that a labelling and choice-architecture intervention in a hospital cafeteria measurably shifted purchases toward healthier options.',
    cadenceLabel: 'One-time setup · 3 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Placement changes choice',
        description: 'Demonstrated in real-world settings.',
      },
      {
        icon: 'sparkle',
        title: 'No willpower',
        description: 'The environment decides for you.',
      },
      {
        icon: 'leaf',
        title: 'Three minutes',
        description: 'Then it keeps paying off.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediately effective',
        description: 'You eat what you can see.',
      },
      {
        when: 'Week 2',
        title: 'Snacking shifts',
        description: 'Default choices change quietly.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'The arrangement maintains itself.',
        peak: true,
      },
    ],
    howToStart: [
      'Move fruit to eye level and the biscuits to a high shelf.',
      'Out of sight genuinely works. Opaque containers help.',
      'Redo it after each shop — that is the only upkeep.',
    ],
    sources: [
      {
        authors: 'Thorndike AN, Sonnenberg L, Riis J, Barraclough S, Levy DE',
        title:
          'A 2-phase labeling and choice architecture intervention to improve healthy food and beverage choices',
        journal: 'American Journal of Public Health',
        year: '2012',
      },
    ],
  },

  'Phone in Another Room': {
    tagline: 'Distance, not self-control.',
    lead: 'A phone within reach occupies attention even face-down and untouched — resisting it costs something. Physical distance removes the contest entirely. Worth noting the effect size here is debated, but the intervention is free.',
    cadenceLabel: 'Per focus block',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Removes the contest',
        description: 'You cannot resist what is not there.',
      },
      {
        icon: 'wave',
        title: 'Longer focus',
        description: 'No micro-checks fragmenting the block.',
      },
      {
        icon: 'sparkle',
        title: 'Free',
        description: 'Costs one walk to another room.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Twitchy',
        description: 'You reach for a phone that is not there.',
      },
      {
        when: 'Week 2',
        title: 'Longer stretches',
        description: 'Focus rebuilds without the interruptions.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The phone leaves the room by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Put the phone in another room for one work block.',
      'Another room, not a drawer. Distance is the mechanism.',
      'Tell anyone who needs to reach you how, if that is the blocker.',
    ],
    sources: [
      {
        authors: 'Parry DA, le Roux DB',
        title: 'Does the "brain drain" effect really exist? A meta-analysis',
        journal: 'Media Psychology',
        year: '2023',
      },
    ],
  },

  'Bedroom for Sleep Only': {
    tagline: 'Bed is for sleep and sex, nothing else.',
    lead: 'If you work, scroll and worry in bed, your brain learns that bed means wakefulness. Reserving it rebuilds the association — this is stimulus control, a core component of the most effective insomnia treatment there is.',
    cadenceLabel: 'Always · ongoing',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Bed means sleep again',
        description: 'Rebuilds the learned association.',
      },
      {
        icon: 'target',
        title: 'Clinically established',
        description: 'A central CBT-I component.',
      },
      {
        icon: 'wave',
        title: 'Faster sleep onset',
        description: 'The cue starts working for you.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Inconvenient',
        description: 'Especially if your bed was your sofa.',
      },
      {
        when: 'Week 3',
        title: 'Sleepy on getting in',
        description: 'The association starts reforming.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Bed reliably means sleep.',
        peak: true,
      },
    ],
    howToStart: [
      'Move work and scrolling out of the bed today.',
      'Read in a chair instead, then move to bed when sleepy.',
      'If you cannot sleep, get up rather than lying there.',
    ],
    sources: [
      {
        authors: 'Morin CM, et al.',
        title: 'Nonpharmacologic treatment of chronic insomnia',
        journal: 'Sleep',
        year: '1999',
      },
    ],
  },

  'No Phone in Bedroom': {
    tagline: 'Charge it somewhere else.',
    lead: 'Phone access at bedtime is associated with shorter sleep and worse sleep quality — through light, through stimulation, and through the simple fact that it is there when you wake at 3am. Removing it removes all three at once.',
    evidence:
      'Carter et al. (2016) meta-analysed studies of children and adolescents and found bedtime access to screen-based media devices was associated with inadequate sleep quantity, poor sleep quality and daytime sleepiness.',
    cadenceLabel: 'Nightly',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Longer, better sleep',
        description: 'Access itself is the risk factor.',
      },
      {
        icon: 'wave',
        title: 'No 3am scrolling',
        description: 'Night wakings stop becoming sessions.',
      },
      {
        icon: 'sparkle',
        title: 'Better mornings',
        description: 'The day does not start in the feed.',
      },
    ],
    timeline: [
      {
        when: 'Nights 1-3',
        title: 'Uneasy',
        description: 'Buy a cheap alarm clock and it passes.',
      },
      {
        when: 'Week 2',
        title: 'Sleep improves',
        description: 'Onset and continuity both.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The phone charges elsewhere, permanently.',
        peak: true,
      },
    ],
    howToStart: [
      'Charge the phone in another room tonight.',
      'Buy a proper alarm clock — that removes the main excuse.',
      'Set emergency-bypass contacts if you are on call.',
    ],
    sources: [
      {
        authors: 'Carter B, Rees P, Hale L, Bhattacharjee D, Paradkar MS',
        title:
          'Association between portable screen-based media device access or use and sleep outcomes',
        journal: 'JAMA Pediatrics',
        year: '2016',
      },
    ],
  },

  'No Snooze Button': {
    tagline: 'Get up on the first alarm.',
    lead: 'Snoozing fragments the last stretch of sleep into short, low-quality pieces and can deepen sleep inertia rather than easing it. The extra nine minutes cost more than they give.',
    evidence:
      'Trotti (2017) reviews sleep inertia and sleep drunkenness, describing how fragmented waking and repeated alarms can prolong post-waking impairment.',
    cadenceLabel: 'Daily · first alarm',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less grogginess',
        description: 'Fragmented sleep worsens inertia.',
      },
      {
        icon: 'target',
        title: 'One decision',
        description: 'Up, rather than five negotiations.',
      },
      {
        icon: 'moon',
        title: 'Honest bedtime',
        description: 'No snooze forces a real sleep window.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'Brutal',
        description: 'This is genuinely hard at first.',
      },
      {
        when: 'Week 2',
        title: 'Easier',
        description: 'Especially once bedtime adjusts.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Up on the first alarm, without drama.',
        peak: true,
      },
    ],
    howToStart: [
      'Set one alarm, across the room.',
      'Set it for when you will actually get up, not optimistically early.',
      'If it is unbearable, the problem is bedtime, not the alarm.',
    ],
    sources: [
      {
        authors: 'Trotti LM',
        title:
          'Waking up is the hardest thing I do all day: sleep inertia and sleep drunkenness',
        journal: 'Sleep Medicine Reviews',
        year: '2017',
      },
    ],
  },

  'No News Before Noon': {
    tagline: 'Keep the feed out of your morning.',
    lead: 'High-arousal media early in the day sets a reactive tone and consumes the attention you were going to spend on your own priorities. Repeated exposure to distressing coverage is also associated with stress responses of its own.',
    evidence:
      'Holman et al. (2014) found that repeated media exposure to collective trauma was associated with acute stress responses, in some cases exceeding those of direct exposure.',
    cadenceLabel: 'Daily · until noon',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Calmer start',
        description: 'No arousal spike before you are awake.',
      },
      {
        icon: 'target',
        title: 'Your agenda first',
        description: 'The morning stays yours.',
      },
      {
        icon: 'leaf',
        title: 'You miss nothing',
        description: 'Genuine news survives until noon.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Itchy',
        description: 'The checking reflex is strong.',
      },
      {
        when: 'Week 2',
        title: 'Better mornings',
        description: 'And you find you missed nothing.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Morning news stops appealing.',
        peak: true,
      },
    ],
    howToStart: [
      'No news or feeds before noon today.',
      'Remove the apps from your home screen.',
      'Pick one time to catch up properly rather than grazing.',
    ],
    sources: [
      {
        authors: 'Holman EA, Garfin DR, Silver RC',
        title:
          'Media’s role in broadcasting acute stress following the Boston Marathon bombings',
        journal: 'PNAS',
        year: '2014',
      },
    ],
  },

  'Alcohol-Free Weekdays': {
    tagline: 'Drink at weekends, if at all.',
    lead: 'A weekday rule cuts cumulative intake without requiring abstinence, and it protects the sleep quality that weekday performance depends on. The evidence on alcohol has moved steadily toward "less is better" with no protective threshold.',
    cadenceLabel: 'Mon-Thu · alcohol-free',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Better weekday sleep',
        description: 'Alcohol suppresses REM and fragments sleep.',
      },
      {
        icon: 'leaf',
        title: 'Lower total intake',
        description: 'Without needing to quit entirely.',
      },
      {
        icon: 'target',
        title: 'A clear rule',
        description: 'Easier to keep than a unit count.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Habit protests',
        description: 'The evening ritual is the hard part.',
      },
      {
        when: 'Week 3',
        title: 'Sleep and mornings improve',
        description: 'Usually obvious by here.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Weekday drinking stops occurring to you.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick the days and treat them as fixed, not negotiable.',
      'Replace the ritual, not just the drink.',
      'If cutting back feels impossible, that is worth raising with a doctor.',
    ],
    sources: [
      {
        authors: 'GBD 2016 Alcohol Collaborators',
        title:
          'Alcohol use and burden for 195 countries and territories, 1990-2016',
        journal: 'The Lancet',
        year: '2018',
      },
    ],
  },

  'Stop at 80% Full': {
    tagline: 'Stop at satisfied, not stuffed.',
    lead: 'Satiety signals arrive on a delay, so eating to "full" reliably overshoots. Eating attentively and leaving a margin lets those signals land — attentiveness itself is associated with eating less, independent of what is on the plate.',
    evidence:
      'Robinson et al. (2014) meta-analysed attentive-eating studies and found that greater attention to eating was associated with reduced food intake.',
    cadenceLabel: 'Every meal',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Signals catch up',
        description: 'Fullness arrives after you stop.',
      },
      {
        icon: 'leaf',
        title: 'Better digestion',
        description: 'Less discomfort after meals.',
      },
      {
        icon: 'target',
        title: 'No food rules',
        description: 'Changes quantity, not content.',
      },
    ],
    timeline: [
      {
        when: 'Meal 1',
        title: 'Hard to judge',
        description: '80% is a feel, not a measurement.',
      },
      {
        when: 'Week 3',
        title: 'You recognise it',
        description: 'The signal becomes легible with practice.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Stopping earlier becomes normal.',
        peak: true,
      },
    ],
    howToStart: [
      'Put the fork down between mouthfuls and check in.',
      'Pause halfway and ask whether you still want the rest.',
      'No screens — attention is the mechanism here.',
    ],
    sources: [
      {
        authors: 'Robinson E, et al.',
        title:
          'Eating attentively: a systematic review and meta-analysis of the effect of food intake memory and awareness on eating',
        journal: 'American Journal of Clinical Nutrition',
        year: '2014',
      },
    ],
  },

  'One Less Meeting': {
    tagline: 'Decline or shorten one meeting a week.',
    lead: 'Meeting load is associated with fatigue and reduced wellbeing, and most calendars contain at least one recurring item nobody would defend. Removing one a week compounds into real reclaimed time.',
    evidence:
      'Luong & Rogelberg (2005) found that the number of meetings attended was associated with increased daily fatigue and subjective workload.',
    cadenceLabel: 'Weekly · cancel one',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Reclaimed focus time',
        description: 'Fragmented days cost more than the hour.',
      },
      {
        icon: 'wave',
        title: 'Less fatigue',
        description: 'Meeting load tracks with it directly.',
      },
      {
        icon: 'leaf',
        title: 'Nobody misses it',
        description: 'Usually nothing breaks. That is data.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Feels risky',
        description: 'Declining is socially uncomfortable.',
      },
      {
        when: 'Week 4',
        title: 'Calendar breathes',
        description: 'And nothing has fallen over.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You audit the calendar by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Find one recurring meeting with no clear purpose.',
      'Propose async or a shorter slot rather than flat refusal.',
      'Offer to read notes instead — that usually lands well.',
    ],
    sources: [
      {
        authors: 'Luong A, Rogelberg SG',
        title:
          'Meetings and more meetings: the relationship between meeting load and the daily well-being of employees',
        journal: 'Group Dynamics',
        year: '2005',
      },
    ],
  },

  'Circadian Anchor Times': {
    tagline: 'Sleep and wake within the same half hour daily.',
    lead: 'Regularity is a distinct sleep variable from duration, and an irregular schedule produces something like permanent mild jet lag. Holding both ends steady — weekends included — is the highest-leverage sleep change most people can make.',
    cadenceLabel: 'Daily · ±30 min, 7 days',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Stable body clock',
        description: 'Regularity matters independently of duration.',
      },
      {
        icon: 'wave',
        title: 'No social jet lag',
        description: 'Weekend shifts cost you Monday.',
      },
      {
        icon: 'target',
        title: 'Everything else improves',
        description: 'Sleep is upstream of most things.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'Friction',
        description: 'Weekends are where this gets tested.',
      },
      {
        when: 'Week 2',
        title: 'Sleepy on schedule',
        description: 'Your clock starts cooperating.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The window holds itself.',
        peak: true,
      },
    ],
    howToStart: [
      'Fix the wake time first — it anchors the rest.',
      'Keep weekends within 30 minutes of weekdays.',
      'Morning light immediately after waking locks it in.',
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

  'Evening Screen Curfew': {
    tagline: 'Screens off two hours before bed.',
    lead: 'Evening light suppresses melatonin and pushes your body clock later, and the content keeps you alert on top of that. A curfew is easier to keep than per-app rules because there is nothing to adjudicate.',
    evidence:
      'Chang et al. (2015) found that reading on a light-emitting device before bed suppressed melatonin, delayed sleep onset and reduced next-morning alertness compared with print.',
    cadenceLabel: 'Nightly · last 2-3 hours',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Melatonin on time',
        description: 'Light is what holds it back.',
      },
      {
        icon: 'wave',
        title: 'Faster sleep onset',
        description: 'Less alerting input before bed.',
      },
      {
        icon: 'sparkle',
        title: 'Evenings reappear',
        description: 'Two hours is a lot of reclaimed time.',
      },
    ],
    timeline: [
      {
        when: 'Nights 1-3',
        title: 'Boredom',
        description: 'Have the replacement ready in advance.',
      },
      {
        when: 'Week 2',
        title: 'Earlier sleepiness',
        description: 'Bedtime starts arriving on its own.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Screens go down without a decision.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with 30 minutes and extend weekly.',
      'Charge devices outside the bedroom.',
      'Decide the replacement first — book, bath, conversation.',
    ],
    sources: [
      {
        authors: 'Chang A-M, Aeschbach D, Duffy JF, Czeisler CA',
        title:
          'Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness',
        journal: 'PNAS',
        year: '2015',
      },
    ],
  },

  'Sunset Viewing Ritual': {
    tagline: 'Catch the evening light.',
    lead: 'Your circadian system reads the shift toward longer wavelengths at dusk as a time signal. Bookending the day with morning and evening light gives the clock both edges to anchor to, rather than only one.',
    cadenceLabel: 'Daily · 10 min at sunset',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Evening time cue',
        description: 'Signals the day is closing.',
      },
      {
        icon: 'wave',
        title: 'A real transition',
        description: 'Marks the end of work deliberately.',
      },
      {
        icon: 'leaf',
        title: 'Outdoors again',
        description: 'A second dose of daylight.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Pleasant',
        description: 'The pause is the immediate benefit.',
      },
      {
        when: 'Week 2',
        title: 'The day gets shape',
        description: 'A defined ending rather than a fade.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You notice the light without planning.',
        peak: true,
      },
    ],
    howToStart: [
      'Step outside near sunset for ten minutes.',
      'Dim the indoor lights afterwards to keep the signal consistent.',
      'Attach it to a walk or to finishing work.',
    ],
  },

  'Optimal Vagal Breathing (6/min)': {
    tagline: 'Six breaths a minute, longer out than in.',
    lead: 'Around six breaths a minute your heart rate and breathing fall into phase and heart rate variability peaks — this is the resonant frequency that HRV biofeedback training targets. The extended exhale is what tips it toward the parasympathetic side.',
    evidence:
      'Lehrer & Gevirtz (2014) review evidence that breathing near the resonance frequency of roughly six breaths per minute maximises heart rate variability and underpins HRV biofeedback.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Peak HRV',
        description: 'The measured resonance frequency.',
      },
      {
        icon: 'target',
        title: 'Trainable calm',
        description: 'Raises baseline stress tolerance over weeks.',
      },
      {
        icon: 'leaf',
        title: 'Nothing to buy',
        description: 'A count is the whole equipment list.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Slower than expected',
        description: 'Six a minute feels long at first.',
      },
      {
        when: 'Week 3',
        title: 'Comfortable',
        description: 'The rhythm stops needing counting.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You drift toward this pace when settling.',
        peak: true,
      },
    ],
    howToStart: [
      'Inhale about 4 seconds, exhale about 6. That is roughly six a minute.',
      'Five minutes, nasal, low into the belly.',
      'A paced-breathing app removes the counting.',
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

  'Vagal Humming Practice': {
    tagline: 'Hum for five minutes.',
    lead: 'Humming makes nasal airflow oscillate, which sharply increases the nitric oxide released there, and it enforces a long controlled exhale at the same time. Two mechanisms from an activity requiring no skill whatsoever.',
    evidence:
      'Weitzberg & Lundberg (2002) measured nasal nitric oxide during humming and found it rose roughly fifteen-fold compared with quiet exhalation.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Nasal nitric oxide',
        description: 'A large, measured increase.',
      },
      {
        icon: 'leaf',
        title: 'Extended exhale',
        description: 'Humming enforces it automatically.',
      },
      {
        icon: 'sparkle',
        title: 'No technique',
        description: 'Impossible to do wrong.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Calming',
        description: 'The long exhale does the work.',
      },
      {
        when: 'Week 2',
        title: 'Fits anywhere',
        description: 'Shower, car, walking.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You hum without deciding to.',
        peak: true,
      },
    ],
    howToStart: [
      'Hum any note on the out-breath, lips closed.',
      'One minute to start, build to five.',
      'Pair it with something you already do alone.',
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

  'Cold Face Diving Reflex': {
    tagline: 'Cold water on the face when stressed.',
    lead: 'Cold on the face and around the nostrils triggers the mammalian diving reflex — heart rate drops within seconds via vagal activation. It is the fastest physiological intervention on this list and it needs a tap.',
    cadenceLabel: 'As needed · 30 sec',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Heart rate drops fast',
        description: 'Seconds, not minutes.',
      },
      {
        icon: 'target',
        title: 'Interrupts panic',
        description: 'Useful when thinking will not help.',
      },
      {
        icon: 'leaf',
        title: 'A tap is the equipment',
        description: 'Available almost anywhere.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Immediate',
        description: 'The effect is unmistakable.',
      },
      {
        when: 'Week 2',
        title: 'You remember it in time',
        description: 'It becomes reachable during stress.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A default response to spiralling.',
        peak: true,
      },
    ],
    howToStart: [
      'Hold cold water against your face for 30 seconds.',
      'Cover forehead, eyes and upper cheeks — that is where the reflex lives.',
      'Check with a clinician first if you have a heart rhythm condition.',
    ],
  },

  'Daily Vagus Reset Ritual': {
    tagline: 'Five minutes of deliberate downshifting.',
    lead: 'Slow breathing, cold exposure and humming all engage the parasympathetic system through different doors. Doing one daily is less about any single session and more about practising the shift so it is available when you need it.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Practised downshift',
        description: 'The skill is getting there on demand.',
      },
      {
        icon: 'target',
        title: 'Several routes',
        description: 'Breath, cold, or humming — pick one.',
      },
      {
        icon: 'leaf',
        title: 'Five minutes',
        description: 'Short enough to keep daily.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Noticeable',
        description: 'All three routes work immediately.',
      },
      {
        when: 'Week 3',
        title: 'Faster to arrive',
        description: 'You downshift more readily.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A reliable daily reset.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick one: slow breathing, cold splash, or humming.',
      'Five minutes, same time daily.',
      'Same tool each day at first — variety comes later.',
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

  '2-Minute Emotional Pause': {
    tagline: 'Two minutes with your breath when feeling rises.',
    lead: 'A deliberate pause puts a gap between the emotion and whatever you were about to do about it. Two minutes is long enough for the physiological peak to pass and short enough that you will actually take it.',
    cadenceLabel: 'As needed · 2 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'The peak passes',
        description: 'Strong emotion is time-limited.',
      },
      {
        icon: 'target',
        title: 'A gap to choose in',
        description: 'Between feeling and acting.',
      },
      {
        icon: 'leaf',
        title: 'Two minutes',
        description: 'Short enough to be realistic.',
      },
    ],
    timeline: [
      {
        when: 'First use',
        title: 'Hard to remember',
        description: 'Emotion is faster than intention.',
      },
      {
        when: 'Week 3',
        title: 'You catch it earlier',
        description: 'The pause becomes reachable.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Pausing precedes reacting.',
        peak: true,
      },
    ],
    howToStart: [
      'When something rises, stop and watch your breath for two minutes.',
      'Do not analyse the feeling. Just wait it out.',
      'Longer exhales than inhales speed it up.',
    ],
  },

  'Power Posture Practice': {
    tagline: 'Stand tall — for the mechanics, not the hormones.',
    lead: 'Be careful with this one. The famous "power posing" finding — that posture changes testosterone and cortisol — failed to replicate, and the original author has since distanced herself from the hormonal claims. What survives is smaller and still worth having: upright posture reduces neck and back load and lets you breathe fully.',
    cadenceLabel: 'Before key moments · 2 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less mechanical load',
        description: 'The claim that actually holds up.',
      },
      {
        icon: 'leaf',
        title: 'Fuller breathing',
        description: 'Slumping restricts the diaphragm.',
      },
      {
        icon: 'target',
        title: 'Self-reported confidence',
        description: 'Felt effects may be real; hormonal ones did not replicate.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels deliberate',
        description: 'Which is fine — that is the point.',
      },
      {
        when: 'Week 3',
        title: 'Posture awareness',
        description: 'You catch the slump unprompted.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Upright becomes the default.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand tall, shoulders back, for two minutes before something that matters.',
      'Expect a posture and breathing benefit — not a hormonal one.',
      'Fix your desk setup too. Posture fights furniture and loses.',
    ],
  },

  '30-Minute Brain-Boosting Cardio': {
    tagline: 'Aerobic exercise, for your head.',
    lead: 'Acute aerobic exercise produces measurable short-term improvements in mood and executive function, and regular training is associated with longer-term cognitive benefit. Of everything marketed for brain health, this has the best evidence behind it.',
    evidence:
      'Basso & Suzuki (2017) reviewed acute exercise studies and found consistent improvements in mood, executive function and attention following single bouts of aerobic exercise.',
    cadenceLabel: '3-4x weekly · 30-45 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Same-day cognitive lift',
        description: 'Measured after single sessions.',
      },
      {
        icon: 'target',
        title: 'Best-evidenced brain habit',
        description: 'Better supported than any brain-training app.',
      },
      {
        icon: 'leaf',
        title: 'Mood too',
        description: 'The effect on mood is large and fast.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Immediate lift',
        description: 'Mood and focus both, within the hour.',
      },
      {
        when: 'Week 6',
        title: 'Fitter and sharper',
        description: 'Cumulative effects accrue.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Sessions hold their place in the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Walk briskly for ten minutes. That is session one.',
      'Build to 30-45 minutes, 3-4 times a week.',
      'Do it before demanding work to use the acute effect.',
    ],
    sources: [
      {
        authors: 'Basso JC, Suzuki WA',
        title:
          'The effects of acute exercise on mood, cognition, neurophysiology, and neurochemical pathways: a review',
        journal: 'Brain Plasticity',
        year: '2017',
      },
    ],
  },

  'Resistance Training for Brain': {
    tagline: 'Lift, for cognition.',
    lead: 'Resistance training shows cognitive benefits in trial data, not just cardiovascular ones — and it does so through partly different mechanisms than aerobic work. Doing both beats doing either.',
    evidence:
      'Northey et al. (2018) meta-analysed exercise trials in adults over 50 and found both aerobic and resistance training improved cognitive function, with combined training effective across domains.',
    cadenceLabel: '2-3x weekly · 25-45 min',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Cognitive benefit',
        description: 'Demonstrated in meta-analysed trials.',
      },
      {
        icon: 'target',
        title: 'Complements cardio',
        description: 'Different mechanisms, additive effect.',
      },
      {
        icon: 'leaf',
        title: 'Muscle protects too',
        description: 'Independence and metabolic health.',
      },
    ],
    timeline: [
      {
        when: 'Week 2',
        title: 'Stronger first',
        description: 'Neural adaptation precedes everything else.',
      },
      {
        when: 'Week 12',
        title: 'Cognitive measures shift',
        description: 'The trial timescale for these effects.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Training days are fixed.',
        peak: true,
      },
    ],
    howToStart: [
      'Two sessions a week. Squat, hinge, push, pull.',
      'Start with bodyweight and add load gradually.',
      'Combine with aerobic work — together beats either alone.',
    ],
    sources: [
      {
        authors: 'Northey JM, Cherbuin N, Pumpa KL, Smee DJ, Rattray B',
        title:
          'Exercise interventions for cognitive function in adults older than 50: a systematic review with meta-analysis',
        journal: 'British Journal of Sports Medicine',
        year: '2018',
      },
    ],
  },

  'Cognitive Blood Pressure Target': {
    tagline: 'Aim below 120 systolic.',
    lead: 'Intensive blood pressure control reduced the incidence of mild cognitive impairment in a large randomised trial — one of the few interventions with trial-level evidence for protecting cognition. Blood pressure is a brain variable, not only a heart one.',
    evidence:
      'The SPRINT MIND trial (2019) found intensive blood pressure control targeting below 120 mmHg systolic significantly reduced the risk of mild cognitive impairment compared with a standard target.',
    cadenceLabel: 'Weekly check · ongoing target',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Cognitive protection',
        description: 'Trial-level evidence, which is rare here.',
      },
      {
        icon: 'leaf',
        title: 'Cardiovascular too',
        description: 'The same target helps both.',
      },
      {
        icon: 'target',
        title: 'Measurable',
        description: 'A number you can actually track.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Baseline',
        description: 'Several readings, not one.',
      },
      {
        when: 'Week 8',
        title: 'Trend visible',
        description: 'Lifestyle changes start showing.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A standing weekly check.',
        peak: true,
      },
    ],
    howToStart: [
      'Take a weekly reading, seated and rested, on a validated monitor.',
      'Exercise, salt, alcohol, weight and sleep all move this number.',
      'Do not chase a target with medication changes on your own — that is a doctor’s call.',
    ],
    sources: [
      {
        authors: 'SPRINT MIND Investigators',
        title:
          'Effect of intensive vs standard blood pressure control on probable dementia and mild cognitive impairment',
        journal: 'JAMA',
        year: '2019',
      },
    ],
  },

  'Cognitive Reserve Building': {
    tagline: 'Learn something new every month.',
    lead: 'Cognitive reserve is the idea that mentally demanding activity across life builds capacity that masks age-related decline for years. Novelty appears to be the ingredient — getting better at something familiar does less than being a beginner again.',
    cadenceLabel: 'Monthly · one new skill',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Builds reserve',
        description: 'Associated with later symptom onset.',
      },
      {
        icon: 'target',
        title: 'Novelty is the ingredient',
        description: 'New beats better-at-familiar.',
      },
      {
        icon: 'leaf',
        title: 'Enjoyable',
        description: 'Which is what makes it last.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Beginner again',
        description: 'Uncomfortable, and that is the exercise.',
      },
      {
        when: 'Week 3',
        title: 'Competent enough',
        description: 'Enough to decide whether to continue.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A monthly rotation you enjoy.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick something genuinely new — instrument, language, craft.',
      'One month, then keep it or rotate.',
      'Choose for curiosity. Enjoyment decides whether it survives.',
    ],
    sources: [
      {
        authors: 'Stern Y',
        title: 'Cognitive reserve in ageing and Alzheimer’s disease',
        journal: 'The Lancet Neurology',
        year: '2012',
      },
    ],
  },

  'Longevity Big 4 Habits': {
    tagline: 'Four things, most of the benefit.',
    lead: 'Large cohort analyses keep converging on the same short list — not smoking, regular activity, adequate sleep, and a decent diet. It is unglamorous precisely because it is well established, and it outperforms anything you can buy.',
    cadenceLabel: 'Ongoing · all four',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Years of life',
        description: 'The effect sizes here are large.',
      },
      {
        icon: 'target',
        title: 'Nothing exotic',
        description: 'No supplements, no protocols.',
      },
      {
        icon: 'wave',
        title: 'They reinforce each other',
        description: 'Sleep makes exercise easier, and so on.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Pick one',
        description: 'Four at once fails. One sticks.',
      },
      {
        when: 'Month 3',
        title: 'Two or three in place',
        description: 'They pull each other along.',
      },
      {
        when: '~90 days',
        title: 'Automatic',
        description: 'The basics run themselves.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick the weakest of the four and work only on that.',
      '150 minutes of activity weekly, 7-8 hours of sleep, no smoking, mostly plants.',
      'Boring and effective. Do not upgrade to something more interesting.',
    ],
  },

  'Healthspan Tracking': {
    tagline: 'Track the habits, not just the years.',
    lead: 'Adherence to a handful of low-risk lifestyle factors is associated with substantially more disease-free years, not merely more years. Tracking adherence keeps attention on the inputs, which are the part you control.',
    cadenceLabel: 'Weekly · review adherence',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Disease-free years',
        description: 'Healthspan, not just lifespan.',
      },
      {
        icon: 'target',
        title: 'Inputs, not outcomes',
        description: 'The part you can actually act on.',
      },
      {
        icon: 'wave',
        title: 'Honest feedback',
        description: 'You see which factor keeps slipping.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Clarifying',
        description: 'You find out where you actually stand.',
      },
      {
        when: 'Month 2',
        title: 'Patterns visible',
        description: 'One factor is always the weak one.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A weekly review of the basics.',
        peak: true,
      },
    ],
    howToStart: [
      'List the factors: activity, sleep, diet, alcohol, smoking, weight.',
      'Score adherence weekly, honestly, out of five.',
      'Work on the lowest score. Ignore the rest for now.',
    ],
  },

  'Lifelong Weight Maintenance': {
    tagline: 'Stability beats cycling.',
    lead: 'Maintaining a steady weight across decades is associated with better outcomes than repeatedly losing and regaining it. The framing matters: this is about avoiding the cycle, not about pursuing a number.',
    cadenceLabel: 'Ongoing',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Stability matters',
        description: 'Cycling appears worse than steady.',
      },
      {
        icon: 'target',
        title: 'Long horizon',
        description: 'Decades, not a twelve-week plan.',
      },
      {
        icon: 'wave',
        title: 'Habits over diets',
        description: 'Only sustainable changes hold.',
      },
    ],
    timeline: [
      {
        when: 'Month 1',
        title: 'Nothing dramatic',
        description: 'Maintenance is deliberately undramatic.',
      },
      {
        when: 'Year 1',
        title: 'Stability is the win',
        description: 'Not gaining is a real outcome.',
      },
      {
        when: '~90 days',
        title: 'Automatic',
        description: 'The habits that hold it become default.',
        peak: true,
      },
    ],
    howToStart: [
      'Focus on habits you could keep for ten years, not ten weeks.',
      'Weigh weekly at most — daily fluctuation is noise.',
      'If weight is a fraught topic for you, work with a clinician or dietitian.',
    ],
  },

  'Mediterranean + Time-Restricted Eating': {
    tagline: 'A Mediterranean pattern inside a set window.',
    lead: 'Both halves have independent evidence — the Mediterranean pattern from randomised cardiovascular trials, time-restricted eating from smaller metabolic ones. Combining them is reasonable extrapolation rather than something directly trialled; treat it that way.',
    cadenceLabel: 'Daily · 10-12 hour window',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Two evidenced patterns',
        description: 'Each supported on its own.',
      },
      {
        icon: 'moon',
        title: 'No late eating',
        description: 'Often the biggest practical win.',
      },
      {
        icon: 'target',
        title: 'Two simple rules',
        description: 'What and when, nothing counted.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Two changes at once',
        description: 'Consider staging them.',
      },
      {
        when: 'Week 4',
        title: 'Both feel normal',
        description: 'Appetite re-times itself.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'It is just how you eat.',
        peak: true,
      },
    ],
    howToStart: [
      'Start with the eating pattern; add the window a fortnight later.',
      'Twelve hours is a real intervention. Do not jump to eight.',
      'Not appropriate in pregnancy, with diabetes medication, or with a history of eating disorders.',
    ],
    sources: [
      {
        authors: 'Estruch R, et al.',
        title:
          'Primary prevention of cardiovascular disease with a Mediterranean diet',
        journal: 'New England Journal of Medicine',
        year: '2013',
      },
    ],
  },

  'Choose Whole Foods': {
    tagline: 'Add something good rather than banning something bad.',
    lead: 'Approach-framed goals hold up better than avoidance ones — "add a vegetable" survives a bad week in a way "no sugar" does not. Same direction of travel, much lower failure rate.',
    cadenceLabel: 'Every meal · add one',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Approach beats avoid',
        description: 'Additive goals are more durable.',
      },
      {
        icon: 'target',
        title: 'Crowds out the rest',
        description: 'More good food means less room.',
      },
      {
        icon: 'wave',
        title: 'No deprivation',
        description: 'Nothing is forbidden.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy',
        description: 'Adding is far easier than removing.',
      },
      {
        when: 'Week 3',
        title: 'Plates change',
        description: 'Composition shifts without restriction.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You build meals around the good stuff.',
        peak: true,
      },
    ],
    howToStart: [
      'Add one extra serving of vegetables to your next meal.',
      'Add before you subtract. It works better.',
      'Frozen counts. Convenience is what makes it repeatable.',
    ],
  },

  'Psychobiotic Foods': {
    tagline: 'Fermented foods, for the gut-brain axis.',
    lead: 'The gut-brain axis is real and actively researched, and a controlled trial found fermented foods shift microbiome diversity and immune markers. The mood claims are more preliminary than the marketing suggests — worth doing, worth calibrating.',
    evidence:
      'Wastyk et al. (2021), in a Stanford randomised trial, found a fermented-food diet increased gut microbiota diversity and decreased inflammatory markers over ten weeks.',
    cadenceLabel: 'Daily · 1-2 servings',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Microbiome diversity',
        description: 'Measured in a randomised trial.',
      },
      {
        icon: 'wave',
        title: 'Inflammatory markers',
        description: 'Decreased over ten weeks.',
      },
      {
        icon: 'target',
        title: 'Mood claims are early',
        description: 'Promising, not established.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Possible bloating',
        description: 'Start with a spoonful, not a jar.',
      },
      {
        when: 'Week 10',
        title: 'The trial window',
        description: 'Where the measured changes appeared.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A daily spoonful with a meal.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one bite of yoghurt, kefir or kimchi.',
      'Look for live cultures — pasteurised versions do not count.',
      'Build up slowly. Be cautious if immunocompromised.',
    ],
    sources: [
      {
        authors: 'Wastyk HC, et al.',
        title: 'Gut-microbiota-targeted diets modulate human immune status',
        journal: 'Cell',
        year: '2021',
      },
    ],
  },

  'Longevity Probiotics': {
    tagline: 'A probiotic supplement, with modest expectations.',
    lead: 'Specific strains do show effects in specific conditions, but the general anti-ageing probiotic story is not established — most supplements are poorly characterised and the transient colonisation is real. Fermented food is the better-evidenced route to the same goal.',
    cadenceLabel: 'Daily · if you choose to',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Strain-specific effects',
        description: 'Some strains, some conditions.',
      },
      {
        icon: 'target',
        title: 'Food first',
        description: 'Fermented foods have better evidence.',
      },
      {
        icon: 'wave',
        title: 'Low risk',
        description: 'Generally safe if you are healthy.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Possible digestive change',
        description: 'Usually settles.',
      },
      {
        when: 'Week 6',
        title: 'Hard to assess',
        description: 'There is little you can feel here.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of a daily routine.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a product that names its strains and doses.',
      'Consider fermented foods instead — better evidence, cheaper.',
      'Talk to a clinician first if immunocompromised or seriously unwell.',
    ],
  },

  'Oral Microbiome Care': {
    tagline: 'Look after your mouth.',
    lead: 'Gum disease is associated with cardiovascular and cognitive outcomes, and the association is robust — though whether it is causal remains open. Either way the oral health benefit alone justifies two minutes. One caution: routine antiseptic mouthwash is not obviously good, and oil pulling has little support.',
    cadenceLabel: 'Daily · 2 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Gum health',
        description: 'The direct, uncontested benefit.',
      },
      {
        icon: 'target',
        title: 'Associated with more',
        description: 'Cardiovascular and cognitive links exist.',
      },
      {
        icon: 'wave',
        title: 'Two minutes',
        description: 'Attached to something you already do.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Possible bleeding',
        description: 'Usually existing inflammation, not harm.',
      },
      {
        when: 'Week 3',
        title: 'Gums firm up',
        description: 'Bleeding stops.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of brushing.',
        peak: true,
      },
    ],
    howToStart: [
      'Brush twice and clean between your teeth daily — that is the evidenced core.',
      'Skip routine antiseptic mouthwash unless a dentist advised it.',
      'Oil pulling has little evidence. Interdental cleaning has plenty.',
    ],
  },

  '40 Hz Binaural Beats': {
    tagline: 'An audio focus experiment.',
    lead: 'Gamma-frequency stimulation is a genuinely active research area, mostly in Alzheimer’s models and mostly using light and sound flicker rather than binaural beats. For focus in healthy adults the evidence is thin and mixed — try it as a personal experiment, not an established tool.',
    cadenceLabel: 'Before focus blocks · 5 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'A cue, at minimum',
        description: 'Putting it on marks the start of work.',
      },
      {
        icon: 'wave',
        title: 'Masks noise',
        description: 'A real benefit regardless of frequency.',
      },
      {
        icon: 'leaf',
        title: 'Evidence is thin',
        description: 'Treat any focus effect as unproven.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Odd sounding',
        description: 'Binaural beats take adjusting to.',
      },
      {
        when: 'Week 2',
        title: 'It becomes a cue',
        description: 'Probably the main mechanism.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'On with the headphones, into the work.',
        peak: true,
      },
    ],
    howToStart: [
      'Headphones are required — binaural beats need separate channels.',
      'Five minutes before a focus block, at low volume.',
      'Skip it if you have epilepsy or are sensitive to rhythmic stimulation.',
    ],
  },
};
