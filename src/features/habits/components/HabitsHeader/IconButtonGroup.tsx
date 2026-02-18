import { BookOpen, Settings } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { NotificationBadge } from '../../../../components/NotificationBadge';
import { useIsDark, useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './IconButtonGroup.styles';
import type { IconButtonGroupProps } from './types';

/**
 * Header button group: "Templates" labeled button + Settings icon.
 * Uses rounded-square containers instead of pill shape.
 */
export function IconButtonGroup({
  templatesAnimatedStyle,
  showBadge,
  onTemplatesPress,
  onTemplatesPressIn,
  onTemplatesPressOut,
  settingsAnimatedStyle,
  onSettingsPress,
  onSettingsPressIn,
  onSettingsPressOut,
}: IconButtonGroupProps) {
  const isDark = useIsDark();
  const { colors: themeColors } = useThemeColors();
  const iconColor = isDark ? '#D1D5DB' : '#44403c';
  const darkBorder = isDark ? styles.containerDark : undefined;

  const templatesStyle = useMemo(
    () => (state: { pressed: boolean }) => [
      styles.templatesButton,
      state.pressed
        ? styles.templatesButtonPressed
        : styles.templatesButtonUnpressed,
    ],
    []
  );

  const settingsStyle = useMemo(
    () => (state: { pressed: boolean }) => [
      styles.settingsButton,
      darkBorder,
      state.pressed ? styles.buttonPressed : styles.buttonUnpressed,
    ],
    [darkBorder]
  );

  return (
    <View className='flex-row items-center gap-2'>
      <Animated.View style={templatesAnimatedStyle}>
        <View style={{ position: 'relative' }}>
          <Pressable
            accessibilityHint='Browse habit templates to add'
            accessibilityLabel='Browse habit templates'
            accessibilityRole='button'
            testID='home-templates-button'
            style={templatesStyle}
            onPress={onTemplatesPress}
            onPressIn={onTemplatesPressIn}
            onPressOut={onTemplatesPressOut}
          >
            <BookOpen color={themeColors.text.inverse} size={16} strokeWidth={2.25} />
            <Text style={[styles.label, { color: themeColors.text.inverse }]}>Templates</Text>
          </Pressable>
          <NotificationBadge count={1} visible={showBadge} />
        </View>
      </Animated.View>

      <Animated.View style={settingsAnimatedStyle}>
        <Pressable
          accessibilityHint='Open app settings'
          accessibilityLabel='Open settings'
          accessibilityRole='button'
          testID='home-settings-button'
          style={settingsStyle}
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
