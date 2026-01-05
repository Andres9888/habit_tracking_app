/**
 * HabitsEmptyStateMinimal - Utility Functions
 *
 * Time-based chip selection logic and autocomplete matching.
 */

import type { SuggestionChip } from './types';
import {
  MORNING_CHIPS,
  AFTERNOON_CHIPS,
  EVENING_CHIPS,
  NIGHT_CHIPS,
  STATIC_CHIPS,
} from './constants';
import {
  HABIT_SUGGESTIONS,
  MIN_CHARS_FOR_SUGGESTIONS,
  MAX_SUGGESTIONS_SHOWN,
  type HabitSuggestion,
} from './habitSuggestions';

/**
 * Time windows for chip suggestions (24-hour format)
 */
export const TIME_WINDOWS = {
  // 5am - 11am
  AFTERNOON: { end: 17, start: 11 },
  // 11am - 5pm
  EVENING: { end: 22, start: 17 },
  MORNING: { end: 11, start: 5 }, // 5pm - 10pm
  NIGHT: { end: 5, start: 22 }, // 10pm - 5am (wraps midnight)
} as const;

/**
 * Get contextually relevant chip suggestions based on current time
 *
 * @param date - Date object to check (defaults to now)
 * @param useTimeBased - Feature flag to enable/disable time-based logic
 * @returns Array of 6 suggestion chips appropriate for the time
 *
 * @example
 * // At 8:30am
 * getTimeBasedChips() // Returns MORNING_CHIPS
 *
 * // At 3:15pm
 * getTimeBasedChips() // Returns AFTERNOON_CHIPS
 *
 * // With feature flag disabled
 * getTimeBasedChips(new Date(), false) // Returns STATIC_CHIPS
 */
export function getTimeBasedChips(
  date: Date = new Date(),
  useTimeBased: boolean = true
): SuggestionChip[] {
  // Feature flag: return static chips if disabled
  if (!useTimeBased) {
    return STATIC_CHIPS;
  }

  const hour = date.getHours(); // 0-23

  // Morning: 5am - 11am
  if (hour >= TIME_WINDOWS.MORNING.start && hour < TIME_WINDOWS.MORNING.end) {
    return MORNING_CHIPS;
  }

  // Afternoon: 11am - 5pm
  if (
    hour >= TIME_WINDOWS.AFTERNOON.start &&
    hour < TIME_WINDOWS.AFTERNOON.end
  ) {
    return AFTERNOON_CHIPS;
  }

  // Evening: 5pm - 10pm
  if (hour >= TIME_WINDOWS.EVENING.start && hour < TIME_WINDOWS.EVENING.end) {
    return EVENING_CHIPS;
  }

  // Night: 10pm - 5am (wraps around midnight)
  return NIGHT_CHIPS;
}

// ============================================================================
// AUTOCOMPLETE MATCHING LOGIC
// ============================================================================

/**
 * Match score for ranking suggestions
 */
interface MatchResult {
  suggestion: HabitSuggestion;
  score: number; // Higher = better match
  matchType: 'prefix' | 'word' | 'fuzzy' | 'keyword';
}

/**
 * Fuzzy match: Check if all characters in query appear in text in order
 *
 * @example
 * fuzzyMatch("excs", "exercise") // true (e-x-c-s matches e-x-e-r-c-i-s-e)
 * fuzzyMatch("abc", "axxxbxxxc") // true
 * fuzzyMatch("abc", "acb") // false (wrong order)
 */
function fuzzyMatch(query: string, text: string): boolean {
  let queryIndex = 0;
  for (let i = 0; i < text.length && queryIndex < query.length; i++) {
    if (text[i] === query[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === query.length;
}

/**
 * Get autocomplete suggestions for user input
 *
 * Matching priority:
 * 1. Prefix match (highest score): "ex" → "**Ex**ercise"
 * 2. Word boundary match: "morning" → "**Morning** coffee"
 * 3. Keyword match: "workout" → "Exercise" (via keywords)
 * 4. Fuzzy match (lowest score): "excs" → "**Ex**er**c**i**s**e"
 *
 * @param input - User's input text
 * @param maxResults - Maximum suggestions to return (default: 5)
 * @returns Sorted array of matching suggestions (best matches first)
 *
 * @example
 * getAutocompleteSuggestions("exe") // ["Exercise 10 minutes", "Exercise 30 minutes"]
 * getAutocompleteSuggestions("read") // ["Read 5 pages", "Read 10 pages", "Read 20 pages"]
 */
export function getAutocompleteSuggestions(
  input: string,
  maxResults: number = MAX_SUGGESTIONS_SHOWN
): HabitSuggestion[] {
  // Return empty if input too short
  if (input.length < MIN_CHARS_FOR_SUGGESTIONS) {
    return [];
  }

  const query = input.toLowerCase().trim();
  const matches: MatchResult[] = [];

  for (const suggestion of HABIT_SUGGESTIONS) {
    const text = suggestion.text.toLowerCase();
    let score = 0;
    let matchType: MatchResult['matchType'] = 'fuzzy';

    // 1. Prefix match (highest priority): score = 100
    if (text.startsWith(query)) {
      score = 100;
      matchType = 'prefix';
    }
    // 2. Word boundary match: score = 80
    else if (text.includes(` ${query}`)) {
      score = 80;
      matchType = 'word';
    }
    // 3. Keyword match: score = 60
    else if (suggestion.keywords?.some(kw => kw.toLowerCase().includes(query))) {
      score = 60;
      matchType = 'keyword';
    }
    // 4. Fuzzy match (contains all characters in order): score = 40
    else if (fuzzyMatch(query, text)) {
      score = 40;
      matchType = 'fuzzy';
    }

    // Boost score for shorter suggestions (more concise = better)
    if (score > 0) {
      const lengthPenalty = Math.max(0, suggestion.text.length - 20) * 0.1;
      score -= lengthPenalty;
      matches.push({ suggestion, score, matchType });
    }
  }

  // Sort by score (descending) and return top N
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(m => m.suggestion);
}

/**
 * Get the best (top-scored) suggestion for inline preview
 *
 * @param input - User's input text
 * @returns Best matching suggestion text, or null if no matches
 *
 * @example
 * getBestSuggestion("exe") // "Exercise 10 minutes"
 * getBestSuggestion("x") // null (too short)
 */
export function getBestSuggestion(input: string): string | null {
  const suggestions = getAutocompleteSuggestions(input, 1);
  return suggestions.length > 0 ? suggestions[0].text : null;
}

/**
 * Get the inline preview text (grayed out completion)
 *
 * Returns only the part of the suggestion that extends beyond user input
 *
 * @param input - User's current input
 * @param suggestion - Full suggestion text
 * @returns The preview text to show in gray, or empty string if no preview
 *
 * @example
 * getInlinePreview("exe", "Exercise 10 minutes") // "rcise 10 minutes"
 * getInlinePreview("Exercise", "Exercise 10 minutes") // " 10 minutes"
 * getInlinePreview("Walk", "Run") // "" (no prefix match)
 */
export function getInlinePreview(input: string, suggestion: string): string {
  const inputLower = input.toLowerCase();
  const suggestionLower = suggestion.toLowerCase();

  // Only show preview if suggestion starts with input
  if (suggestionLower.startsWith(inputLower)) {
    return suggestion.substring(input.length);
  }

  return '';
}
