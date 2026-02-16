/**
 * StreakMilestoneModal - Celebratory modal shown at streak milestones
 * with a natural premium upsell CTA.
 *
 * Designed to feel like a reward first, upsell second.
 */

import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { OPACITY } from '../../constants';

interface StreakMilestoneModalProps {
  visible: boolean;
  emoji: string;
  title: string;
  message: string;
  ctaText: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export function StreakMilestoneModal({
  visible,
  emoji,
  title,
  message,
  ctaText,
  onAccept,
  onDismiss,
}: StreakMilestoneModalProps) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <Animated.View
          className="mx-6 w-full max-w-sm overflow-hidden rounded-3xl bg-white"
          entering={SlideInDown.springify().damping(18)}
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
          }}
        >
          {/* Celebration header */}
          <LinearGradient
            className="items-center px-6 pb-6 pt-8"
            colors={['#fef3c7', '#fde68a']}
          >
            <Animated.Text
              className="text-[48px]"
              entering={FadeIn.delay(200)}
            >
              {emoji}
            </Animated.Text>
            <Text className="mt-3 text-center text-[22px] font-bold tracking-tight text-stone-900">
              {title}
            </Text>
          </LinearGradient>

          {/* Content */}
          <View className="gap-4 px-6 pb-6 pt-5">
            <Text className="text-center text-[15px] leading-[22px] text-stone-600">
              {message}
            </Text>

            <View className="items-center rounded-2xl bg-emerald-50 px-4 py-2.5">
              <Text className="text-center text-[13px] font-semibold text-emerald-700">
                7 days free · Cancel anytime
              </Text>
            </View>

            <Pressable
              accessibilityLabel={ctaText}
              accessibilityRole="button"
              className="items-center rounded-full px-5 py-4"
              style={({ pressed }) => ({
                opacity: pressed ? OPACITY.strong : OPACITY.full,
              })}
              onPress={onAccept}
            >
              <LinearGradient
                className="absolute inset-0 rounded-full"
                colors={['#7c3aed', '#4f46e5']}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
              />
              <Text className="text-[17px] font-semibold text-white">
                {ctaText}
              </Text>
            </Pressable>

            <Pressable
              accessibilityLabel="Continue with free plan"
              accessibilityRole="button"
              className="items-center py-2"
              onPress={onDismiss}
            >
              <Text className="text-[15px] text-stone-400">
                Continue Free
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
