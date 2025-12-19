/**
 * Emoji keyword mappings for enhanced search functionality
 * Maps emojis to arrays of synonyms/keywords for better search results
 */
export const EMOJI_KEYWORDS: Record<string, string[]> = {
  // Fitness
  '💪': ['strength', 'muscle', 'workout', 'gym', 'exercise', 'strong', 'flex', 'bicep', 'lift'],
  '🏃': ['run', 'running', 'jog', 'cardio', 'sprint', 'marathon', 'exercise'],
  '🚴': ['bike', 'bicycle', 'cycling', 'cycle', 'spin', 'ride'],
  '🧘': ['yoga', 'meditate', 'meditation', 'zen', 'mindful', 'calm', 'stretch', 'pose'],
  '🏋️': ['gym', 'weights', 'lift', 'lifting', 'workout', 'exercise', 'fitness', 'barbell'],
  '🏊': ['swim', 'swimming', 'pool', 'water', 'laps'],
  '🚶': ['walk', 'walking', 'step', 'steps', 'stroll', 'hike'],
  '🤸': ['gymnastics', 'cartwheel', 'acrobat', 'flip', 'tumble'],
  '⛹️': ['basketball', 'ball', 'sport', 'dribble'],
  '🏄': ['surf', 'surfing', 'wave', 'ocean', 'beach'],
  '🧗': ['climb', 'climbing', 'rock', 'boulder'],

  // Learning & Knowledge
  '📖': ['book', 'read', 'reading', 'study', 'novel', 'literature'],
  '📚': ['books', 'read', 'reading', 'study', 'library', 'learn', 'education'],
  '✏️': ['pencil', 'write', 'drawing', 'draw', 'sketch'],
  '🎓': ['graduate', 'study', 'education', 'school', 'learn', 'degree', 'college'],
  '💡': ['idea', 'light', 'bulb', 'think', 'creative', 'bright', 'insight'],
  '🧠': ['brain', 'think', 'smart', 'mind', 'learn', 'intelligence', 'mental'],
  '📝': ['note', 'write', 'writing', 'memo', 'journal', 'list', 'todo'],
  '🔬': ['science', 'research', 'experiment', 'lab', 'microscope'],
  '✍️': ['write', 'writing', 'pen', 'journal', 'author'],

  // Wellness & Relaxation
  '💆': ['massage', 'spa', 'relax', 'relaxation', 'self-care', 'selfcare'],
  '😴': ['sleep', 'sleepy', 'zzz', 'tired', 'rest', 'nap', 'bed'],
  '💤': ['sleep', 'zzz', 'snore', 'rest', 'nap', 'tired'],
  '🌅': ['sunrise', 'morning', 'dawn', 'early', 'wake'],
  '🌿': ['nature', 'plant', 'green', 'calm', 'fresh', 'herb'],
  '💚': ['green', 'heart', 'love', 'nature', 'health'],
  '🛁': ['bath', 'relax', 'spa', 'soak', 'clean', 'tub'],
  '🌙': ['moon', 'night', 'evening', 'sleep', 'dream'],
  '⭐': ['star', 'favorite', 'best', 'top', 'goal'],
  '✨': ['sparkle', 'magic', 'special', 'shine', 'new'],

  // Health & Nutrition
  '🥗': ['salad', 'healthy', 'food', 'vegetable', 'diet', 'eat', 'nutrition'],
  '🍎': ['apple', 'fruit', 'healthy', 'food', 'eat', 'snack'],
  '💧': ['water', 'drop', 'hydrate', 'drink', 'hydration', 'h2o'],
  '🥦': ['broccoli', 'vegetable', 'healthy', 'green', 'food'],
  '🍳': ['egg', 'breakfast', 'cook', 'cooking', 'food', 'protein'],
  '🥤': ['drink', 'soda', 'cup', 'beverage', 'smoothie'],
  '💊': ['pill', 'medicine', 'vitamin', 'supplement', 'meds', 'health'],
  '🩺': ['doctor', 'health', 'medical', 'checkup', 'hospital'],
  '🥑': ['avocado', 'healthy', 'food', 'green', 'fat'],
  '☕': ['coffee', 'cafe', 'morning', 'drink', 'caffeine', 'espresso'],
  '🍵': ['tea', 'drink', 'green', 'herbal', 'relax'],

  // Work & Productivity
  '💼': ['briefcase', 'work', 'business', 'job', 'office', 'career'],
  '📋': ['clipboard', 'list', 'tasks', 'checklist', 'todo', 'plan'],
  '✅': ['check', 'done', 'complete', 'yes', 'correct', 'finish', 'task'],
  '📅': ['calendar', 'schedule', 'date', 'plan', 'appointment', 'event'],
  '⏰': ['alarm', 'clock', 'time', 'wake', 'morning', 'reminder'],
  '🎯': ['target', 'goal', 'aim', 'focus', 'bullseye', 'objective'],
  '📈': ['chart', 'growth', 'progress', 'increase', 'up', 'stats', 'improve'],
  '💻': ['computer', 'laptop', 'work', 'tech', 'code', 'program'],
  '📧': ['email', 'mail', 'message', 'inbox', 'send'],
  '📞': ['phone', 'call', 'telephone', 'contact'],

  // Creative
  '🎨': ['art', 'paint', 'creative', 'palette', 'color', 'draw', 'design'],
  '🎵': ['music', 'note', 'song', 'melody', 'sound'],
  '🎸': ['guitar', 'music', 'instrument', 'rock', 'play', 'practice'],
  '📷': ['camera', 'photo', 'photography', 'picture', 'capture'],
  '🎭': ['theater', 'drama', 'acting', 'performance', 'mask'],
  '🖌️': ['brush', 'paint', 'art', 'draw', 'design'],
  '🎹': ['piano', 'music', 'keyboard', 'instrument', 'play', 'practice'],
  '🎤': ['microphone', 'sing', 'karaoke', 'voice', 'speak'],
  '🎬': ['movie', 'film', 'video', 'cinema', 'direct'],

  // Home & Chores
  '🏠': ['house', 'home', 'family', 'domestic'],
  '🧹': ['broom', 'clean', 'sweep', 'tidy', 'chore'],
  '🌱': ['plant', 'grow', 'seed', 'sprout', 'nature', 'garden'],
  '🛏️': ['bed', 'sleep', 'rest', 'bedroom', 'make'],
  '🧺': ['laundry', 'basket', 'clothes', 'wash', 'clean'],
  '👕': ['shirt', 'clothes', 'laundry', 'dress', 'wear'],
  '🧼': ['soap', 'clean', 'wash', 'hygiene'],
  '🪴': ['plant', 'potted', 'indoor', 'green', 'garden'],

  // Finance
  '💰': ['money', 'save', 'savings', 'cash', 'wealth', 'budget'],
  '💵': ['dollar', 'money', 'cash', 'pay', 'bill'],
  '📊': ['chart', 'data', 'stats', 'analysis', 'graph', 'report'],
  '🏦': ['bank', 'money', 'savings', 'finance', 'account'],
  '💳': ['card', 'credit', 'payment', 'buy', 'spend'],
  '📉': ['down', 'decrease', 'chart', 'loss', 'reduce'],
  '💎': ['diamond', 'gem', 'value', 'precious', 'invest'],
  '🪙': ['coin', 'money', 'save', 'piggy', 'change'],

  // Social
  '❤️': ['heart', 'love', 'red', 'like', 'care'],
  '👨‍👩‍👧': ['family', 'parent', 'child', 'home', 'together'],
  '💬': ['chat', 'talk', 'message', 'speak', 'conversation'],
  '🤝': ['handshake', 'deal', 'agree', 'partner', 'meet'],
  '👋': ['wave', 'hello', 'hi', 'bye', 'greet'],
  '😊': ['smile', 'happy', 'joy', 'positive', 'good'],
  '🎉': ['party', 'celebrate', 'confetti', 'congrats', 'win'],
  '🤗': ['hug', 'embrace', 'warm', 'friendly', 'support'],
  '👏': ['clap', 'applause', 'congrats', 'bravo', 'well done'],

  // Misc
  '🔥': ['fire', 'hot', 'lit', 'flame', 'streak', 'burn', 'passion'],
  '🚀': ['rocket', 'launch', 'fast', 'start', 'go', 'boost', 'growth'],
  '💯': ['hundred', 'perfect', 'score', 'complete', 'max', 'best'],
  '🏆': ['trophy', 'win', 'winner', 'champion', 'award', 'first'],
  '🥇': ['medal', 'gold', 'first', 'win', 'best', 'champion'],
  '📵': ['phone', 'no', 'off', 'digital', 'detox', 'disconnect'],
  '🙏': ['pray', 'please', 'thanks', 'hope', 'grateful', 'namaste'],
  '👍': ['thumbs', 'up', 'yes', 'good', 'ok', 'like', 'approve'],
};

