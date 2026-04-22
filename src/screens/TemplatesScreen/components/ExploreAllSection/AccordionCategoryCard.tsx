/**
 * AccordionCategoryCard — card with always-visible 2-habit preview.
 * Tap header or "Show all N →" to reveal the remaining habits.
 */

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';
import { CategoryGroupHeader } from './CategoryGroupHeader';
import { ExploreHabitRow } from './ExploreHabitRow';
import { getCardColors, s } from './AccordionCategoryCard.styles';
import type {
  CategoryGroup,
  ExploreAllSectionProps,
} from './ExploreAllSection.types';

const PREVIEW_COUNT = 2;

type Props = {
  group: CategoryGroup;
} & Pick<
  ExploreAllSectionProps,
  'importedTemplateIds' | 'importingTemplateId' | 'onImport' | 'onPreview'
>;

export function AccordionCategoryCard({
  group,
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { colors, isDark } = useThemeColors();
  const preview = group.templates.slice(0, PREVIEW_COUNT);
  const rest = group.templates.slice(PREVIEW_COUNT);
  const hasMore = rest.length > 0;

  const handleToggle = () => {
    if (!hasMore) return;
    void triggerHaptic('selection');
    setExpanded((prev) => !prev);
  };

  const renderRow = (item: Doc<'templates'>) => (
    <ExploreHabitRow
      key={item._id}
      importedTemplateIds={importedTemplateIds}
      importingTemplateId={importingTemplateId}
      item={item}
      onImport={onImport}
      onPreview={onPreview}
    />
  );

  return (
    <View
      style={[
        s.card,
        getCardColors(expanded, colors.card, colors.border, isDark),
      ]}
    >
      <CategoryGroupHeader
        count={group.templates.length}
        expanded={expanded}
        icon={group.icon}
        label={group.label}
        subtitle={group.subtitle}
        onToggle={hasMore ? handleToggle : undefined}
      />
      <View
        style={[
          s.body,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        {preview.map(renderRow)}
        {expanded ? rest.map(renderRow) : null}
        {hasMore ? (
          <Pressable
            accessibilityLabel={
              expanded ? 'Show less' : `Show all ${group.templates.length}`
            }
            accessibilityRole='button'
            style={s.showAll}
            onPress={handleToggle}
          >
            <Text style={[s.showAllText, { color: colors.primary[700] }]}>
              {expanded ? 'Show less' : `Show all ${group.templates.length} →`}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
