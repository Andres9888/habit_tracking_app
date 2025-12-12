import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface LivePreviewProps {
  frequencyLabel?: string;
  habitName: string;
  reminderTime?: string;
  selectedColor: string;
  selectedEmoji: string | null;
}

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const LivePreview = ({
  frequencyLabel = 'Daily',
  habitName,
  reminderTime,
  selectedColor,
  selectedEmoji,
}: LivePreviewProps) => {
  const isEmpty = !habitName.trim() && !selectedEmoji;

  // Animation values
  const cardScale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const emptyOpacity = useRef(new Animated.Value(isEmpty ? 1 : 0)).current;
  const filledOpacity = useRef(new Animated.Value(isEmpty ? 0 : 1)).current;

  // Animate icon bounce when emoji changes
  useEffect(() => {
    if (selectedEmoji) {
      Animated.sequence([
        Animated.spring(iconScale, {
          damping: 8,
          stiffness: 300,
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          damping: 8,
          stiffness: 300,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedEmoji, iconScale]);

  // Animate card pulse when content changes
  useEffect(() => {
    if (!isEmpty) {
      Animated.sequence([
        Animated.timing(cardScale, {
          duration: 100,
          toValue: 1.02,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          damping: 10,
          stiffness: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [habitName, selectedColor, isEmpty, cardScale]);

  // Crossfade between empty and filled states
  useEffect(() => {
    Animated.parallel([
      Animated.timing(emptyOpacity, {
        duration: 200,
        toValue: isEmpty ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(filledOpacity, {
        duration: 200,
        toValue: isEmpty ? 0 : 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isEmpty, emptyOpacity, filledOpacity]);

  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold text-slate-500">✨ PREVIEW</Text>

      <Animated.View
        className="overflow-hidden rounded-2xl bg-white p-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          transform: [{ scale: cardScale }],
        }}
      >
        {/* Empty State */}
        <Animated.View
          className="absolute inset-0 items-center justify-center p-4"
          pointerEvents={isEmpty ? 'auto' : 'none'}
          style={{ opacity: emptyOpacity }}
        >
          <Text className="mb-2 text-4xl">✨</Text>
          <Text className="text-center text-sm font-medium text-slate-500">
            Your habit will appear here
          </Text>
          <Text className="mt-1 text-center text-xs text-slate-400">
            Start typing above ↑
          </Text>
        </Animated.View>

        {/* Filled State */}
        <Animated.View
          pointerEvents={isEmpty ? 'none' : 'auto'}
          style={{ opacity: filledOpacity }}
        >
          {/* Habit Card */}
          <View className="flex-row items-center">
            <Animated.View
              className="mr-4 h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: selectedColor || '#DBEAFE',
                transform: [{ scale: iconScale }],
              }}
            >
              <Text className="text-3xl">{selectedEmoji || '🎯'}</Text>
            </Animated.View>

            <View className="flex-1">
              <Text
                className="text-lg font-bold text-slate-800"
                numberOfLines={2}
              >
                {habitName || 'Your habit name'}
              </Text>
              <View className="mt-1 flex-row items-center">
                <Text className="text-sm text-slate-500">{frequencyLabel}</Text>
                {reminderTime && (
                  <>
                    <Text className="mx-2 text-slate-300">•</Text>
                    <Text className="text-sm text-blue-500">⏰ {reminderTime}</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Week Preview */}
          <View className="mt-4 rounded-xl bg-slate-50 p-3">
            <Text className="mb-2 text-xs font-medium text-slate-500">This week</Text>
            <View className="flex-row items-center justify-between">
              {WEEK_DAYS.map((day, index) => (
                <View key={`${day}-${index}`} className="items-center">
                  <Text className="mb-1 text-xs text-slate-400">{day}</Text>
                  <View
                    className="h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: selectedColor + '20' || '#DBEAFE20' }}
                  >
                    <View
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: selectedColor || '#DBEAFE' }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default LivePreview;
