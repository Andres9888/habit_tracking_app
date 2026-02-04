/**
 * ProgressHeroCard Component
 * Hero section with streak as the main focus, emoji, and best streak
 * Large 56px animated streak number with countUp animation
 * 
 * @see HABIT-DETAIL-AFTER-SPEC.md for design details
 */

import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';

interface ProgressHeroCardProps {
  currentStreak: number;
  bestStreak: number;
  emoji: string;
  habitName: string;
  reduceMotion?: boolean;
}

export function ProgressHeroCard({
  currentStreak,
  bestStreak,
  emoji,
  habitName,
  reduceMotion = false,
}: ProgressHeroCardProps) {
  const cardOpacity = useSharedValue(reduceMotion ? 1 : 0);
  const cardTranslateY = useSharedValue(reduceMotion ? 0 : 8);
  const emojiScale = useSharedValue(reduceMotion ? 1 : 0.9);
  const [countedValue, setCountedValue] = React.useState(reduceMotion ? currentStreak : 0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (reduceMotion) {
      cardOpacity.value = 1;
      cardTranslateY.value = 0;
      emojiScale.value = 1;
      setCountedValue(currentStreak);
      return;
    }

    cardOpacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
    cardTranslateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.ease) });
    emojiScale.value = withDelay(80, withSpring(1, { damping: 12, stiffness: 200 }));

    // Animated countUp for streak number
    const duration = 320;
    const startTime = Date.now();
    const endValue = currentStreak;
    
    const animateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quadratic for smooth deceleration
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.round(endValue * eased);
      setCountedValue(value);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateCount);
      }
    };
    
    const timeout = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animateCount);
    }, 120);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
      cancelAnimation(emojiScale);
    };
  }, [currentStreak, reduceMotion, cardOpacity, cardTranslateY, emojiScale]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const emojiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const isAtBest = currentStreak >= bestStreak && bestStreak > 0;

  return (
    <Animated.View
      style={[{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }, cardAnimatedStyle]}
      accessibilityRole="summary"
      accessibilityLabel={`${habitName}. Current streak: ${currentStreak} days. Personal best: ${bestStreak} days.`}
    >
      {/* Top accent bar with gradient */}
      <LinearGradient colors={['#10B981', '#34D399']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 3 }} />
      
      <View style={{ padding: 16, minHeight: 140 }}>
        {/* Emoji + Habit Name row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Animated.View 
            style={[{ 
              width: 56, 
              height: 56, 
              borderRadius: 14, 
              backgroundColor: '#fef3c7', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginRight: 12 
            }, emojiAnimatedStyle]}
          >
            <Text style={{ fontSize: 32 }}>{emoji}</Text>
          </Animated.View>
          <Text 
            style={{ 
              fontSize: 28, 
              fontWeight: '700', 
              color: '#1F2937', 
              letterSpacing: -0.42, 
              lineHeight: 34, 
              flex: 1 
            }} 
            numberOfLines={1}
          >
            {habitName}
          </Text>
        </View>
        
        {/* Streak row with large 56px number */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: '#faf9f7', 
          borderRadius: 12, 
          paddingVertical: 12, 
          paddingHorizontal: 16 
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', flex: 1 }}>
            <Flame size={24} color="#F59E0B" style={{ marginRight: 8, alignSelf: 'center' }} />
            <Text style={{ 
              fontSize: 56, 
              fontWeight: '800', 
              color: '#1F2937', 
              letterSpacing: -1.12, 
              lineHeight: 56 
            }}>
              {countedValue}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '500', 
              color: '#78716c', 
              letterSpacing: 0.07, 
              marginLeft: 8, 
              lineHeight: 20 
            }}>
              days
            </Text>
          </View>
          
          {/* Divider */}
          <View style={{ width: 1, height: 28, backgroundColor: '#e7e5e4', marginHorizontal: 16 }} />
          
          {/* Best streak (highlighted if at best) */}
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '500', 
            color: isAtBest ? '#F59E0B' : '#78716c', 
            letterSpacing: 0.07 
          }}>
            Best: {bestStreak} days
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
