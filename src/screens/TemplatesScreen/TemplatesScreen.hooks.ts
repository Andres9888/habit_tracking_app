/**
 * State management for TemplatesScreen
 */

import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../templates/constants';
import { useExpandedCategories } from './hooks/useExpandedCategories';
import { useFeedbackState } from './hooks/useFeedbackState';
import { useImportedTemplateIdsSync } from './hooks/useImportedTemplateIdsSync';
import type {
  BrowseTab,
  TemplatePreviewAnchor,
  ViewMode,
} from './TemplatesScreen.types';

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
  const [previewInitialAnchor, setPreviewInitialAnchor] =
    useState<TemplatePreviewAnchor>('top');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const {
    frozenImportedIds,
    importedTemplateIds,
    isImportedStateReady,
    setImportedTemplateIds,
  } = useImportedTemplateIdsSync(initialImportedIds);
  const feedback = useFeedbackState();
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
    ...feedback,
    flatListRef,
    frozenImportedIds,
    hasActiveFilters,
    importedTemplateIds,
    importingTemplateId,
    isImportedStateReady,
    isSearchActive,
    isSearching,
    isSeeding,
    previewInitialAnchor,
    previewTemplate,
    searchQuery,
    selectedCategory,
    setBrowseTab,
    setExpandedCategories,
    setImportedTemplateIds,
    setImportingTemplateId,
    setIsSeeding,
    setPreviewInitialAnchor,
    setPreviewTemplate,
    setSearchQuery,
    setSelectedCategory,
    setShowCustomizeModal,
    setShowFullsizePreview,
    setShowPaywall,
    setShowSortOptions,
    setSortOption,
    setViewMode,
    showCustomizeModal,
    showFullsizePreview,
    showPaywall,
    showSortOptions,
    sortOption,
    viewMode,
  };
}
