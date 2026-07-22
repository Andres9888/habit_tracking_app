/**
 * Habit Browser card — a tinted icon and serif title, the habit description,
 * an outlined "Details" pill, a "START SMALL" box, and a bottom rail pairing a
 * meta pill with a circular Add / Added toggle. Full-width; one per habit.
 */

import { memo } from 'react';
import { View } from 'react-native';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { browserPalette } from '../../browserPalette';
import { TemplateReadRowDetails } from './TemplateReadRowDetails';
import { TemplateReadRowFooter } from './TemplateReadRowFooter';
import { TemplateReadRowHeader } from './TemplateReadRowHeader';
import { TemplateReadRowTeaser } from './TemplateReadRowTeaser';
import { s } from './TemplateReadRow.styles';

interface TemplateReadRowProps {
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

function TemplateReadRowImpl({
  isImported,
  isImporting,
  item,
  onImport,
  onPreview,
}: TemplateReadRowProps) {
  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: browserPalette.card,
          borderColor: browserPalette.border,
        },
      ]}
    >
      <TemplateReadRowHeader item={item} onPreview={onPreview} />
      <TemplateReadRowDetails item={item} onPreview={onPreview} />
      <TemplateReadRowTeaser item={item} />
      <TemplateReadRowFooter
        isImported={isImported}
        isImporting={isImporting}
        item={item}
        onImport={onImport}
      />
    </View>
  );
}

export const TemplateReadRow = memo(TemplateReadRowImpl);
