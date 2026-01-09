/**
 * Type definitions for TemplatesScreen handlers
 */

import type { FlatList } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../templates/constants';
import type { TemplateCustomizations, ViewMode } from './TemplatesScreen.types';

export interface UseTemplateHandlersOptions {
  flatListRef: React.RefObject<FlatList<Doc<'templates'>>>;
  importTemplate: (args: {
    templateId: Id<'templates'>;
    customizations?: TemplateCustomizations;
  }) => Promise<{ success: boolean }>;
  seedAdditionalTemplates: (args: Record<string, never>) => Promise<void>;
  seedNewScienceTemplates: (args: Record<string, never>) => Promise<void>;
  seedTemplates: (args: Record<string, never>) => Promise<void>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setIsSeeding: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setResearchOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}
