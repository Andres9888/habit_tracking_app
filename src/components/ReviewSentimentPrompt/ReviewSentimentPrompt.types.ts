/**
 * ReviewSentimentPrompt Types
 *
 * Pre-filter before the native App Store review dialog.
 * Routes positive users → native dialog, negative users → feedback form.
 */

export interface ReviewSentimentPromptProps {
  /** Whether the sentiment modal is visible */
  visible: boolean;
  /** Called when the user taps "Yes, I love it!" */
  onPositive: () => void;
  /** Called when the user taps "Not really" */
  onNegative: () => void;
  /** Called when the modal is dismissed without action */
  onDismiss: () => void;
  /**
   * Optional context hint shown in the subtitle.
   * e.g. "You just hit a 7-day streak!" or "You've completed 50 habits!"
   */
  contextMessage?: string;
}
