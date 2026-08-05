import { Pressable, Text, View } from 'react-native';
import { Play, Plus, Target } from 'lucide-react-native';
import { iconSizes } from '../../../../theme/iconSizes';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';

interface WeeklyTimeCardHeaderProps {
  habitColor: string;
  hasAnyGoal: boolean;
  running: boolean;
  onLogPress: () => void;
  onGoalsPress: () => void;
  onStartPress: () => void;
}

export function WeeklyTimeCardHeader({
  habitColor,
  hasAnyGoal,
  running,
  onLogPress,
  onGoalsPress,
  onStartPress,
}: WeeklyTimeCardHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-3 flex-row items-center justify-between'>
      <Text style={{ ...typography.heading3, color: colors.text.primary }}>Last 7 days</Text>
      <View className='flex-row items-center' style={{ gap: 12 }}>
        <Pressable
          accessibilityLabel='Set time goals'
          accessibilityRole='button'
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
        {!running ? (
          <Pressable
            accessibilityLabel='Start timer'
            accessibilityRole='button'
            className='flex-row items-center'
            style={{ gap: 4 }}
            onPress={onStartPress}
          >
            <Play color={habitColor} fill={habitColor} size={iconSizes.small} strokeWidth={2.5} />
            <Text
              style={{
                ...typography.bodySmall,
                color: habitColor,
                fontWeight: fontWeights.semibold,
              }}
            >
              Start
            </Text>
          </Pressable>
        ) : null}
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
