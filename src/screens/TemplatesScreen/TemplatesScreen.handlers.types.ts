/**
 * Type definitions for TemplatesScreen handlers
 */

import type { FlatList } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../components/TemplateAddedToast';
import type { Category, SortOption } from '../templates/constants';
import type { TemplateCustomizations, ViewMode } from './TemplatesScreen.types';

export interface UseTemplateHandlersOptions {
  flatListRef: React.RefObject<FlatList<Doc<'templates'>> | null>;
  importTemplate: (args: {
    templateId: Id<'templates'>;
    customizations?: TemplateCustomizations;
  }) => Promise<{ success: boolean; habitId?: Id<'habits'> }>;
  isPremiumUser: boolean;
  onPostImportSetup?: (habitId: Id<'habits'>, template: Doc<'templates'>) => void;
  onShowPaywall?: () => void;
  previewTemplate: Doc<'templates'> | null;
  seedTemplates: (args: Record<string, never>) => Promise<unknown>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportedTemplateIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setImportingTemplateId: React.Dispatch<
    React.SetStateAction<Id<'templates'> | null>
  >;
  setIsSeeding: React.Dispatch<React.SetStateAction<boolean>>;
  setPreviewTemplate: React.Dispatch<
    React.SetStateAction<Doc<'templates'> | null>
  >;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  userHabitCount: number;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastTemplateData: React.Dispatch<
    React.SetStateAction<TemplateToastData | null>
  >;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}
