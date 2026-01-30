import { ArrowUpDown, BookOpen, Settings } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { NotificationBadge } from '../../../../components/NotificationBadge';
import type { AnimatedStyleProp, ViewStyle } from 'react-native-reanimated';

interface IconButtonGroupProps {
  // Templates button
  templatesAnimatedStyle: AnimatedStyleProp<ViewStyle>;
  showBadge: boolean;
  onTemplatesPress: () => void;
  onTemplatesPressIn: () => void;
  onTemplatesPressOut: () => void;
  // Sort button
  sortAnimatedStyle: AnimatedStyleProp<ViewStyle>;
  onSortPress: () => void;
  onSortPressIn: () => void;
  onSortPressOut: () => void;
  // Settings button
  settingsAnimatedStyle: AnimatedStyleProp<ViewStyle>;
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
  return (
    <View className='flex-row items-center rounded-full border border-stone-200 bg-white/80 p-1'>
      {/* Templates Button */}
      <Animated.View style={templatesAnimatedStyle}>
        <View style={{ position: 'relative' }}>
          <Pressable
            accessibilityHint='Browse habit templates to add'
            accessibilityLabel='Browse habit templates'
            accessibilityRole='button'
            className='h-11 w-11 items-center justify-center rounded-full'
            onPress={onTemplatesPress}
            onPressIn={onTemplatesPressIn}
            onPressOut={onTemplatesPressOut}
          >
            <BookOpen color='#7c3aed' size={18} strokeWidth={2.25} />
          </Pressable>
          <NotificationBadge count={1} visible={showBadge} />
        </View>
      </Animated.View>

      <View className='mx-0.5 h-4 w-px bg-stone-200' />

      {/* Sort Button */}
      <Animated.View style={sortAnimatedStyle}>
        <Pressable
          accessibilityHint='Change habit sort order'
          accessibilityLabel='Sort habits'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          onPress={onSortPress}
          onPressIn={onSortPressIn}
          onPressOut={onSortPressOut}
        >
          <ArrowUpDown color='#44403c' size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>

      <View className='mx-0.5 h-4 w-px bg-stone-200' />

      {/* Settings Button */}
      <Animated.View style={settingsAnimatedStyle}>
        <Pressable
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          onPress={onSettingsPress}
          onPressIn={onSettingsPressIn}
          onPressOut={onSettingsPressOut}
        >
          <Settings color='#44403c' size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
