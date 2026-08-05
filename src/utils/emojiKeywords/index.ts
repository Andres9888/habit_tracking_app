/**
 * Emoji keywords module
 * Provides emoji search and suggestion functionality
 */

export { EMOJI_KEYWORDS } from './keywords';
export { HABIT_NAME_EMOJI_MAP } from './habitNameMap';
export { searchEmojisByKeyword } from './search';
export {
  suggestEmojisForHabitName,
  getBestEmojiForHabitName,
} from './suggestions';
