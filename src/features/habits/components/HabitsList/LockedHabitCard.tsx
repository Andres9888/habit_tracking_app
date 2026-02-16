/* eslint-disable max-lines */
/**
 * LockedHabitCard — inline upgrade nudge shown in the list footer.
 *
 * Part of the **monetization flow**: rendered by {@link HabitsListFooter} when
 * a free-tier user has reached the habit limit.  Displays a dashed-border card
 * with a "Start Free Trial" CTA.
 *
 * **Animations:** entrance spring (scale + fade) and press spring (scale).
 * Both respect the `reduceMotion` preference.
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { SCALE, ANIMATION_DURATION } from '../../../../constants';

interface LockedHabitCardProps {
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

export function LockedHabitCard({
  onUpgradePress,
  reduceMotion = false,
}: LockedHabitCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const entranceScale = useRef(new Animated.Value(SCALE.pressSmall)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(SCALE.normal)).current;

  useEffect(() => {
    if (reduceMotion) {
      entranceScale.setValue(1);
      opacity.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(entranceScale, {
        damping: 18,
        mass: 1,
        stiffness: 150, // Design system standard
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: ANIMATION_DURATION.extraLong,
        easing: Easing.out(Easing.cubic),
        toValue: SCALE.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, entranceScale, reduceMotion]);

  const handlePressIn = () => {
    if (reduceMotion) {
      pressScale.setValue(SCALE.pressLarge);
      return;
    }
    Animated.spring(pressScale, {
      damping: 18,
      mass: 1,
      stiffness: 150,
      toValue: SCALE.pressLarge,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (reduceMotion) {
      pressScale.setValue(SCALE.normal);
      return;
    }
    Animated.spring(pressScale, {
      damping: 18,
      mass: 1,
      stiffness: 150,
      toValue: SCALE.normal,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityHint='Tap to start your free trial'
      accessibilityLabel='Upgrade to unlock unlimited habits'
      accessibilityRole='button'
      onPress={onUpgradePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        className='gap-4 rounded-3xl border border-dashed p-5'
        style={{
          borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(196, 181, 253, 1)',
          opacity,
          transform: [{ scale: entranceScale }, { scale: pressScale }],
        }}
      >
        <LinearGradient
          className='absolute inset-0 rounded-3xl'
          colors={isDark
            ? ['rgba(88, 28, 135, 0.2)', 'rgba(120, 53, 15, 0.1)']
            : ['rgba(245, 243, 255, 0.8)', 'rgba(255, 251, 235, 0.4)']}
        />
        <View className='items-center gap-2'>
          <Text className='text-[24px]'>✨</Text>
          <View className='gap-1'>
            <Text
              className='text-center text-[17px] font-semibold'
              style={{ color: themeColors.text.primary }}
            >
              Ready to unlock more?
            </Text>
            <Text
              className='text-center text-[13px] font-normal leading-[18px]'
              style={{ color: themeColors.text.secondary }}
            >
              Start a 7-day free trial to track unlimited habits and get
              AI-powered insights. No credit card required.
            </Text>
          </View>
        </View>
        <View className='items-center rounded-full px-5 py-3 shadow-[0px_8px_16px_rgba(109,40,217,0.2)]'>
          <LinearGradient
            className='absolute inset-0 rounded-full'
            colors={['#7c3aed', '#4f46e5']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          <Text className='text-[15px] font-semibold text-white'>
            Start Free Trial
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
