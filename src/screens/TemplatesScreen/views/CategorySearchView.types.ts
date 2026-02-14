/**
 * Type definitions for CategorySearchView
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../../templates/constants';
import type {
  CategoryDoc,
  TemplateCustomizations,
  ViewMode,
} from '../TemplatesScreen.types';

export interface CategorySearchHandlers {
  handleBackToBrowse: () => void;
  handleCustomizeFromPreview: (template: Doc<'templates'>) => void;
  handleDirectImport: (templateId: Id<'templates'>) => Promise<void>;
  handleResetFilters: () => void;
  handleSelectSortOption: (option: SortOption) => void;
  handleTemplateImport: (
    templateId: Id<'templates'>,
    customizations?: TemplateCustomizations
  ) => Promise<void>;
  handleTemplatePreview: (template: Doc<'templates'>) => void;
}

export interface CategorySearchViewProps {
  categories: CategoryDoc[] | undefined;
  effectiveViewMode: ViewMode;
  filteredTemplates: Doc<'templates'>[];
  getCategoryLabel: (categoryId: string) => string;
  handlers: CategorySearchHandlers;
  hasActiveFilters: boolean;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  isPremiumUser: boolean;
  previewTemplate: Doc<'templates'> | null;
  researchOnly: boolean;
  searchQuery: string;
  selectedCategory: Category;
  setResearchOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
  showSortOptions: boolean;
  showToast: boolean;
  sortOption: SortOption;
  toastMessage: string;
}
