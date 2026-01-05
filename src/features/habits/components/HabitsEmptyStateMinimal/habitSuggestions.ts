/**
 * HabitsEmptyStateMinimal - Habit Suggestions Database
 *
 * Curated habit suggestions for autocomplete functionality.
 * Organized by category for maintainability and ease of updates.
 */

/**
 * Habit suggestion data structure for autocomplete
 */
export interface HabitSuggestion {
  /** Display text for the suggestion */
  text: string;
  /** Category for organization (not shown to user) */
  category:
    | 'physical'
    | 'mental'
    | 'productivity'
    | 'nutrition'
    | 'social'
    | 'custom';
  /** Search keywords for fuzzy matching (optional) */
  keywords?: string[];
  /** Emoji to show in dropdown (optional) */
  emoji?: string;
}

/**
 * Physical Health Habits
 * Focus: Exercise, movement, sleep, hydration
 */
const PHYSICAL_HABITS: HabitSuggestion[] = [
  {
    text: 'Exercise 10 minutes',
    category: 'physical',
    emoji: '🏃',
    keywords: ['workout', 'gym', 'fitness', 'cardio'],
  },
  {
    text: 'Exercise 30 minutes',
    category: 'physical',
    emoji: '🏃',
    keywords: ['workout', 'gym', 'fitness'],
  },
  {
    text: 'Walk 5 minutes',
    category: 'physical',
    emoji: '🚶',
    keywords: ['stroll', 'walking'],
  },
  {
    text: 'Walk 10 minutes',
    category: 'physical',
    emoji: '🚶',
    keywords: ['stroll', 'walking'],
  },
  {
    text: 'Walk 30 minutes',
    category: 'physical',
    emoji: '🚶',
    keywords: ['stroll', 'walking', 'outdoor'],
  },
  {
    text: 'Run 1 mile',
    category: 'physical',
    emoji: '🏃',
    keywords: ['jog', 'running', 'cardio'],
  },
  {
    text: 'Run 2 miles',
    category: 'physical',
    emoji: '🏃',
    keywords: ['jog', 'running', 'cardio'],
  },
  {
    text: 'Stretch for 5 minutes',
    category: 'physical',
    emoji: '🤸',
    keywords: ['flexibility', 'yoga', 'warmup'],
  },
  {
    text: 'Stretch for 10 minutes',
    category: 'physical',
    emoji: '🤸',
    keywords: ['flexibility', 'yoga', 'cooldown'],
  },
  {
    text: 'Yoga for 10 minutes',
    category: 'physical',
    emoji: '🧘',
    keywords: ['flexibility', 'stretch', 'mindfulness'],
  },
  {
    text: 'Yoga for 20 minutes',
    category: 'physical',
    emoji: '🧘',
    keywords: ['flexibility', 'stretch'],
  },
  {
    text: 'Drink 8 glasses of water',
    category: 'physical',
    emoji: '💧',
    keywords: ['hydrate', 'water', 'hydration'],
  },
  {
    text: 'Take vitamins',
    category: 'physical',
    emoji: '💊',
    keywords: ['supplements', 'pills', 'health'],
  },
  {
    text: 'Go to bed by 10pm',
    category: 'physical',
    emoji: '🛌',
    keywords: ['sleep', 'bedtime', 'rest'],
  },
  {
    text: 'Go to bed by 11pm',
    category: 'physical',
    emoji: '🛌',
    keywords: ['sleep', 'bedtime', 'rest'],
  },
  {
    text: 'Sleep 8 hours',
    category: 'physical',
    emoji: '😴',
    keywords: ['rest', 'bedtime', 'recovery'],
  },
  {
    text: 'Do push-ups',
    category: 'physical',
    emoji: '💪',
    keywords: ['strength', 'workout', 'exercise'],
  },
  {
    text: 'Do squats',
    category: 'physical',
    emoji: '💪',
    keywords: ['strength', 'workout', 'exercise', 'legs'],
  },
  {
    text: 'Bike 10 minutes',
    category: 'physical',
    emoji: '🚴',
    keywords: ['cycling', 'cardio', 'exercise'],
  },
  {
    text: 'Swim for 20 minutes',
    category: 'physical',
    emoji: '🏊',
    keywords: ['swimming', 'cardio', 'exercise'],
  },
];

/**
 * Mental Wellness Habits
 * Focus: Mindfulness, reading, digital detox, journaling
 */
