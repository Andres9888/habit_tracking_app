import React, { isValidElement, useEffect } from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { mixHex } from '../../theme/colors';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { durations, enterEasing } from '../../theme/animations';
import type { ScreenHeaderProps } from './ScreenHeader.types';
import { styles } from './ScreenHeader.styles';

const ENTERING = FadeInDown.delay(0)
  .duration(durations.enter)
  .easing(enterEasing);
const SUBTITLE_ENTERING = FadeInDown.delay(50)
  .duration(durations.enter)
  .easing(enterEasing);
const ICON_SIZE = 24;

export function ScreenHeader({
  title,
  subtitle,
  leftAction = 'back',
  rightAction,
  variant = 'default',
  titleVisible = true,
  titleStyle,
  titleNumberOfLines = 1,
  leftActionAccessibilityLabel,
  animateEntrance = true,
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
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const hasNavigation = Boolean(leftAction) || Boolean(rightAction);
  const iconColor = colors.text.primary;
  const controlFill = mixHex(colors.gray[900], colors.background, 0.06);

  const renderLeftAction = () => {
    if (!leftAction) return null;
    if (isValidElement(leftAction)) return leftAction;

    const Icon = leftAction === 'close' ? X : ChevronLeft;
    const label =
      leftActionAccessibilityLabel ??
      (leftAction === 'close' ? 'Close' : 'Go back');

    return (
      <Pressable
        accessibilityLabel={label}
        accessibilityRole='button'
        style={styles.actionSlot}
        onPress={onBack}
        {...pressHandlers}
      >
        <Animated.View
          style={[
            styles.iconButton,
            { backgroundColor: controlFill },
            animatedStyle,
          ]}
        >
          <Icon
            color={iconColor}
            size={ICON_SIZE}
            strokeWidth={2.5}
            style={
              leftAction === 'back' && I18nManager.isRTL
                ? styles.rtlIcon
                : undefined
            }
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Animated.View
      entering={animateEntrance ? ENTERING : undefined}
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top + 8, 16) },
        variant === 'transparent' && styles.transparent,
      ]}
    >
      {hasNavigation ? (
        <View style={styles.row}>
          <View style={styles.left}>{renderLeftAction()}</View>
          {title && titleVisible ? (
            <Animated.Text
              accessibilityRole='header'
              numberOfLines={titleNumberOfLines}
              style={[
                styles.titleCenter,
                { color: colors.text.primary },
                titleStyle,
                titleAnimatedStyle,
              ]}
            >
              {title}
            </Animated.Text>
          ) : null}
          <View style={styles.right}>{rightAction}</View>
        </View>
      ) : (
        title && (
          <Animated.Text
            accessibilityRole='header'
            numberOfLines={titleNumberOfLines}
            style={[styles.titleLeft, { color: colors.text.primary }]}
          >
            {title}
          </Animated.Text>
        )
      )}
      {subtitle ? (
        <Animated.Text
          entering={animateEntrance ? SUBTITLE_ENTERING : undefined}
          style={[styles.subtitle, { color: colors.text.secondary }]}
        >
          {subtitle}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
}
