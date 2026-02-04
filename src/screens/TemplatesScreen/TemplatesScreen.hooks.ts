/**
 * State management for TemplatesScreen
 */

import { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../templates/constants';
import type { BrowseTab, ViewMode } from './TemplatesScreen.types';

interface UseTemplatesScreenStateOptions {
  categories: { id: string }[] | undefined;
}

export function useTemplatesScreenState({
  categories,
}: UseTemplatesScreenStateOptions) {
  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [browseTab, setBrowseTab] = useState<BrowseTab>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [hasInitializedExpanded, setHasInitializedExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [researchOnly, setResearchOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] =
    useState<Doc<'templates'> | null>(null);
  const [showFullsizePreview, setShowFullsizePreview] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [importedTemplateIds, setImportedTemplateIds] = useState<Set<string>>(
    new Set()
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [importingTemplateId, setImportingTemplateId] =
    useState<Id<'templates'> | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Categories collapsed by default per spec - reduces initial overwhelm
  useEffect(() => {
    if (
      Array.isArray(categories) &&
      categories.length > 0 &&
      !hasInitializedExpanded
    ) {
      setExpandedCategories(new Set<string>());
      setHasInitializedExpanded(true);
    }
  }, [categories, hasInitializedExpanded]);

  const safeSearchQuery = searchQuery ?? '';
  const isSearching = safeSearchQuery.trim().length > 0;
  const effectiveViewMode = isSearching ? 'search' : viewMode;
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    Boolean(safeSearchQuery.trim()) ||
    researchOnly;

  return {
    browseTab,
    effectiveViewMode,
    expandedCategories,
    flatListRef,
    hasActiveFilters,
    importedTemplateIds,
    importingTemplateId,
    isSearching,
    isSeeding,
    previewTemplate,
    researchOnly,
    scrollViewRef,
    searchQuery,
    selectedCategory,
    setBrowseTab,
    setExpandedCategories,
    setImportedTemplateIds,
    setImportingTemplateId,
    setIsSeeding,
    setPreviewTemplate,
    setResearchOnly,
    setSearchQuery,
    setSelectedCategory,
    setShowCustomizeModal,
    setShowFullsizePreview,
    setShowSortOptions,
    setShowToast,
    setSortOption,
    setToastMessage,
    setViewMode,
    showCustomizeModal,
    showFullsizePreview,
    showSortOptions,
    showToast,
    sortOption,
    toastMessage,
    viewMode,
  };
}
