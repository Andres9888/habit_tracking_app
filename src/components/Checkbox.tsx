/**
 * Checkbox Component
 * Checkbox with haptic feedback for tactile confirmation
 */

import React, { useCallback } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { clsx } from 'clsx';

import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { AnimatedPressable } from 'ui';

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

const variantClasses = {
  danger: 'bg-red-600 border-red-600',
  neutral: 'bg-stone-700 border-stone-700',
  primary: 'bg-stone-900 border-stone-900',
  success: 'bg-green-600 border-green-600',
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
  const { triggerLightImpact } = useHapticFeedback();
  const isIndeterminate = indeterminate && !checked;
  const isActive = checked || isIndeterminate;

  const handlePress = useCallback(() => {
    triggerLightImpact();
    onPress?.();
  }, [onPress, triggerLightImpact]);

  return (
    <AnimatedPressable
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='checkbox'
      accessibilityState={{ checked: isActive, disabled }}
      className='self-start'
      disabled={disabled}
      style={style}
      onPress={handlePress}
    >
      <View
        className={clsx(
          'items-center justify-center rounded border border-stone-200 bg-white shadow-sm',
          sizeClasses[size].box,
          isActive && variantClasses[variant],
          disabled && 'opacity-50'
        )}
      >
        {isActive && (
          <Text
            className={clsx('font-bold text-white', sizeClasses[size].text)}
          >
            {isIndeterminate ? '−' : '✓'}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
});

export default Checkbox;
