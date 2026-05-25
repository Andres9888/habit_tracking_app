/**
 * State management for TemplatesScreen
 */

import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../components/TemplateAddedToast';
import type { Category, SortOption } from '../templates/constants';
import { useExpandedCategories } from './hooks/useExpandedCategories';
import type { BrowseTab, ViewMode } from './TemplatesScreen.types';

interface UseTemplatesScreenStateOptions {
  categories: { id: string }[] | undefined;
  initialImportedIds?: Set<string>;
}

export function useTemplatesScreenState({
  categories,
  initialImportedIds,
}: UseTemplatesScreenStateOptions) {
  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [browseTab, setBrowseTab] = useState<BrowseTab>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const { expandedCategories, setExpandedCategories } =
    useExpandedCategories(categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [previewTemplate, setPreviewTemplate] =
    useState<Doc<'templates'> | null>(null);
  const [showFullsizePreview, setShowFullsizePreview] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [importedTemplateIds, setImportedTemplateIds] = useState<Set<string>>(
    new Set()
  );
  const syncedRef = useRef(false);
  useEffect(() => {
    if (initialImportedIds && initialImportedIds.size > 0 && !syncedRef.current) {
      syncedRef.current = true;
      setImportedTemplateIds((prev) => {
        const merged = new Set(prev);
        for (const id of initialImportedIds) merged.add(id);
        return merged;
      });
    }
  }, [initialImportedIds]);
  const [showToast, setShowToast] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTemplateData, setToastTemplateData] =
    useState<TemplateToastData | null>(null);
  const [feedbackHabitId, setFeedbackHabitId] = useState<Id<'habits'> | null>(
    null
  );
  const [feedbackVariant, setFeedbackVariant] = useState<
    'success' | 'already_exists' | null
  >(null);
  const [sessionImportCount, setSessionImportCount] = useState(0);
  const [importingTemplateId, setImportingTemplateId] =
    useState<Id<'templates'> | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const safeSearchQuery = searchQuery ?? '';
  const isSearching = safeSearchQuery.trim().length > 0;

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchQuery(safeSearchQuery), 150);
    return () => clearTimeout(t);
  }, [safeSearchQuery]);
  const isSearchActive = debouncedSearchQuery.trim().length > 0;

  const effectiveViewMode = isSearching ? 'search' : viewMode;
  const hasActiveFilters =
    selectedCategory !== 'all' || Boolean(safeSearchQuery.trim());

  return {
    browseTab,
    debouncedSearchQuery,
    effectiveViewMode,
    expandedCategories,
    feedbackHabitId,
    feedbackVariant,
    flatListRef,
    hasActiveFilters,
    importedTemplateIds,
    importingTemplateId,
    isSearchActive,
    isSearching,
    isSeeding,
    previewTemplate,
    searchQuery,
    selectedCategory,
    sessionImportCount,
    setBrowseTab,
    setShowCelebration,
    setExpandedCategories,
    setFeedbackHabitId,
    setFeedbackVariant,
    setImportedTemplateIds,
    setImportingTemplateId,
    setIsSeeding,
    setPreviewTemplate,
    setSearchQuery,
    setSelectedCategory,
    setSessionImportCount,
    setShowCustomizeModal,
    setShowFullsizePreview,
    setShowPaywall,
    setShowSortOptions,
    setShowToast,
    setSortOption,
    setToastMessage,
    setToastTemplateData,
    setViewMode,
    showCelebration,
    showCustomizeModal,
    showFullsizePreview,
    showPaywall,
    showSortOptions,
    showToast,
    sortOption,
    toastMessage,
    toastTemplateData,
    viewMode,
  };
}
