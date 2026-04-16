import { useState } from 'react';
import { View } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { ResumeButton, DeleteIconButton, LimitReachedButtons, DeleteConfirmRow } from './ActionButtonParts';

interface ActionButtonsProps {
  habitName: string;
  isRestoring: boolean;
  showSuccess: boolean;
  hasReachedLimit?: boolean;
  successIconStyle: AnimatedStyle;
  onRestorePress: () => void;
  onDeletePress: () => void;
  onUpgradePress?: () => void;
}

export function ActionButtons({
  habitName, isRestoring, showSuccess, hasReachedLimit,
  successIconStyle, onRestorePress, onDeletePress, onUpgradePress,
}: ActionButtonsProps) {
  const { colors } = useThemeColors();
  const [showConfirm, setShowConfirm] = useState(false);

  const btnBg = showSuccess ? colors.primary[700] : colors.status.success;
  const greenColor = colors.text.inverse;

  if (hasReachedLimit) {
    return <LimitReachedButtons onDeletePress={() => setShowConfirm(true)} onUpgradePress={onUpgradePress} />;
  }

  if (showConfirm) {
    return (
      <View style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
        <DeleteConfirmRow onCancel={() => setShowConfirm(false)} onDelete={onDeletePress} />
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}>
        <ResumeButton
          btnBg={btnBg} greenColor={greenColor} habitName={habitName}
          isRestoring={isRestoring} showSuccess={showSuccess}
          successIconStyle={successIconStyle} onRestorePress={onRestorePress}
        />
      </View>
      <DeleteIconButton habitName={habitName} onPress={() => setShowConfirm(true)} />
    </View>
  );
}
