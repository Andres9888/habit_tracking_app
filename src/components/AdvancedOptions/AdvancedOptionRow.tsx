/** Single row inside the Advanced Options section: icon · title/subtitle/description · edit affordance. */
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { AdvancedOptionEditAffordance } from './AdvancedOptionEditAffordance';

interface AdvancedOptionRowProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  subtitle: string;
  description?: string;
  onPress: () => void;
  accessibilityHint?: string;
}

export function AdvancedOptionRow({
  icon,
  iconBackground,
  title,
  subtitle,
  description,
  onPress,
  accessibilityHint,
}: AdvancedOptionRowProps) {
  const { colors } = useThemeColors();

  const handlePress = () => {
    void Haptics.selectionAsync();
    onPress();
  };

  const a11yHint = description
    ? `${description} ${accessibilityHint ?? ''}`.trim()
    : accessibilityHint;

  return (
    <Pressable
      accessibilityHint={a11yHint}
      accessibilityLabel={title}
      accessibilityRole='button'
      className='flex-row items-center gap-3 rounded-2xl px-4 py-3.5'
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.primary[100] : colors.background,
        borderWidth: 1,
        borderColor: pressed ? colors.primary[300] : colors.cardBorder,
        minHeight: 64,
        opacity: pressed ? 0.92 : 1,
      })}
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
            color: colors.text.secondary,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
        {description ? (
          <Text
            accessibilityElementsHidden
            importantForAccessibility='no'
            numberOfLines={2}
            style={{
              ...typography.caption,
              fontSize: 12,
              lineHeight: 16,
              color: colors.text.tertiary,
              marginTop: 4,
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      <AdvancedOptionEditAffordance />
    </Pressable>
  );
}
