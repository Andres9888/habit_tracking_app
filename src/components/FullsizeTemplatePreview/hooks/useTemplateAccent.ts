/**
 * Resolves the preview's accent colour for a template.
 *
 * Accent comes from the category so sibling habits in a shelf match; the row's
 * own `iconColor` is only a fallback for uncategorised/custom templates.
 */

import { useIconAccent } from '@/theme/iconTokens';
import { DEFAULT_ICON_COLOR } from '../FullsizeTemplatePreview.constants';
import type { Template } from '../../../types/template';

export function useTemplateAccent(template: Template | null | undefined) {
  return useIconAccent(
    template?.iconColor?.trim() || DEFAULT_ICON_COLOR,
    template?.category
  );
}
