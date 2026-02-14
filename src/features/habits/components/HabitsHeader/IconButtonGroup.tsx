import { ArrowUpDown, Settings } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { TemplatesButton } from './TemplatesButton';
import type { ViewStyle } from 'react-native';

interface IconButtonGroupProps {
  templatesAnimatedStyle: AnimatedStyle<ViewStyle>;
  showBadge: boolean;
  onTemplatesPress: () => void;
  onTemplatesPressIn: () => void;
  onTemplatesPressOut: () => void;
  sortAnimatedStyle: AnimatedStyle<ViewStyle>;
  onSortPress: () => void;
  onSortPressIn: () => void;
  onSortPressOut: () => void;
  settingsAnimatedStyle: AnimatedStyle<ViewStyle>;
  onSettingsPress: () => void;
  onSettingsPressIn: () => void;
  onSettingsPressOut: () => void;
}

export function IconButtonGroup(props: IconButtonGroupProps) {
  const { isDark } = useThemeColors();
  const iconColor = isDark ? '#D1D5DB' : '#44403c';
  const dividerBg = isDark ? '#374151' : undefined;
  const pressedBg = 'rgba(0, 0, 0, 0.05)';

  return (
    <View
      className='flex-row items-center rounded-full border border-stone-200 bg-white/80 p-1'
      style={
        isDark
          ? { backgroundColor: 'rgba(31,41,55,0.8)', borderColor: '#374151' }
          : undefined
      }
    >
      <TemplatesButton
        animatedStyle={props.templatesAnimatedStyle}
        isDark={isDark}
        showBadge={props.showBadge}
        onPress={props.onTemplatesPress}
        onPressIn={props.onTemplatesPressIn}
        onPressOut={props.onTemplatesPressOut}
      />
      <View
        className='mx-0.5 h-4 w-px bg-stone-200'
        style={dividerBg ? { backgroundColor: dividerBg } : undefined}
      />
      <Animated.View style={props.sortAnimatedStyle}>
        <Pressable
          accessibilityHint='Change habit sort order'
          accessibilityLabel='Sort habits'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => ({
            backgroundColor: pressed ? pressedBg : 'transparent',
          })}
          onPress={props.onSortPress}
          onPressIn={props.onSortPressIn}
          onPressOut={props.onSortPressOut}
        >
          <ArrowUpDown color={iconColor} size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>
      <View
        className='mx-0.5 h-4 w-px bg-stone-200'
        style={dividerBg ? { backgroundColor: dividerBg } : undefined}
      />
      <Animated.View style={props.settingsAnimatedStyle}>
        <Pressable
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-full'
          style={({ pressed }) => ({
            backgroundColor: pressed ? pressedBg : 'transparent',
          })}
          onPress={props.onSettingsPress}
          onPressIn={props.onSettingsPressIn}
          onPressOut={props.onSettingsPressOut}
        >
          <Settings color={iconColor} size={18} strokeWidth={2.25} />
        </Pressable>
      </Animated.View>
    </View>
  );
}
