import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryIndexItem } from '../components/CategoryIndexGrid';
import type { ResolvedPrescription } from '../hooks/usePrescription';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';

export interface BrowseSectionsProps {
  categoryIndex: CategoryIndexItem[];
  goalTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onOpenCategory: (categoryId: string) => void;
  onPopularImport: (template: Doc<'templates'>) => void;
  onPrescriptionImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  prescription: ResolvedPrescription | null;
  rowSections: BrowseRowSection[];
  selectedGoalId: string | null;
  totalHabitCount: number;
}
