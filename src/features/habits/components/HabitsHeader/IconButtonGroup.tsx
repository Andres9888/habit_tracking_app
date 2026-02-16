/* eslint-disable max-lines */
import { ArrowUpDown, BookOpen, Settings } from 'lucide-react-native';
import { Pressable, View, StyleSheet } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { NotificationBadge } from '../../../../components/NotificationBadge';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { ViewStyle } from 'react-native';
import { useMemo } from 'react';

interface IconButtonGroupProps {
  // Templates button
  templatesAnimatedStyle: AnimatedStyle<ViewStyle>;
  showBadge: boolean;
  onTemplatesPress: () => void;
  onTemplatesPressIn: () => void;
  onTemplatesPressOut: () => void;
  // Sort button
  sortAnimatedStyle: AnimatedStyle<ViewStyle>;
  onSortPress: () => void;
  onSortPressIn: () => void;
  onSortPressOut: () => void;
  // Settings button
  settingsAnimatedStyle: AnimatedStyle<ViewStyle>;
  onSettingsPress: () => void;
  onSettingsPressIn: () => void;
  onSettingsPressOut: () => void;
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  templatesButton: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  templatesButtonUnpressed: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  templatesButtonPressed: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  buttonUnpressed: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

/**
 * Compact icon button group containing Templates, Sort, and Settings buttons.
 */
export function IconButtonGroup({
  templatesAnimatedStyle,
  showBadge,
  onTemplatesPress,
  onTemplatesPressIn,
  onTemplatesPressOut,
  sortAnimatedStyle,
  onSortPress,
  onSortPressIn,
  onSortPressOut,
  settingsAnimatedStyle,
  onSettingsPress,
  onSettingsPressIn,
  onSettingsPressOut,
}: IconButtonGroupProps) {
  const { colors: tc, isDark } = useThemeColors();
  const iconColor = tc.gray[600];
  const dividerBg = isDark ? tc.gray[200] : undefined;

  const templatesButtonStyle = useMemo(
    () => (state: { pressed: boolean }) => [
      styles.templatesButton,
      state.pressed
        ? styles.templatesButtonPressed
        : styles.templatesButtonUnpressed,
    ],
    []
  );

  const buttonStyle = useMemo(
    () => (state: { pressed: boolean }) => [
      styles.button,
      state.pressed ? styles.buttonPressed : styles.buttonUnpressed,
    ],
    []
  );
  return (
    <View
      className='flex-row items-center rounded-full border border-stone-200 bg-white/80 p-1'
      style={
        isDark
          ? { borderColor: tc.gray[200], backgroundColor: 'rgba(31,41,55,0.8)' }
          : undefined
      }
    >
      {/* Templates Button - highlighted with subtle purple bg */}
      <Animated.View style={templatesAnimatedStyle}>
        <View style={{ position: 'relative' }}>
          <Pressable
            accessibilityHint='Browse habit templates to add'
            accessibilityLabel='Browse habit templates'
            accessibilityRole='button'
            testID='home-templates-button'
            style={templatesButtonStyle}
            onPress={onTemplatesPress}
            onPressIn={onTemplatesPressIn}
            onPressOut={onTemplatesPressOut}
          >
            <BookOpen
              color={tc.purpleText}
              size={18}
              strokeWidth={2.25}
            />
          </Pressable>
          <NotificationBadge count={1} visible={showBadge} />
        </View>
      </Animated.View>

      <View
        className='mx-0.5 h-4 w-px bg-stone-200'
        style={dividerBg ? { backgroundColor: dividerBg } : undefined}
      />

      {/* Sort Button */}
      <Animated.View style={sortAnimatedStyle}>
        <Pressable
          accessibilityHint='Change habit sort order'
          accessibilityLabel='Sort habits'
          accessibilityRole='button'
          testID='home-sort-button'
          style={buttonStyle}
          onPress={onSortPress}
          onPressIn={onSortPressIn}
          onPressOut={onSortPressOut}
        >
          <ArrowUpDown color={iconColor} size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>

      <View
        className='mx-0.5 h-4 w-px bg-stone-200'
        style={dividerBg ? { backgroundColor: dividerBg } : undefined}
      />

      {/* Settings Button */}
      <Animated.View style={settingsAnimatedStyle}>
        <Pressable
          accessibilityHint='Open app settings'
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          testID='home-settings-button'
          style={buttonStyle}
          onPress={onSettingsPress}
          onPressIn={onSettingsPressIn}
          onPressOut={onSettingsPressOut}
        >
          <Settings color={iconColor} size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
