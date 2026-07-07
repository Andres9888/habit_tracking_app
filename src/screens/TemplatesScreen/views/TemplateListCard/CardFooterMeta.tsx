/**
 * Meta pills row (frequency, category, popularity).
 */

import { Text, View } from 'react-native';
import { getGrowthTypeMeta, type GrowthType } from '@/utils/growthTypeMeta';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getTemplatePillColors } from '../../utils/templatePillColors';
import { CardMatchRow } from './CardMatchRow';
import { styles } from './TemplateListCard.styles';

interface CardFooterMetaProps {
  categoryLabel: string;
  frequency: string | undefined;
  growthType?: GrowthType;
  matchReason: string | null;
  popularityCount?: string | null;
}

export function CardFooterMeta({
  categoryLabel,
  frequency,
  growthType,
  matchReason,
  popularityCount,
}: CardFooterMetaProps) {
  const { colors, isDark } = useThemeColors();
  const { popularity } = getTemplatePillColors(colors, isDark);
  const growthMeta = getGrowthTypeMeta(growthType);

  return (
    <>
      <View style={styles.metaRow}>
        {growthMeta ? (
          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: growthMeta.pillBg,
                borderColor: growthMeta.pillBg,
              },
            ]}
          >
            <Text style={[styles.metaLabel, { color: growthMeta.pillFg }]}>
              {growthMeta.label} · ~{growthMeta.days}d
            </Text>
          </View>
        ) : null}
        {frequency ? (
          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>
              📅 {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </Text>
          </View>
        ) : null}
        {categoryLabel ? (
          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>
              {categoryLabel}
            </Text>
          </View>
        ) : null}
        {popularityCount ? (
          <View
            style={[
              styles.popularityPill,
              {
                backgroundColor: popularity.bg,
                borderColor: popularity.border,
              },
            ]}
          >
            <Text style={[styles.metaLabel, { color: popularity.text }]}>
              🔥 {popularityCount} added
            </Text>
          </View>
        ) : null}
      </View>
      {matchReason ? <CardMatchRow matchReason={matchReason} /> : null}
    </>
  );
}
