/**
 * Bottom rail of the Habit Browser card. Left: a meta pill (duration ·
 * frequency). Right: the labeled Add / Added pill that creates the habit.
 */

import { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useBrowserPalette } from '../../browserPalette';
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
  const palette = useBrowserPalette();
  const metaLabel = getTemplateMetaLabel(item);
  const handleImport = useCallback(() => onImport(item), [item, onImport]);

  return (
    <View style={s.footer}>
      {metaLabel ? (
        <View style={[s.metaPill, { backgroundColor: palette.metaPillBg }]}>
          <Text
            numberOfLines={1}
            style={[s.metaPillText, { color: palette.textSecondary }]}
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
