/** Advanced Options row: whole row is the tap target; pressed state washes the row + tints the hint. */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';
import { AdvancedOptionEditAffordance } from './AdvancedOptionEditAffordance';
import { AdvancedOptionRowTitle } from './AdvancedOptionRowTitle';

interface AdvancedOptionRowProps {
  icon: ReactNode;
  iconBackground: string;
  title: string;
  subtitle: string;
  description?: string;
  onPress: () => void;
  accessibilityHint?: string;
  isFirst?: boolean;
  /** Optional small pill shown next to the title (e.g. "Recommended"). */
  titleBadge?: string;
}

export function AdvancedOptionRow({
  icon,
  iconBackground,
  title,
  subtitle,
  description,
  onPress,
  accessibilityHint,
  isFirst = false,
  titleBadge,
}: AdvancedOptionRowProps) {
  const { colors } = useThemeColors();

  const handlePress = () => {
    void triggerHaptic('selection');
    onPress();
  };

  const a11yHint = description
    ? `${description} ${accessibilityHint ?? ''}`.trim()
    : accessibilityHint;

  return (
    <Pressable
      accessibilityHint={a11yHint}
      accessibilityLabel={`${title}, tap to edit`}
      accessibilityRole='button'
      className='flex-row items-center gap-3 py-3.5'
      style={({ pressed }) => ({
        borderTopWidth: isFirst ? 0 : StyleSheet.hairlineWidth,
        borderTopColor: colors.cardBorder,
        minHeight: 72,
        backgroundColor: pressed ? colors.gray[200] : 'transparent',
        borderRadius: 12,
      })}
      onPress={handlePress}
    >
      {({ pressed }) => (
        <>
          <View
            className='h-9 w-9 items-center justify-center rounded-xl'
            style={{ backgroundColor: iconBackground }}
          >
            {icon}
          </View>
          <View className='flex-1'>
            <AdvancedOptionRowTitle badge={titleBadge} title={title} />
            <Text
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
                numberOfLines={3}
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
          <AdvancedOptionEditAffordance pressed={pressed} />
        </>
      )}
    </Pressable>
  );
}
