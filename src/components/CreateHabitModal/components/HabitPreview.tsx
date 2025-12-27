import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import STRINGS from '../../../constants/strings';
import { SkeletonCard } from './SkeletonLoader';
import { HUBERMAN_PHASES, type HubermanPhase } from '../../../constants/hubermanPhases';

interface HabitPreviewProps {
  habitName: string;
  selectedEmoji: string | null;
  selectedColor: string;
  timeOfDay?: HubermanPhase | null;
}

export const HabitPreview = ({
  habitName,
  selectedEmoji,
  selectedColor,
  timeOfDay,
}: HabitPreviewProps) => {
  const isEmpty = !habitName && !selectedEmoji;
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Animations
  const iconScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Brief skeleton on mount for polish
  useEffect(() => {
    setShowSkeleton(true);
    const timer = setTimeout(() => setShowSkeleton(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Pulse ring animation on emoji icon
  useEffect(() => {
    if (!isEmpty && selectedEmoji) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isEmpty, selectedEmoji, pulseAnim]);

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

  // Get time of day display text
  const getTimeOfDayLabel = () => {
    if (!timeOfDay) return 'Daily';
    const phase = HUBERMAN_PHASES[timeOfDay];
    return phase ? `Daily • ${phase.icon} ${phase.shortLabel}` : 'Daily';
  };

  // Generate accessibility label based on current state
  const getAccessibilityLabel = () => {
    if (isEmpty) {
      return 'Habit preview: No habit configured yet. Enter a name and select an icon to preview.';
    }
    const nameText = habitName || 'Unnamed habit';
    const emojiText = selectedEmoji ? `with icon ${selectedEmoji}` : 'without icon';
    const timeText = getTimeOfDayLabel();
    return `Habit preview: ${nameText} ${emojiText}. Schedule: ${timeText}`;
  };

  return (
    <View
      accessible
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole='summary'
      className='mb-4 mt-3 overflow-hidden rounded-2xl bg-white p-3'
      style={{
        borderWidth: 2,
        borderColor: isEmpty ? '#e7e5e4' : selectedColor,
      }}
    >
      <Text className='mb-2 text-xs font-semibold text-stone-500'>✨ Live Preview</Text>

      {showSkeleton ? (
        <View className='py-2'>
          <SkeletonCard />
        </View>
      ) : isEmpty ? (
        <View className='items-center py-4'>
          <Text className='mb-2 text-4xl'>✨</Text>
          <Text className='mb-1 text-sm font-medium text-stone-500'>Your habit will appear here</Text>
          <Text className='text-xs text-stone-400'>Try: "Meditate", "Run", or "Read"</Text>
        </View>
      ) : (
        <Animated.View style={{ opacity: contentOpacity, transform: [{ scale: contentScale }] }}>
          <View className='flex-row items-center gap-3'>
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              {selectedEmoji ? (
                <View className='relative'>
                  {/* Pulse ring behind icon */}
                  <Animated.View
                    className='absolute inset-0 rounded-2xl'
                    style={{
                      backgroundColor: selectedColor,
                      opacity: 0.3,
                      transform: [{ scale: pulseAnim }],
                    }}
                  />
                  <View
                    className='h-14 w-14 items-center justify-center rounded-2xl'
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Text className='text-[28px]'>{selectedEmoji}</Text>
                  </View>
                </View>
              ) : (
                <View className='h-14 w-14 items-center justify-center rounded-2xl bg-stone-200'>
                  <Text className='text-xl text-stone-400'>?</Text>
                </View>
              )}
            </Animated.View>
            <View className='flex-1'>
              {habitName ? (
                <Text className='text-lg font-semibold text-stone-800' numberOfLines={1}>
                  {habitName}
                </Text>
              ) : (
                <Text className='text-lg font-semibold text-stone-400'>
                  {STRINGS.CREATE_HABIT.namePlaceholder}
                </Text>
              )}
              <Text className='text-sm text-stone-500'>
                {getTimeOfDayLabel()}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};
