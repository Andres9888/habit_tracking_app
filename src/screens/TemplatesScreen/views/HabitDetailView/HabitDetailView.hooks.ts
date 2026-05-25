import { useState } from 'react';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { deriveConfidenceContent } from '../../data/templateContentFallbacks';

export function useHabitDetailView(template: Doc<'templates'>) {
  const content = deriveConfidenceContent(template);
  const [isCustomizeExpanded, setCustomizeExpanded] = useState(false);
  return {
    content,
    isCustomizeExpanded,
    toggleCustomize: () => setCustomizeExpanded((p) => !p),
  };
}
