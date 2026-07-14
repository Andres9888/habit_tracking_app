/** Strength Curve gated row — icon · title/value · Edit pill. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { fontWeights, typography } from '@/theme/typography';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { AdvancedOptionEditAffordance } from './AdvancedOptionEditAffordance';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
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
}: Props) {
  const t = useAdvancedTokens();
  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${title}, ${subtitle}, tap to edit`}
      accessibilityRole='button'
      style={{
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
      }}
      onPress={() => {
        void triggerHaptic('selection');
        onPress();
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: iconBackground,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            ...typography.body,
            fontSize: 15,
            fontWeight: fontWeights.semibold,
            color: t.fg,
          }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...typography.caption,
            fontSize: 13,
            color: t.muted,
            marginTop: 2,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <AdvancedOptionEditAffordance />
    </AnimatedPressable>
  );
}
