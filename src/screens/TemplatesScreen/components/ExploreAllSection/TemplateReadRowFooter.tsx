/**
 * Footer for TemplateReadRow (Version B). Left: a "How it works"
 * affordance (green chevron + short copy) that opens the detail view.
 * Right: the + Add pill. Always rendered so every card can Add.
 */

import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowFooterProps {
  importingTemplateId: string | null;
  isImported: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function TemplateReadRowFooter({
  importingTemplateId,
  isImported,
  item,
  onImport,
  onPreview,
}: TemplateReadRowFooterProps) {
  const { colors } = useThemeColors();
  const isImporting = importingTemplateId === item._id;

  return (
    <View style={[s.footer, { borderTopColor: colors.border }]}>
      <Pressable
        accessibilityLabel={`Science and how ${item.name} works`}
        accessibilityRole='button'
        style={s.footCopy}
        onPress={() => onPreview(item)}
      >
        <View style={s.footChev}>
          <ChevronRight
            color={colors.text.tertiary}
            size={iconSizes.small}
            strokeWidth={2}
          />
        </View>
        <View style={s.textMin}>
          <Text
            numberOfLines={1}
            style={[s.footTitle, { color: colors.text.secondary }]}
          >
            How it works
          </Text>
        </View>
      </Pressable>
      <ListCardAddButton
        isImported={isImported}
        isImporting={isImporting}
        name={item.name}
        size='regular'
        onImport={() => onImport(item)}
      />
    </View>
  );
}
