/**
 * `startSmallVersion` backfill, round 2 (evidence review, Aug 2026).
 *
 * `templatesDataSeed:backfillStartSmallVersion` covers 253 templates. The
 * `_insertTemplateIfMissing` batches — longevity, mental_health, recovery,
 * breathing, plus stragglers in health_fitness/social/productivity/learning —
 * were authored without a start-small line and were never added to that map,
 * so 42 live templates still render the detail sheet with no tiny version.
 *
 * Authoring rule: the start-small must be doable in under a minute, require
 * nothing you do not already have, and be a real instance of the habit rather
 * than a rehearsal of it.
 */

export const START_SMALL_ROUND_2: Record<string, string> = {
  // longevity
  'Always Take Stairs': 'Take the stairs one flight instead of the elevator.',
  'Brisk Walking Pace': 'Walk one block faster than feels natural.',
  'Floor Sitting Practice': 'Sit on the floor for 30 seconds.',
  'Ground Transitions': 'Get down to the floor and back up once.',
  'Muscle Preservation': 'Do 5 bodyweight squats.',
  'Resting Heart Rate Check': 'Take your pulse for 15 seconds.',
  'Single-Leg Balance Test': 'Stand on one leg for 10 seconds.',

  // mental_health
  'Behavioral Activation': 'Do one small thing you have been putting off.',
  'Cognitive Defusion': 'Say "I notice I am having the thought that..." once.',
  'Emotion Granularity': 'Name what you are feeling in one specific word.',
  'Expressive Writing': 'Write one sentence about how you actually feel.',
  'Opposite Action': 'Do one small thing the feeling is telling you to skip.',
  'Pleasant Activity Scheduling': 'Put one small thing you enjoy on today.',
  'Self-Compassion Break': 'Put a hand on your chest and take one breath.',
  'Self-Distancing': 'Ask yourself what you would tell a friend right now.',
  'Values Clarification': 'Write down one value that matters to you.',

  // recovery
  'Consistent Wake Time': "Set tomorrow's alarm for your target wake time.",
  'Contrast Shower': 'End your shower with 10 seconds of cold water.',
  'Power Nap': 'Lie down and close your eyes for 5 minutes.',
  'Self-Massage/Foam Rolling': 'Roll one tight spot for 30 seconds.',

  // breathing
  '4-7-8 Relaxing Breath': 'Do one round of 4-7-8 breathing.',
  'Box Breathing (4-4-4-4)': 'Do one round of 4-4-4-4 breathing.',
  'CO2 Tolerance Training': 'Exhale fully and hold for 10 seconds.',
  'Daily Humming': 'Hum one long note.',
  'Energizing Breath (Kapalabhati)': 'Do 10 sharp exhales through your nose.',
  'Mouth Taping Sleep': 'Breathe through your nose only for one minute.',
  'Resonant Breathing': 'Take one 5-second inhale and 5-second exhale.',
  'Wim Hof Breathing': 'Take 10 deep breaths, then exhale and pause.',

  // health_fitness
  'Movement Snacks': 'Do 20 seconds of anything vigorous right now.',
  'Pre-Meal Vinegar': 'Stir one teaspoon of vinegar into a glass of water.',
  'Resistant Starch': "Put tonight's leftover rice or potatoes in the fridge.",

  // social
  'Active Constructive Responding':
    "Ask one follow-up question about someone's good news.",
  'Eye Contact Practice': 'Hold eye contact through one full sentence.',
  'Reflective Listening': 'Repeat back what one person just told you.',
  'Vulnerability Practice': 'Tell one person how you are actually doing.',

  // productivity
  'Fresh Air Ventilation': 'Open one window for 60 seconds.',
  'Grayscale Phone Mode': 'Turn on grayscale for 5 minutes.',
  'Ultradian Work Cycles': 'Set a 25-minute timer and start.',

  // learning
  'Interleaved Practice': 'Switch topics once during your next study block.',
  'Non-Dominant Hand Training': 'Brush your teeth with your other hand.',
  'Same-Day Review': 'Recall one thing you learned today without looking.',

  // morning_routine
  'Bilateral Eye Movements': 'Look left and right 10 times.',
};
