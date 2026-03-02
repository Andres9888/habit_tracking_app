import React, { isValidElement } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { ScreenHeaderProps } from './ScreenHeader.types';

const ENTERING = FadeInDown.delay(0).springify().damping(18);
const ICON_SIZE = 24;

export function ScreenHeader({
  title,
  leftAction = 'back',
  rightAction,
  variant = 'default',
  onBack,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { animatedStyle, pressHandlers } = usePressAnimation({
    pressScale: 0.92,
    hapticStyle: 'light',
  });

  const isTransparent = variant === 'transparent';
  const iconColor = colors.text.primary;

  const renderLeftAction = () => {
    if (!leftAction) return null;

    if (isValidElement(leftAction)) return leftAction;

    const Icon = leftAction === 'close' ? X : ChevronLeft;
    const label = leftAction === 'close' ? 'Close' : 'Go back';

    return (
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onBack}
        {...pressHandlers}
      >
        <Animated.View style={[styles.iconButton, animatedStyle]}>
          <Icon color={iconColor} size={ICON_SIZE} strokeWidth={2.5} />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Animated.View
      accessible
      accessibilityRole="header"
      entering={ENTERING}
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 8, 16) },
        isTransparent && styles.transparent,
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>{renderLeftAction()}</View>
        {title && (
          <Animated.Text
            numberOfLines={1}
            style={[styles.title, { color: colors.text.primary }]}
          >
            {title}
          </Animated.Text>
        )}
        <View style={styles.right}>{rightAction}</View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  iconButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  left: { minWidth: 40 },
  right: { alignItems: 'flex-end', minWidth: 40 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.heading1,
    flex: 1,
    textAlign: 'center',
  },
  transparent: { backgroundColor: 'transparent' },
});
