import { Text } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { AnimatedPressable } from '../../ui';

interface DangerZoneFooterProps {
  habitCount: number;
  onDeleteAll: () => void;
}

export function DangerZoneFooter({ habitCount, onDeleteAll }: DangerZoneFooterProps) {
  const { colors } = useThemeColors();

  if (habitCount <= 1) return null;

  return (
    <AnimatedPressable
      accessibilityLabel='Delete all archived habits'
      accessibilityRole='button'
      style={{ alignItems: 'center', paddingVertical: 20 }}
      onPress={onDeleteAll}
    >
      <Text style={{ fontSize: typography.caption.fontSize, color: colors.text.tertiary }}>
        Delete all archived habits
      </Text>
    </AnimatedPressable>
  );
}
