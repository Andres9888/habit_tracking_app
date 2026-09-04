interface ToastCopyInput {
  name: string;
  pending?: boolean;
  sessionImportCount: number;
  variant: 'success' | 'already_exists';
}

export function buildToastCopy({
  name,
  pending,
  sessionImportCount,
  variant,
}: ToastCopyInput) {
  if (pending) {
    return {
      headline: `Adding ${name}…`,
      message: 'Saving to your habits.',
      primaryLabel: `Go to ${name}`,
    };
  }
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
