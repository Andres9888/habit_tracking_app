/**
 * ExpectationCard — 66-day expectation framing + 7-day chain visual
 * (day 1 filled) shown right after the first habit is added.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';

const CHAIN_DAYS = [1, 2, 3, 4, 5, 6, 7];

export function ExpectationCard() {
  const { colors } = useThemeColors();

  return (
    <View
      style={[
        s.expectCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[s.expectText, { color: colors.text.primary }]}>
        The average habit takes <Text style={s.bold}>~66 days</Text> to feel
        automatic (Lally et al., 2010). Plan for setbacks — missing a day
        doesn&apos;t break anything.
      </Text>
      <View style={s.chainRow}>
        {CHAIN_DAYS.map((day, index) => (
          <View key={day} style={index === 0 ? s.chainCellFirst : s.chainCell}>
            {index > 0 ? (
              <View style={[s.chainLink, { backgroundColor: colors.border }]} />
            ) : null}
            <View
              style={[
                s.chainDay,
                day === 1
                  ? {
                      backgroundColor: colors.primary[600],
                      borderColor: colors.primary[600],
                    }
                  : {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
              ]}
            >
              <Text
                style={[
                  s.chainDayText,
                  {
                    color:
                      day === 1 ? colors.text.inverse : colors.text.tertiary,
                  },
                ]}
              >
                {day}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bold: { fontWeight: fontWeights.bold },
  chainCell: { alignItems: 'center', flex: 1, flexDirection: 'row' },
  chainCellFirst: { alignItems: 'center', flexDirection: 'row' },
  chainDay: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  chainDayText: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
  },
  chainLink: {
    flex: 1,
    height: 2,
  },
  chainRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  expectCard: {
    borderRadius: borderRadius.card,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    padding: spacing.md,
  },
  expectText: {
    ...typography.caption,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
  },
});
