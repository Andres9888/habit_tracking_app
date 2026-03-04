/**
 * State management for TemplatesScreen
 */

import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import type { Doc, Id } from '../../../convex/_generated/dataModel';
import type { TemplateToastData } from '../../components/TemplateAddedToast';
import type { Category, SortOption } from '../templates/constants';
import { useExpandedCategories } from './hooks/useExpandedCategories';
import type { BrowseTab, ViewMode } from './TemplatesScreen.types';

interface UseTemplatesScreenStateOptions {
  categories: { id: string }[] | undefined;
}

export function useTemplatesScreenState({
  categories,
}: UseTemplatesScreenStateOptions) {
  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [browseTab, setBrowseTab] = useState<BrowseTab>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const { expandedCategories, setExpandedCategories } =
    useExpandedCategories(categories);
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastTemplateData, setToastTemplateData] =
    useState<TemplateToastData | null>(null);
  const [importingTemplateId, setImportingTemplateId] =
    useState<Id<'templates'> | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

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
    searchQuery,
    selectedCategory,
    setBrowseTab,
    setShowCelebration,
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
