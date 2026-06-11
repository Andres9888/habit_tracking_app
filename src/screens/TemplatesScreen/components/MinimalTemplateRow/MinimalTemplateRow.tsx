/**
 * MinimalTemplateRow — single-column browse row: tinted icon, name,
 * one-line description, meta pill, and a single inline add button.
 * Imported state renders as a quiet green tint (no modal).
 */

import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { shadows } from '../../../../theme/spacing';
import { DetailsChevron } from '../DetailsChevron';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { getImportedStateColors } from '../../utils/importedStateColors';
import { getTemplateMetaLabel } from './templateMeta';
import { styles as s } from './MinimalTemplateRow.styles';

interface MinimalTemplateRowProps {
  elevated?: boolean;
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function MinimalTemplateRow({
  elevated = false,
  isImported,
  isImporting,
  item,
  onImport,
  onPreview,
}: MinimalTemplateRowProps) {
  const { colors, isDark } = useThemeColors();
  const importedColors = getImportedStateColors(isDark);
  const metaLabel = getTemplateMetaLabel(item);

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={[
        s.row,
        elevated && shadows.card,
        {
          backgroundColor: isImported
            ? importedColors.backgroundColor
            : colors.card,
          borderColor: isImported ? importedColors.borderColor : colors.border,
          opacity: isImporting ? 0.72 : 1,
        },
      ]}
      onPress={() => onPreview(item)}
    >
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
          numberOfLines={2}
          style={[s.description, { color: colors.text.secondary }]}
        >
          {item.description}
        </Text>
        <View style={s.metaLine}>
          {metaLabel ? (
            <View
              style={[
                s.pill,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[s.pillLabel, { color: colors.text.secondary }]}>
                {metaLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <DetailsChevron />
      <ListCardAddButton
        isImported={isImported}
        isImporting={isImporting}
        name={item.name}
        onImport={() => onImport(item)}
      />
    </Pressable>
  );
}
