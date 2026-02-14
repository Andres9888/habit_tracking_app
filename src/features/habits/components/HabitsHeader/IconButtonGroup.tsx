import { ArrowUpDown, BookOpen, Settings } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { NotificationBadge } from '../../../../components/NotificationBadge';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { ViewStyle } from 'react-native';

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

/**
 * Compact icon button group containing Templates, Sort, and Settings buttons.
 * All colors derived from theme tokens for dark/light mode consistency.
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
  const { colors: themeColors, isDark } = useThemeColors();

  const iconColor = themeColors.text.secondary;
  const dividerColor = themeColors.border;
  const containerBorderColor = themeColors.border;
  const containerBgColor = isDark
    ? `${themeColors.card}CC` // 80% opacity
    : `${themeColors.gray[50]}CC`;
  const pressedBg = isDark ? `${themeColors.gray[300]}20` : `${themeColors.gray[800]}0D`;

  return (
    <View
      className='flex-row items-center rounded-full p-1'
      style={{
        borderColor: containerBorderColor,
        borderWidth: 1,
        backgroundColor: containerBgColor,
      }}
    >
      {/* Templates Button - highlighted with subtle purple bg */}
      <Animated.View style={templatesAnimatedStyle}>
        <View style={{ position: 'relative' }}>
          <Pressable
            accessibilityHint='Browse habit templates to add'
            accessibilityLabel='Browse habit templates'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full'
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? 'rgba(139, 92, 246, 0.15)'
                : 'rgba(139, 92, 246, 0.08)',
            })}
            onPress={onTemplatesPress}
            onPressIn={onTemplatesPressIn}
            onPressOut={onTemplatesPressOut}
          >
            <BookOpen color={isDark ? '#a78bfa' : '#7c3aed'} size={18} strokeWidth={2.25} />
          </Pressable>
          <NotificationBadge count={1} visible={showBadge} />
        </View>
      </Animated.View>

      <View className='mx-0.5 h-4 w-px' style={{ backgroundColor: dividerColor }} />

      {/* Sort Button */}
      <Animated.View style={sortAnimatedStyle}>
        <Pressable
          accessibilityHint='Change habit sort order'
          accessibilityLabel='Sort habits'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => ({
            backgroundColor: pressed ? pressedBg : 'transparent',
          })}
          onPress={onSortPress}
          onPressIn={onSortPressIn}
          onPressOut={onSortPressOut}
        >
          <ArrowUpDown color={iconColor} size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>

      <View className='mx-0.5 h-4 w-px' style={{ backgroundColor: dividerColor }} />

      {/* Settings Button */}
      <Animated.View style={settingsAnimatedStyle}>
        <Pressable
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => ({
            backgroundColor: pressed ? pressedBg : 'transparent',
          })}
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
