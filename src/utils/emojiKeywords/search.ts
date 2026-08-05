/**
 * Emoji search functionality
 * Search emojis using keyword mappings
 */

import { EMOJI_KEYWORDS } from './keywords';

/**
 * Search emojis by keyword with synonym support
 * @param query - The search query string
 * @param allEmojis - Array of all available emojis to search through
 * @returns Array of matching emoji strings
 */
export function searchEmojisByKeyword(
  query: string,
  allEmojis: string[]
): string[] {
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
  return [...results];
}
