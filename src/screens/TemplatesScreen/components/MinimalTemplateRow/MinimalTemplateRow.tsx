/**
 * MinimalTemplateRow — single-column browse row: tinted icon, name,
 * one-line description, meta pill, and a single inline add button.
 * Imported state renders as a quiet green tint (no modal).
 */

import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { getTemplateMetaLabel } from './templateMeta';
import { styles as s } from './MinimalTemplateRow.styles';

interface MinimalTemplateRowProps {
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function MinimalTemplateRow({
  isImported,
  isImporting,
  item,
  onImport,
  onPreview,
}: MinimalTemplateRowProps) {
  const { colors } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(item);

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={[
        s.row,
        {
          backgroundColor: isImported ? '#F0FDF6' : colors.card,
          borderColor: isImported ? '#A7F3D0' : colors.border,
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
          numberOfLines={1}
          style={[s.name, { color: colors.text.primary }]}
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={1}
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
          {item.scientificReference ? (
            <Text style={[s.science, { color: colors.text.tertiary }]}>
              🔬 research-backed
            </Text>
          ) : null}
        </View>
      </View>
      <ListCardAddButton
        isImported={isImported}
        isImporting={isImporting}
        name={item.name}
        onImport={() => onImport(item)}
      />
    </Pressable>
  );
}
