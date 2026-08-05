/**
 * Top block of TemplateReadRow — icon, serif name, description, and a small
 * inline "Details ›" affordance. The whole block opens the detail view.
 */

import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowHeaderProps {
  item: Doc<'templates'>;
  onPreview: (template: Doc<'templates'>) => void;
}

export function TemplateReadRowHeader({
  item,
  onPreview,
}: TemplateReadRowHeaderProps) {
  const { colors } = useThemeColors();
  const iconBg = `${item.iconColor || colors.primary[600]}30`;

  return (
    <Pressable
      accessibilityHint='Opens science and how it works'
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={s.header}
      onPress={() => onPreview(item)}
    >
      <View style={s.titleRow}>
        <View style={[s.iconBox, { backgroundColor: iconBg }]}>
          <Text style={s.emoji}>{item.icon}</Text>
        </View>
        <Text
          numberOfLines={2}
          style={[s.name, { color: colors.text.primary }]}
        >
          {item.name}
        </Text>
      </View>
      <Text
        numberOfLines={3}
        style={[s.description, { color: colors.text.secondary }]}
      >
        {item.description}
      </Text>
      <View style={s.details}>
        <Text style={[s.detailsText, { color: colors.text.tertiary }]}>
          Details
        </Text>
        <ChevronRight
          color={colors.text.tertiary}
          size={iconSizes.small - 2}
          strokeWidth={2.2}
        />
      </View>
    </Pressable>
  );
}
