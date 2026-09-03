/**
 * Science drill-down copy — Longevity, environmental design, subtraction.
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const LONGEVITY_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'Brisk Walking Pace': {
    suggestedWhy: 'Walking faster trains heart, muscle and balance at once, so the number that tracks with survival keeps improving.',
    tagline: 'Walk faster, not just further.',
    lead: 'Walking speed is one of the strongest simple predictors of how long people live — partly because it summarises cardiovascular fitness, muscle, balance and neurological function in a single number. Training the pace trains all of them.',
    evidence:
      'Studenski et al. (2011) pooled nine cohort studies and found gait speed was strongly associated with survival in older adults, with each 0.1 m/s increment predicting improved survival.',
    cadenceLabel: 'Daily · 30 min at 3+ mph',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A longevity marker',
        description: 'Pace predicts survival better than most single measures.',
      },
      {
        icon: 'wave',
        title: 'Real cardio',
        description: 'Brisk walking reaches a genuine training zone.',
      },
      {
        icon: 'target',
        title: 'No extra time',
        description: 'Same walk, more benefit.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Breathing harder',
        description: 'Brisk should feel like effort, not a stroll.',
      },
      {
        when: 'Week 4',
        title: 'The pace gets easier',
        description: 'Fitness adapts quickly at this intensity.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Your default walking speed has changed.',
        peak: true,
      },
    ],
    howToStart: [
      'Aim for a pace where you can talk but not sing.',
      'Push the pace on walks you already take rather than adding new ones.',
      'Roughly 100 steps a minute is a useful target to count against.',
    ],
    sources: [
      {
        authors: 'Studenski S, et al.',
        title: 'Gait speed and survival in older adults',
        journal: 'JAMA',
        year: '2011',
      },
    ],
  },

  'Muscle Preservation': {
    suggestedWhy: 'Loading muscle reverses the decline that starts in midlife, so strength, glucose control and independence hold up.',
    tagline: 'Resistance training two or three times a week.',
    lead: 'Muscle mass declines steadily from midlife unless it is loaded, and that decline tracks closely with loss of independence and higher mortality. Resistance training is the only intervention that reliably reverses it — and two sessions a week is enough to matter.',
    evidence:
      'Srikanthan & Karlamangla (2014) analysed NHANES data and found higher muscle mass index was associated with lower all-cause mortality in older adults.',
    cadenceLabel: '2-3x weekly · 25-45 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Protects independence',
        description: 'Strength is what keeps you self-sufficient later.',
      },
      {
        icon: 'target',
        title: 'Metabolic health',
        description: 'Muscle is where glucose gets used.',
      },
      {
        icon: 'wave',
        title: 'Fewer falls',
        description: 'Strength and balance decline together.',
      },
    ],
    timeline: [
      {
        when: 'Week 2',
        title: 'Neural gains first',
        description: 'You get stronger before you get bigger.',
      },
      {
        when: 'Week 8',
        title: 'Visible change',
        description: 'Muscle takes about two months to show.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Training is a fixed part of your week.',
        peak: true,
      },
    ],
    howToStart: [
      'Two sessions a week. Squat, hinge, push, pull — that covers it.',
      'Start with bodyweight or light loads and add weight gradually.',
      'Progressive overload is the mechanism: a little more over time.',
    ],
    sources: [
      {
        authors: 'Srikanthan P, Karlamangla AS',
        title:
          'Muscle mass index as a predictor of longevity in older adults',
        journal: 'American Journal of Medicine',
        year: '2014',
      },
    ],
  },

  'Always Take Stairs': {
    suggestedWhy: 'Short vigorous climbs accumulate with no scheduling, so leg strength and heart fitness build inside your normal day.',
    tagline: 'Skip the lift, every time.',
    lead: 'Stair climbing is short-burst vigorous activity that accumulates without any scheduling. Because the decision is binary and repeated daily, it is one of the few fitness habits that needs no willpower once the rule is fixed.',
    cadenceLabel: 'Daily · every opportunity',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Cardiovascular benefit',
        description: 'Regular climbing tracks with lower risk.',
      },
      {
        icon: 'target',
        title: 'Zero scheduling',
        description: 'The opportunities come to you.',
      },
      {
        icon: 'wave',
        title: 'Leg strength',
        description: 'Loaded step-ups, several times a day.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Out of breath',
        description: 'Especially past the third floor.',
      },
      {
        when: 'Week 4',
        title: 'Noticeably easier',
        description: 'Stair fitness improves fast.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You walk past the lift without registering it.',
        peak: true,
      },
    ],
    howToStart: [
      'Make it a rule, not a decision — rules do not need motivation.',
      'Under five floors, always. Build up from there.',
      'Take the stairs down too; that is where balance gets trained.',
    ],
    sources: [
      {
        authors: 'Boreham CAG, et al.',
        title:
          'Training effects of short bouts of stair climbing on cardiorespiratory fitness',
        journal: 'British Journal of Sports Medicine',
        year: '2005',
      },
    ],
  },

  'Floor Sitting Practice': {
    suggestedWhy: 'Getting down and up keeps strength, balance and mobility together, so you stay able to do it decades from now.',
    tagline: 'Get down to the floor and back up again.',
    lead: 'The ability to lower yourself to the floor and rise without support integrates strength, balance, mobility and coordination — which is why it predicts mortality better than most single fitness tests. Practising it maintains the whole bundle.',
    evidence:
      'Brito et al. (2014) scored the sitting-rising test in over 2,000 adults and found lower scores strongly predicted higher all-cause mortality over roughly six years of follow-up.',
    cadenceLabel: 'Daily · 10-25 min on the floor',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Predicts longevity',
        description: 'One of the better single functional markers.',
      },
      {
        icon: 'wave',
        title: 'Hip and ankle mobility',
        description: 'Chairs quietly remove both.',
      },
      {
        icon: 'target',
        title: 'Keeps independence',
        description: 'Getting off the floor unaided matters later.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Stiff and awkward',
        description: 'Most adults have lost this range.',
      },
      {
        when: 'Week 4',
        title: 'More positions available',
        description: 'Cross-legged and kneeling get comfortable.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The floor becomes a normal place to sit.',
        peak: true,
      },
    ],
    howToStart: [
      'Sit on the floor while doing something you already do — reading, TV.',
      'Change position whenever it gets uncomfortable. Variety is the point.',
      'Practise standing up without using your hands, slowly.',
    ],
    sources: [
      {
        authors: 'Brito LBB, et al.',
        title:
          'Ability to sit and rise from the floor as a predictor of all-cause mortality',
        journal: 'European Journal of Preventive Cardiology',
        year: '2014',
      },
    ],
  },

  'Ground Transitions': {
    suggestedWhy: 'Varied routes to the floor load hips, knees and shoulders through different ranges, so the option stays available.',
    tagline: 'Practise different ways up and down.',
    lead: 'Most adults have exactly one route to the floor and one route back. Training several patterns keeps hips, knees and shoulders loaded through varied ranges, which is what preserves the option later when a single stiff joint would otherwise remove it.',
    cadenceLabel: 'Daily · 5-10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Varied loading',
        description: 'Different patterns train different ranges.',
      },
      {
        icon: 'target',
        title: 'Functional capacity',
        description: 'Directly rehearses a real-world requirement.',
      },
      {
        icon: 'leaf',
        title: 'Coordination',
        description: 'Balance and sequencing, not just strength.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Clumsy',
        description: 'Unfamiliar patterns feel unfamiliar.',
      },
      {
        when: 'Week 4',
        title: 'Smoother and stronger',
        description: 'Transitions start feeling controlled.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Moving on the floor stops being a project.',
        peak: true,
      },
    ],
    howToStart: [
      'Learn three routes: cross-legged, kneeling, and a side sit.',
      'Five reps of each, slowly and controlled.',
      'Use a hand for support at first if you need it.',
    ],
  },

  'Single-Leg Balance Test': {
    suggestedWhy: 'Balance degrades quietly but responds fast to practice, so a weekly check catches decline and reduces falls.',
    tagline: 'Stand on one leg for ten seconds.',
    lead: 'Balance is a composite of vestibular, visual and proprioceptive function plus ankle and hip strength, so it degrades early and quietly. Testing it weekly gives you an honest, repeatable number — and practising it improves that number quickly.',
    evidence:
      'Araujo et al. (2022) found that middle-aged and older adults unable to complete a 10-second one-legged stance had substantially higher all-cause mortality over roughly seven years of follow-up.',
    cadenceLabel: 'Weekly test · daily practice',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A real risk marker',
        description: 'Failure predicts meaningfully higher mortality.',
      },
      {
        icon: 'wave',
        title: 'Fall prevention',
        description: 'Balance training reduces falls directly.',
      },
      {
        icon: 'target',
        title: 'Instant feedback',
        description: 'You either hold it or you do not.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Baseline set',
        description: 'Time both legs — asymmetry is informative.',
      },
      {
        when: 'Week 4',
        title: 'Noticeably steadier',
        description: 'Balance responds fast to practice.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You balance while brushing your teeth.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand near a wall. Arms crossed, eyes open, one foot up.',
      'Practise while brushing your teeth — the cue is already there.',
      'When ten seconds is easy, close your eyes. That is far harder.',
    ],
    sources: [
      {
        authors: 'Araujo CG, et al.',
        title:
          'Successful 10-second one-legged stance performance predicts survival in middle-aged and older individuals',
        journal: 'British Journal of Sports Medicine',
        year: '2022',
      },
    ],
  },

  'Resting Heart Rate Check': {
    suggestedWhy: 'Your resting pulse tracks fitness and recovery, so watching the trend shows training working and illness coming.',
    tagline: 'Track your resting heart rate weekly.',
    lead: 'Resting heart rate is a cheap window onto cardiovascular fitness and recovery, and elevated values predict worse outcomes independent of other risk factors. Its real value is as a trend line: your own number moving is more informative than any population range.',
    evidence:
      'Jensen et al. (2013) followed healthy men for decades and found elevated resting heart rate was an independent predictor of mortality, even after adjusting for fitness and other risk factors.',
    cadenceLabel: 'Weekly · 1 min, on waking',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A real risk signal',
        description: 'Independently predicts long-term outcomes.',
      },
      {
        icon: 'target',
        title: 'Tracks your training',
        description: 'Falling RHR is fitness you can see.',
      },
      {
        icon: 'wave',
        title: 'Early warning',
        description: 'Spikes often precede illness or overtraining.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Baseline',
        description: 'One reading means little; the series is the point.',
      },
      {
        when: 'Week 8',
        title: 'A visible trend',
        description: 'Training effects start showing in the number.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A standing weekly checkpoint.',
        peak: true,
      },
    ],
    howToStart: [
      'Measure before getting out of bed, same day each week.',
      'Count for 30 seconds and double it, or read it off a wearable.',
      'Watch your own trend. Persistent unexplained changes are worth a GP visit.',
    ],
    sources: [
      {
        authors: 'Jensen MT, et al.',
        title:
          'Elevated resting heart rate, physical fitness and all-cause mortality: a 16-year follow-up in the Copenhagen Male Study',
        journal: 'Heart',
        year: '2013',
      },
    ],
  },

  'Evening Environment Reset': {
    suggestedWhy: 'Setting tomorrow’s cues out tonight removes the decision, so the habits you want start without any willpower.',
    tagline: 'Two minutes setting tomorrow up.',
    lead: 'Habits are cued far more by environment than by intention. Laying out the kit the night before means tomorrow’s version of you does not have to decide anything — the cue is already in place and the friction is already gone.',
    cadenceLabel: 'Nightly · 2 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Cues already set',
        description: 'Tomorrow’s habits get a visible trigger.',
      },
      {
        icon: 'wave',
        title: 'Less morning friction',
        description: 'Nothing to find, nothing to decide.',
      },
      {
        icon: 'leaf',
        title: 'Closes the day',
        description: 'A defined end rather than a fade-out.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Next morning is easier',
        description: 'The payoff arrives immediately.',
      },
      {
        when: 'Week 2',
        title: 'Other habits stick better',
        description: 'This one quietly props up the rest.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The reset is how the evening ends.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick the one habit you most want tomorrow and set its kit out.',
      'Two minutes. A tidy desk and a filled water bottle is a complete version.',
      'Same point each evening so it has a slot.',
    ],
    sources: [
      {
        authors: 'Mazar A, Wood W',
        title: 'Illusory feelings, elusive habits',
        journal: 'Annual Review of Psychology',
        year: '2022',
      },
    ],
  },

  'Visual Cue Placement': {
    suggestedWhy: 'A cue you physically bump into does the remembering for you, so the habit keeps running after motivation stops.',
    tagline: 'Put the habit where you will see it.',
    lead: 'A cue you physically encounter beats a reminder you have to receive. Book on the pillow, bottle on the desk, shoes by the door — the environment does the remembering, which is why it keeps working after motivation stops.',
    evidence:
      'Stawarz et al. (2015) compared reminder-based and cue-based habit support and found event-based cues embedded in existing routines outperformed simple reminders for habit formation.',
    cadenceLabel: 'Weekly · 2 min setup',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Beats reminders',
        description: 'Physical cues outperform notifications.',
      },
      {
        icon: 'sparkle',
        title: 'Set once',
        description: 'The cue keeps working with no upkeep.',
      },
      {
        icon: 'leaf',
        title: 'No willpower',
        description: 'You do not have to remember anything.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Works right away',
        description: 'You see it, you do it.',
      },
      {
        when: 'Week 3',
        title: 'Cue blindness',
        description: 'Objects that never move stop registering — move them.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The behaviour outlives the need for the cue.',
        peak: true,
      },
    ],
    howToStart: [
      'One cue per habit, placed where you cannot miss it.',
      'Put it in the path of something you already do.',
      'Reposition it if you stop noticing it.',
    ],
    sources: [
      {
        authors: 'Stawarz K, Cox AL, Blandford A',
        title:
          'Beyond self-tracking and reminders: designing smartphone apps that support habit formation',
        journal: 'CHI Conference on Human Factors in Computing Systems',
        year: '2015',
      },
    ],
  },

  'Friction Addition': {
    suggestedWhy: 'Adding a step you must repeat every time taxes the unwanted habit, so it thins out without needing resolve.',
    tagline: 'Make the unwanted thing harder to do.',
    lead: 'Adding steps to a behaviour reduces it about as reliably as removing steps increases the one you want. Logging out, moving the charger, deleting the app — each is a small tax that has to be paid every single time.',
    cadenceLabel: 'Weekly · add one friction step',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Reduces the behaviour',
        description: 'Friction works without requiring resolve.',
      },
      {
        icon: 'wave',
        title: 'Creates a pause',
        description: 'The extra step is a chance to reconsider.',
      },
      {
        icon: 'leaf',
        title: 'Compounds',
        description: 'One step a week adds up quickly.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Mildly annoying',
        description: 'The annoyance is the mechanism working.',
      },
      {
        when: 'Week 3',
        title: 'Frequency drops',
        description: 'The behaviour becomes not worth the effort.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The habit has genuinely thinned out.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick one behaviour and add exactly one step this week.',
      'Log out after each use. Move the charger. Delete the app from your phone.',
      'Add another step next week rather than trying to fix it all at once.',
    ],
    sources: [
      {
        authors: 'Verplanken B, Roy D',
        title:
          'Empowering interventions to promote sustainable lifestyles: testing the habit discontinuity hypothesis',
        journal: 'Journal of Environmental Psychology',
        year: '2016',
      },
    ],
  },

  'Phone-Free First Hour': {
    suggestedWhy: 'Protecting the first hour keeps attention undefended by a feed, so the day opens on your terms, not reactively.',
    tagline: 'No screens for the first hour awake.',
    lead: 'Attention is most restorable and least defended right after waking. Handing that window to a feed sets a reactive tone that is hard to undo later — protecting it is less about discipline than about not starting from behind.',
    cadenceLabel: 'Daily · first 60 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Your agenda first',
        description: 'The day opens on your terms.',
      },
      {
        icon: 'wave',
        title: 'Calmer baseline',
        description: 'No inbox or news spike before you are awake.',
      },
      {
        icon: 'sparkle',
        title: 'Space for everything else',
        description: 'Every other morning habit becomes feasible.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-3',
        title: 'Genuinely twitchy',
        description: 'The reach is more automatic than you expect.',
      },
      {
        when: 'Week 2',
        title: 'The hour expands',
        description: 'It starts feeling like time you own.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Checking first thing loses its pull.',
        peak: true,
      },
    ],
    howToStart: [
      'Charge the phone in another room and buy a cheap alarm clock.',
      'Start at 20 minutes and extend weekly.',
      'Decide the night before what the hour is for.',
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

  'Caffeine Cutoff': {
    suggestedWhy: 'Caffeine clears slowly and costs you sleep depth, so an early cutoff means waking rested rather than only asleep.',
    tagline: 'Nothing caffeinated within six hours of bed.',
    lead: 'Caffeine blocks adenosine, the signal that makes you sleepy, and it clears slowly — half of a dose is still circulating five to six hours later. The damage happens to sleep depth, which is why you can fall asleep fine and still wake unrested.',
    evidence:
      'Drake et al. (2013) found 400 mg of caffeine taken six hours before bed still caused measurable sleep disruption, and participants largely failed to notice it.',
    cadenceLabel: 'Daily · nothing within 6 hours of bed',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Deeper sleep',
        description: 'Depth is what caffeine costs you, not onset.',
      },
      {
        icon: 'wave',
        title: 'Breaks the cycle',
        description: 'Better sleep lowers tomorrow’s caffeine need.',
      },
      {
        icon: 'target',
        title: 'Honest energy',
        description: 'You start reading real tiredness again.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'Flat afternoons',
        description: 'A real dip while you adjust.',
      },
      {
        when: 'Week 2',
        title: 'Better nights',
        description: 'Improved sleep starts flattening the dip.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Late caffeine stops occurring to you.',
        peak: true,
      },
    ],
    howToStart: [
      'Work backwards from bedtime and set a hard cutoff.',
      'Remember tea, chocolate and some painkillers also count.',
      'Move the cutoff 30 minutes earlier each week if it is currently late.',
    ],
    sources: [
      {
        authors: 'Drake C, et al.',
        title:
          'Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
        journal: 'Journal of Clinical Sleep Medicine',
        year: '2013',
      },
    ],
  },
};
