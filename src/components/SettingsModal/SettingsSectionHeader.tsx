/** SettingsSectionHeader - Pressable header with animated chevron for collapsible sections */

import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { highContrastColors } from '@/theme/highContrastColors';
import { useThemeColors } from '@/theme/ThemeContext';

interface SettingsSectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isExpanded: boolean;
  chevronStyle: AnimatedStyle<ViewStyle>;
  onToggle: () => void;
  highContrastMode?: boolean;
}

export function SettingsSectionHeader({
  title,
  subtitle,
  icon,
  isExpanded,
  chevronStyle,
  onToggle,
  highContrastMode = false,
}: SettingsSectionHeaderProps) {
  const { colors: themeColors } = useThemeColors();

  const titleColor = highContrastMode ? highContrastColors.accent : themeColors.text.primary;

  return (
    <Pressable
      accessibilityHint={`Double tap to ${isExpanded ? 'collapse' : 'expand'} ${title} settings`}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      className="flex-row items-center justify-between px-4 py-3"
      onPress={onToggle}
    >
      <View className="flex-row items-center">
        <View className="mr-4 w-10 items-center justify-center">
          {icon ?? null}
        </View>
        <Text
          style={{
            fontFamily: typography.heading3.fontFamily,
            fontSize: 15,
            fontWeight: fontWeights.bold,
            letterSpacing: -0.2,
            color: titleColor,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="ml-2 rounded-full px-2 py-0.5"
            style={{
              ...typography.tabBar,
              fontWeight: fontWeights.semibold,
              textTransform: 'uppercase',
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
          color={highContrastMode ? highContrastColors.accent : themeColors.text.secondary}
          size={iconSizes.small}
        />
      </Animated.View>
    </Pressable>
  );
}
