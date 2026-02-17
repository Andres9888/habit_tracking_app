import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme';
import { MOOD_EMOJIS, type JournalEntry } from './types';

interface JournalEntryCardProps {
  entry: JournalEntry;
  index: number;
  onDelete: (id: JournalEntry['_id']) => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function JournalEntryCard({ entry, index, onDelete }: JournalEntryCardProps) {
  const { colors, isDark } = useThemeColors();
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const promptColor = isDark ? colors.text.tertiary : '#9C958D';

  return (
    <Animated.View
      className='mb-3 rounded-2xl p-4'
      entering={FadeInUp.duration(280).delay(index * 60).springify().damping(18)}
      style={{
        backgroundColor: cardBg,
        elevation: 4,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
      }}
    >
      {/* Header: mood + date + delete */}
      <View className='mb-2 flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-xl'>{MOOD_EMOJIS[entry.mood]}</Text>
          <View>
            <Text
              className='text-[13px] font-semibold'
              style={{ color: colors.text.primary }}
            >
              {formatDate(entry.createdAt)}
            </Text>
            <Text
              className='text-[11px]'
              style={{ color: colors.text.tertiary }}
            >
              {formatTime(entry.createdAt)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          accessibilityLabel='Delete entry'
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => onDelete(entry._id)}
        >
          <Text className='text-[13px]' style={{ color: '#EF4444' }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <Text
        className='mb-3 text-[15px] leading-[22px]'
        style={{ color: colors.text.primary }}
      >
        {entry.textContent}
      </Text>

      {/* Prompted questions */}
      {entry.whatWentWell ? (
        <View className='mb-2'>
          <Text className='text-[11px] font-semibold uppercase tracking-wider' style={{ color: promptColor }}>
            What went well?
          </Text>
          <Text className='mt-0.5 text-[13px]' style={{ color: colors.text.secondary }}>
            {entry.whatWentWell}
          </Text>
        </View>
      ) : null}

      {entry.whatWasHard ? (
        <View className='mb-2'>
          <Text className='text-[11px] font-semibold uppercase tracking-wider' style={{ color: promptColor }}>
            What was hard?
          </Text>
          <Text className='mt-0.5 text-[13px]' style={{ color: colors.text.secondary }}>
            {entry.whatWasHard}
          </Text>
        </View>
      ) : null}

      {entry.whatWillChange ? (
        <View>
          <Text className='text-[11px] font-semibold uppercase tracking-wider' style={{ color: promptColor }}>
            What will you do differently?
          </Text>
          <Text className='mt-0.5 text-[13px]' style={{ color: colors.text.secondary }}>
            {entry.whatWillChange}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}
