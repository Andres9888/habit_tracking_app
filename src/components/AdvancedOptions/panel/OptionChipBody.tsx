/** Visual body of an OptionChip — glyph, value, suggested dot + micro label. */
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { fontWeights, typography } from '@/theme/typography';
import { usePanelTokens } from './panelTokens';

export interface OptionChipBodyProps {
  label: string;
  value: string;
  selected: boolean;
  suggested: boolean;
  glyph?: ReactNode;
  valueSize: 17 | 15;
  disabled: boolean;
  /** Static tiles skip the press-scale style. */
  animatedStyle?: object | null;
}

export function OptionChipBody({
  label,
  value,
  selected,
  suggested,
  glyph,
  valueSize,
  disabled,
  animatedStyle,
}: OptionChipBodyProps) {
  const t = usePanelTokens();
  const ink = selected
    ? t.chipSelectedInk
    : suggested
      ? t.chipSuggestedInk
      : t.textPrimary;
  const labelInk = selected
    ? t.chipSelectedInk
    : suggested
      ? t.chipSuggestedInk
      : t.textSecondary;

  return (
    <Animated.View
      style={[
        {
          minHeight: 66,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
          paddingHorizontal: 2,
          gap: 2,
          backgroundColor: selected ? t.chipSelectedBg : t.chipRestBg,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? t.chipSelectedBorder : t.chipRestBorder,
          opacity: disabled ? 0.55 : 1,
        },
        animatedStyle ?? null,
      ]}
    >
      {glyph}
      {value ? (
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={{
            ...typography.bodyBold,
            fontSize: valueSize,
            lineHeight: valueSize === 17 ? 20 : 18,
            color: ink,
            fontVariant: ['tabular-nums'],
          }}
        >
          {value}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        {suggested ? (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              backgroundColor: t.dot,
            }}
          />
        ) : null}
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={{
            ...typography.tabBar,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            color: labelInk,
          }}
        >
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}
