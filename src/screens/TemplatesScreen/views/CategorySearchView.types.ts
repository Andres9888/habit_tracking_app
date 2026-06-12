/**
 * Type definitions for CategorySearchView
 */

import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../../components/TemplateAddedToast';
import type { Category, SortOption } from '../../templates/constants';
import type {
  CategoryDoc,
  TemplateCustomizations,
  TemplatePreviewAnchor,
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
  handleTemplatePreview: (
    template: Doc<'templates'>,
    anchor?: TemplatePreviewAnchor
  ) => void;
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
  previewInitialAnchor: TemplatePreviewAnchor;
  previewTemplate: Doc<'templates'> | null;
  searchQuery: string;
  selectedCategory: Category;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  showCelebration: boolean;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
  showSortOptions: boolean;
  showToast: boolean;
  sortOption: SortOption;
  toastMessage: string;
  toastOnAction: (() => void) | null;
  toastTemplateData: TemplateToastData | null;
}
