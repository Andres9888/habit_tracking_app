/**
 * Foot row for TemplateReadRow — a single duration/frequency meta pill (clock
 * glyph) on the left, the + Add pill on the right, mirroring the habit-library
 * mock's card-foot. Full science + citations live in the detail view.
 */

import { Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { iconSizes } from '@/theme/iconSizes';
import { getTemplateMetaLabel } from '../HabitTemplateCard/templateMeta';
import { ListCardAddButton } from '../../views/TemplateListCard/ListCardAddButton';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowMetaProps {
  importingTemplateId: string | null;
  isImported: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
}

export function TemplateReadRowMeta({
  importingTemplateId,
  isImported,
  item,
  onImport,
}: TemplateReadRowMetaProps) {
  const { colors } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(item);

  return (
    <View style={s.foot}>
      {metaLabel ? (
        <View style={[s.chip, { backgroundColor: colors.card }]}>
          <Clock
            color={colors.text.tertiary}
            size={iconSizes.small - 2}
            strokeWidth={2}
          />
          <Text style={[s.chipText, { color: colors.text.tertiary }]}>
            {metaLabel}
          </Text>
        </View>
      ) : (
        <View />
      )}
      <ListCardAddButton
        isImported={isImported}
        isImporting={importingTemplateId === item._id}
        name={item.name}
        size='regular'
        onImport={() => onImport(item)}
      />
    </View>
  );
}
