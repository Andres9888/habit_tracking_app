import type { TemplateInsert } from './types';

export const CURATION_SEED_TEMPLATES: Omit<TemplateInsert, 'createdAt'>[] = [
  {
    category: 'environmental_design',
    description:
      'Keep your phone outside your main work area during one focused block. Merely having a smartphone nearby can reduce available working memory, even when it is face down and silent.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'simple',
    icon: '📵',
    iconColor: '#059669',
    name: 'Phone in Another Room',
    popularityScore: 88,
    scientificLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10525686/',
    scientificReference:
      'Parry & le Roux (2023) - Does the brain drain effect really exist? A meta-analysis',
    startSmallVersion: 'Put your phone across the room for 10 minutes.',
    tips: [
      'Use a visible timer instead of checking your phone for time',
      'Start with your first focus block of the day',
      'Keep the phone silent so the cue does not pull attention back',
    ],
  },
  {
    category: 'environmental_design',
    description:
      'Lay out workout clothes, shoes, or equipment the night before. A visible cue lowers startup friction and makes the next action obvious when motivation is low.',
    estimatedMinutes: 2,
    frequency: 'daily',
    growthType: 'simple',
    icon: '👟',
    iconColor: '#059669',
    name: 'Prep Workout Clothes Night Before',
    popularityScore: 84,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
    scientificReference:
      'Lally et al. (2010) - How habits are formed: modelling habit formation in the real world',
    startSmallVersion: 'Put your shoes where you will see them tomorrow.',
    tips: [
      'Place the clothes on the path to your bathroom or door',
      'Prep for the smallest acceptable version of the workout',
      'Reset the cue immediately after laundry so it stays automatic',
    ],
  },
  {
    category: 'environmental_design',
    description:
      'Move fruit, vegetables, or protein-rich snacks to eye level and push low-value snacks out of sight. Food placement changes choice without relying on willpower.',
    estimatedMinutes: 3,
    frequency: 'weekly',
    growthType: 'average',
    icon: '🥗',
    iconColor: '#059669',
    name: 'Healthy Food at Eye Level',
    popularityScore: 83,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22320315/',
    scientificReference:
      'Thorndike et al. (2012) - A 2-phase labeling and choice architecture intervention to improve healthy food and beverage choices',
    startSmallVersion: 'Put one healthy snack at eye level.',
    tips: [
      'Make the better option the first thing you see',
      'Use clear containers for foods you want to eat more often',
      'Move treats to opaque containers or a higher shelf',
    ],
  },
  {
    category: 'environmental_design',
    description:
      'Reserve your bed for sleep and intimacy, not scrolling or work. Stimulus control is a core CBT-I technique that helps the brain reassociate bed with sleepiness.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'average',
    icon: '🛏️',
    iconColor: '#059669',
    name: 'Bedroom for Sleep Only',
    popularityScore: 86,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/12201660/',
    scientificReference:
      'Morin et al. (2002) - Nonpharmacologic treatment of chronic insomnia',
    startSmallVersion: 'Move one non-sleep activity out of bed tonight.',
    tips: [
      'Charge devices outside the bedroom when possible',
      'If you cannot sleep, leave bed for a quiet low-light activity',
      'Keep work materials out of the room',
    ],
  },
  {
    category: 'environmental_design',
    description:
      'Keep a filled water bottle visible at your desk, bedside, or bag. Environmental cues make hydration easier to notice before thirst or fatigue become the reminder.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'simple',
    icon: '💧',
    iconColor: '#059669',
    name: 'Water Bottle Always Visible',
    popularityScore: 85,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22855911/',
    scientificReference:
      'Ganio et al. (2011) - Mild dehydration impairs cognitive performance and mood of men',
    startSmallVersion: 'Fill a bottle and place it where you work.',
    tips: [
      'Refill it during an existing transition, like lunch',
      'Use a bottle size that makes progress visible',
      'Pair each refill with a short movement break',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Skip the snooze button and get out of bed on the first alarm. Repeated alarms fragment sleep and can worsen sleep inertia during the first part of the morning.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'average',
    icon: '⏰',
    iconColor: '#7C3AED',
    name: 'No Snooze Button',
    popularityScore: 87,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26434633/',
    scientificReference:
      'Trotti (2017) - Waking up is the hardest thing I do all day: sleep inertia and sleep drunkenness',
    startSmallVersion: 'Put the alarm across the room tonight.',
    tips: [
      'Use one alarm and make standing up required',
      'Turn on bright light immediately after rising',
      'Keep the first morning action very small',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Avoid news and outrage feeds before noon. Delaying high-arousal media protects the first part of the day for planned attention instead of reactive stress.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'average',
    icon: '📰',
    iconColor: '#7C3AED',
    name: 'No News Before Noon',
    popularityScore: 80,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/24324161/',
    scientificReference:
      'Holman et al. (2014) - Media exposure to collective trauma, acute stress, and stress responses',
    startSmallVersion: 'Move your news app off the home screen.',
    tips: [
      'Choose one planned news window later in the day',
      'Turn off breaking-news notifications',
      'Replace the morning check with weather or calendar only',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Keep weekdays alcohol-free. Regular alcohol breaks reduce sleep disruption and lower cumulative intake without requiring an all-or-nothing identity.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'complex',
    icon: '🚫',
    iconColor: '#7C3AED',
    name: 'Alcohol-Free Weekdays',
    popularityScore: 84,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/30146330/',
    scientificReference:
      'GBD 2016 Alcohol Collaborators (2018) - Alcohol use and burden for 195 countries and territories',
    startSmallVersion: 'Choose one alcohol-free weekday this week.',
    tips: [
      'Stock a satisfying non-alcoholic default',
      'Decide before social plans begin',
      'Track sleep quality the next morning for feedback',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Keep the phone out of the bedroom overnight. Device access at bedtime is associated with shorter sleep duration, poorer sleep quality, and more daytime sleepiness.',
    estimatedMinutes: 1,
    frequency: 'daily',
    growthType: 'average',
    icon: '📴',
    iconColor: '#7C3AED',
    name: 'No Phone in Bedroom',
    popularityScore: 90,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27802500/',
    scientificReference:
      'Carter et al. (2016) - Association between portable screen-based media device access or use and sleep outcomes',
    startSmallVersion: 'Charge your phone outside the bedroom once.',
    tips: [
      'Use a physical alarm clock',
      'Keep a book or notebook where the phone used to be',
      'Set the charger up before bedtime so the choice is easy',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Cancel, shorten, or decline one low-value meeting each week. Reducing unnecessary synchronous work protects time for focused execution and recovery.',
    estimatedMinutes: 5,
    frequency: 'weekly',
    growthType: 'average',
    icon: '📆',
    iconColor: '#7C3AED',
    name: 'One Less Meeting',
    popularityScore: 78,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25766928/',
    scientificReference:
      'Luong & Rogelberg (2005) - Meetings and more meetings: the relationship between meeting load and daily well-being',
    startSmallVersion: 'Turn one meeting into an async update.',
    tips: [
      'Ask whether a decision, agenda, or owner is missing',
      'Shorten 60-minute defaults to 25 or 45 minutes',
      'Protect the freed block on your calendar immediately',
    ],
  },
  {
    category: 'subtraction',
    description:
      'Stop eating when comfortably satisfied instead of fully stuffed. Slowing down and leaving a margin helps appetite signals catch up before overeating.',
    estimatedMinutes: 20,
    frequency: 'daily',
    growthType: 'average',
    icon: '🍽️',
    iconColor: '#7C3AED',
    name: 'Stop at 80% Full',
    popularityScore: 82,
    scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26100137/',
    scientificReference:
      'Robinson et al. (2014) - Eating attentively: a systematic review and meta-analysis of the effect of food intake memory and awareness on eating',
    startSmallVersion: 'Pause halfway through one meal.',
    tips: [
      'Put utensils down for one breath between bites',
      'Check for comfortable satisfaction halfway through',
      'Leave the last few bites if fullness has arrived',
    ],
  },
];
