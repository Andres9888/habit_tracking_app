import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Lock, Trash2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { shadows } from '../../../theme/spacing';
import { typography, fontWeights } from '../../../theme/typography';
import { getRelativeTime } from '../utils';
import { pickAccentColor } from '../../DraggableHabit/DraggableHabit.hooks';
import type { ArchivedHabit } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';

interface CompactHabitRowProps {
  habit: ArchivedHabit;
  isLast: boolean;
  hasReachedLimit?: boolean;
  onRestore: (id: Id<'habits'>, name: string) => Promise<boolean>;
  onDelete: (id: Id<'habits'>, name: string) => void;
  onUpgradePress?: () => void;
}

export function CompactHabitRow({
  habit, isLast, hasReachedLimit,
  onRestore, onDelete, onUpgradePress,
}: CompactHabitRowProps) {
  const { colors, isDark } = useThemeColors();
  const [isRestoring, setIsRestoring] = useState(false);
  const accentColor = habit.color || habit.iconColor || pickAccentColor(habit.name);
  const archiveDate = habit.archivedAt || habit._creationTime;
  const cardBg = colors.card;

  const handleRestore = async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    const success = await onRestore(habit._id, habit.name);
    if (!success) setIsRestoring(false);
  };

  return (
    <View style={{ marginBottom: isLast ? 0 : 10 }}>
      <View
        className='rounded-2xl'
        style={[shadows.card, { backgroundColor: cardBg, borderWidth: 1, borderColor: isDark ? colors.border : 'transparent', borderLeftWidth: 4, borderLeftColor: accentColor }]}
      >
        <View className='flex-row items-center py-4 pr-4' style={{ paddingLeft: 16 }}>
          <View
            className='h-11 w-11 items-center justify-center rounded-full'
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Text style={{ fontSize: 26 }}>{habit.icon || '📝'}</Text>
          </View>
          <View className='ml-3 mr-3 flex-1'>
            <Text
              numberOfLines={1}
              style={[typography.body, { color: colors.text.primary, fontWeight: fontWeights.semibold }]}
            >{habit.name}</Text>
            <Text style={[typography.caption, { color: colors.text.tertiary }]}>
              {getRelativeTime(archiveDate)}
            </Text>
          </View>
          <View className='flex-row items-center gap-2'>
            <Pressable
              className='h-8 flex-row items-center justify-center gap-1 rounded-full px-3.5'
              disabled={isRestoring}
              style={{ backgroundColor: colors.status.success, opacity: isRestoring ? 0.6 : 1 }}
              onPress={hasReachedLimit ? onUpgradePress : handleRestore}
            >
              {hasReachedLimit && <Lock color={colors.text.inverse} size={iconSizes.small} strokeWidth={2.5} />}
              <Text style={[typography.caption, { color: colors.text.inverse, fontWeight: fontWeights.semibold }]}>
                {isRestoring ? 'Done!' : 'Resume'}
              </Text>
            </Pressable>
            <Pressable
              className='h-8 w-8 items-center justify-center rounded-lg'
              hitSlop={8}
              style={{ backgroundColor: colors.status.errorLight }}
              onPress={() => onDelete(habit._id, habit.name)}
            >
              <Trash2 color={colors.status.error} size={iconSizes.small} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
