import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryIndexItem } from '../components/CategoryIndexGrid';
import type { ResolvedPrescription } from '../hooks/usePrescription';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';

export interface BrowseSectionsProps {
  categoryIndex: CategoryIndexItem[];
  goalTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onBrowseByGoal: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onOpenGoal: (goalId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  prescription: ResolvedPrescription | null;
  rowSections: BrowseRowSection[];
  selectedGoalId: string | null;
  starterTemplates: Doc<'templates'>[];
  totalHabitCount: number;
}
