/** +10% → +3% → +1% teaching strip; active node highlights the selection. */
import { Fragment } from 'react';
import { Text, View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { fontWeights, typography } from '@/theme/typography';
import { CURVE_STRIP } from './mockTokens';
import { useAdvancedTokens } from './useAdvancedTokens';

interface Props {
  selected: AlgorithmMode;
}

export function StrengthCurveCompareStrip({ selected }: Props) {
  const t = useAdvancedTokens();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 12,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.accentTile,
      }}
    >
      {CURVE_STRIP.map((cell, i) => {
        const active = cell.mode === selected;
        return (
          <Fragment key={cell.mode}>
            {i > 0 ? (
              <Text
                style={{
                  ...typography.caption,
                  fontWeight: fontWeights.bold,
                  color: t.meta,
                  marginHorizontal: 4,
                }}
              >
                →
              </Text>
            ) : null}
            <View
              style={{
                minWidth: 48,
                alignItems: 'center',
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 8,
                backgroundColor: active ? t.accentText : 'transparent',
                ...(active ? { transform: [{ translateY: -1 }] } : {}),
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: fontWeights.bold,
                  color: active ? '#fff' : t.accentText,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {cell.pct}
              </Text>
            </View>
          </Fragment>
        );
      })}
      <Text
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          color: t.accentText,
          marginTop: 4,
        }}
      >
        per successful check-in · pick one curve
      </Text>
    </View>
  );
}
