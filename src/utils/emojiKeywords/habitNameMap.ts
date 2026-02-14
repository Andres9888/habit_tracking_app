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
  bike: ['🚴', '🚵', '🏃'],

  biking: ['🚴', '🚵', '🚶'],

  cycling: ['🚴', '🚵', '🏃'],

  exercise: ['💪', '🏃', '🏋️'],

  gym: ['🏋️', '💪', '🏃'],

  jog: ['🏃', '🚶', '💪'],

  jogging: ['🏃', '🚶', '💪'],

  lift: ['🏋️', '💪', '🏃'],

  lifting: ['🏋️', '💪', '💯'],
  
  // Wellness & Relaxation
meditate: ['🧘', '💆', '🌿'],
  

breathe: ['🧘', '🌿', '💨'],
  

meditation: ['🧘', '💆', '🙏'],
  

breathing: ['🧘', '🌿', '💨'],
  

nap: ['😴', '💤', '🛋️'],
  
  
drink: ['💧', '🥤', '☕'],

  
plank: ['💪', '🏋️', '🧘'],

  
eat: ['🍎', '🥗', '🍽️'],

  
pushup: ['💪', '🏋️', '🏃'],

  
fruit: ['🍎', '🍌', '🍇'],

  // Fitness & Exercise
run: ['🏃', '💪', '🏅'],

  healthy: ['🥗', '🍎', '💪'],

  running: ['🏃', '💪', '🏅'],

  hydrate: ['💧', '🥤', '💦'],
  walk: ['🚶', '🏃', '👟'],
  medicine: ['💊', '🩺', '💉'],
  walking: ['🚶', '🏃', '👟'],
  breakfast: ['🍳', '🥣', '☕'],
  workout: ['💪', '🏋️', '🏃'],
  coffee: ['☕', '🫖', '🍵'],
  meal: ['🍽️', '🥗', '🍳'],

  swim: ['🏊', '💧', '🏄'],

  book: ['📚', '📖', '🎓'],

  swimming: ['🏊', '💧', '🏄'],

  books: ['📚', '📖', '🎓'],

  stretch: ['🧘', '💪', '🤸'],

  learn: ['🧠', '📚', '🎓'],

  yoga: ['🧘', '💆', '🌿'],

  learning: ['🧠', '📚', '🎓'],

  stretching: ['🧘', '💪', '🤸'],

  practice: ['🎯', '✏️', '🏋️'],
  
  pushups: ['💪', '🏋️', '🏃'],
  
journal: ['📓', '✍️', '📝'],
  
relax: ['💆', '🧘', '🛁'],
  
journaling: ['📓', '✍️', '📝'],
  
sleep: ['😴', '🛏️', '💤'],
  
course: ['🎓', '📚', '💻'],

  
rest: ['😴', '💤', '🛋️'],

  
email: ['📧', '💻', '📱'],

  
supplement: ['💊', '💪', '🍎'],

  
emails: ['📧', '💻', '📱'],

  // Health & Nutrition
water: ['💧', '🥤', '💦'],

  focus: ['🎯', '🧠', '💡'],

  language: ['🗣️', '📚', '🌍'],

  vegetable: ['🥦', '🥕', '🥗'],
  
  organize: ['📋', '🗂️', '📁'],
  
vegetables: ['🥦', '🥕', '🥗'],
  
call: ['📞', '🤳', '💬'],
  
vitamin: ['💊', '🍎', '🥗'],
  
code: ['💻', '⌨️', '🖥️'],
  
vitamins: ['💊', '🍎', '🥗'],
  
coding: ['💻', '⌨️', '🖥️'],
  
supplements: ['💊', '💪', '🍎'],

  
// Creative
draw: ['🎨', '✏️', '🖌️'],

  

drawing: ['🎨', '✏️', '🖌️'],

  
// Learning & Knowledge
read: ['📖', '📚', '🧠'],

  
guitar: ['🎸', '🎵', '🎶'],

  
tea: ['🍵', '🫖', '☕'],

  
meeting: ['📅', '💼', '🤝'],

  
reading: ['📖', '📚', '🧠'],

  
  music: ['🎵', '🎸', '🎹'],

  study: ['📚', '🎓', '📝'],

  craft: ['✂️', '🧵', '🎨'],

  
  studying: ['📚', '🎓', '📝'],

  
