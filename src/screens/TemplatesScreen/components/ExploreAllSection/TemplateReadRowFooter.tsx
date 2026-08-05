/**
 * Bottom rail of the Habit Browser card. Left: the meta line (duration ·
 * frequency) as plain text. Right: the labeled Add / Added pill that creates
 * the habit — the only control in the rail.
 */

import { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useBrowserPalette } from '../../browserPalette';
import { getTemplateMetaLabel } from './templateMeta';
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
        <Text
          numberOfLines={1}
          style={[s.metaText, { color: palette.textSecondary }]}
        >
          {metaLabel}
        </Text>
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
