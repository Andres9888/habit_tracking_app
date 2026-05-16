/**
 * Meta pills row (frequency, category, popularity) and search match row.
 */

import { Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { getGrowthTypeMeta, type GrowthType } from '@/utils/growthTypeMeta';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
  const growthMeta = getGrowthTypeMeta(growthType);

  return (
    <>
      <View style={styles.metaRow}>
        {growthMeta ? (
          <View
            style={[
              styles.metaPill,
              { backgroundColor: growthMeta.pillBg, borderColor: growthMeta.pillBg },
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
          <View style={styles.popularityPill}>
            <Text style={[styles.metaLabel, { color: '#C2410C' }]}>
              🔥 {popularityCount} added
            </Text>
          </View>
        ) : null}
      </View>

      {matchReason ? (
        <View
          style={[
            styles.matchRow,
            { backgroundColor: `${colors.primary[600]}10` },
          ]}
        >
          <Search color={colors.primary[700]} size={iconSizes.micro} strokeWidth={2.5} />
          <Text style={[styles.matchText, { color: colors.primary[700] }]}>
            {matchReason}
          </Text>
        </View>
      ) : null}
    </>
  );
}
