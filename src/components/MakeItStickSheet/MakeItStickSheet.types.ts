/**
 * Types for MakeItStickSheet.
 */

import type { Doc, Id } from '../../../convex/_generated/dataModel';

export interface MakeItStickSheetProps {
  habitId: Id<'habits'> | null;
  onDone: () => void;
  onSaveError?: () => void;
  template: Doc<'templates'> | null;
  visible: boolean;
}