/**
 * Search emojis by keyword with synonym support
 * @param query - The search query string
 * @param allEmojis - Array of all available emojis to search through
 * @returns Array of matching emoji strings
 */
export function searchEmojisByKeyword(query: string, allEmojis: string[]): string[] {
  if (!query.trim()) {
    return allEmojis;
  }

  const lowerQuery = query.toLowerCase().trim();
  const results = new Set<string>();

  // Search through keyword mappings
  for (const [emoji, keywords] of Object.entries(EMOJI_KEYWORDS)) {
    // Check if any keyword starts with or contains the query
    const matches = keywords.some(
      (keyword) => keyword.includes(lowerQuery) || lowerQuery.includes(keyword)
    );
    if (matches) {
      results.add(emoji);
    }
  }

  // If no results from keywords, return empty to show "no results" state
  // (Don't fall back to all emojis - that's confusing UX)
  return Array.from(results);
}

/**
 * Common habit name words mapped to their most relevant emojis.
 * Words are mapped to an array of emojis, with the first being the "best match".
 */
export const HABIT_NAME_EMOJI_MAP: Record<string, string[]> = {
  // Fitness & Exercise
  run: ['🏃', '💪', '🏅'],
  running: ['🏃', '💪', '🏅'],
  jog: ['🏃', '🚶', '💪'],
  jogging: ['🏃', '🚶', '💪'],
  walk: ['🚶', '🏃', '👟'],
  walking: ['🚶', '🏃', '👟'],
  exercise: ['💪', '🏃', '🏋️'],
  workout: ['💪', '🏋️', '🏃'],
  gym: ['🏋️', '💪', '🏃'],
  lift: ['🏋️', '💪', '🏃'],
  lifting: ['🏋️', '💪', '💯'],
  swim: ['🏊', '💧', '🏄'],
  swimming: ['🏊', '💧', '🏄'],
  bike: ['🚴', '🚵', '🏃'],
  biking: ['🚴', '🚵', '🚶'],
  cycling: ['🚴', '🚵', '🏃'],
  yoga: ['🧘', '💆', '🌿'],
  stretch: ['🧘', '💪', '🤸'],
  stretching: ['🧘', '💪', '🤸'],
  pushup: ['💪', '🏋️', '🏃'],
  pushups: ['💪', '🏋️', '🏃'],
  plank: ['💪', '🏋️', '🧘'],

  // Wellness & Relaxation
  meditate: ['🧘', '💆', '🌿'],
  meditation: ['🧘', '💆', '🙏'],
  sleep: ['😴', '🛏️', '💤'],
  nap: ['😴', '💤', '🛋️'],
  rest: ['😴', '💤', '🛋️'],
  relax: ['💆', '🧘', '🛁'],
  breathe: ['🧘', '🌿', '💨'],
  breathing: ['🧘', '🌿', '💨'],

  // Health & Nutrition
  water: ['💧', '🥤', '💦'],
  hydrate: ['💧', '🥤', '💦'],
  drink: ['💧', '🥤', '☕'],
  eat: ['🍎', '🥗', '🍽️'],
  healthy: ['🥗', '🍎', '💪'],
  fruit: ['🍎', '🍌', '🍇'],
  vegetable: ['🥦', '🥕', '🥗'],
  vegetables: ['🥦', '🥕', '🥗'],
  vitamin: ['💊', '🍎', '🥗'],
  vitamins: ['💊', '🍎', '🥗'],
  supplement: ['💊', '💪', '🍎'],
  supplements: ['💊', '💪', '🍎'],
  medicine: ['💊', '🩺', '💉'],
  meal: ['🍽️', '🥗', '🍳'],
  breakfast: ['🍳', '🥣', '☕'],
  coffee: ['☕', '🫖', '🍵'],
  tea: ['🍵', '🫖', '☕'],

  // Learning & Knowledge
  read: ['📖', '📚', '🧠'],
  reading: ['📖', '📚', '🧠'],
  book: ['📚', '📖', '🎓'],
  books: ['📚', '📖', '🎓'],
  study: ['📚', '🎓', '📝'],
  studying: ['📚', '🎓', '📝'],
  learn: ['🧠', '📚', '🎓'],
  learning: ['🧠', '📚', '🎓'],
  practice: ['🎯', '✏️', '🏋️'],
  write: ['✍️', '📝', '🖊️'],
  writing: ['✍️', '📝', '📖'],
  journal: ['📓', '✍️', '📝'],
  journaling: ['📓', '✍️', '📝'],
  language: ['🗣️', '📚', '🌍'],
  course: ['🎓', '📚', '💻'],

  // Work & Productivity
  work: ['💼', '💻', '📊'],
  email: ['📧', '💻', '📱'],
  emails: ['📧', '💻', '📱'],
  task: ['✅', '📋', '🎯'],
  tasks: ['✅', '📋', '🎯'],
  focus: ['🎯', '🧠', '💡'],
  plan: ['📅', '📋', '🎯'],
  planning: ['📅', '📋', '🎯'],
  organize: ['📋', '🗂️', '📁'],
  meeting: ['📅', '💼', '🤝'],
  call: ['📞', '🤳', '💬'],
  code: ['💻', '⌨️', '🖥️'],
  coding: ['💻', '⌨️', '🖥️'],
  project: ['📊', '💼', '🎯'],

  // Creative
  draw: ['🎨', '✏️', '🖌️'],
  drawing: ['🎨', '✏️', '🖌️'],
  paint: ['🎨', '🖌️', '🖼️'],
  painting: ['🎨', '🖌️', '🖼️'],
  music: ['🎵', '🎸', '🎹'],
  guitar: ['🎸', '🎵', '🎶'],
  piano: ['🎹', '🎵', '🎶'],
  sing: ['🎤', '🎵', '🎶'],
  singing: ['🎤', '🎵', '🎶'],
  photo: ['📷', '📸', '🖼️'],
  photography: ['📷', '📸', '🖼️'],
  craft: ['✂️', '🧵', '🎨'],

  // Home & Chores
  clean: ['🧹', '🧼', '✨'],
  cleaning: ['🧹', '🧼', '✨'],
  laundry: ['🧺', '👕', '🧼'],
  dishes: ['🍽️', '🧼', '🧹'],
  cook: ['🍳', '👨‍🍳', '🍽️'],
  cooking: ['🍳', '👨‍🍳', '🍽️'],
  garden: ['🌱', '🪴', '🌻'],
  gardening: ['🌱', '🪴', '🌻'],
  plant: ['🌱', '🪴', '🌿'],
  plants: ['🌱', '🪴', '🌿'],
  bed: ['🛏️', '😴', '💤'],

  // Finance
  save: ['💰', '🏦', '💵'],
  saving: ['💰', '🏦', '💵'],
  savings: ['💰', '🏦', '💵'],
  budget: ['💰', '📊', '💵'],
  invest: ['📈', '💰', '💎'],
  investing: ['📈', '💰', '💎'],
  money: ['💰', '💵', '💳'],
  expense: ['💸', '📊', '💰'],
  expenses: ['💸', '📊', '💰'],

  // Social
  family: ['👨‍👩‍👧', '❤️', '🏠'],
  friend: ['🤝', '👋', '💬'],
  friends: ['🤝', '👋', '💬'],
  gratitude: ['🙏', '❤️', '✨'],
  grateful: ['🙏', '❤️', '✨'],
  thank: ['🙏', '❤️', '💝'],
  kindness: ['❤️', '🤗', '💝'],
  connect: ['💬', '📞', '🤝'],

  // Mindset & Goals
  goal: ['🎯', '🏆', '⭐'],
  goals: ['🎯', '🏆', '⭐'],
  habit: ['✅', '📈', '🔥'],
  positive: ['😊', '✨', '☀️'],
  affirmation: ['💬', '💪', '✨'],
  affirmations: ['💬', '💪', '✨'],
  reflect: ['🪞', '🧠', '📝'],
  reflection: ['🪞', '🧠', '📝'],

  // Misc
  no: ['🚫', '❌', '✋'],
  quit: ['🚫', '✋', '💪'],
  stop: ['🛑', '🚫', '✋'],
  limit: ['📵', '⏰', '🎯'],
  screen: ['📵', '📱', '💻'],
  phone: ['📵', '📱', '☎️'],
  social: ['📵', '📱', '🤳'],
  pray: ['🙏', '⛪', '✝️'],
  prayer: ['🙏', '⛪', '✝️'],
  morning: ['🌅', '☀️', '⏰'],
  night: ['🌙', '⭐', '😴'],
  evening: ['🌙', '⭐', '🌆'],
  daily: ['📅', '✅', '🔁'],
  track: ['📊', '📈', '✅'],
  log: ['📝', '📓', '📊'],
  step: ['🚶', '👟', '📈'],
  steps: ['🚶', '👟', '📈'],
  streak: ['🔥', '📈', '⚡'],
};

