/**
 * Compact template result card for filtered list views.
 * Layout: icon + title/desc (expanded), meta pills, full-width add button.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { TemplateListCardProps } from './TemplateListCard.types';
import { getMatchReason } from './getMatchReason';
import { styles } from './TemplateListCard.styles';
import { CardFooterMeta } from './CardFooterMeta';
import { ListCardAddButton } from './ListCardAddButton';

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
  const categoryLabel = getCategoryLabel(item.category);
  const matchReason = getMatchReason(item, searchQuery, getCategoryLabel);

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
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
            numberOfLines={3}
            style={[styles.description, { color: colors.text.secondary }]}
          >
            {item.description}
          </Text>
          <CardFooterMeta
            categoryLabel={categoryLabel}
            frequency={item.frequency}
            matchReason={matchReason}
          />
        </View>
      </View>

      <ListCardAddButton
        isImported={isImported}
        isImporting={isImporting}
        name={item.name}
        onImport={() => onImport(item._id)}
      />
    </Pressable>
  );
}
