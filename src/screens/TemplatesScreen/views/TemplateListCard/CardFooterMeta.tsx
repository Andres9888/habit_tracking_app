/**
 * Meta pills row (frequency, category) and search match row.
 */

import { Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './TemplateListCard.styles';

interface CardFooterMetaProps {
  categoryLabel: string;
  frequency: string | undefined;
  matchReason: string | null;
}

export function CardFooterMeta({
  categoryLabel,
  frequency,
  matchReason,
}: CardFooterMetaProps) {
  const { colors } = useThemeColors();

  return (
    <>
      <View style={styles.metaRow}>
        {frequency ? (
          <View
            style={[
              styles.metaPill,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>
              {frequency}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.metaPill,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metaLabel, { color: colors.text.secondary }]}>
            {categoryLabel}
          </Text>
        </View>
      </View>

      {matchReason ? (
        <View
          style={[styles.matchRow, { backgroundColor: `${colors.primary[600]}10` }]}
        >
          <Search color={colors.primary[700]} size={12} strokeWidth={2.5} />
          <Text style={[styles.matchText, { color: colors.primary[700] }]}>
            {matchReason}
          </Text>
        </View>
      ) : null}
    </>
  );
}
