/**
 * Templates Screen
 * Based on UX Specification Section 2.1 (Templates Tab) & Section 9.2
 *
 * Purpose: Browse and import science-backed habit templates
 * Features: Collapsible category sections, featured hero, search, import flow
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';

import Button from '../components/Button/Button';
import CollapsibleCategorySection from '../components/CollapsibleCategorySection';
import EmptyState from '../components/EmptyState';
import MiniTemplateCard from '../components/MiniTemplateCard';
import TemplateCard from '../components/TemplateCard';
import Toast from '../components/Toast';
import { useAppTheme } from '../theme';

import TemplatePreviewModal from './templates/TemplatePreviewModal';
import FullsizeTemplatePreview from '../components/FullsizeTemplatePreview';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
  SORT_LABELS,
  SORT_OPTIONS,
  type Category,
  type SortOption,
} from './templates/constants';
import { styles } from './templates/templatesScreenStyles';

// View modes for the screen
type ViewMode = 'browse' | 'category' | 'search';

// Tab options for main view
type BrowseTab = 'categories' | 'all';

// Screen entrance animation spring config - fast parallel reveal
const ENTRANCE_SPRING_CONFIG = {
  damping: 24,
  stiffness: 400,
};

export default function TemplatesScreen() {
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const reducedMotion = useReduceMotion();

  // Screen entrance animation values
  const headerTranslateY = useSharedValue(-20);
  const headerOpacity = useSharedValue(0);
  const searchOpacity = useSharedValue(0);
  const searchTranslateY = useSharedValue(15);
  const tabBarOpacity = useSharedValue(0);
  const tabBarTranslateY = useSharedValue(15);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  // Trigger choreographed entrance animation on mount
  useEffect(() => {
    if (reducedMotion) {
      // Instant appearance for reduced motion
      headerTranslateY.value = 0;
      headerOpacity.value = 1;
      searchOpacity.value = 1;
      searchTranslateY.value = 0;
      tabBarOpacity.value = 1;
      tabBarTranslateY.value = 0;
      contentOpacity.value = 1;
      contentTranslateY.value = 0;
      return;
    }

    // Content is instant - modal slide IS the animation
    // No separate content animation, just like native iOS sheets

    headerTranslateY.value = 0;
    headerOpacity.value = 1;

    searchTranslateY.value = 0;
    searchOpacity.value = 1;

    tabBarTranslateY.value = 0;
    tabBarOpacity.value = 1;

    contentTranslateY.value = 0;
    contentOpacity.value = 1;
  }, [reducedMotion]);

  // Animated styles for screen sections
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerTranslateY.value }],
    opacity: headerOpacity.value,
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: searchTranslateY.value }],
    opacity: searchOpacity.value,
  }));

  const tabBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }],
    opacity: tabBarOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [browseTab, setBrowseTab] = useState<BrowseTab>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['morning_routine', 'health_fitness']) // Default expanded
  );

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [researchOnly, setResearchOnly] = useState(false);

  // Modal & UI state
  const [previewTemplate, setPreviewTemplate] = useState<Doc<'templates'> | null>(null);
  const [showFullsizePreview, setShowFullsizePreview] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [importedTemplateIds, setImportedTemplateIds] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);
  const [importingTemplateId, setImportingTemplateId] = useState<Id<'templates'> | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const listScrollOffset = useRef(0);
  const listScrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });

  // Fetch templates and categories
  const allTemplates = useQuery(api.templates.list, {});
  const categories = useQuery(api.categories.list, {});
  const isLoading = allTemplates === undefined || categories === undefined;

  // Import template mutation
  const importTemplate = useMutation(api.templates.importTemplate);

  // Seed template mutations
  const seedTemplates = useMutation(api.templates.seedTemplates);
  const seedAdditionalTemplates = useMutation(api.templates.seedAdditionalTemplates);
  const seedNewScienceTemplates = useMutation(api.templates.seedNewScienceTemplates);
  const [isSeeding, setIsSeeding] = useState(false);

  // Group templates by category
  const templatesByCategory = useMemo(() => {
    if (!allTemplates) return new Map<string, Doc<'templates'>[]>();

    const grouped = new Map<string, Doc<'templates'>[]>();
    allTemplates.forEach((template) => {
      const existing = grouped.get(template.category) || [];
      grouped.set(template.category, [...existing, template]);
    });

    // Sort templates within each category by popularity
    grouped.forEach((templates, category) => {
      grouped.set(
        category,
        templates.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      );
    });

    return grouped;
  }, [allTemplates]);

  // Category counts
  const categoryCounts = useMemo(() => {
    if (!allTemplates) return {} as Record<Category, number>;

    return allTemplates.reduce((acc, template) => {
      acc.all = (acc.all || 0) + 1;
      acc[template.category as Category] = (acc[template.category as Category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>);
  }, [allTemplates]);

  // Filter templates for search/category view
  const filteredTemplates = useMemo(() => {
    if (!allTemplates) return [];

    let data = [...allTemplates];

    if (selectedCategory !== 'all') {
      data = data.filter((t) => t.category === selectedCategory);
    }

    if (researchOnly) {
      data = data.filter((t) => Boolean(t.scientificLink));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    const sorter: Record<SortOption, (a: Doc<'templates'>, b: Doc<'templates'>) => number> = {
      az: (a, b) => a.name.localeCompare(b.name),
      newest: (a, b) => b.createdAt - a.createdAt,
      popular: (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0),
    };

    return data.sort(sorter[sortOption]);
  }, [allTemplates, selectedCategory, researchOnly, searchQuery, sortOption]);

  // Determine if we're in search mode
  const isSearching = searchQuery.trim().length > 0;
  const effectiveViewMode = isSearching ? 'search' : viewMode;

  const hasActiveFilters = selectedCategory !== 'all' || Boolean(searchQuery.trim()) || researchOnly;

  // Toggle category expansion
  const handleToggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // Back to browse mode
  const handleBackToBrowse = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory('all');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Handle template preview - opens fullsize preview first
  const handleTemplatePreview = useCallback((template: Doc<'templates'>) => {
    setPreviewTemplate(template);
    setShowFullsizePreview(true);
  }, []);

  // Handle customize from fullsize preview
  const handleCustomizeFromPreview = useCallback((template: Doc<'templates'>) => {
    // Set template and open customize modal immediately
    // Both modals can handle their own visibility
    setPreviewTemplate(template);
    setShowCustomizeModal(true);
    setShowFullsizePreview(false);
  }, []);

  // Handle direct import from fullsize preview
  const handleDirectImport = useCallback(
    async (templateId: Id<'templates'>) => {
      try {
        setImportingTemplateId(templateId);
        const result = await importTemplate({ customizations: undefined, templateId });

        if (result.success) {
          // Mark as imported for success animation
          setImportedTemplateIds((prev) => new Set(prev).add(templateId));

          // Show success toast
          setShowToast(true);
          setToastMessage('Imported habit successfully');

          // Close modal after a short delay to show success animation
          setTimeout(() => {
            setShowFullsizePreview(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to import template:', error);
        setShowToast(true);
        setToastMessage('Failed to import template. Please try again.');
      } finally {
        setImportingTemplateId(null);
      }
    },
    [importTemplate]
  );

  // Handle template import (from customize modal)
  const handleTemplateImport = useCallback(
    async (
      templateId: Id<'templates'>,
      customizations?: {
        iconColor?: string;
        name?: string;
        reminderTime?: string;
      }
    ) => {
      try {
        setImportingTemplateId(templateId);
        const result = await importTemplate({ customizations, templateId });

        if (result.success) {
          // Mark as imported
          setImportedTemplateIds((prev) => new Set(prev).add(templateId));
          setShowToast(true);
          setToastMessage('Imported habit successfully');
          setShowCustomizeModal(false);
        }
      } catch (error) {
        console.error('Failed to import template:', error);
        setShowToast(true);
        setToastMessage('Failed to import template. Please try again.');
      } finally {
        setImportingTemplateId(null);
      }
    },
    [importTemplate]
  );

  const handleOpenSortOptions = useCallback(() => {
    setShowSortOptions(true);
  }, []);

  const handleCloseSortOptions = useCallback(() => {
    setShowSortOptions(false);
  }, []);

  const handleSelectSortOption = useCallback((option: SortOption) => {
    setSortOption(option);
    setShowSortOptions(false);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setResearchOnly(false);
    setSortOption('popular');
    setViewMode('browse');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleSeedTemplates = useCallback(async () => {
    setIsSeeding(true);
    try {
      await seedTemplates({});
      await seedAdditionalTemplates({});
      await seedNewScienceTemplates({});
      setToastMessage('Templates loaded successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error seeding templates:', error);
      setToastMessage('Failed to load templates.');
      setShowToast(true);
    } finally {
      setIsSeeding(false);
    }
  }, [seedTemplates, seedAdditionalTemplates, seedNewScienceTemplates]);


  // Scroll shadow handling for category view
  const updateListScrollShadows = useCallback(() => {
    const { layoutHeight, contentHeight } = listScrollMetrics.current;
    const offsetY = listScrollOffset.current;
    const hasScrollableContent = contentHeight > layoutHeight + 1;

    setShowTopScrollShadow(hasScrollableContent && offsetY > 4);
    setShowBottomScrollShadow(
      hasScrollableContent && contentHeight - (offsetY + layoutHeight) > 4
    );
  }, []);

  const handleListScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      listScrollOffset.current = contentOffset.y;
      listScrollMetrics.current = {
        contentHeight: contentSize.height,
        layoutHeight: layoutMeasurement.height,
      };
      updateListScrollShadows();
    },
    [updateListScrollShadows]
  );

  const handleListContentSizeChange = useCallback(
    (_width: number, height: number) => {
      listScrollMetrics.current = { ...listScrollMetrics.current, contentHeight: height };
      updateListScrollShadows();
    },
    [updateListScrollShadows]
  );

  const handleListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      listScrollMetrics.current = {
        ...listScrollMetrics.current,
        layoutHeight: event.nativeEvent.layout.height,
      };
      updateListScrollShadows();
    },
    [updateListScrollShadows]
  );

  // Reset scroll shadows on view changes
  useEffect(() => {
    listScrollOffset.current = 0;
    listScrollMetrics.current = { ...listScrollMetrics.current, contentHeight: 0 };
    setShowTopScrollShadow(false);
    setShowBottomScrollShadow(false);
  }, [selectedCategory, filteredTemplates.length, viewMode]);

  // Render template card for FlatList
  const renderTemplateCard = useCallback(
    ({ item }: { item: Doc<'templates'> }) => (
      <TemplateCard
        category={item.category}
        description={item.description}
        frequency={item.frequency}
        icon={item.icon}
        iconColor={item.iconColor}
        id={item._id}
        isImporting={importingTemplateId === item._id}
        isPremium={item.category === 'andrew_huberman'}
        name={item.name}
        onImport={() => handleTemplateImport(item._id)}
        onPreview={() => handleTemplatePreview(item)}
        popularityScore={item.popularityScore}
        scientificLink={item.scientificLink}
        scientificReference={item.scientificReference}
        youtubeLink={item.youtubeLink}
      />
    ),
    [handleTemplateImport, handleTemplatePreview, importingTemplateId]
  );

  // Get category label for header
  const getCategoryLabel = (categoryId: string): string => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.label || categoryId;
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[theme.custom.typography.heading1, { color: '#101727', fontWeight: '700' }]}>
            Import Habits
          </Text>
          <Text style={[theme.custom.typography.bodySmall, { color: '#6b7280', marginTop: 4 }]}>
            Science-backed habits to get you started
          </Text>
        </View>
        <View style={styles.skeletonSearch} />
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.skeletonCard}>
            <View style={styles.skeletonIcon} />
            <View style={styles.skeletonLineLarge} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonBadgeRow}>
              <View style={styles.skeletonBadge} />
              <View style={styles.skeletonBadge} />
              <View style={styles.skeletonBadge} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // Empty state (no templates)
  if (!allTemplates || allTemplates.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          hideCTA
          description="Tap the button below to load science-backed habits."
          headline="No Habits Available"
          icon="📚"
        />
        <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <Button
            disabled={isSeeding}
            onPress={handleSeedTemplates}
            size="large"
            variant="primary"
          >
            {isSeeding ? 'Loading Habits...' : 'Load Habits'}
          </Button>
        </View>
      </View>
    );
  }

  // Category view (showing all templates in one category)
  if (effectiveViewMode === 'category' || effectiveViewMode === 'search') {
    const colors = CATEGORY_COLORS[selectedCategory] || DEFAULT_CATEGORY_COLORS;
    const categoryIcon = categories?.find((c) => c.id === selectedCategory)?.icon || '📌';

    return (
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          {effectiveViewMode === 'category' && (
            <Pressable
              accessible
              accessibilityLabel="Go back to browse"
              accessibilityRole="button"
              style={styles.backButton}
              onPress={handleBackToBrowse}
            >
              <ArrowLeft color="#374151" size={20} strokeWidth={2.5} />
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          )}
          <View style={styles.categoryHeaderRow}>
            {effectiveViewMode === 'category' && (
              <View style={[styles.categoryHeaderIcon, { backgroundColor: colors.bg }]}>
                <Text style={{ fontSize: 24 }}>{categoryIcon}</Text>
              </View>
            )}
            <View>
              <Text style={[theme.custom.typography.heading1, { color: '#101727', fontWeight: '700' }]}>
                {effectiveViewMode === 'search' ? 'Search Results' : getCategoryLabel(selectedCategory)}
              </Text>
              <Text style={[theme.custom.typography.bodySmall, { color: '#6b7280', marginTop: 2 }]}>
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Search bar (always visible) */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search color="#a8a29e" size={18} strokeWidth={2.25} />
            <TextInput
              placeholder="Search habits or science keywords"
              placeholderTextColor="#a8a29e"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity accessibilityLabel="Clear search" onPress={() => setSearchQuery('')}>
                <X color="#a8a29e" size={18} strokeWidth={2.25} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Controls row */}
          <View style={styles.controlRow}>
            <View style={styles.sortButtonWrapper}>
              <Pressable
                accessibilityLabel="Open sort options"
                accessibilityRole="button"
                style={[styles.controlButton, showSortOptions && styles.controlButtonActive]}
                onPress={handleOpenSortOptions}
              >
                <SlidersHorizontal color={showSortOptions ? '#fff' : '#1c1917'} size={16} />
                <Text style={[styles.controlButtonText, showSortOptions && { color: '#fff' }]}>
                  {SORT_LABELS[sortOption]}
                </Text>
                <ChevronDown
                  color={showSortOptions ? '#fff' : '#1c1917'}
                  size={14}
                  style={{ transform: [{ rotate: showSortOptions ? '180deg' : '0deg' }] }}
                />
              </Pressable>
              {showSortOptions && (
                <Animated.View entering={FadeIn.duration(150)} style={styles.sortDropdown}>
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = sortOption === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        accessible
                        accessibilityLabel={`Sort by ${option.label}`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        style={[styles.sortDropdownOption, isSelected && styles.sortDropdownOptionSelected]}
                        onPress={() => handleSelectSortOption(option.value)}
                      >
                        <Text
                          style={[
                            styles.sortDropdownOptionText,
                            isSelected && styles.sortDropdownOptionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {isSelected && <Check color="#10B981" size={16} strokeWidth={2.5} />}
                      </Pressable>
                    );
                  })}
                </Animated.View>
              )}
            </View>
            <Pressable
              accessibilityLabel="Toggle research-only filter"
              accessibilityRole="button"
              style={[styles.controlButton, researchOnly && styles.controlButtonActive]}
              onPress={() => setResearchOnly((prev) => !prev)}
            >
              <Filter color={researchOnly ? '#fff' : '#1c1917'} size={16} />
              <Text style={[styles.controlButtonText, { color: researchOnly ? '#fff' : '#1c1917' }]}>
                Research
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Templates list */}
        <View style={styles.listWrapper}>
          <FlatList
            ref={flatListRef}
            contentContainerStyle={styles.listContent}
            data={filteredTemplates}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              filteredTemplates.length === 0 ? (
                <View style={styles.emptyStateWrapper}>
                  <EmptyState
                    hideCTA
                    description="Try adjusting filters or search keywords."
                    headline="No habits match your filters"
                    icon="🔍"
                  />
                  {hasActiveFilters && (
                    <Button size="medium" style={{ marginTop: 16 }} variant="secondary" onPress={handleResetFilters}>
                      Reset filters
                    </Button>
                  )}
                </View>
              ) : null
            }
            renderItem={renderTemplateCard}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={handleListContentSizeChange}
            onLayout={handleListLayout}
            onScroll={handleListScroll}
          />
          {showTopScrollShadow && (
            <LinearGradient
              colors={['rgba(248,247,245,0.96)', 'rgba(248,247,245,0)']}
              pointerEvents="none"
              style={styles.scrollFadeTop}
            />
          )}
          {showBottomScrollShadow && (
            <LinearGradient
              colors={['rgba(248,247,245,0)', 'rgba(248,247,245,0.95)']}
              pointerEvents="none"
              style={styles.scrollFadeBottom}
            >
              <View style={[styles.scrollHintChip, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
                <ChevronDown color="#374151" size={16} strokeWidth={2.25} />
                <Text style={[styles.scrollHintText, { color: '#374151' }]}>Scroll for more</Text>
              </View>
            </LinearGradient>
          )}
        </View>

        <FullsizeTemplatePreview
          isImporting={importingTemplateId === previewTemplate?._id}
          isImported={previewTemplate ? importedTemplateIds.has(previewTemplate._id) : false}
          onClose={() => setShowFullsizePreview(false)}
          onCustomize={handleCustomizeFromPreview}
          onImport={handleDirectImport}
          template={previewTemplate}
          visible={showFullsizePreview}
        />

        <TemplatePreviewModal
          importingTemplateId={importingTemplateId}
          onClose={() => setShowCustomizeModal(false)}
          onImport={handleTemplateImport}
          template={previewTemplate}
          visible={showCustomizeModal}
        />

        <Toast
          duration={3000}
          message={toastMessage}
          variant={toastMessage.includes('Failed') ? 'error' : 'success'}
          visible={showToast}
          onDismiss={() => setShowToast(false)}
        />

        {showSortOptions && <Pressable style={styles.dropdownBackdrop} onPress={handleCloseSortOptions} />}
      </View>
    );
  }

  // Browse mode (main view with collapsible categories)
  return (
    <View style={styles.container}>
      {/* Header - slides down on entrance */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={[theme.custom.typography.heading1, { color: '#101727', fontWeight: '700' }]}>
          Import Habits
        </Text>
        <Text style={[theme.custom.typography.bodySmall, { color: '#6b7280', marginTop: 4 }]}>
          Science-backed habits to get you started
        </Text>
      </Animated.View>

      {/* Search bar - fades up with delay */}
      <Animated.View style={[styles.searchSection, searchAnimatedStyle]}>
        <View style={styles.searchBar}>
          <Search color="#a8a29e" size={18} strokeWidth={2.25} />
          <TextInput
            placeholder="Search habits..."
            placeholderTextColor="#a8a29e"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity accessibilityLabel="Clear search" onPress={() => setSearchQuery('')}>
              <X color="#a8a29e" size={18} strokeWidth={2.25} />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>

      {/* Tab bar - fades up with delay */}
      <Animated.View style={[styles.tabBar, tabBarAnimatedStyle]}>
        <Pressable
          accessible
          accessibilityLabel={`Categories tab, ${categories?.filter((c) => c.id !== 'all').length || 0} categories`}
          accessibilityRole="tab"
          accessibilityState={{ selected: browseTab === 'categories' }}
          style={[styles.tab, browseTab === 'categories' && styles.tabActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setBrowseTab('categories');
          }}
        >
          <Text style={[styles.tabText, browseTab === 'categories' && styles.tabTextActive]}>
            Categories
          </Text>
          <Text style={[styles.tabCount, browseTab === 'categories' && styles.tabCountActive]}>
            {categories?.filter((c) => c.id !== 'all').length || 0}
          </Text>
        </Pressable>
        <Pressable
          accessible
          accessibilityLabel={`View All tab, ${allTemplates?.length || 0} templates`}
          accessibilityRole="tab"
          accessibilityState={{ selected: browseTab === 'all' }}
          style={[styles.tab, browseTab === 'all' && styles.tabActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setBrowseTab('all');
          }}
        >
          <Text style={[styles.tabText, browseTab === 'all' && styles.tabTextActive]}>
            View All
          </Text>
          <Text style={[styles.tabCount, browseTab === 'all' && styles.tabCountActive]}>
            {allTemplates?.length || 0}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Scrollable content - Categories tab - fades up with delay */}
      {browseTab === 'categories' && (
        <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
          <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.browseContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}
        >
          <View style={styles.categorySections}>
            {categories
              ?.filter((cat) => cat.id !== 'all')
              .map((category) => {
                const templates = templatesByCategory.get(category.id) || [];
                if (templates.length === 0) return null;

                return (
                  <CollapsibleCategorySection
                    key={category.id}
                    categoryId={category.id}
                    label={category.label}
                    icon={category.icon}
                    templates={templates}
                    isExpanded={expandedCategories.has(category.id)}
                    onToggle={() => handleToggleCategory(category.id)}
                    onTemplatePress={handleTemplatePreview}
                    onImport={(template) => handleTemplateImport(template._id)}
                    importingTemplateId={importingTemplateId}
                  />
                );
              })}
          </View>
        </ScrollView>
        </Animated.View>
      )}

      {/* View All tab - FlatList for performance - fades up with delay */}
      {browseTab === 'all' && (
        <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
          {/* Filter controls - only shown in All tab */}
          <View style={styles.filterControlsRow}>
            <View style={styles.sortButtonWrapper}>
              <Pressable
                accessibilityLabel="Open sort options"
                accessibilityRole="button"
                style={[styles.controlButton, showSortOptions && styles.controlButtonActive]}
                onPress={handleOpenSortOptions}
              >
                <SlidersHorizontal color={showSortOptions ? '#fff' : '#1c1917'} size={16} />
                <Text style={[styles.controlButtonText, showSortOptions && { color: '#fff' }]}>
                  {SORT_LABELS[sortOption]}
                </Text>
                <ChevronDown
                  color={showSortOptions ? '#fff' : '#1c1917'}
                  size={14}
                  style={{ transform: [{ rotate: showSortOptions ? '180deg' : '0deg' }] }}
                />
              </Pressable>
              {showSortOptions && (
                <Animated.View entering={FadeIn.duration(150)} style={styles.sortDropdown}>
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = sortOption === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        accessible
                        accessibilityLabel={`Sort by ${option.label}`}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        style={[styles.sortDropdownOption, isSelected && styles.sortDropdownOptionSelected]}
                        onPress={() => handleSelectSortOption(option.value)}
                      >
                        <Text
                          style={[
                            styles.sortDropdownOptionText,
                            isSelected && styles.sortDropdownOptionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {isSelected && <Check color="#10B981" size={16} strokeWidth={2.5} />}
                      </Pressable>
                    );
                  })}
                </Animated.View>
              )}
            </View>
            <Pressable
              accessibilityLabel={`Filter by science-backed habits, ${researchOnly ? 'active' : 'inactive'}`}
              accessibilityRole="button"
              accessibilityState={{ selected: researchOnly }}
              style={[styles.controlButton, researchOnly && styles.controlButtonActive]}
              onPress={() => setResearchOnly((prev) => !prev)}
            >
              <Filter color={researchOnly ? '#fff' : '#1c1917'} size={16} />
              <Text style={[styles.controlButtonText, { color: researchOnly ? '#fff' : '#1c1917' }]}>
                Science-Backed
              </Text>
            </Pressable>
          </View>
          <FlatList
          data={filteredTemplates}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.allTemplatesList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          renderItem={({ item: template }) => (
            <TemplateCard
              key={template._id}
              animationIndex={0}
              category={template.category}
              description={template.description}
              enableScrollReveal={true}
              frequency={template.frequency}
              icon={template.icon}
              iconColor={template.iconColor}
              id={template._id}
              isImporting={importingTemplateId === template._id}
              name={template.name}
              onImport={() => handleTemplateImport(template._id)}
              onPreview={() => handleTemplatePreview(template)}
              popularityScore={template.popularityScore}
              scientificLink={template.scientificLink}
              scientificReference={template.scientificReference}
              youtubeLink={template.youtubeLink}
            />
          )}
        />
        </Animated.View>
      )}

      {/* Dropdown backdrop for sort options in browse mode */}
      {showSortOptions && browseTab === 'all' && <Pressable style={styles.dropdownBackdrop} onPress={handleCloseSortOptions} />}

      <FullsizeTemplatePreview
        isImporting={importingTemplateId === previewTemplate?._id}
        isImported={previewTemplate ? importedTemplateIds.has(previewTemplate._id) : false}
        onClose={() => setShowFullsizePreview(false)}
        onCustomize={handleCustomizeFromPreview}
        onImport={handleDirectImport}
        template={previewTemplate}
        visible={showFullsizePreview}
      />

      <TemplatePreviewModal
        importingTemplateId={importingTemplateId}
        onClose={() => setShowCustomizeModal(false)}
        onImport={handleTemplateImport}
        template={previewTemplate}
        visible={showCustomizeModal}
      />

      <Toast
        duration={3000}
        message={toastMessage}
        variant={toastMessage.includes('Failed') ? 'error' : 'success'}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
}
