import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedHabitCard } from './AnimatedHabitCard.hooks';
import { getStrengthInfo, getStrengthGradientColor } from '../utils';
import { HabitCardHeader } from './HabitCardHeader';
import { HabitStatsBadges } from './HabitStatsBadges';
import { ActionButtons } from './ActionButtons';
import { StrengthBackground } from './StrengthBackground';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { AnimatedHabitCardProps } from '../types';

const CARD_SHADOW = {
  ...shadows.card,
  shadowOpacity: 0.05,
};

export function AnimatedHabitCard({
  habit,
  index,
  reducedMotion,
  onRestore,
  onDelete,
}: AnimatedHabitCardProps) {
  const { isDark } = useThemeColors();
  const {
    isRestoring,
    showSuccess,
    animatedStyle,
    successIconStyle,
    handleRestorePress,
  } = useAnimatedHabitCard({
    habitId: habit._id,
    habitName: habit.name,
    index,
    onRestore,
    reducedMotion,
  });

  const strength = (habit.strength ?? 0) * 100;
  const strengthInfo = getStrengthInfo(strength, isDark);
  const gradientColor = getStrengthGradientColor(strength);
  const archiveDate = habit.archivedAt || habit._creationTime;

  return (
    <Animated.View style={animatedStyle}>
      <View
        className='overflow-hidden rounded-2xl border'
        style={[
          CARD_SHADOW,
          {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e7e5e4',
          },
        ]}
      >
        <StrengthBackground gradientColor={gradientColor} strength={strength} />

        <View className='relative p-4'>
          <HabitCardHeader
            accentColor={gradientColor}
            archiveDate={archiveDate}
            icon={habit.icon}
            iconColor={habit.iconColor}
            name={habit.name}
          />

          <HabitStatsBadges
            habit={habit}
            strength={strength}
            strengthInfo={strengthInfo}
          />

          <ActionButtons
            habitName={habit.name}
            isRestoring={isRestoring}
            showSuccess={showSuccess}
            successIconStyle={successIconStyle}
            onDeletePress={() => onDelete(habit._id, habit.name)}
            onRestorePress={handleRestorePress}
          />
        </View>
      </View>
    </Animated.View>
  );
}
