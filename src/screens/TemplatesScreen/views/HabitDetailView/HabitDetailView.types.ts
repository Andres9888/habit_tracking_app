import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { DetailSourcePath } from '../../hooks/useViewNavigation';

export interface HabitDetailViewProps {
  template: Doc<'templates'>;
  sourcePath: DetailSourcePath;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onCustomize: (template: Doc<'templates'>) => void;
  onTrackOpen?: (templateId: string, sourcePath: DetailSourcePath) => void;
}
