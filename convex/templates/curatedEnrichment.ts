export type TemplateEnrichment = {
  scientificLink: string;
  tips: string[];
};

const SOCIAL_CONNECTION_TIPS = [
  'Make the interaction specific and personal',
  'Choose one small action you can repeat',
  'Follow up while the conversation is still fresh',
];

const LEARNING_TIPS = [
  'Recall before rereading',
  'Keep the practice block short and focused',
  'Review mistakes before moving on',
];

const MINDFULNESS_TIPS = [
  'Start with one minute',
  'Notice the cue that pulls your attention',
  'Return gently without judging the miss',
];

const PRODUCTIVITY_TIPS = [
  'Define the next visible action',
  'Remove one distraction before starting',
  'Stop with a clear note for the next session',
];

export const CURATED_ENRICHMENT: Record<string, TemplateEnrichment> = {
  'Morning Pages': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/2424660/',
    tips: [
      'Write continuously without editing',
      'Keep the session private so honesty is easier',
      'Stop after the planned page or timer limit',
    ],
  },
  'Hydration First': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22855911/',
    tips: [
      'Place water beside your bed before sleep',
      'Drink before coffee so the sequence is automatic',
      'Refill the glass immediately for tomorrow',
    ],
  },
  'Sun Salutation Flow': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22502620/',
    tips: [
      'Start with one slow round',
      'Match movement to breath',
      'Keep the sequence gentle on stiff mornings',
    ],
  },
  'Make Your Bed': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: [
      'Pull the covers up before leaving the room',
      'Keep the standard simple enough for rushed mornings',
      'Use it as the cue for the next morning habit',
    ],
  },
  'Strength Training': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/35228201/',
    tips: [
      'Train the major movement patterns across the week',
      'Leave one or two reps in reserve while building consistency',
      'Record the weight or reps after each session',
    ],
  },
  'Stretching Routine': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/15233597/',
    tips: [
      'Hold each stretch without bouncing',
      'Target the tightest area first',
      'Use relaxed breathing to keep intensity moderate',
    ],
  },
  'No Added Sugar': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23321486/',
    tips: [
      'Start with drinks before changing foods',
      'Check sauces and snacks for hidden sugar',
      'Choose a default unsweetened replacement',
    ],
  },
  'Meal Prepping': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28818039/',
    tips: [
      'Prep one protein and one vegetable first',
      'Use repeatable meals instead of new recipes every week',
      'Store portions where they are easy to grab',
    ],
  },
  'Daily Yoga Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22502620/',
    tips: [
      'Use a short familiar flow',
      'Keep a mat visible',
      'Choose consistency over intensity',
    ],
  },
  'High Fiber Diet': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25552267/',
    tips: [
      'Add fiber gradually to avoid stomach discomfort',
      'Pair beans, oats, or berries with meals you already eat',
      'Drink water as fiber intake increases',
    ],
  },
  'Hydration Tracking': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22855911/',
    tips: [
      'Track refills instead of every sip',
      'Use the same bottle size daily',
      'Tie refills to meals and work breaks',
    ],
  },
  'Work Breaks': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23853513/',
    tips: [
      'Stand before fatigue becomes obvious',
      'Step away from the screen during the break',
      'Use breaks to reset posture and breathing',
    ],
  },
  'Evening Reflection': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: [
      'Write one specific thing that went well',
      'Keep the prompt short enough for tired evenings',
      'End with one next action for tomorrow',
    ],
  },
  'Walking in Nature': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19568835/',
    tips: [
      'Choose a nearby route to reduce friction',
      'Leave headphones off for the first few minutes',
      'Notice one visual detail before returning',
    ],
  },
  'Progressive Muscle Relaxation': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27502808/',
    tips: [
      'Tense gently, not painfully',
      'Release slowly and notice the contrast',
      'Move from feet to face for a predictable sequence',
    ],
  },
  'Loving-Kindness Meditation': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/18954193/',
    tips: [
      'Start with someone easy to care about',
      'Use one repeated phrase',
      'Include yourself before ending',
    ],
  },
  'Daily Social Call': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: [
      'Keep a short list of people to rotate through',
      'Send a text first if a call feels too large',
      'Ask one follow-up question before ending',
    ],
  },
  'Reach Out Daily': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: [
      'Make the message specific',
      'Use idle moments to send one note',
      'Do not wait until you have a perfect reason',
    ],
  },
  'Express Gratitude': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: [
      'Name the exact action you appreciated',
      'Share gratitude out loud when possible',
      'Vary the person so it stays genuine',
    ],
  },
  'Group Activities': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: [
      'Choose recurring groups over one-off events',
      'Put the next event on your calendar immediately',
      'Attend even when you can only stay briefly',
    ],
  },
  'Consistent Bedtime': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28889101/',
    tips: [
      'Set a bedtime alarm before you feel tired',
      'Keep weekend timing within a narrow range',
      'Start the wind-down routine 30 minutes earlier',
    ],
  },
  'No Afternoon Caffeine': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/24235903/',
    tips: [
      'Set the cutoff at bedtime minus six hours',
      'Replace the ritual with decaf or herbal tea',
      'Watch for caffeine in soda and chocolate',
    ],
  },
  'Pre-Sleep Warm Bath': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/31102877/',
    tips: [
      'Take the bath one to two hours before bed',
      'Keep lights low afterward',
      'Use it as the start of the wind-down routine',
    ],
  },
  'No Evening Alcohol': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23347102/',
    tips: [
      'Pick a non-alcoholic default before dinner',
      'Track sleep quality the next morning',
      'Avoid keeping alcohol in the bedroom or workspace',
    ],
  },
  'Active Recall': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: [
      'Close the notes before testing yourself',
      'Write what you remember before checking answers',
      'Review misses immediately after the attempt',
    ],
  },
  'Music Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21463047/',
    tips: [
      'Practice one small passage slowly',
      'End by playing something enjoyable',
      'Keep the instrument visible',
    ],
  },
  'Handwritten Notes': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/24760141/',
    tips: [
      'Summarize ideas instead of transcribing',
      'Leave space for later recall questions',
      'Review the notes within 24 hours',
    ],
  },
  'Morning Freewriting': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/2424660/',
    tips: [
      'Write before opening messages',
      'Keep the pen moving until the timer ends',
      'Do not judge grammar or structure',
    ],
  },
  'Body Scan Meditation': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21151835/',
    tips: [
      'Move attention slowly from feet to head',
      'Name sensations without trying to change them',
      'Use a short guided track if focus wanders',
    ],
  },
  'Dopamine Reset': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22570770/',
    tips: [
      'Remove one high-stimulation cue at a time',
      'Plan a low-stimulation replacement',
      'Avoid turning the reset into an all-day test',
    ],
  },
  'House Plant Care': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19963382/',
    tips: [
      'Water on a fixed weekly cue',
      'Keep care tools near the plants',
      'Check leaves for one minute while watering',
    ],
  },
  'Daily Declutter': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21228167/',
    tips: [
      'Clear one visible surface',
      'Use a two-minute timer',
      'Put items away instead of making a new pile',
    ],
  },
  'Deep Listening': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: [
      'Wait one breath before responding',
      'Reflect back the main point',
      'Ask one curious follow-up question',
    ],
  },
  'Random Act of Kindness': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17356687/',
    tips: [
      'Keep the action small and concrete',
      'Choose something helpful, not performative',
      'Notice the other person\'s actual need',
    ],
  },
  'Face-to-Face Time': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: [
      'Schedule the next meetup before leaving',
      'Keep phones off the table',
      'Choose a low-effort recurring setting',
    ],
  },
  'Phone-Free Meals': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28718340/',
    tips: [
      'Put phones in another room before eating',
      'Start with one meal per day',
      'Use the first few minutes for conversation',
    ],
  },
  'Single-Tasking': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21228167/',
    tips: [
      'Close unrelated tabs before starting',
      'Write the one task on paper',
      'Do not switch until the timer ends',
    ],
  },
  'Regular Dental Checkups': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17615018/',
    tips: [
      'Book the next visit before leaving the office',
      'Put reminders two weeks and two days ahead',
      'Pair the visit with an existing errand route',
    ],
  },
  'Bone-Strengthening Exercise': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/18505370/',
    tips: [
      'Include impact or resistance appropriate to your body',
      'Progress gradually',
      'Track sessions by week, not by perfection',
    ],
  },
  'Joint Mobility Routine': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/15233597/',
    tips: [
      'Move joints through a pain-free range',
      'Use slow controlled reps',
      'Attach the routine to warm-up or bedtime',
    ],
  },
  'Energy Level Tracking': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17617910/',
    tips: [
      'Use a simple one-to-five score',
      'Track at the same time daily',
      'Look for patterns after one week',
    ],
  },
  'Weekly Teaching': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: [
      'Teach from memory before checking notes',
      'Use a real or imagined beginner',
      'Turn gaps into next week\'s study list',
    ],
  },
  'Deep Questions': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: [
      'Ask one question that invites a story',
      'Answer the same question yourself',
      'Do not rush to advice',
    ],
  },
  'Active Constructive Responding': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: [
      'Respond with interest before shifting topics',
      'Ask for details about good news',
      'Celebrate in a way that matches the person',
    ],
  },
  'Vulnerability Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: [
      'Share with someone who has earned trust',
      'Start with a modest truth',
      'Notice whether the conversation becomes more mutual',
    ],
  },
  'Ultradian Work Cycles': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/3627576/',
    tips: [
      'Work in a focused block of 60 to 90 minutes',
      'Take a real recovery break afterward',
      'Stop before quality drops sharply',
    ],
  },
  'Same-Day Review': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: [
      'Review before sleep or before switching topics',
      'Use recall before rereading',
      'Mark only the items you missed',
    ],
  },
  'Unstimulated Walk': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25553364/',
    tips: [
      'Leave headphones at home',
      'Walk a familiar route',
      'Let thoughts settle before reaching for input',
    ],
  },
  'Single-Sentence Journal': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: [
      'Write one sentence only',
      'Use the same prompt each night',
      'Do not restart if you miss a day',
    ],
  },
  'Identity Journaling': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: [
      'Write as the kind of person you are practicing becoming',
      'Tie the identity to one action',
      'Keep the entry short and repeatable',
    ],
  },
  'Daily Meaningful Interaction': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Weekly Networking Outreach': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Standing Social Events': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Six-Second Kiss': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Love Maps Question': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Express Daily Appreciation': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Stress-Reducing Conversation': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Handwritten Letters': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Friend Check-Ins': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Weekly Date Night': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  '6-Second Hug': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Highs and Lows Ritual': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Receive Feedback Gracefully': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Reflective Listening': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Eye Contact Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Daily Compliment': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Boundary Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17014291/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Pet Time': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19963382/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Acts of Service': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17356687/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Quality Partner Time': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: SOCIAL_CONNECTION_TIPS,
  },
  'Novel Learning Session': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Documentary Learning': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Memory Challenges': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Daily Logic Puzzle': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Navigation Novelty': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25553364/',
    tips: LEARNING_TIPS,
  },
  'Language Word Learning': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Pre-Sleep Review': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Interleaved Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Non-Dominant Hand Training': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21463047/',
    tips: LEARNING_TIPS,
  },
  'Study Groups': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: LEARNING_TIPS,
  },
  'Educational Videos': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Audio Learning': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Daily Reading': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Feynman Technique': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Daily Language Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20976019/',
    tips: LEARNING_TIPS,
  },
  'Post-Behavior Celebration': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: MINDFULNESS_TIPS,
  },
  'Legacy Action': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: MINDFULNESS_TIPS,
  },
  'Mortality Reflection': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21151835/',
    tips: MINDFULNESS_TIPS,
  },
  'Letter to Future Self': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: MINDFULNESS_TIPS,
  },
  'Future Self Visualization': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: MINDFULNESS_TIPS,
  },
  'Purpose Statement Review': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: MINDFULNESS_TIPS,
  },
  'Foot Grounding': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19568835/',
    tips: MINDFULNESS_TIPS,
  },
  'Self-Massage Ritual': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27502808/',
    tips: MINDFULNESS_TIPS,
  },
  'Tension Release Shaking': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27502808/',
    tips: MINDFULNESS_TIPS,
  },
  'Stargazing': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19568835/',
    tips: MINDFULNESS_TIPS,
  },
  'Blue Space Time': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19568835/',
    tips: MINDFULNESS_TIPS,
  },
  'Bird Watching': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19568835/',
    tips: MINDFULNESS_TIPS,
  },
  'Daily Laughter': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/17356687/',
    tips: MINDFULNESS_TIPS,
  },
  'Mindful Eating': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26100137/',
    tips: MINDFULNESS_TIPS,
  },
  'Digital Detox Hour': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22570770/',
    tips: MINDFULNESS_TIPS,
  },
  'Quarterly Quest Setting': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Weekly Review': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Digital File Organization': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21228167/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Public Speaking Practice': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21463047/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Work Insights Journal': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Professional Networking': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20668659/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Career Documentation': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12585811/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Grayscale Phone Mode': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22570770/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Airplane Mode Morning': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22570770/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Weekly Desk Cleanup': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21228167/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Time Blocking': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Inbox Zero': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21228167/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Pomodoro Technique': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23853513/',
    tips: PRODUCTIVITY_TIPS,
  },
  'Deep Work Session': {
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/3627576/',
    tips: PRODUCTIVITY_TIPS,
  },
};
