import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedHabitCard } from './AnimatedHabitCard.hooks';
import { getStrengthInfo, getStrengthGradientColor } from '../utils';
import { HabitCardHeader } from './HabitCardHeader';
import { HabitStatsBadges } from './HabitStatsBadges';
import { ActionButtons } from './ActionButtons';
import { SelectionCheckbox } from './SelectionCheckbox';
import { shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { AnimatedHabitCardProps } from '../types';

const CARD_SHADOW = shadows.card;

export function AnimatedHabitCard({
  habit,
  index,
  reducedMotion,
  selectionMode,
  isSelected,
  hasReachedLimit,
  onRestore,
  onDelete,
  onToggleSelect,
  onUpgradePress,
}: AnimatedHabitCardProps) {
  const { colors, isDark } = useThemeColors();
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

  const borderColor = isSelected
    ? colors.status.successLight
    : (isDark ? colors.border : 'transparent');

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={!selectionMode}
        onPress={selectionMode ? () => onToggleSelect(habit._id) : undefined}
      >
        <View
          className='overflow-hidden rounded-2xl border'
          style={[
            CARD_SHADOW,
            { backgroundColor: isDark ? colors.card : '#FFFFFF', borderColor },
          ]}
        >
          {/* Accent bar */}
          <View
            className='absolute bottom-0 left-0 top-0 w-1 rounded-l-2xl'
            style={{ backgroundColor: gradientColor }}
          />

          <View className='p-6'>
            {selectionMode && (
              <SelectionCheckbox isDark={isDark} isSelected={isSelected} />
            )}

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

            {!selectionMode && (
              <ActionButtons
                habitName={habit.name}
                hasReachedLimit={hasReachedLimit}
                isRestoring={isRestoring}
                showSuccess={showSuccess}
                successIconStyle={successIconStyle}
                onDeletePress={() => onDelete(habit._id, habit.name)}
                onRestorePress={handleRestorePress}
                onUpgradePress={onUpgradePress}
              />
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
