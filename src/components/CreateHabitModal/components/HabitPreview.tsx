import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import STRINGS from '../../../constants/strings';
import { SkeletonCard } from './SkeletonLoader';

interface HabitPreviewProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  frequencyLabel?: string;
}

export const HabitPreview = ({
  habitName,
  selectedEmoji,
  selectedColor,
  frequencyLabel,
}: HabitPreviewProps) => {
  const isEmpty = !habitName && !selectedEmoji;
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Animations
  const iconScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;

  // Brief skeleton on mount for polish
  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Trigger spring animation when content changes
  useEffect(() => {
    if (!isEmpty) {
      // Bounce the icon
      Animated.sequence([
        Animated.spring(iconScale, {
          toValue: 1.15,
          tension: 180,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 180,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Subtle content pulse
      Animated.sequence([
        Animated.spring(contentScale, {
          toValue: 1.02,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [habitName, selectedEmoji, selectedColor, isEmpty, iconScale, contentScale]);

  return (
    <View className='mb-6 mt-4 rounded-2xl bg-white p-4'>
      <Text className='mb-2 text-xs font-semibold text-[#78716c]'>✨ Live Preview</Text>

      {showSkeleton ? (
        <View className='py-2'>
          <SkeletonCard />
        </View>
      ) : isEmpty ? (
        <View className='items-center py-6'>
          <Text className='mb-2 text-4xl'>✨</Text>
          <Text className='mb-1 text-sm font-medium text-[#78716c]'>Your habit will appear here</Text>
          <Text className='text-xs text-[#a8a29e]'>Try: "Meditate", "Run", or "Read"</Text>
        </View>
      ) : (
        <Animated.View style={{ opacity: contentOpacity, transform: [{ scale: contentScale }] }}>
          <View className='flex-row items-center gap-4'>
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              {selectedEmoji ? (
                <View
                  className='h-16 w-16 items-center justify-center rounded-2xl'
                  style={{ backgroundColor: selectedColor }}
                >
                  <Text className='text-[30px]'>{selectedEmoji}</Text>
                </View>
              ) : (
                <View
                  className='h-16 w-16 items-center justify-center rounded-2xl bg-gray-200'
                >
                  <Text className='text-2xl text-gray-400'>?</Text>
                </View>
              )}
            </Animated.View>
            <View className='flex-1'>
              {habitName ? (
                <Text className='text-[22px] font-semibold text-[#1a1a1a]'>
                  {habitName}
                </Text>
              ) : (
                <Text className='text-[22px] font-semibold text-[#a8a29e]'>
                  {STRINGS.CREATE_HABIT.namePlaceholder}
                </Text>
              )}
              {!!frequencyLabel && (
                <Text className='text-sm font-medium text-[#8a8a8a]'>
                  {capitalize(frequencyLabel)}
                </Text>
              )}
            </View>
          </View>

          {/* Week Preview */}
          <View className='mt-4 rounded-xl bg-[#f8f5f1] p-3'>
            <Text className='mb-2 text-xs font-medium text-[#78716c]'>This week:</Text>
            <View className='flex-row items-center justify-between'>
              {weekDays.map((day, index) => (
                <View key={`${day}-${index}`} className='items-center gap-1'>
                  <Text className='text-xs text-[#a8a29e]'>{day}</Text>
                  <View className='h-6 w-6 items-center justify-center rounded-full bg-white'>
                    <View className='h-2 w-2 rounded-full bg-[#e7e5e4]' />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const capitalize = (s?: string) => {
  if (!s) return s ?? '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
