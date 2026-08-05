import type { AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { ResumeButton, LimitReachedResume } from './ActionButtonParts';

interface ActionButtonsProps {
  habitName: string;
  isRestoring: boolean;
  showSuccess: boolean;
  hasReachedLimit?: boolean;
  successIconStyle: AnimatedStyle;
  onRestorePress: () => void;
  onUpgradePress?: () => void;
}

export function ActionButtons({
  habitName,
  isRestoring,
  showSuccess,
  hasReachedLimit,
  successIconStyle,
  onRestorePress,
  onUpgradePress,
}: ActionButtonsProps) {
  const { colors } = useThemeColors();

  if (hasReachedLimit) {
    return <LimitReachedResume onUpgradePress={onUpgradePress} />;
  }

  // Calm secondary chip — soft green tile + green text (was a full-width
  // saturated-green button). On success it fills solid for a clear confirm.
  const chipBg = showSuccess ? colors.primary[600] : colors.primary[100];
  const chipFg = showSuccess ? colors.text.inverse : colors.primary[700];

  return (
    <ResumeButton
      chipBg={chipBg}
      chipFg={chipFg}
      habitName={habitName}
      isRestoring={isRestoring}
      showSuccess={showSuccess}
      successIconStyle={successIconStyle}
      onRestorePress={onRestorePress}
    />
  );
}
