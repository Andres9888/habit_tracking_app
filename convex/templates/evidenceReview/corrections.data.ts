/**
 * Evidence corrections from the Aug 2026 catalog copy review.
 *
 * Every entry here removes a claim the cited source does not support:
 * a failed-replication finding, a learning-pyramid retention percentage, a
 * round number with no paper behind it, or a mechanism the literature does not
 * establish. The habit itself stays — only the claim changes.
 *
 * Authoring rules for this batch:
 *  1. Never state a percentage the cited paper does not report.
 *  2. Prefer "is associated with" over "causes" for observational findings.
 *  3. Never add a `scientificLink` that has not been opened and confirmed.
 *     Where an existing link points at the wrong paper it is cleared, not
 *     replaced with a guess.
 */

export type TemplateCorrection = {
  name: string;
  /** Why the old copy was wrong — reviewer note, never shown in the app. */
  reason: string;
  patch: {
    description?: string;
    scientificReference?: string;
    /** Empty string clears a link that pointed at the wrong record. */
    scientificLink?: string;
    tips?: string[];
  };
};

export const EVIDENCE_CORRECTIONS: TemplateCorrection[] = [
  {
    name: 'Posture Check',
    reason:
      'Cited Carney et al. (2010) power posing, which failed replication and was publicly disavowed by its first author. The habit is fine; the citation was not.',
    patch: {
      description:
        'Reset your posture a few times a day: shoulders back, screen at eye level, feet flat. Regular postural breaks reduce the neck and low-back pain that builds up over a desk-bound day.',
      scientificReference:
        'Waongenngarm et al. (2018) - Active break and postural shift intervention for neck and low-back pain in office workers',
      tips: [
        'Anchor the check to something you already do — a meeting ending, a page loading',
        'Raise the screen before you correct your neck; the setup does most of the work',
        'Two seconds of shoulders-back beats one long stretch at 5pm',
      ],
    },
  },
  {
    name: 'Weekly Teaching',
    reason:
      'Claimed "up to 90% retention (protege effect)". That number comes from the learning-pyramid myth, not from Chi et al. or any other study.',
    patch: {
      description:
        'Explain something you learned this week to another person. Expecting to teach changes how you organize material while learning it, and explaining out loud exposes the gaps that silent review hides.',
      scientificReference:
        'Nestojko et al. (2014) - Expecting to teach enhances learning and organization of knowledge',
    },
  },
  {
    name: 'Same-Day Review',
    reason:
      'Claimed retention rises "from 20% to 80%". Ebbinghaus reported no such figures — the numbers are folklore attached to his name.',
    patch: {
      description:
        'Revisit what you learned today before the day ends. Forgetting is steepest in the first 24 hours, so an early review costs a few minutes and buys back most of what would otherwise drain away.',
      scientificReference:
        'Ebbinghaus (1885) - Memory: A Contribution to Experimental Psychology (the forgetting curve)',
    },
  },
  {
    name: 'Handwritten Letters',
    reason:
      'Claimed handwritten notes have "7x more emotional impact" — an invented statistic. Attribution was also wrong: the undervaluing-gratitude finding is Kumar & Epley.',
    patch: {
      description:
        'Write and send one handwritten note or card. Senders consistently underestimate how much a note lands — the awkwardness you expect is smaller than the warmth the other person reports.',
      scientificReference:
        'Kumar & Epley (2018) - Undervaluing gratitude: expressers misunderstand the consequences of showing appreciation',
    },
  },
  {
    name: 'Movement Snacks',
    reason:
      '"Reduce mortality risk 4-5x" is not a coherent reading of Stamatakis et al., which reported a reduction in risk, not a multiple of it.',
    patch: {
      description:
        'Take three short bursts of vigorous effort during the day — stairs, a fast walk uphill, carrying something heavy. In accelerometer data, roughly 3 to 4 minutes of this daily is associated with substantially lower all-cause and cardiovascular mortality among people who do no formal exercise.',
      scientificReference:
        'Stamatakis et al. (2022) - Vigorous intermittent lifestyle physical activity and mortality, Nature Medicine',
    },
  },
  {
    name: 'Fresh Air Ventilation',
    reason:
      '"Improving cognitive function by up to 50%" misreads the COGfx results, which were condition-specific scores in a controlled office simulation.',
    patch: {
      description:
        'Open the windows for 10-15 minutes to clear built-up CO2. In a controlled office simulation, participants scored measurably higher on decision-making tasks under better-ventilated conditions than under typical indoor CO2 levels.',
      scientificReference:
        'Allen et al. (2016) - Associations of cognitive function scores with CO2 and ventilation, Environmental Health Perspectives',
    },
  },
  {
    name: 'Barefoot Grounding',
    reason:
      'Stated grounding "reduces inflammation" as fact. The earthing literature is small, largely single-group, and mostly published outside mainstream venues.',
    patch: {
      description:
        'Walk barefoot on grass, sand, or earth for 10-20 minutes. The reliable part is the sensory and outdoor exposure — time in green space is well evidenced for mood and stress. Claims that ground contact itself reduces inflammation rest on small studies and are not established.',
      scientificReference:
        'White et al. (2019) - Spending at least 120 minutes a week in nature is associated with good health and wellbeing',
      scientificLink: '',
      tips: [
        'Grass, sand, or bare earth all work — the surface matters less than being outside',
        'Pair it with a walk you already take rather than adding a new block of time',
        'Watch where you step; the habit is not worth a cut foot',
      ],
    },
  },
  {
    name: 'Epsom Salt Bath',
    reason:
      'Claimed magnesium absorption through skin. Proksch et al. concerns magnesium-rich water and skin barrier function, not systemic uptake for muscle relaxation or sleep.',
    patch: {
      description:
        'Soak in a warm bath for about 20 minutes in the evening. The warm-water immersion is what does the work: it drives the core-temperature drop that precedes sleep onset. Epsom salts make it pleasant, not medicinal.',
      scientificReference:
        'Haghayegh et al. (2019) - Before-bedtime passive body heating and sleep: a systematic review and meta-analysis',
    },
  },
  {
    name: 'Mouth Taping Sleep',
    reason:
      'Weak evidence plus a real hazard: taping the mouth shut in undiagnosed obstructive sleep apnea can obstruct the airway. Copy now leads with that.',
    patch: {
      description:
        'Encourage nasal breathing overnight. Do not tape your mouth if you snore heavily, wake gasping, or have not ruled out sleep apnea — get assessed first. Evidence for taping is thin and comes from small studies; nasal breathing practice during the day carries the same intent with none of the risk.',
      scientificReference:
        'Nestor (2020) - Breath: The New Science of a Lost Art (popular account; not primary literature)',
      tips: [
        'Rule out sleep apnea before trying this — snoring and daytime sleepiness are red flags',
        'Practice nasal breathing while awake first; if you cannot manage 10 minutes, do not tape',
        'Treat congestion at the source — a blocked nose is a reason to stop, not to push through',
      ],
    },
  },
  {
    name: '20-20-20 Eye Rule',
    reason:
      'Claimed it "prevents myopia progression". The AOA guidance covers digital eye strain only; no evidence links the rule to myopia control.',
    patch: {
      description:
        'Every 20 minutes, look at something about 20 feet away for 20 seconds. Letting your focus relax at distance eases the accommodation load behind digital eye strain — the dryness, ache, and blur that build over a screen-heavy day.',
      scientificReference:
        'American Optometric Association - Digital eye strain (computer vision syndrome) guidance',
    },
  },
  {
    name: 'Grayscale Phone Mode',
    reason:
      '"Reduces compulsive phone use by 30%" had no source. Alter (2017) is a trade book and reports no such figure.',
    patch: {
      description:
        'Switch your phone to grayscale. Stripping the color out of app icons and feeds removes part of what makes the screen worth glancing at — in a randomized trial, people using grayscale spent less time on their phones and reported less problematic use.',
      scientificReference:
        'Holte & Ferraro (2021) - True colors: grayscale display reduces smartphone screen time',
    },
  },
  {
    name: 'Purpose Statement Review',
    reason:
      '"Live 7+ years longer" overstates an observational hazard-ratio finding as a causal life-expectancy gain.',
    patch: {
      description:
        'Write down what you are for, and reread it weekly. Across a 14-year follow-up, adults reporting a stronger sense of purpose had lower mortality than those reporting less — an association, not a guarantee, but a durable one across age groups.',
      scientificReference:
        'Hill & Turiano (2014) - Purpose in life as a predictor of mortality across adulthood, Psychological Science',
    },
  },
  {
    name: 'Express Daily Appreciation',
    reason:
      'The "predicts stability with 90%+ accuracy" claim is a contested retrospective-fit statistic, not a prospective prediction.',
    patch: {
      description:
        "Tell your partner one specific thing you appreciated today. In Gottman's observational work, couples who stayed together showed a far higher ratio of positive to negative interactions than couples who did not — roughly five to one during conflict.",
      scientificReference:
        'Gottman (1999) - The Marriage Clinic: positive-to-negative interaction ratio',
    },
  },
  {
    name: 'Pre-Meal Vinegar',
    reason:
      '"Up to 34%" comes from one small crossover study. The stored scientificLink also pointed at an unrelated 1995 record.',
    patch: {
      description:
        'Dilute a tablespoon of vinegar in water and drink it before a carb-heavy meal. Small crossover studies report lower post-meal glucose and insulin responses; effect sizes vary a lot between people and the trials are short.',
      scientificReference:
        'Johnston et al. (2004) - Vinegar improves insulin sensitivity to a high-carbohydrate meal, Diabetes Care',
      scientificLink: '',
      tips: [
        'Always dilute — undiluted vinegar damages tooth enamel and the esophagus',
        'Take it shortly before the meal, not after',
        'Skip it if you have reflux or take medication affected by gastric emptying',
      ],
    },
  },
  {
    name: 'Always Take Stairs',
    reason:
      'Attributed "33% lower all-cause mortality" to Boreham et al., which was a short stair-climbing training trial measuring fitness and lipids, not mortality.',
    patch: {
      description:
        'Take the stairs instead of the elevator whenever the choice comes up. Short stair-climbing programs measurably raise cardiorespiratory fitness and improve cholesterol in previously sedentary people — and it is the rare training stimulus that costs no extra time.',
      scientificReference:
        'Boreham et al. (2005) - Training effects of short bouts of stair climbing on cardiorespiratory fitness and lipid profile',
    },
  },
  {
    name: 'Daily Flossing',
    reason:
      '"Reduces gum inflammation by 47%", sourced to a study reference that could not be verified. Replaced with the Cochrane review, which states the finding honestly.',
    patch: {
      description:
        'Clean between your teeth once a day with floss or an interdental brush. Brushing misses the surfaces between teeth entirely; adding interdental cleaning reduces gum bleeding and inflammation that brushing alone leaves behind.',
      scientificReference:
        'Sambunjak et al. (2011) - Flossing for the management of periodontal diseases and dental caries, Cochrane Database of Systematic Reviews',
      scientificLink: '',
    },
  },
  {
    name: 'Dopamine Reset',
    reason:
      '"Resets reward circuitry" is not something dopamine fasting has been shown to do. Sepah (2019) is a blog framing of a clinical technique, not a study.',
    patch: {
      description:
        'Take a deliberate break from your most stimulating inputs — feeds, games, short video. The point is not resetting your brain chemistry; it is noticing what you reach for automatically, and finding out what you actually want to do when the easy option is out of reach.',
      scientificReference:
        'Hunt et al. (2018) - No more FOMO: limiting social media decreases loneliness and depression',
      tips: [
        'Pick one input, not all of them — a total blackout usually lasts a day',
        'Decide in advance what replaces it, or the time refills itself',
        'Notice the reach for your phone; that noticing is most of the benefit',
      ],
    },
  },
];
