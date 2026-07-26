import React, { isValidElement, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import type { ScreenHeaderProps } from './ScreenHeader.types';
import { styles } from './ScreenHeader.styles';
import { SCREEN_HEADER_ENTERING, SCREEN_HEADER_ICON_SIZE, SCREEN_HEADER_SUBTITLE_ENTERING } from './ScreenHeader.constants';

export function ScreenHeader({
  title,
  subtitle,
  leftAction = 'back',
  rightAction,
  variant = 'default',
  titleVisible = true,
  titleStyle,
  titleNumberOfLines = 1,
  onBack,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { animatedStyle, pressHandlers } = usePressAnimation({
    pressScale: 0.92,
    hapticStyle: 'light',
  });
  const titleOpacity = useSharedValue(titleVisible ? 1 : 0);
  useEffect(() => {
    titleOpacity.value = withTiming(titleVisible ? 1 : 0, { duration: 220 });
  }, [titleVisible, titleOpacity]);
  const titleAnimatedStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

  const hasNavigation = Boolean(leftAction) || Boolean(rightAction);
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
          <Icon
            color={iconColor}
            size={SCREEN_HEADER_ICON_SIZE}
            strokeWidth={2.5}
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Animated.View
      accessible
      accessibilityRole="header"
      entering={SCREEN_HEADER_ENTERING}
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 8, 16) },
        variant === 'transparent' && styles.transparent,
      ]}
    >
      {hasNavigation ? (
        <View style={styles.row}>
          <View style={styles.left}>{renderLeftAction()}</View>
          {title ? <Animated.Text
              numberOfLines={titleNumberOfLines}
              style={[styles.titleCenter, { color: colors.text.primary }, titleStyle, titleAnimatedStyle]}
            >
              {title}
            </Animated.Text> : null}
          <View style={styles.right}>{rightAction}</View>
        </View>
      ) : (
        title && (
          <Animated.Text
            numberOfLines={titleNumberOfLines}
            style={[styles.titleLeft, { color: colors.text.primary }]}
          >
            {title}
          </Animated.Text>
        )
      )}
      {subtitle ? <Animated.Text
          entering={SCREEN_HEADER_SUBTITLE_ENTERING}
          style={[styles.subtitle, { color: colors.text.secondary }]}
        >
          {subtitle}
        </Animated.Text> : null}
    </Animated.View>
  );
}
