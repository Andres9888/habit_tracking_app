/**
 * Primary / secondary actions for TemplateAddedToast.
 *
 * With a view handler the primary is "Go to <name>" and the secondary is the
 * surface's "stay here" action; without one the toast only offers dismissal.
 */

import type { HabitAddedAction } from '../HabitAddedPanel/types';

interface BuildToastActionsInput {
  actionReady: boolean;
  handleDismiss: () => void;
  primaryHint: string;
  primaryLabel: string;
  secondaryHint: string;
  secondaryLabel: string;
  viewHabit?: () => void;
  onAddAnother?: () => void;
}

export function buildToastActions({
  actionReady,
  handleDismiss,
  primaryHint,
  primaryLabel,
  secondaryHint,
  secondaryLabel,
  viewHabit,
  onAddAnother,
}: BuildToastActionsInput): {
  primary: HabitAddedAction;
  secondary?: HabitAddedAction;
} {
  if (!viewHabit) {
    return { primary: { label: secondaryLabel, onPress: () => handleDismiss() } };
  }
  return {
    primary: {
      disabled: !actionReady,
      hint: primaryHint,
      label: primaryLabel,
      onPress: () => {
        // The toast fade runs in parallel with the focus request; the
        // library stays open for at least one settle poll (see
        // useFocusHabitRequest) so press feedback still registers.
        viewHabit();
        handleDismiss();
      },
    },
    secondary: onAddAnother
      ? {
          hint: secondaryHint,
          label: secondaryLabel,
          onPress: () => {
            handleDismiss();
            onAddAnother();
          },
        }
      : undefined,
  };
}
