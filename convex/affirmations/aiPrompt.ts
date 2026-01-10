/**
 * AI prompt generation for affirmations
 */

import type { HabitContext } from './types';
import { MAX_TEXT_LENGTH } from './types';

/**
 * Build the prompt for AI affirmation generation
 */
export function buildAffirmationPrompt(
  habitContext: HabitContext,
  existingAffirmations: string[],
  count: number
): string {
  const contextParts: string[] = [`Habit: ${habitContext.name}`];

  if (habitContext.why) {
    contextParts.push(`Why (user's motivation): "${habitContext.why}"`);
  }
  if (habitContext.identity) {
    contextParts.push(
      `Identity (who they're becoming): "${habitContext.identity}"`
    );
  }
  if (habitContext.notes) {
    contextParts.push(`Notes: "${habitContext.notes}"`);
  }
  if (habitContext.vizSuccessBody) {
    contextParts.push(
      `Success visualization (Body): "${habitContext.vizSuccessBody}"`
    );
  }
  if (habitContext.vizSuccessMind) {
    contextParts.push(
      `Success visualization (Mind): "${habitContext.vizSuccessMind}"`
    );
  }
  if (habitContext.vizSuccessEmotion) {
    contextParts.push(
      `Success visualization (Emotion): "${habitContext.vizSuccessEmotion}"`
    );
  }

  const existingPart =
    existingAffirmations.length > 0
      ? `\n\nExisting affirmations (avoid similar ones):\n${existingAffirmations.map((a) => `- "${a}"`).join('\n')}`
      : '';

  return `You are an expert in positive psychology, self-affirmation theory (Steele, 1988), and habit formation science.

Generate exactly ${count} personalized affirmations for a user building this habit:

${contextParts.join('\n')}${existingPart}

REQUIREMENTS:
1. Each affirmation MUST be under ${MAX_TEXT_LENGTH} characters
2. Create a mix of three types:
   - identity: "I am..." statements about who they're becoming (most powerful)
   - motivational: Encouraging statements about capability and progress
   - instructional: Guiding statements about approach and mindset

3. Make them:
   - Personal and specific to THIS habit (not generic)
   - Present tense (not future)
   - Positive framing (not negative)
   - Emotionally resonant based on their "why" and visualization
   - Actionable and believable

4. If user provided identity/why statements, incorporate their language

RESPOND WITH EXACTLY THIS JSON FORMAT (no other text):
{
  "affirmations": [
    {"text": "...", "type": "identity"},
    {"text": "...", "type": "motivational"},
    {"text": "...", "type": "instructional"}
  ]
}`;
}
