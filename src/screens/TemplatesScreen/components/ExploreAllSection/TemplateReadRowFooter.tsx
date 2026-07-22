/**
 * Bottom rail of the Habit Browser card. Left: a meta pill (duration ·
 * frequency). Right: the circular Add / Added toggle that creates the habit.
 */

import { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getTemplateMetaLabel } from '../HabitTemplateCard/templateMeta';
import { TemplateReadRowAddButton } from './TemplateReadRowAddButton';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowFooterProps {
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
}

function TemplateReadRowFooterImpl({
  isImported,
  isImporting,
  item,
  onImport,
}: TemplateReadRowFooterProps) {
  const { colors } = useThemeColors();
  const metaLabel = getTemplateMetaLabel(item);
  const handleImport = useCallback(() => onImport(item), [item, onImport]);

  return (
    <View style={s.footer}>
      {metaLabel ? (
        <View style={[s.metaPill, { backgroundColor: colors.card }]}>
          <Text
            numberOfLines={1}
            style={[s.metaPillText, { color: colors.text.secondary }]}
          >
            🕐 {metaLabel}
          </Text>
        </View>
      ) : null}
      <View style={s.addSlot}>
        <TemplateReadRowAddButton
          isImported={isImported}
          isImporting={isImporting}
          name={item.name}
          onImport={handleImport}
        />
      </View>
    </View>
  );
}

export const TemplateReadRowFooter = memo(TemplateReadRowFooterImpl);
