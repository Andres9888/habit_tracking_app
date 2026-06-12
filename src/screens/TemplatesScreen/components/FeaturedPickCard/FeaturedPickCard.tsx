/**
 * FeaturedPickCard — single opinionated "Start here" pick at the top of
 * the browse surface. One-tap add; tapping the card opens the preview.
 */

import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { getTemplateMetaLabel } from '../HabitTemplateCard';
import { styles as s } from './FeaturedPickCard.styles';

interface FeaturedPickCardProps {
  isImported: boolean;
  isImporting: boolean;
  label?: string;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  template: Doc<'templates'>;
}

export function FeaturedPickCard({
  isImported,
  isImporting,
  label = 'Start here',
  onImport,
  onPreview,
  template,
}: FeaturedPickCardProps) {
  const { colors } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(template);

  return (
    <Pressable
      accessibilityLabel={`${label}: ${template.name}`}
      accessibilityRole='button'
      testID='templates-featured-pick'
      style={[
        s.card,
        {
          backgroundColor: isImported ? '#F0FDF6' : colors.card,
          borderColor: isImported ? '#A7F3D0' : colors.border,
          opacity: isImporting ? 0.72 : 1,
        },
      ]}
      onPress={() => onPreview(template)}
    >
      <View style={[s.accent, { backgroundColor: colors.primary[600] }]} />
      <Text style={[s.label, { color: colors.primary[700] }]}>{label}</Text>
      <View style={s.row}>
        <View
          style={[
            s.icon,
            {
              backgroundColor: `${template.iconColor || colors.primary[600]}26`,
            },
          ]}
        >
          <Text style={s.iconText}>{template.icon}</Text>
        </View>
        <View style={s.body}>
          <Text
            numberOfLines={1}
            style={[s.name, { color: colors.text.primary }]}
          >
            {template.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[s.description, { color: colors.text.secondary }]}
          >
            {template.description}
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
            {template.scientificReference ? (
              <Text style={[s.science, { color: colors.text.tertiary }]}>
                🔬 research-backed
              </Text>
            ) : null}
          </View>
        </View>
        <ListCardAddButton
          isImported={isImported}
          isImporting={isImporting}
          name={template.name}
          onImport={() => onImport(template)}
        />
      </View>
    </Pressable>
  );
}
