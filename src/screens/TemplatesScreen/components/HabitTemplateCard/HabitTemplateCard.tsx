/**
 * HabitTemplateCard — drill-style card for browse, drill, and catalog lists.
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { shadows } from '../../../../theme/spacing';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { getImportedStateColors } from '../../utils/importedStateColors';
import type { TemplatePreviewAnchor } from '../../TemplatesScreen.types';
import { HabitTemplateCardBottomRail } from './HabitTemplateCardBottomRail';
import { HabitTemplateCardTopPick } from './HabitTemplateCardTopPick';
import { styles as s } from './HabitTemplateCard.styles';

export interface HabitTemplateCardProps {
  descriptionLines?: 2 | 3;
  elevated?: boolean;
  isImported: boolean;
  isImporting: boolean;
  isTopPick?: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (
    template: Doc<'templates'>,
    anchor?: TemplatePreviewAnchor
  ) => void;
}

function HabitTemplateCardComponent({
  descriptionLines = 2,
  elevated = false,
  isImported,
  isImporting,
  isTopPick = false,
  item,
  onImport,
  onPreview,
}: HabitTemplateCardProps) {
  const { colors, isDark } = useThemeColors();
  const importedColors = getImportedStateColors(isDark);
  const topPickBorderColor = isDark
    ? colors.status.warning
    : colors.status.warningLight;

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={[
        s.card,
        shadows.subtle,
        elevated && shadows.card,
        {
          backgroundColor: isImported
            ? importedColors.backgroundColor
            : colors.card,
          borderColor: isImported
            ? importedColors.borderColor
            : isTopPick
              ? topPickBorderColor
              : colors.border,
          opacity: isImporting ? 0.72 : 1,
        },
      ]}
      onPress={() => onPreview(item)}
    >
      {isTopPick ? <HabitTemplateCardTopPick /> : null}
      <View style={s.topRow}>
        <View
          style={[
            s.icon,
            { backgroundColor: `${item.iconColor || colors.primary[600]}26` },
          ]}
        >
          <Text style={s.iconText}>{item.icon}</Text>
        </View>
        <View style={s.body}>
          <Text
            numberOfLines={2}
            style={[s.name, { color: colors.text.primary }]}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={descriptionLines}
            style={[s.description, { color: colors.text.secondary }]}
          >
            {item.description}
          </Text>
        </View>
        <View style={s.addSlot}>
          <ListCardAddButton
            isImported={isImported}
            isImporting={isImporting}
            name={item.name}
            onImport={() => onImport(item)}
          />
        </View>
      </View>
      <HabitTemplateCardBottomRail item={item} onPreview={onPreview} />
    </Pressable>
  );
}

export const HabitTemplateCard = memo(HabitTemplateCardComponent);
