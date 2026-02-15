/**
 * SafeHeader Component
 *
 * A reusable header wrapper that automatically handles safe area insets
 * for the top of the screen, ensuring UI elements don't overlap with:
 * - iPhone Dynamic Island (iPhone 14 Pro and later)
 * - iPhone notch (iPhone X through 13)
 * - Android status bar
 *
 * This component standardizes safe area handling across all modal and screen headers.
 *
 * @example
 * ```tsx
 * <SafeHeader>
 *   <View className='flex-row items-center justify-between'>
 *     <BackButton />
 *     <Title>Settings</Title>
 *     <CloseButton />
 *   </View>
 * </SafeHeader>
 * ```
 */

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SafeHeaderProps {
  /** Header content (buttons, title, etc.) */
  children: React.ReactNode;

  /**
   * Additional padding beyond the safe area inset.
   * Default: 8 (matching existing pattern from previous fixes)
   */
  additionalPadding?: number;

  /**
   * Optional additional styles for the wrapper View
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional className for NativeWind styling
   */
  className?: string;

  /**
   * If true, uses a minimum padding value to ensure content
   * doesn't sit too close to the top on devices without notch.
   * Default: 16
   */
  minPadding?: number;
}

export function SafeHeader({
  children,
  additionalPadding = 8,
  style,
  className,
  minPadding = 16,
}: SafeHeaderProps) {
  const insets = useSafeAreaInsets();

  // Calculate padding: use safe area + additional, but ensure minimum for non-notch devices
  const paddingTop = Math.max(insets.top + additionalPadding, minPadding);

  return (
    <View className={className} style={[{ paddingTop }, style]}>
      {children}
    </View>
  );
}

export default SafeHeader;
