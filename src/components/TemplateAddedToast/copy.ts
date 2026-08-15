/**
 * Copy for the library post-add toast.
 *
 * Membership, not an event ("is in your habits"), matching the drill-down
 * panel — and free of scheduling claims beyond "when it's due", since plenty
 * of templates are weekly. The session count is folded into the message
 * instead of a separate encouragement line so the panel keeps one voice.
 */

interface ToastCopyInput {
  name: string;
  sessionImportCount: number;
  variant: 'success' | 'already_exists';
}

export interface ToastCopy {
  headline: string;
  message: string;
  primaryLabel: string;
}

export function buildToastCopy({
  name,
  sessionImportCount,
  variant,
}: ToastCopyInput): ToastCopy {
  if (variant === 'already_exists') {
    return {
      headline: `${name} is already in your habits`,
      message: 'Open it to review your progress or adjust the plan.',
      primaryLabel: `Go to ${name}`,
    };
  }

  return {
    headline: `${name} is in your habits`,
    message:
      sessionImportCount > 1
        ? `That's ${sessionImportCount} added today. Complete them from Today when they're due.`
        : "Complete it from Today when it's due.",
    primaryLabel: `Go to ${name}`,
  };
}
