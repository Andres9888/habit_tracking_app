/** SettingsSectionHeader - Pressable header with animated chevron for collapsible sections */

import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';

interface SettingsSectionHeaderProps {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  chevronStyle: AnimatedStyle<ViewStyle>;
  onToggle: () => void;
  highContrastMode?: boolean;
}

export function SettingsSectionHeader({
  title,
  subtitle,
  isExpanded,
  chevronStyle,
  onToggle,
  highContrastMode = false,
}: SettingsSectionHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  const titleColor = highContrastMode ? '#facc15' : themeColors.text.secondary;

  return (
    <Pressable
      accessibilityHint={`Double tap to ${isExpanded ? 'collapse' : 'expand'} ${title} settings`}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      className="flex-row items-center justify-between px-4 py-2.5"
      onPress={onToggle}
    >
      <View className="flex-row items-center">
        <View className="mr-4 w-10" />
        <Text
          className="text-[12px] font-medium uppercase tracking-[1.5px]"
          style={{ color: titleColor }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
            style={{
              backgroundColor: themeColors.status.warningLight,
              color: themeColors.status.warningText,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Animated.View style={chevronStyle}>
        <ChevronDown
          color={highContrastMode ? '#facc15' : themeColors.text.secondary}
          size={iconSizes.small}
        />
      </Animated.View>
    </Pressable>
  );
}