/**
 * Extract words from a habit name for emoji suggestion
 * @param habitName - The habit name string
 * @returns Array of lowercase words
 */
function extractWords(habitName: string): string[] {
  return habitName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove non-letter characters
    .split(/\s+/)
    .filter((word) => word.length >= 2); // Filter out single characters
}

/**
 * Suggest emojis based on a habit name
 * Analyzes the habit name for keywords and returns relevant emoji suggestions
 *
 * @param habitName - The habit name to analyze
 * @param maxSuggestions - Maximum number of suggestions to return (default: 5)
 * @returns Array of suggested emojis with the best match first
 */
export function suggestEmojisForHabitName(
  habitName: string,
  maxSuggestions: number = 5
): string[] {
  if (!habitName.trim()) {
    return [];
  }

  const words = extractWords(habitName);
  if (words.length === 0) {
    return [];
  }

  // Collect all emoji suggestions with priority scores
  const emojiScores = new Map<string, number>();

  for (const word of words) {
    // Check exact match first
    if (HABIT_NAME_EMOJI_MAP[word]) {
      const emojis = HABIT_NAME_EMOJI_MAP[word];
      emojis.forEach((emoji, index) => {
        // Higher score for first emoji (best match), lower for alternatives
        const score = 10 - index;
        emojiScores.set(emoji, (emojiScores.get(emoji) || 0) + score);
      });
    }

    // Also check partial matches (for compound words)
    for (const [key, emojis] of Object.entries(HABIT_NAME_EMOJI_MAP)) {
      if (word.includes(key) || key.includes(word)) {
        emojis.forEach((emoji, index) => {
          // Lower priority for partial matches
          const score = (5 - index) * 0.5;
          emojiScores.set(emoji, (emojiScores.get(emoji) || 0) + score);
        });
      }
    }
  }

  // Sort by score (descending) and return top suggestions
  return Array.from(emojiScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxSuggestions)
    .map(([emoji]) => emoji);
}

/**
 * Get the best single emoji for a habit name
 * @param habitName - The habit name to analyze
 * @returns The best matching emoji, or null if no match found
 */
export function getBestEmojiForHabitName(habitName: string): string | null {
  const suggestions = suggestEmojisForHabitName(habitName, 1);
  return suggestions.length > 0 ? suggestions[0] : null;
}
