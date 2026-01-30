/**
 * Habit name to emoji mappings
 * Maps common habit words to relevant emoji suggestions
 *
 * NOTE: This file contains static mapping data (~150+ entries).
 * Marked as data exception similar to templatesDataSeed.ts and categories.ts.
 */

/**
 * Common habit name words mapped to their most relevant emojis.
 * Words are mapped to an array of emojis, with the first being the "best match".
 */
export const HABIT_NAME_EMOJI_MAP: Record<string, string[]> = {
  exercise: ['💪', '🏃', '🏋️'],

  gym: ['🏋️', '💪', '🏃'],

  jog: ['🏃', '🚶', '💪'],

  jogging: ['🏃', '🚶', '💪'],

  bike: ['🚴', '🚵', '🏃'],

  lift: ['🏋️', '💪', '🏃'],

  biking: ['🚴', '🚵', '🚶'],

  lifting: ['🏋️', '💪', '💯'],

  cycling: ['🚴', '🚵', '🏃'],
  // Fitness & Exercise
  run: ['🏃', '💪', '🏅'],
  pushup: ['💪', '🏋️', '🏃'],
  running: ['🏃', '💪', '🏅'],
  plank: ['💪', '🏋️', '🧘'],
  walk: ['🚶', '🏃', '👟'],
  // Wellness & Relaxation
  meditate: ['🧘', '💆', '🌿'],

  walking: ['🚶', '🏃', '👟'],

  meditation: ['🧘', '💆', '🙏'],

  workout: ['💪', '🏋️', '🏃'],

  nap: ['😴', '💤', '🛋️'],

  breathe: ['🧘', '🌿', '💨'],

  swim: ['🏊', '💧', '🏄'],

  breathing: ['🧘', '🌿', '💨'],

  swimming: ['🏊', '💧', '🏄'],
  drink: ['💧', '🥤', '☕'],
  stretch: ['🧘', '💪', '🤸'],
  eat: ['🍎', '🥗', '🍽️'],
  yoga: ['🧘', '💆', '🌿'],
  fruit: ['🍎', '🍌', '🍇'],
  stretching: ['🧘', '💪', '🤸'],
  healthy: ['🥗', '🍎', '💪'],

  pushups: ['💪', '🏋️', '🏃'],

  hydrate: ['💧', '🥤', '💦'],

  relax: ['💆', '🧘', '🛁'],

  medicine: ['💊', '🩺', '💉'],

  sleep: ['😴', '🛏️', '💤'],

  breakfast: ['🍳', '🥣', '☕'],

  rest: ['😴', '💤', '🛋️'],

  coffee: ['☕', '🫖', '🍵'],

  supplement: ['💊', '💪', '🍎'],

  meal: ['🍽️', '🥗', '🍳'],
  // Health & Nutrition
  water: ['💧', '🥤', '💦'],
  book: ['📚', '📖', '🎓'],
  books: ['📚', '📖', '🎓'],
  vegetable: ['🥦', '🥕', '🥗'],
  learn: ['🧠', '📚', '🎓'],
  vegetables: ['🥦', '🥕', '🥗'],

  learning: ['🧠', '📚', '🎓'],

  vitamin: ['💊', '🍎', '🥗'],

  practice: ['🎯', '✏️', '🏋️'],

  vitamins: ['💊', '🍎', '🥗'],

  journal: ['📓', '✍️', '📝'],

  supplements: ['💊', '💪', '🍎'],

  journaling: ['📓', '✍️', '📝'],

  course: ['🎓', '📚', '💻'],
  // Learning & Knowledge
  read: ['📖', '📚', '🧠'],
  email: ['📧', '💻', '📱'],
  tea: ['🍵', '🫖', '☕'],
  emails: ['📧', '💻', '📱'],
  reading: ['📖', '📚', '🧠'],
  focus: ['🎯', '🧠', '💡'],
  study: ['📚', '🎓', '📝'],
  language: ['🗣️', '📚', '🌍'],

  studying: ['📚', '🎓', '📝'],

  organize: ['📋', '🗂️', '📁'],

  call: ['📞', '🤳', '💬'],

  write: ['✍️', '📝', '🖊️'],

  code: ['💻', '⌨️', '🖥️'],

  writing: ['✍️', '📝', '📖'],

  coding: ['💻', '⌨️', '🖥️'],

  // Creative
  draw: ['🎨', '✏️', '🖌️'],

  plan: ['📅', '📋', '🎯'],

  drawing: ['🎨', '✏️', '🖌️'],

  // Work & Productivity
  work: ['💼', '💻', '📊'],

  guitar: ['🎸', '🎵', '🎶'],

  task: ['✅', '📋', '🎯'],

  meeting: ['📅', '💼', '🤝'],

  tasks: ['✅', '📋', '🎯'],
  music: ['🎵', '🎸', '🎹'],
  craft: ['✂️', '🧵', '🎨'],
  planning: ['📅', '📋', '🎯'],
  // Home & Chores
  clean: ['🧹', '🧼', '✨'],

  paint: ['🎨', '🖌️', '🖼️'],

  cleaning: ['🧹', '🧼', '✨'],

  painting: ['🎨', '🖌️', '🖼️'],

  cook: ['🍳', '👨‍🍳', '🍽️'],

  project: ['📊', '💼', '🎯'],

  cooking: ['🍳', '👨‍🍳', '🍽️'],

  dishes: ['🍽️', '🧼', '🧹'],

  photo: ['📷', '📸', '🖼️'],
  bed: ['🛏️', '😴', '💤'],
  piano: ['🎹', '🎵', '🎶'],
  garden: ['🌱', '🪴', '🌻'],
  sing: ['🎤', '🎵', '🎶'],
  budget: ['💰', '📊', '💵'],
  singing: ['🎤', '🎵', '🎶'],
  gardening: ['🌱', '🪴', '🌻'],
  photography: ['📷', '📸', '🖼️'],
  expense: ['💸', '📊', '💰'],
  invest: ['📈', '💰', '💎'],

  expenses: ['💸', '📊', '💰'],

  laundry: ['🧺', '👕', '🧼'],

  // Social
  family: ['👨‍👩‍👧', '❤️', '🏠'],

  friend: ['🤝', '👋', '💬'],

  plant: ['🌱', '🪴', '🌿'],

  friends: ['🤝', '👋', '💬'],

  plants: ['🌱', '🪴', '🌿'],

  connect: ['💬', '📞', '🤝'],

  // Finance
  save: ['💰', '🏦', '💵'],

  // Mindset & Goals
  goal: ['🎯', '🏆', '⭐'],

  saving: ['💰', '🏦', '💵'],

  affirmation: ['💬', '💪', '✨'],

  savings: ['💰', '🏦', '💵'],

  affirmations: ['💬', '💪', '✨'],

  investing: ['📈', '💰', '💎'],

  goals: ['🎯', '🏆', '⭐'],

  money: ['💰', '💵', '💳'],

  grateful: ['🙏', '❤️', '✨'],
  gratitude: ['🙏', '❤️', '✨'],
  habit: ['✅', '📈', '🔥'],
  kindness: ['❤️', '🤗', '💝'],
  limit: ['📵', '⏰', '🎯'],

  // Misc
  no: ['🚫', '❌', '✋'],

  phone: ['📵', '📱', '☎️'],

  thank: ['🙏', '❤️', '💝'],

  morning: ['🌅', '☀️', '⏰'],
  positive: ['😊', '✨', '☀️'],
  evening: ['🌙', '⭐', '🌆'],
  pray: ['🙏', '⛪', '✝️'],
  daily: ['📅', '✅', '🔁'],
  quit: ['🚫', '✋', '💪'],
  log: ['📝', '📓', '📊'],
  reflect: ['🪞', '🧠', '📝'],
  night: ['🌙', '⭐', '😴'],
  reflection: ['🪞', '🧠', '📝'],
  prayer: ['🙏', '⛪', '✝️'],
  screen: ['📵', '📱', '💻'],
  stop: ['🛑', '🚫', '✋'],
  social: ['📵', '📱', '🤳'],
  step: ['🚶', '👟', '📈'],
  steps: ['🚶', '👟', '📈'],
  streak: ['🔥', '📈', '⚡'],
  track: ['📊', '📈', '✅'],
};
