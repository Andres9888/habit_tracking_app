/**
 * Emoji suggestion functionality
 * Suggest emojis based on habit names
 */

import { HABIT_NAME_EMOJI_MAP } from './habitNameMap';

/**
 * Extract words from a habit name for emoji suggestion
 * @param habitName - The habit name string
 * @returns Array of lowercase words
 */
function extractWords(habitName: string): string[] {
  return habitName
    .toLowerCase()
    .replaceAll(/[^a-z\s]/g, '') // Remove non-letter characters
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
      for (const [index, emoji] of emojis.entries()) {
        // Higher score for first emoji (best match), lower for alternatives
        const score = 10 - index;
        emojiScores.set(emoji, (emojiScores.get(emoji) || 0) + score);
      }
    }

    // Also check partial matches (for compound words)
    for (const [key, emojis] of Object.entries(HABIT_NAME_EMOJI_MAP)) {
      if (word.includes(key) || key.includes(word)) {
        for (const [index, emoji] of emojis.entries()) {
          // Lower priority for partial matches
          const score = (5 - index) * 0.5;
          emojiScores.set(emoji, (emojiScores.get(emoji) || 0) + score);
        }
      }
    }
  }

  // Sort by score (descending) and return top suggestions
  return [...emojiScores.entries()]
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
