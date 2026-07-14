/** +10% → +3% → +1% teaching strip; active node highlights the selection. */
import { Fragment } from 'react';
import { Text, View } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { fontWeights, typography } from '@/theme/typography';
import { CURVE_STRIP } from './mockTokens';
import { StrengthCurveStripCell } from './StrengthCurveStripCell';
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
        marginBottom: 12,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.accentTile,
        gap: 6,
      }}
    >
      {/* Equal-weight cells (flex:1) match Streak/Growth chip rhythm. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        {CURVE_STRIP.map((cell, i) => (
          <Fragment key={cell.mode}>
            {i > 0 ? (
              <Text
                style={{
                  ...typography.caption,
                  fontWeight: fontWeights.bold,
                  color: t.meta,
                  paddingHorizontal: 2,
                  flexShrink: 0,
                }}
              >
                →
              </Text>
            ) : null}
            <StrengthCurveStripCell
              active={cell.mode === selected}
              activeBg={t.accentText}
              inactiveFg={t.accentText}
              pct={cell.pct}
            />
          </Fragment>
        ))}
      </View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 11,
          lineHeight: 14,
          fontWeight: fontWeights.semibold,
          color: t.accentText,
        }}
      >
        per successful check-in · pick one curve
      </Text>
    </View>
  );
}