// Home & Chores
clean: ['🧹', '🧼', '✨'],

  

cleaning: ['🧹', '🧼', '✨'],

  

write: ['✍️', '📝', '🖊️'],

  

cook: ['🍳', '👨‍🍳', '🍽️'],
  

writing: ['✍️', '📝', '📖'],
  

cooking: ['🍳', '👨‍🍳', '🍽️'],
  

dishes: ['🍽️', '🧼', '🧹'],
  
  
plan: ['📅', '📋', '🎯'],

  
bed: ['🛏️', '😴', '💤'],

  // Work & Productivity
work: ['💼', '💻', '📊'],

  garden: ['🌱', '🪴', '🌻'],

  task: ['✅', '📋', '🎯'],

  budget: ['💰', '📊', '💵'],

  tasks: ['✅', '📋', '🎯'],

  gardening: ['🌱', '🪴', '🌻'],

  expense: ['💸', '📊', '💰'],
  planning: ['📅', '📋', '🎯'],
  expenses: ['💸', '📊', '💰'],
  paint: ['🎨', '🖌️', '🖼️'],
  // Social
family: ['👨‍👩‍👧', '❤️', '🏠'],
  
painting: ['🎨', '🖌️', '🖼️'],
  
friend: ['🤝', '👋', '💬'],
  
project: ['📊', '💼', '🎯'],
  
friends: ['🤝', '👋', '💬'],
  
connect: ['💬', '📞', '🤝'],
  
photo: ['📷', '📸', '🖼️'],

  
// Mindset & Goals
goal: ['🎯', '🏆', '⭐'],

  

piano: ['🎹', '🎵', '🎶'],

  
  
affirmation: ['💬', '💪', '✨'],

  
sing: ['🎤', '🎵', '🎶'],

  
affirmations: ['💬', '💪', '✨'],

  
singing: ['🎤', '🎵', '🎶'],

  
goals: ['🎯', '🏆', '⭐'],

  
photography: ['📷', '📸', '🖼️'],

  
  
grateful: ['🙏', '❤️', '✨'],

  
  
invest: ['📈', '💰', '💎'],

  
gratitude: ['🙏', '❤️', '✨'],

  
laundry: ['🧺', '👕', '🧼'],

  
habit: ['✅', '📈', '🔥'],

  
investing: ['📈', '💰', '💎'],

  
plant: ['🌱', '🪴', '🌿'],

  
kindness: ['❤️', '🤗', '💝'],

  
plants: ['🌱', '🪴', '🌿'],

  
evening: ['🌙', '⭐', '🌆'],
  // Finance
save: ['💰', '🏦', '💵'],
  daily: ['📅', '✅', '🔁'],
  saving: ['💰', '🏦', '💵'],
  limit: ['📵', '⏰', '🎯'],

  
  savings: ['💰', '🏦', '💵'],

  
log: ['📝', '📓', '📊'],

  
money: ['💰', '💵', '💳'],

  
morning: ['🌅', '☀️', '⏰'],
  
night: ['🌙', '⭐', '😴'],
  // Misc
no: ['🚫', '❌', '✋'],
  phone: ['📵', '📱', '☎️'],
  positive: ['😊', '✨', '☀️'],
  pray: ['🙏', '⛪', '✝️'],
  prayer: ['🙏', '⛪', '✝️'],
  quit: ['🚫', '✋', '💪'],
  reflect: ['🪞', '🧠', '📝'],
  thank: ['🙏', '❤️', '💝'],
  reflection: ['🪞', '🧠', '📝'],
  screen: ['📵', '📱', '💻'],
  social: ['📵', '📱', '🤳'],
  step: ['🚶', '👟', '📈'],
  steps: ['🚶', '👟', '📈'],
  stop: ['🛑', '🚫', '✋'],
  streak: ['🔥', '📈', '⚡'],
  track: ['📊', '📈', '✅'],
};
