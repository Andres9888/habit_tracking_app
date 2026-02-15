/**
 * Welcome Back Messages
 *
 * Warm, encouraging copy that makes users feel good about returning
 * rather than guilty about being away.
 */

const WELCOME_MESSAGES: Record<string, string> = {
  short: "Welcome back! We missed you 👋",
  medium: "Hey, you're back! Great to see you again 🌟",
  long: "Welcome back, friend! Every return is a fresh start 🌱",
  veryLong: "You're here — that's what matters! Let's rebuild together 💪",
};

const RECOVERY_SUGGESTIONS: Record<string, string> = {
  short:
    "Pick up right where you left off — just complete one habit today to restart your streak!",
  medium:
    "Start small: focus on your easiest habit today. One chain link at a time builds momentum.",
  long:
    "No pressure — just pick one habit that feels manageable today. Consistency beats perfection.",
  veryLong:
    "The best time to start was yesterday. The second best time is right now. Pick just one habit to begin.",
};

function getDaysCategory(daysAway: number): string {
  if (daysAway <= 3) return 'short';
  if (daysAway <= 7) return 'medium';
  if (daysAway <= 14) return 'long';
  return 'veryLong';
}

export function getWelcomeBackMessage(daysAway: number): string {
  return WELCOME_MESSAGES[getDaysCategory(daysAway)] ?? WELCOME_MESSAGES.short;
}

export function getRecoverySuggestion(daysAway: number): string {
  return (
    RECOVERY_SUGGESTIONS[getDaysCategory(daysAway)] ??
    RECOVERY_SUGGESTIONS.short
  );
}

export function getWelcomeEmoji(daysAway: number): string {
  if (daysAway <= 3) return '👋';
  if (daysAway <= 7) return '🌟';
  if (daysAway <= 14) return '🌱';
  return '💪';
}
