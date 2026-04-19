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
  habitName, isRestoring, showSuccess, hasReachedLimit,
  successIconStyle, onRestorePress, onUpgradePress,
}: ActionButtonsProps) {
  const { colors } = useThemeColors();

  if (hasReachedLimit) {
    return <LimitReachedResume onUpgradePress={onUpgradePress} />;
  }

  const btnBg = showSuccess ? colors.primary[700] : colors.status.success;
  const greenColor = colors.text.inverse;

  return (
    <ResumeButton
      btnBg={btnBg} greenColor={greenColor} habitName={habitName}
      isRestoring={isRestoring} showSuccess={showSuccess}
      successIconStyle={successIconStyle} onRestorePress={onRestorePress}
    />
  );
}
