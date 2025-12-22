/**
 * DayDetailTooltip Component
 * Shows details for a tapped calendar day
 */

import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { X, Check, Calendar, Flame } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { BlurView } from 'expo-blur';

interface DayDetailTooltipProps {
  /** Whether the modal is visible */
  visible: boolean;

  /** Date in YYYY-MM-DD format */
  date: string | null;

  /** Whether the habit was completed on this date */
  completed: boolean;

  /** Position in current streak (0 if not in streak) */
  streakPosition: number;

  /** Callback to close the tooltip */
  onClose: () => void;

  /** Habit color for theming */
  habitColor?: string;
}

export function DayDetailTooltip({
  visible,
  date,
  completed,
  streakPosition,
  onClose,
  habitColor,
}: DayDetailTooltipProps) {
  if (!visible || !date) {
    return null;
  }

  const dateObj = parseISO(date);
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');
  const completedColor = habitColor || '#10b981'; // emerald-500 default

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 justify-center items-center"
        onPress={onClose}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        {/* Tooltip Card */}
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.springify().damping(20)}
          className="bg-white rounded-2xl shadow-lg mx-6 w-80 max-w-full"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-stone-100">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-stone-100">
                  <Calendar className="text-stone-600" size={16} />
                </View>
                <Text className="text-sm font-semibold text-stone-800">Day Details</Text>
              </View>
              <Pressable
                onPress={onClose}
                className="h-8 w-8 items-center justify-center rounded-lg active:bg-stone-100"
                accessible={true}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X className="text-stone-400" size={18} />
              </Pressable>
            </View>

            {/* Content */}
            <View className="p-5 gap-4">
              {/* Date */}
              <View>
                <Text className="text-xs font-medium text-stone-500 mb-1">Date</Text>
                <Text className="text-base text-stone-800">{formattedDate}</Text>
              </View>

              {/* Completion Status */}
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: completed ? completedColor : '#f5f5f4',
                  }}
                >
                  {completed ? (
                    <Check className="text-white" size={20} strokeWidth={3} />
                  ) : (
                    <X className="text-stone-300" size={20} strokeWidth={3} />
                  )}
                </View>
                <View>
                  <Text className="text-xs font-medium text-stone-500">Status</Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: completed ? completedColor : '#78716c' }}
                  >
                    {completed ? 'Completed' : 'Not completed'}
                  </Text>
                </View>
              </View>

              {/* Streak Context */}
              {streakPosition > 0 && (
                <View className="flex-row items-center gap-3 p-3 bg-amber-50 rounded-xl">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <Flame className="text-amber-600" size={20} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-medium text-amber-700 mb-0.5">
                      Streak Position
                    </Text>
                    <Text className="text-sm font-semibold text-amber-900">
                      Day {streakPosition} of your streak
                    </Text>
                  </View>
                </View>
              )}

              {/* Future enhancement placeholder */}
              {!completed && (
                <Text className="text-xs text-stone-400 text-center">
                  Editing past dates coming soon
                </Text>
              )}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default DayDetailTooltip;
