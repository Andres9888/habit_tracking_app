/**
 * Top of the Habit Browser card — tinted icon square, serif title, and the
 * habit description. Tapping the header opens the detail view.
 */

import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowHeaderProps {
  item: Doc<'templates'>;
  onPreview: (template: Doc<'templates'>) => void;
}

function TemplateReadRowHeaderImpl({
  item,
  onPreview,
}: TemplateReadRowHeaderProps) {
  const { colors } = useThemeColors();
  const iconBg = `${item.iconColor || colors.primary[600]}30`;

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
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
    </Pressable>
  );
}

export const TemplateReadRowHeader = memo(TemplateReadRowHeaderImpl);
