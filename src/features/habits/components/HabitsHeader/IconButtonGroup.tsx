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
  const { isDark, colors: tc } = useThemeColors();
  const iconColor = isDark ? '#D1D5DB' : '#44403c';
  const dividerBg = isDark ? '#374151' : undefined;
  return (
    <View className='flex-row items-center rounded-full border border-stone-200 bg-white/80 p-1'
      style={isDark ? { borderColor: '#374151', backgroundColor: 'rgba(31,41,55,0.8)' } : undefined}
    >
      {/* Templates Button - highlighted with subtle purple bg */}
      <Animated.View style={templatesAnimatedStyle}>
        <View style={{ position: 'relative' }}>
          <Pressable
            accessibilityHint='Opens screen with pre-made habit templates'
            accessibilityLabel='Browse templates'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full bg-violet-50'
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

      <View className='mx-0.5 h-4 w-px bg-stone-200' style={dividerBg ? { backgroundColor: dividerBg } : undefined} />

      {/* Sort Button */}
      <Animated.View style={sortAnimatedStyle}>
        <Pressable
          accessibilityHint='Change habit sort order'
          accessibilityLabel='Sort habits'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          })}
          onPress={onSortPress}
          onPressIn={onSortPressIn}
          onPressOut={onSortPressOut}
        >
          <ArrowUpDown color={iconColor} size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>

      <View className='mx-0.5 h-4 w-px bg-stone-200' style={dividerBg ? { backgroundColor: dividerBg } : undefined} />

      {/* Settings Button */}
      <Animated.View style={settingsAnimatedStyle}>
        <Pressable
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
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
