/**
 * Types for PostImportSetupSheet
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';

export interface PostImportSetupSheetProps {
  habitId: Id<'habits'> | null;
  template: Doc<'templates'> | null;
  visible: boolean;
  onClose: () => void;
}
