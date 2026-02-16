/**
 * AI response parsing for affirmations
 */

import type { GeneratedAffirmation, AffirmationType } from './types';
import { MAX_TEXT_LENGTH } from './types';

/**
 * Parse and validate the AI response
 */
export function parseAffirmationsResponse(
  response: string
): GeneratedAffirmation[] {
  // Extract JSON from potential markdown code blocks
  let jsonStr = response.trim();

  // Handle ```json ... ``` format
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', error);
    throw new Error('Invalid response format: JSON parse error');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid response format: response is not an object');
  }

  const parsedObj = parsed as Record<string, unknown>;
  if (!parsedObj.affirmations || !Array.isArray(parsedObj.affirmations)) {
    throw new Error('Invalid response format: missing affirmations array');
  }

  const validTypes = new Set<AffirmationType>([
    'identity',
    'motivational',
    'instructional',
  ]);
  const validated: GeneratedAffirmation[] = [];

  const affirmations = parsedObj.affirmations || [];
  if (!Array.isArray(affirmations)) {
    return validated; // Return empty if affirmations is not an array
  }

  for (const aff of affirmations) {
    if (!aff || typeof aff !== 'object') {
      continue; // Skip non-object entries
    }

    const affObj = aff as Record<string, unknown>;
    if (!affObj.text || typeof affObj.text !== 'string') {
      continue; // Skip invalid entries
    }

    const text = affObj.text.trim();
    if (text.length < 3 || text.length > MAX_TEXT_LENGTH) {
      continue; // Skip entries that don't meet length requirements
    }

    const affirmationType = affObj.type || 'motivational';
    const type: AffirmationType = validTypes.has(affirmationType as AffirmationType)
      ? (affirmationType as AffirmationType)
      : 'motivational';

    validated.push({ text, type });
  }

  return validated;
}
