/** Single row inside the Advanced Options section: icon · title/subtitle · chevron. */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';

interface AdvancedOptionRowProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityHint?: string;
}

export function AdvancedOptionRow({
  icon,
  iconBackground,
  title,
  subtitle,
  onPress,
  accessibilityHint,
}: AdvancedOptionRowProps) {
  const { colors } = useThemeColors();

  const handlePress = () => {
    void Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={title}
      accessibilityRole='button'
      className='flex-row items-center gap-3 rounded-2xl px-4 py-3.5'
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: 64,
      }}
      onPress={handlePress}
    >
      <View
        className='items-center justify-center rounded-xl'
        style={{ backgroundColor: iconBackground, height: 36, width: 36 }}
      >
        {icon}
      </View>
      <View className='flex-1'>
        <Text
          numberOfLines={1}
          style={{
            ...typography.body,
            fontWeight: fontWeights.semibold,
            color: colors.text.primary,
          }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...typography.caption,
            color: colors.text.tertiary,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight
        color={colors.text.tertiary}
        size={iconSizes.small}
        strokeWidth={2}
      />
    </Pressable>
  );
}
