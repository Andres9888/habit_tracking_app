/**
 * Science drill-down copy — Health & Fitness: movement, strength, mobility.
 *
 * Citations use each template's OWN curated `scientificReference` from
 * templatesDataSeed rather than a substitute recalled from memory. `evidence`
 * is written only where the finding can be stated precisely; otherwise it is
 * omitted and the Science-backed badge stays hidden.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const HEALTH_MOVEMENT_ENRICHMENT: Record<string, ScienceEnrichment> = {
  '7-Minute Workout': {
    tagline: 'Twelve bodyweight exercises, thirty seconds each.',
    lead: 'High-intensity circuit training stacks resistance and cardio into one short block by cutting the rest. You get a real training stimulus in the time it takes to make coffee — which is the entire point, because the workout you actually do beats the one you plan.',
    evidence:
      'Jordan et al. (2013) set out a 12-exercise bodyweight circuit in ACSM’s Health & Fitness Journal, using high intensity and minimal rest to deliver both resistance and aerobic benefit in about seven minutes.',
    cadenceLabel: 'Daily · 7 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'No excuses left',
        description: 'Seven minutes removes the time objection entirely.',
      },
      {
        icon: 'wave',
        title: 'Strength and cardio',
        description: 'Minimal rest gets you both from one circuit.',
      },
      {
        icon: 'leaf',
        title: 'Nothing to buy',
        description: 'Bodyweight only, a mat’s worth of floor.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Harder than it sounds',
        description: 'Seven minutes at real intensity is not gentle.',
      },
      {
        when: 'Week 3',
        title: 'Reps get cleaner',
        description: 'Form and capacity improve together.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The circuit slots into your day without negotiation.',
        peak: true,
      },
    ],
    howToStart: [
      'Do two push-ups (or two squats). That is a legitimate first session.',
      '30 seconds work, 10 rest. Learn the order once, then stop thinking.',
      'Scale every move — knees down, half-depth. Intensity is relative to you.',
    ],
    sources: [
      {
        authors: 'Jordan K, Klika B',
        title: 'High-intensity circuit training using body weight',
        journal: 'ACSM’s Health & Fitness Journal',
        year: '2013',
        link: 'https://journals.lww.com/acsm-healthfitness/fulltext/2013/05000/high_intensity_circuit_training_using_body_weight_.5.aspx',
      },
    ],
  },

  'Strength Training': {
    tagline: 'Resistance work two or three times a week.',
    lead: 'Muscle is the tissue you lose fastest without a reason to keep it, and it carries your metabolic health, bone density and independence with it. Two sessions a week is the point where the decline stops being the default.',
    cadenceLabel: '2-3x weekly · 25-45 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Muscle and bone',
        description: 'Load is the only signal that builds either.',
      },
      {
        icon: 'leaf',
        title: 'Metabolic health',
        description: 'Muscle is where glucose gets used.',
      },
      {
        icon: 'wave',
        title: 'Everything else gets easier',
        description: 'Stairs, bags, floors — all downstream of strength.',
      },
    ],
    timeline: [
      {
        when: 'Week 2',
        title: 'Stronger already',
        description: 'Early gains are neural, before any size change.',
      },
      {
        when: 'Week 8',
        title: 'Visible change',
        description: 'Muscle takes roughly two months to show.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'Training days are fixed points in your week.',
        peak: true,
      },
    ],
    howToStart: [
      'Do 5 push-ups against the wall. Start where you actually are.',
      'Squat, hinge, push, pull. Four patterns cover the whole body.',
      'Add a little each week — progressive overload is the mechanism.',
    ],
    sources: [
      {
        authors: 'Westcott WL',
        title:
          'Resistance training is medicine: effects of strength training on health',
        journal: 'Current Sports Medicine Reports',
        year: '2012',
      },
    ],
  },

  'Stretching Routine': {
    tagline: 'Ten minutes to keep your range.',
    lead: 'Stretching reliably increases range of motion, and range you do not use is range you slowly lose. Worth knowing what it does not do: it is not a warm-up and the evidence for injury prevention is weaker than the folklore suggests.',
    cadenceLabel: 'Daily · 10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'More range of motion',
        description: 'The best-supported effect, and it is reliable.',
      },
      {
        icon: 'leaf',
        title: 'Less stiffness',
        description: 'Especially if you sit for a living.',
      },
      {
        icon: 'target',
        title: 'You find your limits',
        description: 'You learn which side is tighter, and why.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Tight and uneven',
        description: 'Asymmetry between sides is normal and informative.',
      },
      {
        when: 'Week 4',
        title: 'Real range gained',
        description: 'Flexibility responds quickly to daily work.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Your body starts asking for it.',
        peak: true,
      },
    ],
    howToStart: [
      'Reach for your toes once. That is a complete first session.',
      'Hold 30 seconds per position, breathing normally — no bouncing.',
      'Stretch warm, after movement. Do not stretch hard before lifting.',
    ],
    sources: [
      {
        authors: 'Behm DG, et al.',
        title:
          'Acute effects of muscle stretching on physical performance, range of motion, and injury incidence',
        journal: 'Applied Physiology, Nutrition, and Metabolism',
        year: '2016',
      },
    ],
  },

  'Daily Yoga Practice': {
    tagline: 'Twenty minutes of movement and breath together.',
    lead: 'Yoga is unusual in doing three jobs at once — mobility, load-bearing strength, and attention training — which is why it shows up in both the physical and the mental-health literature. The breath component is what separates it from stretching.',
    cadenceLabel: 'Daily · 20-30 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Mobility plus strength',
        description: 'Holding positions is load, not just stretch.',
      },
      {
        icon: 'leaf',
        title: 'Studied for mood',
        description: 'Trialled as an adjunct for anxiety and low mood.',
      },
      {
        icon: 'target',
        title: 'Attention practice',
        description: 'Breath-linked movement trains focus.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Wobbly',
        description: 'Balance and breath both take practice.',
      },
      {
        when: 'Week 4',
        title: 'Noticeably easier',
        description: 'Positions that felt impossible become routine.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'The mat is part of the day.',
        peak: true,
      },
    ],
    howToStart: [
      'Hold downward dog for one breath. That counts.',
      'Follow a 15-minute beginner video rather than improvising.',
      'Breathe with the movement — that is the practice, not the shapes.',
    ],
    sources: [
      {
        authors: 'Cramer H, et al.',
        title: 'Yoga for anxiety and depression: a systematic review',
        journal: 'Journal of Clinical Psychiatry',
        year: '2014',
      },
    ],
  },

  'Standing Every Hour': {
    tagline: 'Get up and move for two minutes each hour.',
    lead: 'Prolonged sitting carries risk that a single daily workout does not fully offset — the damage is in the uninterrupted hours, not the total. Breaking them up is a separate intervention from exercising, and you need both.',
    evidence:
      'Dunstan et al. (2012) review evidence that prolonged sedentary time is associated with adverse cardiometabolic outcomes independently of how much moderate-to-vigorous exercise a person does.',
    cadenceLabel: 'Hourly · 2-3 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Independent of exercise',
        description: 'A workout does not cancel eight unbroken hours.',
      },
      {
        icon: 'wave',
        title: 'Less stiffness',
        description: 'Hips and lower back notice first.',
      },
      {
        icon: 'target',
        title: 'Sharper afternoons',
        description: 'Movement breaks restore attention too.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy to forget',
        description: 'Set a recurring alarm — memory will not do it.',
      },
      {
        when: 'Week 2',
        title: 'Body starts prompting',
        description: 'You notice the hour before the alarm does.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You stand without being told.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand up and stretch for 10 seconds. That is the whole first version.',
      'Hourly alarm. Walk to fill a glass of water so there is a reason.',
      'Two minutes beats zero — do not wait for a proper break.',
    ],
    sources: [
      {
        authors: 'Dunstan DW, Howard B, Healy GN, Owen N',
        title:
          'Too much sitting — a health hazard',
        journal: 'Diabetes Research and Clinical Practice',
        year: '2012',
      },
    ],
  },

  'VO2 Max Training': {
    tagline: 'Hard intervals, once or twice a week.',
    lead: 'VO2 max — the ceiling on how much oxygen you can use — is among the strongest single predictors of how long you live. It is also trainable at any age, and the training that moves it is short, hard, and unpleasant by design.',
    cadenceLabel: '1-2x weekly · 20-30 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A top-tier longevity marker',
        description: 'Fitness tracks with mortality more strongly than most risks.',
      },
      {
        icon: 'target',
        title: 'Trainable at any age',
        description: 'The ceiling moves with the right stimulus.',
      },
      {
        icon: 'wave',
        title: 'Time-efficient',
        description: 'Intervals do in 20 minutes what an hour easy will not.',
      },
    ],
    timeline: [
      {
        when: 'Session 1',
        title: 'Genuinely hard',
        description: 'This is the one that should feel unpleasant.',
      },
      {
        when: 'Week 6',
        title: 'Measurably fitter',
        description: 'Pace at the same heart rate improves clearly.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'The hard session has a fixed slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Sprint up one flight of stairs. Start there, not with a track session.',
      'Build to 4 × 4 minutes hard with 3 minutes easy between.',
      'Build an easy aerobic base first, and see a doctor before hard intervals if you have any cardiac risk.',
    ],
    sources: [
      {
        authors: 'Attia P',
        title: 'Outlive: The Science and Art of Longevity',
        journal: 'Harmony Books',
        year: '2023',
      },
    ],
  },

  'Balance Training': {
    tagline: 'Practise standing on one leg.',
    lead: 'Balance quietly degrades from midlife and nobody notices until a fall makes it obvious. It is also one of the most trainable capacities there is — exercise programmes that include balance work measurably reduce falls.',
    evidence:
      'Sherrington et al. (2019), in a Cochrane review, found exercise programmes reduce the rate of falls in older people living in the community, with balance and functional training the most effective component.',
    cadenceLabel: 'Daily · 5-10 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Fewer falls',
        description: 'One of the best-evidenced preventive interventions.',
      },
      {
        icon: 'wave',
        title: 'Responds fast',
        description: 'Balance improves within weeks of practice.',
      },
      {
        icon: 'target',
        title: 'No equipment',
        description: 'A floor and a wall to touch is enough.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Wobblier than expected',
        description: 'Most people overestimate their balance.',
      },
      {
        when: 'Week 4',
        title: 'Visibly steadier',
        description: 'Hold times climb quickly.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You balance while brushing your teeth.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand on one foot for 10 seconds. Wall within reach.',
      'Add heel-to-toe walking, then try it with eyes closed — far harder.',
      'Attach it to teeth-brushing so the cue already exists.',
    ],
    sources: [
      {
        authors: 'Sherrington C, et al.',
        title:
          'Exercise for preventing falls in older people living in the community',
        journal: 'Cochrane Database of Systematic Reviews',
        year: '2019',
      },
    ],
  },

  'Grip Strength Training': {
    tagline: 'Hang, carry, squeeze.',
    lead: 'Grip strength is a proxy for whole-body strength and neuromuscular health, which is why it predicts cardiovascular events and mortality across populations. Training it is unusually simple: hold heavy things for longer.',
    evidence:
      'Leong et al. (2015), using PURE study data across 17 countries, found grip strength was a stronger predictor of all-cause and cardiovascular mortality than systolic blood pressure.',
    cadenceLabel: '3x weekly · 5 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'A strong risk marker',
        description: 'Outperformed blood pressure as a predictor in PURE.',
      },
      {
        icon: 'target',
        title: 'Carries over',
        description: 'Grip limits nearly every pulling exercise.',
      },
      {
        icon: 'wave',
        title: 'Simple to train',
        description: 'Hang, carry, repeat.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Seconds, not minutes',
        description: 'Most people cannot hang for long. Fine.',
      },
      {
        when: 'Week 6',
        title: 'Hold times double',
        description: 'Grip responds fast to direct work.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You hang whenever you pass a bar.',
        peak: true,
      },
    ],
    howToStart: [
      'Hang from a bar for 5 seconds. That is session one.',
      'Add farmer carries — walk with heavy bags, upright posture.',
      'Build gradually. Tendons adapt slower than muscle.',
    ],
    sources: [
      {
        authors: 'Leong DP, et al.',
        title:
          'Prognostic value of grip strength: findings from the Prospective Urban Rural Epidemiology (PURE) study',
        journal: 'The Lancet',
        year: '2015',
      },
    ],
  },

  'Daily Hanging': {
    tagline: 'Hang from a bar for thirty seconds.',
    lead: 'Hanging puts your shoulders through a range that modern life never asks for, decompresses the spine, and trains grip at the same time. Three benefits from one position you can hold in a doorway.',
    cadenceLabel: 'Daily · 30-60 sec',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Shoulder range',
        description: 'Overhead position most adults have lost.',
      },
      {
        icon: 'leaf',
        title: 'Spinal decompression',
        description: 'The opposite of a day spent seated.',
      },
      {
        icon: 'target',
        title: 'Grip for free',
        description: 'A mortality-linked marker, trained incidentally.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Hands give out first',
        description: 'Grip fails long before shoulders do.',
      },
      {
        when: 'Week 4',
        title: 'A minute is easy',
        description: 'Hold times climb quickly with daily practice.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You hang whenever you walk past the bar.',
        peak: true,
      },
    ],
    howToStart: [
      'Hang from a doorframe for 5 seconds to begin.',
      'Keep feet touching the floor to take weight off if needed.',
      'Stop if you feel shoulder pain rather than stretch.',
    ],
    sources: [
      {
        authors: 'McGill S',
        title: 'Back Mechanic',
        journal: 'Backfitpro',
        year: '2016',
      },
    ],
  },

  'Exercise Snacks (Stair Climbs)': {
    tagline: 'Three short stair bursts through the day.',
    lead: 'Very short bursts of vigorous effort, scattered across a day, improve fitness without any of the scheduling overhead of a workout. Stairs are ideal because the intensity is built in and you were walking past them anyway.',
    evidence:
      'Jenkins et al. (2019) had sedentary adults do brief vigorous stair-climbing "snacks" three times a day and found measurable improvements in cardiorespiratory fitness.',
    cadenceLabel: 'Daily · 3 × ~1 min',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Real fitness gains',
        description: 'Measured from bursts, not sessions.',
      },
      {
        icon: 'sparkle',
        title: 'No scheduling',
        description: 'Fits inside a day you already have.',
      },
      {
        icon: 'leaf',
        title: 'No kit, no change of clothes',
        description: 'Which is why it survives busy weeks.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Surprisingly breathless',
        description: 'One vigorous flight is more than it sounds.',
      },
      {
        when: 'Week 4',
        title: 'Same stairs, less effort',
        description: 'Recovery between bursts shortens.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The stairwell becomes the default.',
        peak: true,
      },
    ],
    howToStart: [
      'Climb one flight of stairs briskly. That is snack one.',
      'Three times a day, spaced out — vigorous, not casual.',
      'Hold the handrail and slow down if you feel unsteady.',
    ],
    sources: [
      {
        authors: 'Jenkins EM, et al.',
        title:
          'Do stair climbing exercise "snacks" improve cardiorespiratory fitness?',
        journal: 'Applied Physiology, Nutrition, and Metabolism',
        year: '2019',
      },
    ],
  },

  'Movement Snacks': {
    tagline: 'Brief hard bursts, several times a day.',
    lead: 'You do not need a gym to get the mortality benefit of vigorous activity — short bouts embedded in ordinary life appear to carry much of it. Carrying shopping fast, taking stairs hard, a sharp walk uphill all count.',
    evidence:
      'Stamatakis et al. (2022) analysed accelerometer data and found that short bouts of vigorous intermittent lifestyle physical activity were associated with substantially lower mortality risk in people who did no formal exercise.',
    cadenceLabel: 'Daily · 3-5 bursts of 1-2 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Mortality signal',
        description: 'Measured in people doing no formal exercise at all.',
      },
      {
        icon: 'sparkle',
        title: 'Uses your existing day',
        description: 'No session to schedule or skip.',
      },
      {
        icon: 'target',
        title: 'Intensity is the ingredient',
        description: 'Brief and hard beats long and casual here.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels like nothing',
        description: 'It is over before it feels like exercise.',
      },
      {
        when: 'Week 3',
        title: 'Bursts get harder',
        description: 'You can push more in the same minute.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'You take the vigorous option by default.',
        peak: true,
      },
    ],
    howToStart: [
      'Pick a trigger: stairs, the walk from the car, carrying shopping.',
      'One to two minutes, hard enough to breathe heavily.',
      'Three a day. Ease in if you are unused to vigorous effort.',
    ],
    sources: [
      {
        authors: 'Stamatakis E, et al.',
        title:
          'Association of wearable device-measured vigorous intermittent lifestyle physical activity with mortality',
        journal: 'Nature Medicine',
        year: '2022',
      },
    ],
  },

  'Bone-Strengthening Exercise': {
    tagline: 'Weight-bearing work, three or four times a week.',
    lead: 'Bone responds to load the way muscle does — it strengthens where it is stressed and thins where it is not. Weight-bearing and resistance work is the only lifestyle lever that meaningfully signals bone to hold its density.',
    cadenceLabel: '3-4x weekly · 30 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Density preserved',
        description: 'Load is the signal bone actually responds to.',
      },
      {
        icon: 'target',
        title: 'Fracture risk down',
        description: 'Stronger bone plus better balance compound.',
      },
      {
        icon: 'wave',
        title: 'Muscle comes along',
        description: 'The same work trains both tissues.',
      },
    ],
    timeline: [
      {
        when: 'Week 2',
        title: 'Muscles first',
        description: 'Strength responds long before bone does.',
      },
      {
        when: 'Month 6',
        title: 'Bone changes slowly',
        description: 'Density shifts on a timescale of many months.',
      },
      {
        when: '~60 days',
        title: 'Automatic',
        description: 'The sessions hold their place in the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Do 5 bodyweight squats. That is a real start.',
      'Weight-bearing means feet loaded — walking, jogging, stairs, lifting.',
      'Swimming and cycling are excellent, but do little for bone.',
    ],
    sources: [
      {
        authors: 'National Osteoporosis Foundation',
        title: 'Weight-bearing exercise guidelines for bone health',
        journal: 'Bone Health & Osteoporosis Foundation',
        year: '2022',
      },
    ],
  },

  'Joint Mobility Routine': {
    tagline: 'Take every joint through its range.',
    lead: 'Joints keep the range you regularly ask for and quietly surrender the rest. A few minutes of deliberate circles and rotations is maintenance — cheap now, expensive to recover once it is gone.',
    cadenceLabel: 'Daily · 5-10 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Range maintained',
        description: 'Use it or lose it, quite literally.',
      },
      {
        icon: 'leaf',
        title: 'Less stiffness',
        description: 'Especially wrists, ankles and neck.',
      },
      {
        icon: 'target',
        title: 'Injury resilience',
        description: 'Range you control is range you can catch yourself in.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Clicks and creaks',
        description: 'Normal, and usually not a problem.',
      },
      {
        when: 'Week 3',
        title: 'Smoother movement',
        description: 'Ranges open up and stay open.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of getting going in the morning.',
        peak: true,
      },
    ],
    howToStart: [
      'Do five wrist and ankle circles. Session complete.',
      'Work top to bottom: neck, shoulders, spine, hips, knees, ankles.',
      'Slow, controlled circles. No forcing, no pain.',
    ],
    sources: [
      {
        authors: 'American College of Sports Medicine',
        title: 'ACSM guidelines for flexibility and neuromotor exercise',
        journal: 'ACSM Position Stand',
        year: '2011',
      },
    ],
  },

  'Isometric Wall Sit': {
    tagline: 'Hold a wall sit a few times a week.',
    lead: 'Isometric holds — sustained contraction without movement — appear unusually effective at lowering resting blood pressure, more so than the same time spent on cardio in some analyses. Two minutes of holding is the whole exercise.',
    evidence:
      'Carlson et al. (2014) meta-analysed isometric resistance training trials and found meaningful reductions in resting systolic and diastolic blood pressure.',
    cadenceLabel: '3x weekly · 4 × 2 min holds',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Blood pressure',
        description: 'Isometrics perform well in the meta-analyses.',
      },
      {
        icon: 'target',
        title: 'Leg endurance',
        description: 'Quads adapt fast to sustained holds.',
      },
      {
        icon: 'sparkle',
        title: 'A wall is the equipment',
        description: 'Doable anywhere, no noise, no kit.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Burns quickly',
        description: 'Thirty seconds is plenty at first.',
      },
      {
        when: 'Week 4',
        title: 'Two minutes holds',
        description: 'Endurance improves rapidly.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Three sessions a week, unremarkable.',
        peak: true,
      },
    ],
    howToStart: [
      'Hold a wall sit for 10 seconds. Build from there.',
      'Work toward 4 holds of 2 minutes with 2 minutes rest.',
      'Breathe throughout — do not hold your breath. Check with a clinician first if your blood pressure is high or you have cardiac issues.',
    ],
    sources: [
      {
        authors: 'Carlson DJ, et al.',
        title:
          'Isometric exercise training for blood pressure management: a systematic review and meta-analysis',
        journal: 'Mayo Clinic Proceedings',
        year: '2014',
      },
    ],
  },

  '5-Minute Mobility Snack': {
    tagline: 'Five minutes of hips, shoulders and ankles.',
    lead: 'A short mobility break does two jobs at once — it restores range that sitting compresses, and it interrupts the prolonged stillness that carries its own metabolic cost. Both benefits come from standing up and moving.',
    cadenceLabel: 'Daily · 5 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Undoes desk posture',
        description: 'Hips and shoulders take the worst of sitting.',
      },
      {
        icon: 'leaf',
        title: 'Breaks up stillness',
        description: 'Interrupting sitting matters on its own.',
      },
      {
        icon: 'target',
        title: 'Fits in a work day',
        description: 'Five minutes needs no change of clothes.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediately better',
        description: 'The relief from moving is same-minute.',
      },
      {
        when: 'Week 3',
        title: 'Less accumulated stiffness',
        description: 'You stop ending the day seized up.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A standing break in the afternoon.',
        peak: true,
      },
    ],
    howToStart: [
      'Roll your shoulders and ankles for 30 seconds. Done.',
      'Add hip circles and a standing spinal twist.',
      'Set it for the afternoon dip — you get two benefits at once.',
    ],
    sources: [
      {
        authors: 'Dempsey PC, Owen N, Yates TE, Kingwell BA, Dunstan DW',
        title:
          'Sitting less and moving more: improved glycaemic control for type 2 diabetes prevention and management',
        journal: 'Current Diabetes Reports',
        year: '2016',
      },
    ],
  },

  'Posture Check': {
    tagline: 'Reset your posture a few times a day.',
    lead: 'The useful claim is mechanical: sustained slumping loads your neck and lower back and restricts breathing depth, and a periodic reset interrupts that. Treat the confidence and hormone claims about posture with caution — that literature has not replicated well.',
    cadenceLabel: 'Daily · 3 checks',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less neck and back load',
        description: 'The mechanical case is the solid one.',
      },
      {
        icon: 'leaf',
        title: 'Fuller breathing',
        description: 'Slumping physically restricts the diaphragm.',
      },
      {
        icon: 'target',
        title: 'Builds awareness',
        description: 'You start noticing the slump yourself.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Constantly slumped',
        description: 'Checking reveals how often it happens.',
      },
      {
        when: 'Week 3',
        title: 'Self-correcting',
        description: 'You catch it without a prompt.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Upright becomes the resting default.',
        peak: true,
      },
    ],
    howToStart: [
      'Roll your shoulders back once. That is a check.',
      'Three prompts a day beat one long effort at sitting up straight.',
      'Fix the desk height too — posture fights furniture and loses.',
    ],
  },

  'Nasal Breathing': {
    tagline: 'Breathe through your nose by default.',
    lead: 'Nasal breathing filters and humidifies air and releases nitric oxide, which supports oxygen uptake in the lungs. Switching your default is mostly a matter of noticing — most mouth breathing is habit rather than obstruction.',
    cadenceLabel: 'Daily · ongoing',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Nitric oxide',
        description: 'Released in the nasal passages, not the mouth.',
      },
      {
        icon: 'leaf',
        title: 'Filtered, humidified air',
        description: 'Your nose is doing a job your mouth cannot.',
      },
      {
        icon: 'target',
        title: 'Slower breathing',
        description: 'Nasal breathing naturally reduces volume and rate.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feels restrictive',
        description: 'Normal if you have been mouth breathing.',
      },
      {
        when: 'Week 3',
        title: 'Becomes the default',
        description: 'Including during light exercise.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Mouth breathing starts to feel wrong.',
        peak: true,
      },
    ],
    howToStart: [
      'Take three breaths through your nose. That is the start.',
      'Notice it at rest first, then during easy walking.',
      'If your nose is genuinely blocked most of the time, see a clinician rather than forcing it.',
    ],
    sources: [
      {
        authors: 'Nestor J',
        title: 'Breath: The New Science of a Lost Art',
        journal: 'Riverhead Books',
        year: '2020',
      },
    ],
  },

  '20-20-20 Eye Rule': {
    tagline: 'Every twenty minutes, look twenty feet away.',
    lead: 'Sustained near-focus keeps the eye’s focusing muscle contracted and cuts your blink rate roughly in half, which is what produces the ache and dryness of a screen day. Looking far away releases both.',
    cadenceLabel: 'Every 20 min · 20 sec',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Less eye strain',
        description: 'Releases the focusing muscle periodically.',
      },
      {
        icon: 'leaf',
        title: 'Less dryness',
        description: 'Looking up resets your blink rate.',
      },
      {
        icon: 'target',
        title: 'Free and instant',
        description: 'Twenty seconds, no equipment.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Immediate relief',
        description: 'Noticeable within the first few breaks.',
      },
      {
        when: 'Week 2',
        title: 'Fewer end-of-day headaches',
        description: 'Cumulative strain drops.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You look up without a timer.',
        peak: true,
      },
    ],
    howToStart: [
      'Look out the window for 20 seconds. That is the whole habit.',
      'Twenty feet is roughly "across the room or further".',
      'Pair it with your hourly stand-up so one prompt covers both.',
    ],
    sources: [
      {
        authors: 'American Optometric Association',
        title: 'Computer vision syndrome: digital eye strain',
        journal: 'AOA Clinical Guidance',
        year: '2020',
      },
    ],
  },

  'Heat Therapy Bath': {
    tagline: 'A hot bath, fifteen to twenty minutes.',
    lead: 'Passive heat raises heart rate and dilates blood vessels in a way that partially mimics moderate exercise, and repeated exposure is associated with cardiovascular benefit. It is not a replacement for training — it is a supplement that happens to be pleasant.',
    evidence:
      'Laukkanen et al. (2018) review evidence that repeated passive heat exposure such as sauna and hot-water immersion is associated with cardiovascular benefits, including improved vascular function.',
    cadenceLabel: '3-4x weekly · 15-20 min',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Vascular function',
        description: 'Heat dilates vessels and trains that response.',
      },
      {
        icon: 'wave',
        title: 'Muscle relaxation',
        description: 'Tension drops within minutes.',
      },
      {
        icon: 'moon',
        title: 'Better sleep',
        description: 'The post-bath cooldown aids sleep onset.',
      },
    ],
    timeline: [
      {
        when: 'First bath',
        title: 'Relaxed and sleepy',
        description: 'The immediate effects are unmistakable.',
      },
      {
        when: 'Week 4',
        title: 'Heat tolerance up',
        description: 'Sessions get easier to sustain.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'A fixed part of the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Run a hot bath and dip your feet in. Start smaller than a full soak.',
      'Around 40°C for 15-20 minutes. Hydrate before and after.',
      'Stand up slowly. Skip it if pregnant or if you have cardiac issues — ask a clinician.',
    ],
    sources: [
      {
        authors: 'Laukkanen JA, Laukkanen T, Kunutsor SK',
        title:
          'Cardiovascular and other health benefits of sauna bathing: a review of the evidence',
        journal: 'Mayo Clinic Proceedings',
        year: '2018',
      },
    ],
  },

  'Barefoot Grounding': {
    tagline: 'Time barefoot on grass or earth.',
    lead: 'Be straight about this one: the "earthing" theory — that contact with the ground transfers electrons and lowers inflammation — is not well supported, and the studies behind it are small and weak. What does hold up is that walking barefoot on uneven ground works your feet and ankles, and that time outdoors improves mood.',
    cadenceLabel: 'Daily · 10-20 min',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Foot and ankle work',
        description: 'Uneven ground trains what shoes do for you.',
      },
      {
        icon: 'leaf',
        title: 'Time outdoors',
        description: 'The best-supported benefit here, comfortably.',
      },
      {
        icon: 'target',
        title: 'Sensory attention',
        description: 'Hard to be distracted while barefoot on grass.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Feet feel everything',
        description: 'Unfamiliar and mildly tender.',
      },
      {
        when: 'Week 3',
        title: 'Stronger feet',
        description: 'Arches and ankles adapt to varied ground.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Shoes come off when you get outside.',
        peak: true,
      },
    ],
    howToStart: [
      'Stand barefoot on grass for 30 seconds.',
      'Build up slowly — feet that lived in shoes need time.',
      'Check the ground for glass and sharps. Avoid if you have diabetic neuropathy or reduced foot sensation.',
    ],
  },

  'Hydration Tracking': {
    tagline: 'Log what you actually drink.',
    lead: 'Even mild dehydration measurably degrades concentration and mood, and most people underestimate their intake badly. Tracking is not about hitting a magic number — it is about discovering your real baseline, which is usually lower than you think.',
    cadenceLabel: 'Daily · log through the day',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Clearer thinking',
        description: 'Mild dehydration is a real cognitive drag.',
      },
      {
        icon: 'target',
        title: 'You learn your baseline',
        description: 'Estimates are consistently too high.',
      },
      {
        icon: 'leaf',
        title: 'Fewer false hungers',
        description: 'Thirst is often misread as appetite.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Sobering',
        description: 'The first honest count usually surprises people.',
      },
      {
        when: 'Week 2',
        title: 'Intake rises on its own',
        description: 'Measuring changes the behaviour.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You drink enough without counting.',
        peak: true,
      },
    ],
    howToStart: [
      'Log one glass of water. That is the habit started.',
      'Use one bottle you know the volume of — counting refills is easier.',
      'Aim for pale-straw urine rather than a fixed glass count. Thirst is a decent guide.',
    ],
    sources: [
      {
        authors: 'Riebl SK, Davy BM',
        title: 'The hydration equation: update on water balance and cognitive performance',
        journal: 'ACSM’s Health & Fitness Journal',
        year: '2013',
      },
    ],
  },

  'Pre-Meal Water': {
    tagline: 'A glass of water before you eat.',
    lead: 'Water before a meal occupies stomach volume and blunts intake slightly — a small effect, reliably measured. It also catches the thirst that people routinely misread as hunger, which is arguably the more useful part.',
    evidence:
      'Davy et al. (2008) found that drinking 500 ml of water before a breakfast meal reduced energy intake at that meal in older adults.',
    cadenceLabel: 'Before every meal · 1 glass',
    benefitDetails: [
      {
        icon: 'target',
        title: 'Slightly smaller meals',
        description: 'A small, consistently measured reduction.',
      },
      {
        icon: 'wave',
        title: 'Hydration by stealth',
        description: 'Three meals is three guaranteed glasses.',
      },
      {
        icon: 'leaf',
        title: 'Separates thirst from hunger',
        description: 'They are easy to confuse.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy',
        description: 'One of the lowest-friction habits available.',
      },
      {
        when: 'Week 2',
        title: 'Meals feel different',
        description: 'You notice fullness arriving sooner.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Water comes before the fork.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one sip of water before your next bite.',
      'Build to a full glass about 20 minutes before eating.',
      'Keep a glass where you eat so the cue is already there.',
    ],
    sources: [
      {
        authors: 'Davy BM, Dennis EA, Dengo AL, Wilson KL, Davy KP',
        title:
          'Water consumption reduces energy intake at a breakfast meal in obese older adults',
        journal: 'Journal of the American Dietetic Association',
        year: '2008',
      },
    ],
  },
};
