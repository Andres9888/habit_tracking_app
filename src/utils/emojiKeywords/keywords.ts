/**
 * Emoji keyword mappings for enhanced search functionality
 * Maps emojis to arrays of synonyms/keywords for better search results
 *
 * NOTE: This file contains static emoji keyword data (~100+ entries).
 * Marked as data exception similar to templatesDataSeed.ts and categories.ts.
 */

export const EMOJI_KEYWORDS: Record<string, string[]> = {
  '⛹️': ['basketball', 'ball', 'sport', 'dribble'],

  '🏃': ['run', 'running', 'jog', 'cardio', 'sprint', 'marathon', 'exercise'],

  '🏄': ['surf', 'surfing', 'wave', 'ocean', 'beach'],

  '🏊': ['swim', 'swimming', 'pool', 'water', 'laps'],

  '✏️': ['pencil', 'write', 'drawing', 'draw', 'sketch'],

  '🏋️': [
    'gym',
    'weights',
    'lift',
    'lifting',
    'workout',
    'exercise',
    'fitness',
    'barbell',
  ],

  '🎓': [
    'graduate',
    'study',
    'education',
    'school',
    'learn',
    'degree',
    'college',
  ],

  // Fitness
  '💪': [
    'strength',
    'muscle',
    'workout',
    'gym',
    'exercise',
    'strong',
    'flex',
    'bicep',
    'lift',
  ],

  '💡': ['idea', 'light', 'bulb', 'think', 'creative', 'bright', 'insight'],

  // Learning & Knowledge
  '📖': ['book', 'read', 'reading', 'study', 'novel', 'literature'],

  '✍️': ['write', 'writing', 'pen', 'journal', 'author'],

  '🚴': ['bike', 'bicycle', 'cycling', 'cycle', 'spin', 'ride'],
  // Wellness & Relaxation
  '💆': ['massage', 'spa', 'relax', 'relaxation', 'self-care', 'selfcare'],

  '🧘': [
    'yoga',
    'meditate',
    'meditation',
    'zen',
    'mindful',
    'calm',
    'stretch',
    'pose',
  ],

  '💤': ['sleep', 'zzz', 'snore', 'rest', 'nap', 'tired'],

  '🚶': ['walk', 'walking', 'step', 'steps', 'stroll', 'hike'],

  '🌅': ['sunrise', 'morning', 'dawn', 'early', 'wake'],

  '🤸': ['gymnastics', 'cartwheel', 'acrobat', 'flip', 'tumble'],

  '🌿': ['nature', 'plant', 'green', 'calm', 'fresh', 'herb'],

  '🌙': ['moon', 'night', 'evening', 'sleep', 'dream'],

  '🧗': ['climb', 'climbing', 'rock', 'boulder'],
  '✨': ['sparkle', 'magic', 'special', 'shine', 'new'],
  '📚': ['books', 'read', 'reading', 'study', 'library', 'learn', 'education'],
  '⭐': ['star', 'favorite', 'best', 'top', 'goal'],
  '📝': ['note', 'write', 'writing', 'memo', 'journal', 'list', 'todo'],
  '🍎': ['apple', 'fruit', 'healthy', 'food', 'eat', 'snack'],
  '🧠': ['brain', 'think', 'smart', 'mind', 'learn', 'intelligence', 'mental'],
  '🍳': ['egg', 'breakfast', 'cook', 'cooking', 'food', 'protein'],
  '🔬': ['science', 'research', 'experiment', 'lab', 'microscope'],
  '💊': ['pill', 'medicine', 'vitamin', 'supplement', 'meds', 'health'],

  '💚': ['green', 'heart', 'love', 'nature', 'health'],

  '😴': ['sleep', 'sleepy', 'zzz', 'tired', 'rest', 'nap', 'bed'],

  '☕': ['coffee', 'cafe', 'morning', 'drink', 'caffeine', 'espresso'],

  '🍵': ['tea', 'drink', 'green', 'herbal', 'relax'],

  '💧': ['water', 'drop', 'hydrate', 'drink', 'hydration', 'h2o'],

  '✅': ['check', 'done', 'complete', 'yes', 'correct', 'finish', 'task'],

  '🛁': ['bath', 'relax', 'spa', 'soak', 'clean', 'tub'],

  '⏰': ['alarm', 'clock', 'time', 'wake', 'morning', 'reminder'],

  '🥑': ['avocado', 'healthy', 'food', 'green', 'fat'],

  '🎯': ['target', 'goal', 'aim', 'focus', 'bullseye', 'objective'],
  // Health & Nutrition
  '🥗': ['salad', 'healthy', 'food', 'vegetable', 'diet', 'eat', 'nutrition'],

  '💻': ['computer', 'laptop', 'work', 'tech', 'code', 'program'],

  // Work & Productivity
  '💼': ['briefcase', 'work', 'business', 'job', 'office', 'career'],

  '🥦': ['broccoli', 'vegetable', 'healthy', 'green', 'food'],

  // Creative
  '🎨': ['art', 'paint', 'creative', 'palette', 'color', 'draw', 'design'],

  '🥤': ['drink', 'soda', 'cup', 'beverage', 'smoothie'],

  '🎵': ['music', 'note', 'song', 'melody', 'sound'],

  '🩺': ['doctor', 'health', 'medical', 'checkup', 'hospital'],

  '🎭': ['theater', 'drama', 'acting', 'performance', 'mask'],

  '🎸': ['guitar', 'music', 'instrument', 'rock', 'play', 'practice'],

  '📅': ['calendar', 'schedule', 'date', 'plan', 'appointment', 'event'],

  '🎤': ['microphone', 'sing', 'karaoke', 'voice', 'speak'],
  '📋': ['clipboard', 'list', 'tasks', 'checklist', 'todo', 'plan'],
  '🎬': ['movie', 'film', 'video', 'cinema', 'direct'],
  '🌱': ['plant', 'grow', 'seed', 'sprout', 'nature', 'garden'],
  '📈': ['chart', 'growth', 'progress', 'increase', 'up', 'stats', 'improve'],
  '🎹': ['piano', 'music', 'keyboard', 'instrument', 'play', 'practice'],
  '📞': ['phone', 'call', 'telephone', 'contact'],
  // Home & Chores
  '🏠': ['house', 'home', 'family', 'domestic'],

  '📧': ['email', 'mail', 'message', 'inbox', 'send'],

  '👕': ['shirt', 'clothes', 'laundry', 'dress', 'wear'],

  // Finance
  '💰': ['money', 'save', 'savings', 'cash', 'wealth', 'budget'],

  '💵': ['dollar', 'money', 'cash', 'pay', 'bill'],

  '🏦': ['bank', 'money', 'savings', 'finance', 'account'],

  '📷': ['camera', 'photo', 'photography', 'picture', 'capture'],

  '💳': ['card', 'credit', 'payment', 'buy', 'spend'],

  '🖌️': ['brush', 'paint', 'art', 'draw', 'design'],

  '💎': ['diamond', 'gem', 'value', 'precious', 'invest'],

  // Social
  '❤️': ['heart', 'love', 'red', 'like', 'care'],

  '🛏️': ['bed', 'sleep', 'rest', 'bedroom', 'make'],

  '👨‍👩‍👧': ['family', 'parent', 'child', 'home', 'together'],

  '🧹': ['broom', 'clean', 'sweep', 'tidy', 'chore'],

  '👋': ['wave', 'hello', 'hi', 'bye', 'greet'],

  '🧺': ['laundry', 'basket', 'clothes', 'wash', 'clean'],

  '🎉': ['party', 'celebrate', 'confetti', 'congrats', 'win'],

  '🧼': ['soap', 'clean', 'wash', 'hygiene'],

  '👏': ['clap', 'applause', 'congrats', 'bravo', 'well done'],
  '🪴': ['plant', 'potted', 'indoor', 'green', 'garden'],
  '💬': ['chat', 'talk', 'message', 'speak', 'conversation'],
  '💯': ['hundred', 'perfect', 'score', 'complete', 'max', 'best'],
  '📊': ['chart', 'data', 'stats', 'analysis', 'graph', 'report'],
  '🏆': ['trophy', 'win', 'winner', 'champion', 'award', 'first'],

  '📉': ['down', 'decrease', 'chart', 'loss', 'reduce'],

  '📵': ['phone', 'no', 'off', 'digital', 'detox', 'disconnect'],

  '👍': ['thumbs', 'up', 'yes', 'good', 'ok', 'like', 'approve'],

  '🪙': ['coin', 'money', 'save', 'piggy', 'change'],
  // Misc
  '🔥': ['fire', 'hot', 'lit', 'flame', 'streak', 'burn', 'passion'],
  '😊': ['smile', 'happy', 'joy', 'positive', 'good'],
  '🙏': ['pray', 'please', 'thanks', 'hope', 'grateful', 'namaste'],
  '🤝': ['handshake', 'deal', 'agree', 'partner', 'meet'],
  '🚀': ['rocket', 'launch', 'fast', 'start', 'go', 'boost', 'growth'],
  '🤗': ['hug', 'embrace', 'warm', 'friendly', 'support'],
  '🥇': ['medal', 'gold', 'first', 'win', 'best', 'champion'],
};
