/**
 * ReviewSentimentPrompt Component Types
 *
 * Sentiment pre-filter before native App Store review prompt.
 * Happy users → native review dialog, unhappy users → feedback form.
 */

export interface ReviewSentimentPromptProps {
  /** Whether the prompt is visible */
  visible: boolean;
  /** Called when the prompt is dismissed (any outcome) */
  onClose: () => void;
  /** Called when user taps "Yes" — trigger native review */
  onPositive: () => void;
  /** Called when user taps "Not really" — open feedback form */
  onNegative: () => void;
}
