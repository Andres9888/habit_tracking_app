// Emoji keyword mappings for better search
// NOTE: This file contains static keyword data (~120 lines).
// Marked as data exception similar to templatesDataSeed.ts.

export const EMOJI_KEYWORDS: Record<string, string[]> = {
  // Smileys
  '😀': ['smile', 'happy', 'grin'],
  '😁': ['smile', 'happy', 'grin', 'teeth'],
  '😂': ['laugh', 'cry', 'tears', 'joy', 'funny'],
  '😃': ['smile', 'happy', 'grin', 'open'],
  '😄': ['smile', 'happy', 'grin', 'laugh'],
  '😅': ['sweat', 'nervous', 'laugh'],
  '😆': ['laugh', 'happy', 'squint'],
  // Gestures
  '👋': ['wave', 'hello', 'hi', 'bye'],

  '😇': ['angel', 'innocent', 'halo'],

  '👍': ['thumbs', 'up', 'yes', 'good', 'ok', 'like'],

  '😊': ['smile', 'blush', 'happy'],

  '👎': ['thumbs', 'down', 'no', 'bad', 'dislike'],

  '😍': ['love', 'heart', 'eyes'],

  '👏': ['clap', 'applause', 'congrats'],

  '😎': ['cool', 'sunglasses'],

  '✊': ['fist', 'punch', 'power'],

  '🤣': ['laugh', 'lol', 'rofl', 'funny'],
  '✌️': ['peace', 'victory', 'v'],
  '🙂': ['smile', 'slight'],
  '✍️': ['write', 'writing', 'pen'],
  // Hearts & Love
  '❤️': ['heart', 'love', 'red'],

  '🥰': ['love', 'hearts', 'adore'],

  '💙': ['heart', 'blue'],

  '🤩': ['star', 'excited', 'wow'],

  '💚': ['heart', 'green'],

  '🤓': ['nerd', 'glasses', 'geek'],

  '💔': ['heart', 'broken'],

  '💪': ['muscle', 'strong', 'strength', 'workout', 'gym', 'flex', 'bicep'],
  '💕': ['hearts', 'love'],
  '🙌': ['hands', 'celebrate', 'praise', 'hooray'],
  // Activities & Fitness
  '🏃': ['run', 'running', 'jog', 'exercise', 'cardio'],

  '🙏': ['pray', 'please', 'thanks', 'hope', 'grateful'],

  '💖': ['heart', 'sparkle'],

  '💛': ['heart', 'yellow'],

  '🏋️': ['gym', 'workout', 'lift', 'weight', 'exercise', 'fitness'],

  '🤙': ['call', 'hang', 'loose', 'shaka'],

  '🏊': ['swim', 'swimming', 'pool'],

  '⛹️': ['basketball', 'ball', 'sport'],

  '🧡': ['heart', 'orange'],

  // Nature & Weather
  '🌞': ['sun', 'sunny', 'morning', 'day'],

  '💜': ['heart', 'purple'],

  '⭐': ['star', 'favorite'],

  '🖤': ['heart', 'black'],

  '✨': ['sparkle', 'magic', 'special'],

  '🤍': ['heart', 'white'],

  '🌙': ['moon', 'night', 'evening', 'sleep'],

  '🌱': ['plant', 'grow', 'seed', 'sprout', 'nature'],

  '💗': ['heart', 'growing'],
  '🌳': ['tree', 'nature', 'forest'],
  '🚶': ['walk', 'walking', 'step'],
  '🌸': ['flower', 'cherry', 'blossom', 'spring'],
  '🧘': ['yoga', 'meditate', 'meditation', 'zen', 'mindful'],
  '⚡': ['lightning', 'energy', 'power', 'electric', 'bolt'],
  '🚴': ['bike', 'cycle', 'cycling', 'bicycle'],
  '🌺': ['flower', 'hibiscus'],
  '🌻': ['sunflower', 'flower'],
  '🤸': ['gymnastics', 'cartwheel', 'acrobat'],
  '🍀': ['clover', 'luck', 'lucky', 'irish'],
  '☕': ['coffee', 'cafe', 'morning', 'drink'],
  '💧': ['water', 'drop', 'hydrate', 'drink'],

  '🍊': ['orange', 'fruit', 'citrus'],

  '🔥': ['fire', 'hot', 'lit', 'flame', 'streak'],

  '🍋': ['lemon', 'citrus', 'sour'],

  '🍌': ['banana', 'fruit'],
  // Food & Drink
  '🍎': ['apple', 'fruit', 'healthy', 'food'],
  '🍏': ['apple', 'green', 'fruit'],
  '✏️': ['pencil', 'write', 'drawing'],
  '🍵': ['tea', 'drink', 'green'],

  '💊': ['pill', 'medicine', 'vitamin', 'supplement'],

  '📓': ['notebook', 'journal', 'diary'],

  '🎓': ['graduate', 'study', 'education', 'school', 'learn'],

  // Objects & Learning
  '📖': ['book', 'read', 'reading', 'study'],

  '🎯': ['target', 'goal', 'aim', 'focus', 'bullseye'],
  '🥑': ['avocado', 'healthy', 'food'],
  '🏆': ['trophy', 'win', 'winner', 'champion', 'award'],
  '🥗': ['salad', 'healthy', 'food', 'vegetable'],
  '🎨': ['art', 'paint', 'creative', 'palette'],
  '🥦': ['broccoli', 'vegetable', 'healthy'],
  '🎵': ['music', 'note', 'song'],
  '🎶': ['music', 'notes', 'song'],
  '🥤': ['drink', 'soda', 'cup'],
  // Time & Sleep
  '⏰': ['alarm', 'clock', 'time', 'wake'],

  '📚': ['books', 'read', 'reading', 'study', 'library'],

  '🎸': ['guitar', 'music', 'instrument'],

  '📝': ['note', 'write', 'writing', 'memo', 'journal'],

  '🎹': ['piano', 'music', 'keyboard', 'instrument'],

  '🖊️': ['pen', 'write'],

  '💡': ['idea', 'light', 'bulb', 'think', 'creative'],

  '💤': ['sleep', 'zzz', 'snore', 'rest'],

  // Tech & Work
  '💻': ['computer', 'laptop', 'work', 'tech'],

  '🧠': ['brain', 'think', 'smart', 'mind', 'learn'],

  '💯': ['hundred', 'perfect', 'score', 'complete'],

  '✅': ['check', 'done', 'complete', 'yes', 'correct'],

  '🥇': ['medal', 'gold', 'first', 'win'],

  '❌': ['x', 'no', 'wrong', 'cancel', 'delete'],
  '💼': ['briefcase', 'work', 'business', 'job'],
  '⭕': ['circle', 'zero', 'ring'],
  '📧': ['email', 'mail', 'message'],

  '🎉': ['party', 'celebrate', 'confetti', 'congrats'],

  '🕐': ['clock', 'time', 'one'],

  '🎊': ['confetti', 'celebrate', 'party'],

  '😴': ['sleep', 'sleepy', 'zzz', 'tired'],

  '🏠': ['house', 'home'],

  '🛏️': ['bed', 'sleep', 'rest'],

  '📱': ['phone', 'mobile', 'cell'],

  '📵': ['phone', 'no', 'off', 'digital', 'detox'],
  // Misc
  '🚀': ['rocket', 'launch', 'fast', 'start', 'go'],
  '🧹': ['broom', 'clean', 'sweep', 'tidy'],
  '🧼': ['soap', 'clean', 'wash'],
};