const MENTAL_HABITS: HabitSuggestion[] = [
  {
    text: 'Meditate for 5 minutes',
    category: 'mental',
    emoji: '🧘',
    keywords: ['mindfulness', 'breathe', 'calm'],
  },
  {
    text: 'Meditate for 10 minutes',
    category: 'mental',
    emoji: '🧘',
    keywords: ['mindfulness', 'breathe', 'calm'],
  },
  {
    text: 'Meditate for 15 minutes',
    category: 'mental',
    emoji: '🧘',
    keywords: ['mindfulness', 'breathe'],
  },
  {
    text: 'Breathe deeply for 2 minutes',
    category: 'mental',
    emoji: '🌬️',
    keywords: ['breathing', 'calm', 'relaxation'],
  },
  {
    text: 'Practice gratitude',
    category: 'mental',
    emoji: '🙏',
    keywords: ['thankful', 'grateful', 'appreciation'],
  },
  {
    text: 'Journal for 10 minutes',
    category: 'mental',
    emoji: '📝',
    keywords: ['write', 'diary', 'reflection'],
  },
  {
    text: 'Journal for 15 minutes',
    category: 'mental',
    emoji: '📝',
    keywords: ['write', 'diary', 'reflection'],
  },
  {
    text: 'Read 5 pages',
    category: 'mental',
    emoji: '📚',
    keywords: ['book', 'reading', 'learn'],
  },
  {
    text: 'Read 10 pages',
    category: 'mental',
    emoji: '📚',
    keywords: ['book', 'reading'],
  },
  {
    text: 'Read 20 pages',
    category: 'mental',
    emoji: '📚',
    keywords: ['book', 'reading'],
  },
  {
    text: 'Read for 30 minutes',
    category: 'mental',
    emoji: '📚',
    keywords: ['book', 'reading'],
  },
  {
    text: 'No phone for 1 hour',
    category: 'mental',
    emoji: '📱',
    keywords: ['digital detox', 'unplug', 'disconnect'],
  },
  {
    text: 'Digital detox after 9pm',
    category: 'mental',
    emoji: '📵',
    keywords: ['phone off', 'screen time', 'unplug'],
  },
  {
    text: 'Listen to podcast',
    category: 'mental',
    emoji: '🎧',
    keywords: ['audio', 'learn', 'education'],
  },
  {
    text: 'Practice mindfulness',
    category: 'mental',
    emoji: '🧘',
    keywords: ['meditation', 'awareness', 'present'],
  },
];

/**
 * Productivity Habits
 * Focus: Learning, planning, focus, organization
 */
const PRODUCTIVITY_HABITS: HabitSuggestion[] = [
  {
    text: 'Write for 10 minutes',
    category: 'productivity',
    emoji: '✍️',
    keywords: ['writing', 'compose', 'create'],
  },
  {
    text: 'Write for 30 minutes',
    category: 'productivity',
    emoji: '✍️',
    keywords: ['writing', 'compose'],
  },
  {
    text: 'Learn something new',
    category: 'productivity',
    emoji: '🧠',
    keywords: ['study', 'education', 'knowledge'],
  },
  {
    text: 'Practice language for 15 minutes',
    category: 'productivity',
    emoji: '🗣️',
    keywords: ['spanish', 'french', 'duolingo', 'language'],
  },
  {
    text: 'Review daily goals',
    category: 'productivity',
    emoji: '🎯',
    keywords: ['planning', 'goals', 'organize'],
  },
  {
    text: 'Plan tomorrow',
    category: 'productivity',
    emoji: '📅',
    keywords: ['organize', 'schedule', 'calendar'],
  },
  {
    text: 'Clean workspace',
    category: 'productivity',
    emoji: '🧹',
    keywords: ['tidy', 'organize', 'desk'],
  },
  {
    text: 'Inbox zero',
    category: 'productivity',
    emoji: '📧',
    keywords: ['email', 'messages', 'organize'],
  },
  {
    text: 'One focused work session',
    category: 'productivity',
    emoji: '🎯',
    keywords: ['deep work', 'focus', 'concentrate'],
  },
  {
    text: 'No social media before noon',
    category: 'productivity',
    emoji: '📵',
    keywords: ['focus', 'productivity', 'discipline'],
  },
  {
    text: 'Morning routine completed',
    category: 'productivity',
    emoji: '☀️',
    keywords: ['routine', 'morning', 'start'],
  },
  {
    text: 'Complete 3 important tasks',
    category: 'productivity',
    emoji: '✅',
    keywords: ['tasks', 'todo', 'accomplish'],
  },
  {
    text: 'No distractions for 1 hour',
    category: 'productivity',
    emoji: '🔇',
    keywords: ['focus', 'deep work', 'concentrate'],
  },
  {
    text: 'Review progress weekly',
    category: 'productivity',
    emoji: '📊',
    keywords: ['reflect', 'analyze', 'review'],
  },
  {
    text: 'Set 3 priorities for the day',
    category: 'productivity',
    emoji: '🎯',
    keywords: ['planning', 'goals', 'priorities'],
  },
];

/**
 * Nutrition Habits
 * Focus: Healthy eating, meal planning, hydration
 */
