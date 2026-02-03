/**
 * Emoji Search Utilities
 *
 * Functions for searching and filtering emojis by keyword or category.
 */

import { EMOJI_CATEGORIES } from './categories';
import { EMOJI_KEYWORDS } from './keywords';

// Helper function to get all emojis as a flat array
export const getAllEmojis = (): string[] => {
  return EMOJI_CATEGORIES.flatMap((category) => category.emojis);
};

// Helper function to search emojis
export const searchEmojis = (query: string): string[] => {
  if (!query.trim()) {
    return getAllEmojis();
  }

  const lowerQuery = query.toLowerCase();
  const results: string[] = [];

  // Search by emoji keywords
  for (const [emoji, keywords] of Object.entries(EMOJI_KEYWORDS)) {
    if (keywords.some((keyword) => keyword.includes(lowerQuery))) {
      results.push(emoji);
    }
  }

  // Search by category name
  for (const category of EMOJI_CATEGORIES) {
    if (category.category.toLowerCase().includes(lowerQuery)) {
      results.push(...category.emojis);
    }
  }

  // If no results found, return all emojis that might match the query
  if (results.length === 0) {
    // Search through all emojis and match if query is part of category
    return getAllEmojis();
  }

  return [...new Set(results)]; // Remove duplicates
};

// Get emojis by category ID
export const getEmojisByCategory = (categoryId: string): string[] => {
  const category = EMOJI_CATEGORIES.find((cat) => cat.id === categoryId);
  return category ? category.emojis : [];
};
