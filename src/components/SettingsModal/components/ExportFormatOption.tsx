/** ExportFormatOption — one tappable format card inside ExportFormatSheet. */
import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';

interface ExportFormatOptionProps {
  icon: ReactNode;
  iconBackgroundColor: string;
  label: string;
  subtitle: string;
  recommended?: boolean;
  onPress: () => void;
}

export function ExportFormatOption({
  icon,
  iconBackgroundColor,
  label,
  subtitle,
  recommended,
  onPress,
}: ExportFormatOptionProps) {
  const { colors: themeColors, settings } = useThemeColors();

  return (
    <AnimatedPressable
      accessibilityHint={subtitle}
      accessibilityLabel={recommended ? `${label}, recommended` : label}
      accessibilityRole='button'
      animationConfig={{ hapticStyle: 'light' }}
      onPress={onPress}
    >
      <View
        className='flex-row items-center gap-4 px-4'
        style={{
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
          borderRadius: airy.cardRadius,
          borderWidth: 1,
          paddingVertical: 16,
        }}
      >
        <View
          className='items-center justify-center'
          style={{
            backgroundColor: iconBackgroundColor,
            width: airy.tileSize,
            height: airy.tileSize,
            borderRadius: airy.tileRadius,
          }}
        >
          {icon}
        </View>
        <View className='flex-1'>
          <Text
            style={{
              color: themeColors.text.primary,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              color: themeColors.text.secondary,
              fontSize: 13,
              marginTop: 1,
            }}
          >
            {subtitle}
          </Text>
        </View>
        {recommended ? (
          <Text
            style={{
              backgroundColor: settings.user.bg,
              borderRadius: 8,
              color: settings.user.icon,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.4,
              paddingHorizontal: 9,
              paddingVertical: 5,
              textTransform: 'uppercase',
            }}
          >
            Recommended
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}
