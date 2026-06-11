/* eslint-disable max-lines */
/**
 * Compact template result card for filtered list views.
 * Layout: icon + [title + inline add btn] + desc + meta pills.
 */

import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../../theme/typography';
import type { TemplateListCardProps } from './TemplateListCard.types';
import { getMatchReason } from './getMatchReason';
import { styles } from './TemplateListCard.styles';
import { CardFooterMeta } from './CardFooterMeta';
import { ListCardAddButton } from './ListCardAddButton';

export function TemplateListCard({
  getCategoryLabel,
  importedTemplateIds,
  isTopPick,
  item,
  importingTemplateId,
  popularityCount,
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
        isTopPick && styles.topPickAccent,
        {
          backgroundColor: isImported ? '#F0FDF6' : colors.card,
          borderColor: isImported
            ? '#A7F3D0'
            : isTopPick
              ? '#FCD34D'
              : colors.border,
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
          {isTopPick ? (
            <View style={styles.topPickBadge}>
              <Text
                style={{
                  ...typography.caption,
                  color: '#78350F',
                  fontWeight: fontWeights.bold,
                  letterSpacing: 0.3,
                }}
              >
                ⭐ TOP PICK
              </Text>
            </View>
          ) : null}
          <View style={styles.titleRow}>
            <Text
              numberOfLines={2}
              style={[styles.title, { color: colors.text.primary, flex: 1 }]}
            >
              {item.name}
            </Text>
            <ListCardAddButton
              isImported={isImported}
              isImporting={isImporting}
              name={item.name}
              onImport={() => onImport(item._id)}
            />
          </View>
          <Text
            numberOfLines={3}
            style={[styles.description, { color: colors.text.secondary }]}
          >
            {item.description}
          </Text>
          <CardFooterMeta
            categoryLabel={categoryLabel}
            frequency={item.frequency}
            growthType={item.growthType}
            matchReason={matchReason}
            popularityCount={popularityCount}
            template={item}
            onPreview={onPreview}
          />
        </View>
      </View>
    </Pressable>
  );
}
