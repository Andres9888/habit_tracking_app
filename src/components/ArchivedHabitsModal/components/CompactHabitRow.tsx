import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Lock, Trash2 } from 'lucide-react-native';
import { durations } from '@/theme/animations';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { shadows } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { useReducedMotionEntry } from '../../EmptyState/useReducedMotionEntry';
import { getRelativeTime, getStrengthInfo } from '../utils';
import { pickAccentColor } from '../../DraggableHabit/DraggableHabit.hooks';
import { SelectionCheckbox } from './SelectionCheckbox';
import type { ArchivedHabit } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';

interface CompactHabitRowProps {
  habit: ArchivedHabit;
  index: number;
  isLast: boolean;
  isSelected?: boolean;
  hasReachedLimit?: boolean;
  selectionMode?: boolean;
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>;
  onDelete: (id: Id<'habits'>, name: string) => void;
  onUpgradePress?: () => void;
  onToggleSelect?: (id: Id<'habits'>) => void;
}

export function CompactHabitRow({
  habit,
  index,
  isLast,
  isSelected = false,
  hasReachedLimit,
  selectionMode = false,
  onRestore,
  onDelete,
  onUpgradePress,
  onToggleSelect,
}: CompactHabitRowProps) {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();
  const [isRestoring, setIsRestoring] = useState(false);
  const accentColor =
    habit.color || habit.iconColor || pickAccentColor(habit.name);
  const archiveDate = habit.archivedAt || habit._creationTime;
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const cardBorderColor = isSelected
    ? colors.status.success
    : isDark
      ? colors.border
      : 'transparent';
  const hasStrength = typeof habit.strength === 'number';
  const strength = Math.round((habit.strength ?? 0) * 100);
  const strengthInfo = hasStrength ? getStrengthInfo(strength, isDark) : null;
  const strengthColor =
    strengthInfo?.textStyle ||
    (strength < 20 ? colors.status.error : colors.primary[700]);
  const entranceDelay = Math.min(
    index * durations.stagger,
    durations.stagger * 4
  );

  const handleRestore = async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    const success = await onRestore(habit._id, habit.name);
    if (!success) setIsRestoring(false);
  };

  const card = (
    <View
      className='rounded-2xl'
      style={[
        shadows.card,
        {
          backgroundColor: cardBg,
          borderWidth: 1,
          borderColor: cardBorderColor,
          borderLeftWidth: 4,
          borderLeftColor: accentColor,
        },
      ]}
    >
      {selectionMode ? (
        <SelectionCheckbox isDark={isDark} isSelected={isSelected} />
      ) : null}
      <View
        className='flex-row items-center py-4 pr-4'
        style={{ paddingLeft: 16 }}
      >
        <View
          className='h-11 w-11 items-center justify-center rounded-xl'
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Text style={{ fontSize: 26 }}>{habit.icon || '📝'}</Text>
        </View>
        <View className='ml-3 mr-3 flex-1'>
          <Text
            numberOfLines={1}
            style={[
              typography.body,
              { color: colors.text.primary, fontWeight: fontWeights.semibold },
            ]}
          >
            {habit.name}
          </Text>
          <View className='mt-0.5 flex-row flex-wrap items-center'>
            <Text style={[typography.caption, { color: colors.text.tertiary }]}>
              {getRelativeTime(archiveDate)}
            </Text>
            {strengthInfo ? (
              <>
                <Text
                  style={[
                    typography.caption,
                    { color: colors.text.tertiary, marginHorizontal: 6 },
                  ]}
                >
                  ·
                </Text>
                <Text
                  style={[
                    typography.caption,
                    { color: strengthColor, fontWeight: fontWeights.semibold },
                  ]}
                >
                  {strengthInfo.emoji} {strength}%
                </Text>
              </>
            ) : null}
          </View>
        </View>
        {selectionMode ? (
          <Text
            style={[
              typography.caption,
              {
                color: isSelected
                  ? colors.status.success
                  : colors.text.tertiary,
                fontWeight: fontWeights.semibold,
              },
            ]}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Text>
        ) : (
          <View className='flex-row items-center gap-2'>
            <Pressable
              accessibilityLabel={
                hasReachedLimit
                  ? 'Upgrade to resume archived habit'
                  : `Resume ${habit.name}`
              }
              accessibilityRole='button'
              className='h-8 flex-row items-center justify-center gap-1 rounded-full px-3.5'
              disabled={isRestoring}
              style={{
                backgroundColor: colors.status.success,
                opacity: isRestoring ? 0.6 : 1,
              }}
              onPress={hasReachedLimit ? onUpgradePress : handleRestore}
            >
              {hasReachedLimit ? (
                <Lock
                  color={colors.text.inverse}
                  size={iconSizes.small}
                  strokeWidth={2.5}
                />
              ) : null}
              <Text
                style={[
                  typography.caption,
                  {
                    color: colors.text.inverse,
                    fontWeight: fontWeights.semibold,
                  },
                ]}
              >
                {isRestoring ? 'Restoring...' : 'Resume'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityLabel={`Delete ${habit.name}`}
              accessibilityRole='button'
              className='h-8 w-8 items-center justify-center rounded-lg'
              hitSlop={8}
              style={{ backgroundColor: colors.status.errorLight }}
              onPress={() => onDelete(habit._id, habit.name)}
            >
              <Trash2 color={colors.status.error} size={iconSizes.small} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Animated.View
      entering={entry(entranceDelay)}
      style={{ marginBottom: isLast ? 0 : 10 }}
    >
      {selectionMode ? (
        <Pressable
          accessibilityHint='Double tap to select this archived habit for bulk actions'
          accessibilityLabel={habit.name}
          accessibilityRole='checkbox'
          accessibilityState={{ checked: isSelected }}
          onPress={() => onToggleSelect?.(habit._id)}
        >
          {card}
        </Pressable>
      ) : (
        card
      )}
    </Animated.View>
  );
}
