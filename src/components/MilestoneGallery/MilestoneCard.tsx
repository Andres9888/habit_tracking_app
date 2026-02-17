/* eslint-disable max-lines */
/**
 * MilestoneCard
 * Trophy room card — glows + pulses when achieved, greyed out when locked.
 * Tap an achieved card to replay its celebration animation.
 */

import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { GALLERY_ANIMATION } from './constants';
import type { MilestoneCardProps } from './types';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export function MilestoneCard({ data, delay = 0, onReplay }: MilestoneCardProps) {
  const { milestone, achieved, achievement } = data;
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();

  // Glow pulse animation for achieved cards
  const glowOpacity = useSharedValue(0);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = achieved && !reduceMotion
      ? withRepeat(
          withSequence(
            withTiming(1, {
              duration: GALLERY_ANIMATION.GLOW_DURATION,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0.4, {
              duration: GALLERY_ANIMATION.GLOW_DURATION,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          true
        )
      : 0;
  }, [achieved, reduceMotion, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const cardScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  function handlePress() {
    if (!achieved || !onReplay) return;

    // Quick bounce on tap
    if (!reduceMotion) {
      cardScale.value = withSpring(0.94, {
        damping: GALLERY_ANIMATION.PULSE_DAMPING,
        stiffness: GALLERY_ANIMATION.PULSE_STIFFNESS,
      }, () => {
        cardScale.value = withSpring(1, {
          damping: GALLERY_ANIMATION.SPRING_DAMPING,
          stiffness: GALLERY_ANIMATION.SPRING_STIFFNESS,
        });
      });
    }

    onReplay(data);
  }

  const cardBg = achieved ? colors.card : colors.gray[100];
  const cardBorder = achieved ? milestone.color + '66' : colors.cardBorder;
  const textPrimary = achieved ? colors.text.primary : colors.text.tertiary;
  const textSecondary = achieved ? colors.text.secondary : colors.text.tertiary;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(GALLERY_ANIMATION.SPRING_DAMPING)}
      style={cardScaleStyle}
    >
      <Pressable
        accessible
        accessibilityHint={achieved ? 'Double tap to replay celebration' : 'Not yet achieved'}
        accessibilityLabel={`${milestone.title} milestone, ${achieved ? 'achieved' : 'locked'}`}
        accessibilityRole="button"
        onPress={handlePress}
      >
        {/* Glow layer */}
        {achieved && (
          <Animated.View
            pointerEvents="none"
            style={[
              glowStyle,
              {
                backgroundColor: milestone.glowColor,
                borderRadius: 20,
                bottom: -6,
                left: -6,
                position: 'absolute',
                right: -6,
                top: -6,
              },
            ]}
          />
        )}

        <View
          style={{
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderRadius: 16,
            borderWidth: 1.5,
            overflow: 'hidden',
            padding: 14,
            shadowColor: achieved ? milestone.color : colors.text.primary,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: achieved ? 0.18 : 0.05,
            shadowRadius: achieved ? 12 : 6,
          }}
        >
          {/* Badge circle */}
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            {achieved ? (
              <LinearGradient
                colors={milestone.gradientColors}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={{
                  alignItems: 'center',
                  borderRadius: 999,
                  height: 52,
                  justifyContent: 'center',
                  width: 52,
                }}
              >
                <Text style={{ fontSize: 26 }}>{milestone.emoji}</Text>
              </LinearGradient>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.gray[200],
                  borderRadius: 999,
                  height: 52,
                  justifyContent: 'center',
                  width: 52,
                }}
              >
                <Lock color={colors.text.tertiary} size={22} />
              </View>
            )}
          </View>

          {/* Days badge */}
          <View style={{ alignItems: 'center', marginBottom: 4 }}>
            <Text
              style={{
                color: achieved ? milestone.color : colors.text.tertiary,
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: -0.5,
                lineHeight: 26,
              }}
            >
              {milestone.days}
            </Text>
            <Text
              style={{
                color: textSecondary,
                fontSize: 11,
                letterSpacing: 0.2,
                lineHeight: 14,
              }}
            >
              DAYS
            </Text>
          </View>

          {/* Title */}
          <Text
            numberOfLines={1}
            style={{
              color: textPrimary,
              fontSize: 13,
              fontWeight: '600',
              letterSpacing: -0.1,
              lineHeight: 18,
              textAlign: 'center',
            }}
          >
            {milestone.title}
          </Text>

          {/* Achievement details or locked hint */}
          {achieved && achievement ? (
            <View style={{ marginTop: 6 }}>
              <Text
                numberOfLines={1}
                style={{
                  color: textSecondary,
                  fontSize: 11,
                  letterSpacing: -0.08,
                  lineHeight: 14,
                  textAlign: 'center',
                }}
              >
                {achievement.habitEmoji} {achievement.habitName}
              </Text>
              <Text
                style={{
                  color: colors.text.tertiary,
                  fontSize: 10,
                  lineHeight: 13,
                  textAlign: 'center',
                }}
              >
                {formatDate(achievement.dateAchieved)}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                color: colors.text.tertiary,
                fontSize: 11,
                lineHeight: 14,
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              Keep going!
            </Text>
          )}

          {/* Tap to replay hint */}
          {achieved && (
            <View
              style={{
                alignItems: 'center',
                borderRadius: 8,
                marginTop: 8,
                paddingHorizontal: 6,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{
                  color: milestone.color,
                  fontSize: 10,
                  fontWeight: '500',
                  letterSpacing: 0.1,
                }}
              >
                ▶ Replay
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
