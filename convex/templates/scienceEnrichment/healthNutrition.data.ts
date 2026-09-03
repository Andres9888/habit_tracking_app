/**
 * Science drill-down copy — Health & Fitness: food, diet, supplements.
 *
 * Citations use each template's OWN curated `scientificReference` from
 * templatesDataSeed. Supplement and "biohack" entries state plainly where the
 * effect is small or the evidence thin, and carry the clinical caveat in
 * `howToStart` rather than in small print.
 *
 * Authoring rules: see ../scienceEnrichment.data.ts
 */

import type { ScienceEnrichment } from '../types';

export const HEALTH_NUTRITION_ENRICHMENT: Record<string, ScienceEnrichment> = {
  'No Added Sugar': {
    suggestedWhy: 'Sugar without fibre spikes and drops fast, so cutting it steadies your energy and lowers cardiovascular risk.',
    tagline: 'Cut the sugar that was added, not the sugar in fruit.',
    lead: 'Added sugar arrives without fibre, so it hits fast and leaves you hungrier than the calories justify. Cutting it is one of the few dietary changes where you can feel the difference in energy stability within a week.',
    evidence:
      'Yang et al. (2014) followed US adults and found higher added-sugar intake was associated with significantly increased cardiovascular disease mortality.',
    cadenceLabel: 'Daily · ongoing',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Steadier energy',
        description: 'Fewer spikes means fewer crashes.',
      },
      {
        icon: 'leaf',
        title: 'Cardiovascular risk',
        description: 'Added sugar tracks with worse outcomes.',
      },
      {
        icon: 'target',
        title: 'Taste recalibrates',
        description: 'Fruit starts tasting sweet again.',
      },
    ],
    timeline: [
      {
        when: 'Days 1-4',
        title: 'Cravings',
        description: 'The first few days are genuinely the hardest.',
      },
      {
        when: 'Week 2',
        title: 'Palate resets',
        description: 'Sweet things start tasting too sweet.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You stop noticing the absence.',
        peak: true,
      },
    ],
    howToStart: [
      'Skip the sugar in your next drink. Drinks are the biggest single source.',
      'Read labels on sauces, bread and yoghurt — that is where it hides.',
      'Whole fruit is not the target. This is about added sugar.',
    ],
    sources: [
      {
        authors: 'Yang Q, et al.',
        title:
          'Added sugar intake and cardiovascular diseases mortality among US adults',
        journal: 'JAMA Internal Medicine',
        year: '2014',
      },
    ],
  },

  'Mediterranean Plate': {
    suggestedWhy: 'A mostly-plant plate with olive oil is the eating pattern with the strongest trial evidence for fewer heart events.',
    tagline: 'Vegetables, legumes, whole grains, olive oil.',
    lead: 'This is the dietary pattern with the strongest randomised-trial evidence behind it, rather than another elimination diet. It works as a shape for a plate — most of it plants, fat from olive oil and nuts — which makes it durable in a way rules-based diets are not.',
    evidence:
      'Estruch et al. (2013), in the PREDIMED randomised trial, found a Mediterranean diet supplemented with olive oil or nuts reduced major cardiovascular events compared with a control diet.',
    cadenceLabel: 'Most meals',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Trial-level evidence',
        description: 'Randomised, not just observational.',
      },
      {
        icon: 'wave',
        title: 'No deprivation',
        description: 'A pattern to follow, not a list of bans.',
      },
      {
        icon: 'target',
        title: 'Sustainable',
        description: 'It is a cuisine, which is why people keep it up.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Shopping changes',
        description: 'The habit is mostly a basket habit.',
      },
      {
        when: 'Week 4',
        title: 'Default meals shift',
        description: 'You stop planning it and start cooking it.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'It is just how you eat now.',
        peak: true,
      },
    ],
    howToStart: [
      'Drizzle olive oil over your next meal. Start with the fat swap.',
      'Half the plate vegetables, a quarter whole grains or legumes.',
      'Learn three meals well rather than trying to change everything.',
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

  'High Fiber Diet': {
    suggestedWhy: 'Fibre feeds gut bacteria and slows glucose absorption, so meals hold you longer and long-term risk falls.',
    tagline: 'Twenty-five to thirty-five grams a day.',
    lead: 'Fibre feeds your gut bacteria, slows glucose absorption, and is the single nutrient most people are most short of. Higher intake is consistently associated with lower mortality across large cohorts.',
    cadenceLabel: 'Daily · 25-35g',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Gut bacteria fed',
        description: 'Fibre is what your microbiome actually eats.',
      },
      {
        icon: 'wave',
        title: 'Flatter glucose',
        description: 'Fibre slows absorption of everything with it.',
      },
      {
        icon: 'target',
        title: 'Longer satiety',
        description: 'High-fibre meals hold you for hours.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Digestive adjustment',
        description: 'Increase gradually or you will regret it.',
      },
      {
        when: 'Week 3',
        title: 'Regularity and fullness',
        description: 'Both improve noticeably.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'High-fibre choices become the default.',
        peak: true,
      },
    ],
    howToStart: [
      'Add one piece of fruit to your next meal.',
      'Beans, oats, and leaving skins on do most of the work.',
      'Increase slowly and drink more water — fibre without fluid backfires.',
    ],
    sources: [
      {
        authors: 'McKeown NM, et al.',
        title: 'Dietary fibre intake and risk of mortality',
        journal: 'American Journal of Clinical Nutrition',
        year: '2009',
      },
    ],
  },

  '30 Plants Per Week': {
    suggestedWhy: 'Gut microbes thrive on variety more than volume, so counting distinct plants builds a more diverse microbiome.',
    tagline: 'Count distinct plants, not portions.',
    lead: 'Microbiome diversity tracks with plant diversity more than plant volume — thirty different plants beats the same three vegetables thirty times. Herbs, spices, nuts and seeds all count, which makes the target far easier than it sounds.',
    evidence:
      'The American Gut project (McDonald et al., 2018) found that people eating more than 30 different plant types weekly had greater gut microbial diversity than those eating fewer than 10.',
    cadenceLabel: 'Weekly · 30 distinct plants',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Microbiome diversity',
        description: 'Variety matters more than volume.',
      },
      {
        icon: 'target',
        title: 'A game, not a diet',
        description: 'Counting is oddly motivating.',
      },
      {
        icon: 'sparkle',
        title: 'Herbs and spices count',
        description: 'Which makes 30 much more reachable.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Probably around 12',
        description: 'Most people start lower than they expect.',
      },
      {
        when: 'Week 4',
        title: 'Nudging 30',
        description: 'Small swaps add up fast.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'You shop for variety without counting.',
        peak: true,
      },
    ],
    howToStart: [
      'Add one new vegetable to today’s plate.',
      'Count anything plant-based once per week — including spices and seeds.',
      'Mixed bags of nuts, seeds and frozen veg are the cheap way to climb.',
    ],
    sources: [
      {
        authors: 'McDonald D, et al.',
        title: 'American Gut: an open platform for citizen science microbiome research',
        journal: 'mSystems',
        year: '2018',
      },
    ],
  },

  'Daily Fermented Foods': {
    suggestedWhy: 'A daily spoonful of fermented food raises gut microbial diversity and lowers inflammatory markers.',
    tagline: 'Something fermented, every day.',
    lead: 'Fermented foods introduce live microbes and their by-products, and a controlled trial found they shift microbiome diversity and immune markers in ways a high-fibre diet alone did not. Small servings, done daily, are what the studies use.',
    evidence:
      'Wastyk et al. (2021), in a Stanford randomised trial, found a fermented-food diet increased gut microbiota diversity and decreased inflammatory markers over ten weeks.',
    cadenceLabel: 'Daily · 1-2 servings',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Microbiome diversity',
        description: 'Measured to rise in a randomised trial.',
      },
      {
        icon: 'wave',
        title: 'Inflammatory markers',
        description: 'Fell over ten weeks in the same study.',
      },
      {
        icon: 'target',
        title: 'Small servings work',
        description: 'A spoonful daily is the studied dose, roughly.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Possible bloating',
        description: 'Start small — a spoonful, not a jar.',
      },
      {
        when: 'Week 4',
        title: 'Digestion settles',
        description: 'Most people report improvement by here.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'A daily spoonful with a meal.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one bite of yoghurt or kimchi.',
      'Look for "live cultures" — pasteurised sauerkraut does not count.',
      'Build up slowly. Be cautious if you are immunocompromised — ask a clinician.',
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

  'Omega-3 Rich Foods': {
    suggestedWhy: 'DHA from oily fish is built into neuronal membranes and shifts inflammation, and your body cannot make enough itself.',
    tagline: 'Fatty fish a couple of times a week.',
    lead: 'DHA is a structural component of neuronal membranes, and your body cannot make enough of it from scratch. Food sources are better studied than pills, and oily fish gets you there without a supplement decision.',
    cadenceLabel: '2-3x weekly',
    benefitDetails: [
      {
        icon: 'sparkle',
        title: 'Brain structure',
        description: 'DHA is built into neuronal membranes.',
      },
      {
        icon: 'leaf',
        title: 'Anti-inflammatory',
        description: 'Omega-3s shift the inflammatory balance.',
      },
      {
        icon: 'target',
        title: 'Food beats pills',
        description: 'Whole-food sources are better evidenced.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Nothing to feel',
        description: 'This is a structural, slow-acting nutrient.',
      },
      {
        when: 'Month 3',
        title: 'Tissue levels shift',
        description: 'Omega-3 status changes over months.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Fish is a fixed part of the week.',
        peak: true,
      },
    ],
    howToStart: [
      'Eat a few walnuts. Plant sources count as a start.',
      'Tinned sardines or mackerel are the cheapest oily fish going.',
      'If supplementing, check with a clinician — especially on blood thinners.',
    ],
    sources: [
      {
        authors: 'Dyall SC',
        title:
          'Long-chain omega-3 fatty acids and the brain: a review of the independent and shared effects of EPA, DPA and DHA',
        journal: 'Frontiers in Aging Neuroscience',
        year: '2015',
      },
    ],
  },

  'Protein Per Meal (25–30g)': {
    suggestedWhy: 'Muscle responds to the size of each protein dose, so spreading it across meals preserves more muscle and fills you up.',
    tagline: 'Twenty-five to thirty grams, each meal.',
    lead: 'Muscle protein synthesis responds to the size of a single dose, so protein spread evenly across meals builds more than the same total concentrated at dinner. Breakfast is almost always where the gap is.',
    evidence:
      'Moore et al. (2009) established a dose-response for muscle protein synthesis, showing the response plateaus around 20-25g of high-quality protein in a single serving.',
    cadenceLabel: 'Every meal · 25-30g',
    benefitDetails: [
      {
        icon: 'target',
        title: 'More from the same total',
        description: 'Distribution, not just quantity.',
      },
      {
        icon: 'leaf',
        title: 'Muscle preserved',
        description: 'The main dietary lever against age-related loss.',
      },
      {
        icon: 'wave',
        title: 'Better satiety',
        description: 'Protein is the most filling macronutrient.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Breakfast is the gap',
        description: 'Most people are well short at the first meal.',
      },
      {
        when: 'Week 3',
        title: 'Less snacking',
        description: 'Satiety improves noticeably.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Meals get built around protein.',
        peak: true,
      },
    ],
    howToStart: [
      'Add one egg to your next meal.',
      'Learn three portions by eye instead of weighing everything.',
      'Talk to a clinician first if you have kidney disease.',
    ],
    sources: [
      {
        authors: 'Moore DR, et al.',
        title:
          'Ingested protein dose response of muscle and albumin protein synthesis after resistance exercise',
        journal: 'American Journal of Clinical Nutrition',
        year: '2009',
      },
    ],
  },

  'Veggies First': {
    suggestedWhy: 'Fibre and protein eaten first slow the carbohydrate behind them, so the same meal gives a flatter glucose curve.',
    tagline: 'Eat the vegetables before the starch.',
    lead: 'Meal order changes the glucose response to identical food — fibre and protein arriving first slow the absorption of the carbohydrate that follows. Same plate, same calories, flatter curve.',
    evidence:
      'Shukla et al. (2015) found that eating vegetables and protein before carbohydrate produced substantially lower post-meal glucose and insulin than the reverse order, with the same meal.',
    cadenceLabel: 'Every meal',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Flatter glucose',
        description: 'From ordering alone, not from eating less.',
      },
      {
        icon: 'target',
        title: 'Nothing to give up',
        description: 'Same meal, different sequence.',
      },
      {
        icon: 'leaf',
        title: 'More vegetables eaten',
        description: 'First on the plate means actually finished.',
      },
    ],
    timeline: [
      {
        when: 'Meal 1',
        title: 'Works immediately',
        description: 'The effect is per-meal, not cumulative.',
      },
      {
        when: 'Week 2',
        title: 'Steadier afternoons',
        description: 'Especially noticeable after lunch.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You reach for the salad first.',
        peak: true,
      },
    ],
    howToStart: [
      'Take one bite of vegetables before anything else.',
      'Serve vegetables on their own plate first if it helps.',
      'Protein next, starch last. That is the whole rule.',
    ],
    sources: [
      {
        authors: 'Shukla AP, et al.',
        title:
          'Food order has a significant impact on postprandial glucose and insulin levels',
        journal: 'Diabetes Care',
        year: '2015',
      },
    ],
  },

  'Legume Serving': {
    suggestedWhy: 'Pulses deliver fibre and plant protein in one cheap package, so glycaemic control improves without much cost.',
    tagline: 'Beans, lentils or chickpeas a few times a week.',
    lead: 'Pulses deliver fibre and plant protein in the same package, and they are among the cheapest foods with genuine trial evidence behind them. The glycaemic effect is well documented in reviews.',
    cadenceLabel: '3-4x weekly',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Fibre and protein together',
        description: 'An unusually efficient combination.',
      },
      {
        icon: 'wave',
        title: 'Glycaemic control',
        description: 'Reviewed and consistent across trials.',
      },
      {
        icon: 'target',
        title: 'Very cheap',
        description: 'The best cost-per-benefit food on the list.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Digestive adjustment',
        description: 'Start small; your gut adapts.',
      },
      {
        when: 'Week 4',
        title: 'No more bloating',
        description: 'Regular intake resolves it.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Beans are a default ingredient.',
        peak: true,
      },
    ],
    howToStart: [
      'Add a spoonful of beans to your next meal.',
      'Tinned is fine — rinse them and you are done.',
      'Build up gradually to let your gut bacteria adjust.',
    ],
    sources: [
      {
        authors: 'Sievenpiper JL, et al.',
        title:
          'Effect of non-oil-seed pulses on glycaemic control: a systematic review and meta-analysis',
        journal: 'Diabetologia',
        year: '2009',
      },
    ],
  },

  'Daily Nuts Serving': {
    suggestedWhy: 'A daily handful of nuts is filling and linked to lower cardiovascular risk, and it displaces worse snacks.',
    tagline: 'A small handful most days.',
    lead: 'Nut intake is associated with lower cardiovascular risk across large meta-analyses, and — counter-intuitively for a calorie-dense food — is not associated with weight gain, probably because they are filling and not fully absorbed.',
    evidence:
      'Aune et al. (2016) meta-analysed prospective studies and found nut consumption was associated with reduced risk of cardiovascular disease and all-cause mortality.',
    cadenceLabel: 'Daily · ~30g',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Cardiovascular risk',
        description: 'Consistent across large meta-analyses.',
      },
      {
        icon: 'target',
        title: 'Filling',
        description: 'Fat, fibre and protein in one handful.',
      },
      {
        icon: 'sparkle',
        title: 'Zero preparation',
        description: 'The easiest habit here to actually keep.',
      },
    ],
    timeline: [
      {
        when: 'Day 1',
        title: 'Easy',
        description: 'No cooking, no planning.',
      },
      {
        when: 'Week 3',
        title: 'Replaces worse snacks',
        description: 'That is most of the real benefit.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'A daily handful, unremarkable.',
        peak: true,
      },
    ],
    howToStart: [
      'Eat 5 almonds. That is the starting dose.',
      'Unsalted, and portion them out — the bag disappears otherwise.',
      'Around 30g a day is the studied range.',
    ],
    sources: [
      {
        authors: 'Aune D, et al.',
        title:
          'Nut consumption and risk of cardiovascular disease, total cancer, all-cause and cause-specific mortality',
        journal: 'BMC Medicine',
        year: '2016',
      },
    ],
  },

  'Whole Grain Swap': {
    suggestedWhy: 'Whole grains keep the bran and germ, so fibre slows absorption and cardiovascular and diabetes risk fall.',
    tagline: 'Swap one refined grain for a whole one.',
    lead: 'Whole grains keep the bran and germ, which is where the fibre and most micronutrients live. Higher intake is associated with lower cardiovascular disease and type 2 diabetes risk — and a swap is easier to sustain than an elimination.',
    evidence:
      'Aune et al. (2016) found whole-grain consumption was associated with reduced risk of cardiovascular disease, type 2 diabetes, and all-cause mortality in a dose-response meta-analysis.',
    cadenceLabel: 'Daily · one swap',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Dose-response benefit',
        description: 'More whole grain, lower risk, fairly linearly.',
      },
      {
        icon: 'wave',
        title: 'Flatter glucose',
        description: 'Intact fibre slows absorption.',
      },
      {
        icon: 'target',
        title: 'A swap, not a sacrifice',
        description: 'Nothing removed, one thing replaced.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Texture change',
        description: 'Takes a few meals to prefer.',
      },
      {
        when: 'Week 3',
        title: 'Longer satiety',
        description: 'You notice lasting longer between meals.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Whole grain is what you buy.',
        peak: true,
      },
    ],
    howToStart: [
      'Swap one slice of bread for whole-wheat.',
      'Check labels: "wholegrain" first on the list, not "wheat flour".',
      'One swap at a time — bread, then rice, then pasta.',
    ],
    sources: [
      {
        authors: 'Aune D, et al.',
        title:
          'Whole grain consumption and risk of cardiovascular disease, cancer, and all cause and cause specific mortality',
        journal: 'BMJ',
        year: '2016',
      },
    ],
  },

  'Meal Prepping': {
    suggestedWhy: 'Prepping moves the cooking decision away from 7pm, so home cooking wins more often and diet quality improves.',
    tagline: 'Cook once, eat several times.',
    lead: 'Cooking at home is associated with better diet quality, and the barrier is almost never knowledge — it is the decision fatigue of doing it at 7pm. Prepping moves that decision to a moment when you have capacity.',
    evidence:
      'Wolfson & Bleich (2015) found that people who cooked dinner at home more frequently had healthier diets, including lower calorie, sugar and fat intake.',
    cadenceLabel: 'Weekly · 1-2 hours',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Better diet quality',
        description: 'Home cooking tracks with it directly.',
      },
      {
        icon: 'target',
        title: 'Removes the 7pm decision',
        description: 'The real reason takeaway wins.',
      },
      {
        icon: 'sparkle',
        title: 'Cheaper',
        description: 'Usually the largest immediate saving available.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Takes longer than planned',
        description: 'First session always does.',
      },
      {
        when: 'Week 4',
        title: 'Efficient',
        description: 'You settle into a repeatable set of meals.',
      },
      {
        when: '~40 days',
        title: 'Automatic',
        description: 'Sunday has a prep slot.',
        peak: true,
      },
    ],
    howToStart: [
      'Wash one piece of produce. That is a legitimate start.',
      'Prep components — grains, protein, chopped veg — not full meals.',
      'Three lunches is a good first target. Do not plan seven dinners.',
    ],
    sources: [
      {
        authors: 'Wolfson JA, Bleich SN',
        title:
          'Is cooking at home associated with better diet quality or weight-loss intention?',
        journal: 'Public Health Nutrition',
        year: '2015',
      },
    ],
  },

  'No Late Night Eating': {
    suggestedWhy: 'Closing the kitchen before bed keeps digestion out of your sleep window, so reflux eases and sleep improves.',
    tagline: 'Kitchen closes three hours before bed.',
    lead: 'Lying down with a full stomach raises reflux risk, and late eating asks your digestion to work during the window it is least equipped for. The sleep-quality effect is usually noticed within a week.',
    evidence:
      'Fujiwara et al. (2005) found a short interval between dinner and bedtime was associated with increased risk of gastro-oesophageal reflux disease.',
    cadenceLabel: 'Nightly · nothing within 3 hours',
    benefitDetails: [
      {
        icon: 'moon',
        title: 'Better sleep',
        description: 'Digestion competes with rest.',
      },
      {
        icon: 'leaf',
        title: 'Less reflux',
        description: 'The most direct, best-evidenced effect.',
      },
      {
        icon: 'target',
        title: 'One clear rule',
        description: 'A time is easier to keep than a food list.',
      },
    ],
    timeline: [
      {
        when: 'Nights 1-3',
        title: 'Evening hunger',
        description: 'Habit protesting more than real hunger.',
      },
      {
        when: 'Week 2',
        title: 'Sleep improves',
        description: 'Often the first clear benefit.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'The kitchen closes itself.',
        peak: true,
      },
    ],
    howToStart: [
      'Set a kitchen-closed timer.',
      'Move dinner earlier rather than trying to resist later.',
      'Herbal tea covers the ritual without the food.',
    ],
    sources: [
      {
        authors: 'Fujiwara Y, et al.',
        title:
          'Association between dinner-to-bed time and gastro-esophageal reflux disease',
        journal: 'American Journal of Gastroenterology',
        year: '2005',
      },
    ],
  },

  'Pre-Meal Vinegar': {
    suggestedWhy: 'Acetic acid appears to slow gastric emptying, so the glucose rise after a carbohydrate meal tends to be gentler.',
    tagline: 'Diluted vinegar before a meal.',
    lead: 'Acetic acid appears to slow gastric emptying and blunt the glucose response to a carbohydrate meal. Worth calibrating expectations: the studies are small and short, and the effect is a modest smoothing rather than anything dramatic.',
    cadenceLabel: 'Before meals · 1 tbsp diluted',
    benefitDetails: [
      {
        icon: 'wave',
        title: 'Flatter glucose',
        description: 'A modest, repeatedly observed effect.',
      },
      {
        icon: 'target',
        title: 'Cheap to try',
        description: 'You probably already own vinegar.',
      },
      {
        icon: 'leaf',
        title: 'Pairs with food order',
        description: 'Stacks with eating vegetables first.',
      },
    ],
    timeline: [
      {
        when: 'Meal 1',
        title: 'Unpleasant',
        description: 'Dilute it properly or you will stop.',
      },
      {
        when: 'Week 2',
        title: 'Tolerable',
        description: 'Taste adjusts faster than expected.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'Part of sitting down to eat.',
        peak: true,
      },
    ],
    howToStart: [
      'One tablespoon in a full glass of water — never undiluted.',
      'Through a straw if you can. Rinse your mouth afterwards.',
      'Skip it if you have reflux, ulcers, or take diabetes or diuretic medication — check with a clinician. Acid erodes tooth enamel.',
    ],
    sources: [
      {
        authors: 'Johnston CS, Kim CM, Buller AJ',
        title:
          'Vinegar improves insulin sensitivity to a high-carbohydrate meal',
        journal: 'Diabetes Care',
        year: '2004',
      },
    ],
  },

  'Resistant Starch': {
    suggestedWhy: 'Cooling cooked starch makes part of it indigestible, so it reaches your colon and feeds gut bacteria instead.',
    tagline: 'Cook starches, cool them, then reheat.',
    lead: 'Cooling cooked starch causes some of it to recrystallise into a form your small intestine cannot digest, so it reaches the colon and feeds bacteria there instead. A genuine effect, though the size of it in practice is modest.',
    cadenceLabel: 'Ongoing · when you cook starches',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Feeds gut bacteria',
        description: 'Resistant starch is a fermentable fibre.',
      },
      {
        icon: 'wave',
        title: 'Lower glucose response',
        description: 'Less digestible starch reaching your bloodstream.',
      },
      {
        icon: 'sparkle',
        title: 'Free',
        description: 'It is a fridge step, not an ingredient.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Possible gas',
        description: 'Fermentation is the mechanism working.',
      },
      {
        when: 'Week 3',
        title: 'Settles',
        description: 'Your gut bacteria adjust.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Cook extra, chill it, reheat tomorrow.',
        peak: true,
      },
    ],
    howToStart: [
      'Cook rice, potatoes or pasta, refrigerate overnight, then reheat.',
      'It works cold too — potato salad, rice salad.',
      'Cool cooked rice quickly and refrigerate promptly; reheat thoroughly. Improperly stored rice causes food poisoning.',
    ],
    sources: [
      {
        authors: 'Robertson MD, et al.',
        title:
          'Insulin-sensitizing effects of dietary resistant starch and effects on skeletal muscle and adipose tissue metabolism',
        journal: 'American Journal of Clinical Nutrition',
        year: '2005',
      },
    ],
  },

  'Calcium Intake Tracking': {
    suggestedWhy: 'Bone is a calcium bank you draw on for life, so a short log shows whether your intake is protecting it.',
    tagline: 'Know roughly how much calcium you get.',
    lead: 'Bone is a calcium bank you make deposits into for the first few decades and draw on afterwards. Tracking briefly is diagnostic rather than permanent — most people find they are either comfortably fine or clearly short, and act accordingly.',
    cadenceLabel: 'Daily log · 1000-1200mg target',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Bone density protected',
        description: 'Calcium is the raw material.',
      },
      {
        icon: 'target',
        title: 'Diagnostic',
        description: 'A week of logging answers the question.',
      },
      {
        icon: 'wave',
        title: 'Food first',
        description: 'Dietary calcium beats supplementing.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Clarifying',
        description: 'You find out where you actually are.',
      },
      {
        when: 'Week 3',
        title: 'Intake corrected',
        description: 'Usually one or two food swaps.',
      },
      {
        when: '~21 days',
        title: 'Automatic',
        description: 'You stop needing to log it.',
        peak: true,
      },
    ],
    howToStart: [
      'Note one calcium-rich food you ate.',
      'Dairy, tinned sardines, tofu, fortified plant milks, leafy greens.',
      'Vitamin D matters for absorbing it. Ask a clinician before supplementing — excess calcium has its own risks.',
    ],
    sources: [
      {
        authors: 'Johns Hopkins Medicine',
        title: 'Calcium and vitamin D requirements for bone health',
        journal: 'Johns Hopkins Health Library',
        year: '2024',
      },
    ],
  },

  'Vitamin D Supplementation': {
    suggestedWhy: 'Vitamin D is hard to get from food or winter sun, and correcting a real deficiency supports bone and immune function.',
    tagline: 'Check your level; supplement if you are short.',
    lead: 'Vitamin D is genuinely hard to get from food and, at northern latitudes, impossible to make from winter sun. The honest framing: correcting a deficiency clearly matters, while supplementing when you are already sufficient shows little benefit in trials.',
    cadenceLabel: 'Daily · 600-800 IU if deficient',
    benefitDetails: [
      {
        icon: 'leaf',
        title: 'Deficiency correction',
        description: 'Where the clear benefit sits.',
      },
      {
        icon: 'target',
        title: 'Hard to get otherwise',
        description: 'Little in food, none from winter sun up north.',
      },
      {
        icon: 'wave',
        title: 'Bone and immune function',
        description: 'Both depend on adequate status.',
      },
    ],
    timeline: [
      {
        when: 'Week 1',
        title: 'Nothing to feel',
        description: 'Unless you were significantly deficient.',
      },
      {
        when: 'Month 3',
        title: 'Levels rise',
        description: 'Blood status shifts over months.',
      },
      {
        when: '~30 days',
        title: 'Automatic',
        description: 'Part of a daily routine.',
        peak: true,
      },
    ],
    howToStart: [
      'Take your vitamin D pill — with a meal containing fat, for absorption.',
      'Get a blood test rather than guessing at the dose.',
      'Do not megadose. Vitamin D is fat-soluble and genuinely toxic in excess — dose with a clinician.',
    ],
  },
};
