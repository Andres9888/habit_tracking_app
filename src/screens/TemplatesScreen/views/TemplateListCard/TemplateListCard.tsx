/**
 * Compact template result card for filtered list views.
 */

import { Pressable, Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { ImportButton } from './components/ImportButton';
import { MetaRow } from './components/MetaRow';
import { getMatchReason } from './getMatchReason';
import { styles } from './TemplateListCard.styles';
import type { TemplateListCardProps } from './TemplateListCard.types';

export function TemplateListCard({
  getCategoryLabel,
  importedTemplateIds,
  item,
  importingTemplateId,
  searchQuery,
  onImport,
  onPreview,
}: TemplateListCardProps) {
  const { colors } = useThemeColors();
  const isImporting = importingTemplateId === item._id;
  const isImported = importedTemplateIds.has(item._id);
  const matchReason = getMatchReason(item, searchQuery, getCategoryLabel);

  return (
    <Pressable
      accessibilityLabel={`${item.name} template`}
      accessibilityRole='button'
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: isImporting ? 0.72 : 1,
        },
      ]}
      onPress={() => onPreview(item)}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${item.iconColor || colors.primary[600]}30` },
          ]}
        >
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>

        <View style={styles.contentColumn}>
          <Text
            numberOfLines={2}
            style={[styles.title, { color: colors.text.primary }]}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.description, { color: colors.text.secondary }]}
          >
            {item.description}
          </Text>
        </View>

        <ImportButton
          isImported={isImported}
          isImporting={isImporting}
          name={item.name}
          onImport={() => onImport(item._id)}
        />
      </View>

      <MetaRow
        categoryId={item.category}
        categoryLabel={getCategoryLabel(item.category)}
        frequency={item.frequency}
        hasResearch={Boolean(item.scientificReference)}
      />

      {matchReason ? (
        <View
          style={[
            styles.matchRow,
            { backgroundColor: `${colors.primary[600]}10` },
          ]}
        >
          <Search color={colors.primary[700]} size={12} strokeWidth={2.5} />
          <Text style={[styles.matchText, { color: colors.primary[700] }]}>
            {matchReason}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
