import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedHabitCard } from './AnimatedHabitCard.hooks';
import { pickAccentColor } from '../../DraggableHabit/DraggableHabit.hooks';
import { HabitCardHeader } from './HabitCardHeader';
import { HabitStatsBadges } from './HabitStatsBadges';
import { ActionButtons } from './ActionButtons';
import { SelectionCheckbox } from './SelectionCheckbox';
import { useThemeColors } from '@/theme/ThemeContext';
import type { AnimatedHabitCardProps } from '../types';

export function AnimatedHabitCard({
  habit, index, reducedMotion, selectionMode, isSelected,
  hasReachedLimit, onRestore, onDelete, onToggleSelect, onUpgradePress,
}: AnimatedHabitCardProps) {
  const { colors, isDark } = useThemeColors();
  const {
    isRestoring, showSuccess, animatedStyle, successIconStyle, handleRestorePress,
  } = useAnimatedHabitCard({ habitId: habit._id, habitName: habit.name, index, onRestore, reducedMotion });

  const strength = (habit.strength ?? 0) * 100;
  const accentBarColor = habit.color || habit.iconColor || pickAccentColor(habit.name);
  const archiveDate = habit.archivedAt || habit._creationTime;
  const selected = isSelected && selectionMode;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={!selectionMode}
        onPress={selectionMode ? () => onToggleSelect(habit._id) : undefined}
      >
        <View
          style={{
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderRadius: 20, overflow: 'hidden',
            borderWidth: selected ? 1.5 : 1,
            borderColor: selected ? colors.status.success + '40' : (isDark ? colors.border : 'rgba(221,216,210,0.5)'),
            shadowColor: '#2D2A26', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
            elevation: 2,
          }}
        >
          {/* Accent strip */}
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: accentBarColor }} />
          <View style={{ paddingVertical: 20, paddingRight: 20, paddingLeft: 24 }}>
            {selectionMode && <SelectionCheckbox isDark={isDark} isSelected={isSelected} />}
            <HabitCardHeader
              accentColor={accentBarColor} archiveDate={archiveDate}
              icon={habit.icon} iconColor={habit.iconColor} name={habit.name}
              showDelete={!selectionMode}
              onDeletePress={() => onDelete(habit._id, habit.name)}
            />
            <HabitStatsBadges habit={habit} strength={strength} />
            {!selectionMode && (
              <ActionButtons
                habitName={habit.name} hasReachedLimit={hasReachedLimit}
                isRestoring={isRestoring} showSuccess={showSuccess}
                successIconStyle={successIconStyle}
                onRestorePress={handleRestorePress} onUpgradePress={onUpgradePress}
              />
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
