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

  const parsed = JSON.parse(jsonStr);

  if (!parsed.affirmations || !Array.isArray(parsed.affirmations)) {
    throw new Error('Invalid response format: missing affirmations array');
  }

  const validTypes = new Set<AffirmationType>([
    'identity',
    'motivational',
    'instructional',
  ]);
  const validated: GeneratedAffirmation[] = [];

  for (const aff of parsed.affirmations) {
    if (!aff.text || typeof aff.text !== 'string') {
      continue; // Skip invalid entries
    }

    const text = aff.text.trim();
    if (text.length < 3 || text.length > MAX_TEXT_LENGTH) {
      continue; // Skip entries that don't meet length requirements
    }

    const type: AffirmationType = validTypes.has(aff.type)
      ? aff.type
      : 'motivational';

    validated.push({ text, type });
  }

  return validated;
}
