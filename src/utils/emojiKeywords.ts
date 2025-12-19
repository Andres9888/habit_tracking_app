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
