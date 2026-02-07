import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedHabitCard } from './AnimatedHabitCard.hooks';
import { getStrengthInfo, getStrengthGradientColor } from '../utils';
import { HabitCardHeader } from './HabitCardHeader';
import { HabitStatsBadges } from './HabitStatsBadges';
import { ActionButtons } from './ActionButtons';
import { StrengthBackground } from './StrengthBackground';
import { shadows } from '../../../theme/spacing';
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
  const strengthInfo = getStrengthInfo(strength);
  const gradientColor = getStrengthGradientColor(strength);
  const archiveDate = habit.archivedAt || habit._creationTime;

  return (
    <Animated.View style={animatedStyle}>
      <View
        className='overflow-hidden rounded-2xl border border-stone-200 bg-white'
        style={CARD_SHADOW}
      >
        <StrengthBackground gradientColor={gradientColor} strength={strength} />

        <View className='relative p-4'>
          <HabitCardHeader
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
