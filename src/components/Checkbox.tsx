/**
 * Checkbox Component
 * Checkbox with haptic feedback for tactile confirmation
 */

import React, { useCallback } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { clsx } from 'clsx';

import { useThemeColors } from '../theme/ThemeContext';
import { shadows } from '../theme/spacing';
import { AnimatedPressable } from './ui';

type CheckboxSize = 'sm' | 'md' | 'lg';
type CheckboxVariant = 'primary' | 'success' | 'neutral' | 'danger';

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const sizeClasses = {
  lg: { box: 'w-6 h-6', text: 'text-sm' },
  md: { box: 'w-5 h-5', text: 'text-xs' },
  sm: { box: 'w-4 h-4', text: 'text-[10px]' },
};

const sizeHitSlop = {
  lg: undefined,
  md: undefined,
  sm: { bottom: 14, left: 14, right: 14, top: 14 },
};

const variantClasses = {
  danger: '',
  neutral: '',
  primary: '',
  success: '',
};

export const Checkbox = React.forwardRef<View, CheckboxProps>(function Checkbox(
  {
    checked = false,
    disabled = false,
    indeterminate = false,
    variant = 'primary',
    size = 'md',
    onPress,
    style,
    accessibilityLabel,
  },
  ref
) {
  const { colors } = useThemeColors();
  const isIndeterminate = indeterminate && !checked;
  const isActive = checked || isIndeterminate;

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <AnimatedPressable
      accessibilityHint='Double tap to toggle this checkbox'
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='checkbox'
      accessibilityState={{ checked: isActive, disabled }}
      className='self-start'
      disabled={disabled}
      hitSlop={sizeHitSlop[size]}
      style={style}
      onPress={handlePress}
    >
      <View
        ref={ref}
        className={clsx(
          'items-center justify-center rounded border',
          sizeClasses[size].box,
          isActive && variantClasses[variant],
          disabled && 'opacity-50'
        )}
        style={[shadows.card, isActive
          ? (variant === 'neutral' || variant === 'primary')
            ? { backgroundColor: colors.text.primary, borderColor: colors.text.primary }
            : variant === 'success'
              ? { backgroundColor: colors.status.success, borderColor: colors.status.success }
              : variant === 'danger'
                ? { backgroundColor: colors.status.error, borderColor: colors.status.error }
                : undefined
          : { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        {isActive ? <Text
            className={clsx('font-bold text-white', sizeClasses[size].text)}
          >
            {isIndeterminate ? '−' : '✓'}
          </Text> : null}
      </View>
    </AnimatedPressable>
  );
});

export default Checkbox;
