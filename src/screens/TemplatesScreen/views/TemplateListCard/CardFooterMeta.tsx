/**
 * Meta pills row (frequency, category, popularity) and science door.
 */

import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { getGrowthTypeMeta, type GrowthType } from '@/utils/growthTypeMeta';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { ScienceDoorPill } from '../../components/ScienceDoorPill';
import { CardMatchRow } from './CardMatchRow';
import { styles } from './TemplateListCard.styles';

interface CardFooterMetaProps {
  categoryLabel: string;
  frequency: string | undefined;
  growthType?: GrowthType;
  matchReason: string | null;
  onPreview: (template: Doc<'templates'>) => void;
  popularityCount?: string | null;
  template: Doc<'templates'>;
}

export function CardFooterMeta({
  categoryLabel,
  frequency,
  growthType,
  matchReason,
  onPreview,
  popularityCount,
  template,
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
          <View style={styles.popularityPill}>
            <Text style={[styles.metaLabel, { color: '#C2410C' }]}>
              🔥 {popularityCount} added
            </Text>
          </View>
        ) : null}
        <ScienceDoorPill template={template} onPress={onPreview} />
      </View>
      {matchReason ? <CardMatchRow matchReason={matchReason} /> : null}
    </>
  );
}