const NUTRITION_HABITS: HabitSuggestion[] = [
  {
    text: 'Eat vegetables with lunch',
    category: 'nutrition',
    emoji: '🥗',
    keywords: ['healthy', 'veggies', 'salad'],
  },
  {
    text: 'Eat vegetables with dinner',
    category: 'nutrition',
    emoji: '🥗',
    keywords: ['healthy', 'veggies'],
  },
  {
    text: 'Healthy breakfast',
    category: 'nutrition',
    emoji: '🍳',
    keywords: ['morning meal', 'nutrition'],
  },
  {
    text: 'No sugar today',
    category: 'nutrition',
    emoji: '🍬',
    keywords: ['diet', 'sweets', 'healthy'],
  },
  {
    text: 'Prep meals for tomorrow',
    category: 'nutrition',
    emoji: '🍱',
    keywords: ['meal prep', 'cooking', 'planning'],
  },
  {
    text: 'Drink green tea',
    category: 'nutrition',
    emoji: '🍵',
    keywords: ['tea', 'beverage', 'antioxidants'],
  },
  {
    text: 'Eat slowly (20 min meals)',
    category: 'nutrition',
    emoji: '🍽️',
    keywords: ['mindful eating', 'slow'],
  },
  {
    text: 'No eating after 8pm',
    category: 'nutrition',
    emoji: '🚫',
    keywords: ['fasting', 'diet', 'discipline'],
  },
  {
    text: 'Track calories',
    category: 'nutrition',
    emoji: '📊',
    keywords: ['diet', 'nutrition', 'count'],
  },
  {
    text: 'Cook at home',
    category: 'nutrition',
    emoji: '👨‍🍳',
    keywords: ['cooking', 'homemade', 'prepare'],
  },
  {
    text: 'Eat fruit with breakfast',
    category: 'nutrition',
    emoji: '🍎',
    keywords: ['healthy', 'fruit', 'vitamins'],
  },
  {
    text: 'No snacking between meals',
    category: 'nutrition',
    emoji: '🚫',
    keywords: ['discipline', 'diet', 'fasting'],
  },
  {
    text: 'Drink water before meals',
    category: 'nutrition',
    emoji: '💧',
    keywords: ['hydrate', 'water', 'health'],
  },
  {
    text: 'Take multivitamin',
    category: 'nutrition',
    emoji: '💊',
    keywords: ['supplements', 'vitamins', 'health'],
  },
];

/**
 * Social & Personal Development Habits
 * Focus: Relationships, creativity, learning, kindness
 */
const SOCIAL_HABITS: HabitSuggestion[] = [
  {
    text: 'Call a friend',
    category: 'social',
    emoji: '📞',
    keywords: ['phone', 'connect', 'friendship'],
  },
  {
    text: 'Text someone I love',
    category: 'social',
    emoji: '💬',
    keywords: ['message', 'family', 'connect'],
  },
  {
    text: 'Practice instrument for 15 minutes',
    category: 'social',
    emoji: '🎸',
    keywords: ['music', 'guitar', 'piano', 'practice'],
  },
  {
    text: 'Learn new skill for 20 minutes',
    category: 'social',
    emoji: '🎓',
    keywords: ['hobby', 'practice', 'education'],
  },
  {
    text: 'Spend time with family',
    category: 'social',
    emoji: '👨‍👩‍👧',
    keywords: ['family time', 'connect', 'relationships'],
  },
  {
    text: 'Express appreciation',
    category: 'social',
    emoji: '💝',
    keywords: ['gratitude', 'thank', 'kindness'],
  },
  {
    text: 'Random act of kindness',
    category: 'social',
    emoji: '💕',
    keywords: ['help', 'kind', 'generous'],
  },
  {
    text: 'Listen without interrupting',
    category: 'social',
    emoji: '👂',
    keywords: ['active listening', 'empathy', 'communication'],
  },
  {
    text: 'Take a photo',
    category: 'social',
    emoji: '📷',
    keywords: ['photography', 'picture', 'memories'],
  },
  {
    text: 'Create something',
    category: 'social',
    emoji: '🎨',
    keywords: ['art', 'creative', 'make'],
  },
  {
    text: 'Compliment someone',
    category: 'social',
    emoji: '💬',
    keywords: ['kindness', 'appreciation', 'positive'],
  },
  {
    text: 'Volunteer for a cause',
    category: 'social',
    emoji: '🤝',
    keywords: ['help', 'charity', 'community'],
  },
  {
    text: 'Practice active listening',
    category: 'social',
    emoji: '👂',
    keywords: ['communication', 'empathy', 'listen'],
  },
];

/**
 * Master list of all habit suggestions
 * ~75 curated habits across 5 categories
 */
export const HABIT_SUGGESTIONS: HabitSuggestion[] = [
  ...PHYSICAL_HABITS,
  ...MENTAL_HABITS,
  ...PRODUCTIVITY_HABITS,
  ...NUTRITION_HABITS,
  ...SOCIAL_HABITS,
];

/**
 * Minimum characters required before showing suggestions
 */
export const MIN_CHARS_FOR_SUGGESTIONS = 3;

/**
 * Maximum number of suggestions to show in dropdown
 */
export const MAX_SUGGESTIONS_SHOWN = 5;
