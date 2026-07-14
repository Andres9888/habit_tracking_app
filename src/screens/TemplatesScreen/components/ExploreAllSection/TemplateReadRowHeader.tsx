/** Top row of TemplateReadRow — icon, name, description, pill add button. */

import { Pressable, Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowHeaderProps {
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function TemplateReadRowHeader({
  isImported,
  isImporting,
  item,
  onImport,
  onPreview,
}: TemplateReadRowHeaderProps) {
  const { colors } = useThemeColors();
  const iconBg = `${item.iconColor || colors.primary[600]}30`;

  return (
    <Pressable
      accessibilityLabel={`${item.name} habit`}
      accessibilityRole='button'
      style={s.row}
      onPress={() => onPreview(item)}
    >
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <Text style={s.emoji}>{item.icon}</Text>
      </View>
      <View style={s.info}>
        <Text
          numberOfLines={1}
          style={[s.name, { color: colors.text.primary }]}
        >
          {item.name}
        </Text>
        <Text
          numberOfLines={3}
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
    </Pressable>
  );
}
