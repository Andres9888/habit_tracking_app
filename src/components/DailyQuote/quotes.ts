/**
 * Motivational quotes for habit building
 * Curated collection focused on consistency, growth, and habits
 */

export type { QuoteData } from './quotes.types';
import { QUOTES_PART1, QUOTES_PART2 } from './quotes.data';

export const QUOTES = [...QUOTES_PART1, ...QUOTES_PART2];
