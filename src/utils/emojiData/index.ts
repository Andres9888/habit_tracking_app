/**
 * Emoji Data Module
 *
 * Provides emoji data and search functionality for the emoji picker.
 * Includes habit-focused categories and keyword search.
 */

// Types
export type { EmojiCategory } from './types';

// Data
export { EMOJI_CATEGORIES } from './categories';
export { EMOJI_KEYWORDS } from './keywords';
export { POPULAR_EMOJIS } from './popular';

// Functions
export { getAllEmojis, searchEmojis, getEmojisByCategory } from './search';
