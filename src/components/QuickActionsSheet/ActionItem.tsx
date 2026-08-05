/* eslint-disable max-lines */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import type { ActionItemProps } from './types';
import { ActionItemIcon } from './ActionItemIcon';
import { useThemeColors } from '../../theme/ThemeContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export const ActionItem = ({
  badge,
  destructive = false,
  disabled = false,
  highlighted = false,
  icon,
  label,
  onPress,
  showChevron = false,
  subtitle,
}: ActionItemProps) => {
  const { colors, isDark } = useThemeColors();
  const { triggerWarning, triggerLightImpact } = useHapticFeedback();

  const handlePress = () => {
    // Use warning haptic for destructive actions, light tap for normal actions
    if (destructive) {
      triggerWarning();
    } else {
      triggerLightImpact();
    }
    onPress();
  };

  // Theme-aware background colors
  const getRowBg = () => {
    if (highlighted) return 'transparent'; // gradient handles it
    if (destructive) return isDark ? '#7f1d1d' : '#fef2f2'; // red-900/red-50
    return isDark ? colors.gray[800] : colors.gray[100];
  };

  const getIconBg = () => {
    if (highlighted) return 'transparent'; // gradient handles it
    if (destructive) return isDark ? '#991b1b' : '#fee2e2'; // red-800/red-100
    return isDark ? colors.gray[700] : colors.gray[200];
  };

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      className='flex-row items-center gap-3 rounded-xl px-4 py-3.5 active:opacity-80'
      disabled={disabled}
      style={[
        {
          backgroundColor: getRowBg(),
          opacity: disabled ? 0.5 : 1,
        },
        highlighted && { borderWidth: 2, borderColor: isDark ? '#6d28d9' : '#c4b5fd' },
      ]}
      onPress={handlePress}
    >
      {highlighted ? <LinearGradient
          className='absolute inset-0 rounded-xl'
          colors={isDark ? ['#1e1b4b', '#312e81'] : ['#f5f3ff', '#e0e7ff']}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
        /> : null}
      <ActionItemIcon
        destructive={destructive}
        highlighted={highlighted}
        icon={icon}
      />
      <View className='flex-1'>
        <View className='flex-row items-center gap-2'>
          <Text
            className='text-base font-semibold'
            style={{
              color: highlighted
                ? isDark ? '#c4b5fd' : '#4c1d95'  // violet-300/violet-900
                : destructive
                  ? isDark ? '#fca5a5' : '#dc2626'  // red-300/red-600
                  : colors.text.primary,
            }}
          >
            {label}
          </Text>
          {badge ? <View className='rounded-full px-2 py-0.5' style={{ backgroundColor: colors.status.premium }}>
              <Text className='text-xs font-bold text-white'>{badge}</Text>
            </View> : null}
        </View>
        {subtitle ? <Text
            className='mt-0.5 text-xs'
            style={{
              color: highlighted
                ? isDark ? '#a78bfa' : '#7c3aed'  // violet-400/violet-600
                : destructive
                  ? isDark ? '#fca5a5' : '#ef4444'  // red-300/red-500
                  : colors.text.secondary,
            }}
          >
            {subtitle}
          </Text> : null}
      </View>
      {showChevron ? <ChevronRight
          color={
            highlighted
              ? isDark ? '#a78bfa' : '#a78bfa'  // violet-400
              : destructive
                ? isDark ? '#fca5a5' : '#f87171'  // red-300/red-400
                : colors.text.tertiary
          }
          size={iconSizes.medium}
        /> : null}
    </Pressable>
  );
};
