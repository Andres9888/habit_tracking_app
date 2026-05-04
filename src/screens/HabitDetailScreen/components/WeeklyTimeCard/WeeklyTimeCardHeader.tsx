import { Pressable, Text, View } from 'react-native';
import { Plus, Target } from 'lucide-react-native';
import { iconSizes } from '../../../../theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';

interface WeeklyTimeCardHeaderProps {
  hasAnyGoal: boolean;
  onLogPress: () => void;
  onGoalsPress: () => void;
}

export function WeeklyTimeCardHeader({
  hasAnyGoal,
  onLogPress,
  onGoalsPress,
}: WeeklyTimeCardHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row items-center justify-between'>
      <Text style={{ ...typography.heading3, color: colors.text.primary }}>Last 7 days</Text>
      <View className='flex-row items-center' style={{ gap: 12 }}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Set time goals'
          className='flex-row items-center'
          style={{ gap: 4 }}
          onPress={onGoalsPress}
        >
          <Target color={colors.text.secondary} size={iconSizes.small} strokeWidth={2.5} />
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.secondary,
              fontWeight: fontWeights.semibold,
            }}
          >
            {hasAnyGoal ? 'Goals' : 'Set goal'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole='button'
          className='flex-row items-center'
          style={{ gap: 4 }}
          onPress={onLogPress}
        >
          <Plus color={colors.text.secondary} size={iconSizes.small} strokeWidth={2.5} />
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.text.secondary,
              fontWeight: fontWeights.semibold,
            }}
          >
            Log time
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
