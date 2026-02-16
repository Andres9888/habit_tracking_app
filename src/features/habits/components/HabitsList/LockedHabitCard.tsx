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
import { useThemeColors } from '../../../../../theme/ThemeContext';


interface LockedHabitCardProps {
  onUpgradePress: () => void;
  reduceMotion?: boolean;
}

export function LockedHabitCard({
  onUpgradePress,
  reduceMotion = false,
}: LockedHabitCardProps) {
  const { colors } = useThemeColors();
  const entranceScale = useRef(new Animated.Value(0.94)).current;

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
          borderColor: colors.premium[400] + '66',

          opacity,
          transform: [{ scale: entranceScale }, { scale: pressScale }],
        }}
      >
        <LinearGradient
          className='absolute inset-0 rounded-3xl'
          colors={[
            colors.premium[400] + 'CC',
            colors.streak[100] + '66',
          ]}

        />
        <View className='items-center gap-2'>
          <Text className='text-[24px]'>✨</Text>
          <View className='gap-1'>
            <Text
              className='text-center text-[17px] font-semibold'
              style={{ color: colors.gray[800] }}

            >
              Ready to unlock more?
            </Text>
            <Text
              className='text-center text-[13px] font-normal leading-[18px]'
              style={{ color: colors.gray[500] }}

            >
              Start a 7-day free trial to track unlimited habits and get
              AI-powered insights. No credit card required.
            </Text>
          </View>
        </View>
        <View
          className='items-center rounded-full px-5 py-3'
          style={{
            elevation: 4,
            shadowColor: colors.premium[600],
            shadowOffset: { height: 8, width: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
          }}
        >
          <LinearGradient
            className='absolute inset-0 rounded-full'
            colors={[colors.premium[500], colors.secondary[600]]}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
          <Text
            className='text-[15px] font-semibold'
            style={{ color: colors.white }}
          >
            Start Free Trial
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
