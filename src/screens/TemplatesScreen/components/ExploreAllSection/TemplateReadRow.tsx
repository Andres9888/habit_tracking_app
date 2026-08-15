/**
 * Habit Browser card — a tinted icon, serif title and chevron, a two-line
 * description, and a bottom rail pairing the meta line with a labeled
 * Add / Added pill. Full-width; one per habit.
 *
 * Deliberately compact: browsing is a scanning task, and a category here runs
 * to ~48 habits. The "Start small" copy that used to sit on every card now
 * lives in the detail view, where the reader has already opted in.
 */

import { memo, useCallback } from 'react';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { useBrowserPalette } from '../../browserPalette';
import { TemplateReadRowFooter } from './TemplateReadRowFooter';
import { TemplateReadRowHeader } from './TemplateReadRowHeader';
import { s } from './TemplateReadRow.styles';
import type { OnTemplatePreview } from '../../TemplatesScreen.types';

interface TemplateReadRowProps {
  isImported: boolean;
  isImporting: boolean;
  item: Doc<'templates'>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: OnTemplatePreview;
}

function TemplateReadRowImpl({
  isImported,
  isImporting,
  item,
  onImport,
  onPreview,
}: TemplateReadRowProps) {
  const palette = useBrowserPalette();
  const handlePreview = useCallback(() => onPreview(item), [item, onPreview]);

  return (
    // The whole card opens the detail view — users tap "the card", not a
    // subcomponent. accessible={false}: this Pressable exists for touch
    // coverage only. The header stays the single labeled a11y stop for "open
    // details", so screen reader users aren't offered the same action twice.
    <AnimatedPressable
      accessible={false}
      // Opening the preview mid-import races the import completing underneath
      // it, and the card is about to change state anyway.
      disabled={isImporting}
      // Cards sit spacing.sm apart; the default hitSlop would overlap the
      // neighbouring card's target.
      hitSlop={0}
      style={[
        s.card,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
        },
        isImporting && s.cardImporting,
      ]}
      onPress={handlePreview}
    >
      <TemplateReadRowHeader
        disabled={isImporting}
        item={item}
        onPreview={onPreview}
      />
      <TemplateReadRowFooter
        isImported={isImported}
        isImporting={isImporting}
        item={item}
        onImport={onImport}
      />
    </AnimatedPressable>
  );
}

export const TemplateReadRow = memo(TemplateReadRowImpl);
