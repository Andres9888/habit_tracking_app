/**
 * Templates Screen
 * Based on UX Specification Section 2.1 (Templates Tab) & Section 9.2
 *
 * Purpose: Browse and import science-backed habit templates
 * Features: Category filtering, template cards, import flow, search (future)
 * Categories: Morning Routine, Health & Fitness, Productivity, Mindfulness
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
import Animated, { FadeIn } from 'react-native-reanimated';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';

import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';

import Button from '../components/Button/Button';
import EmptyState from '../components/EmptyState';
import TemplateCard from '../components/TemplateCard';
import Toast from '../components/Toast';
import { useAppTheme } from '../theme';

import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLORS,
  SORT_LABELS,
  SORT_OPTIONS,
  type Category,
  type CategoryFilter,
  type SortOption,
} from './templates/constants';
import { styles } from './templates/templatesScreenStyles';

export default function TemplatesScreen() {
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [researchOnly, setResearchOnly] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);
  const [importingTemplateId, setImportingTemplateId] =
    useState<Id<'templates'> | null>(null);
  const [showCategoryScrollHint, setShowCategoryScrollHint] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const listScrollOffset = useRef(0);
  const listScrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });
  const categoryScrollMetrics = useRef({ contentWidth: 0, layoutWidth: 0 });

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

  const handleSeedTemplates = useCallback(async () => {
    setIsSeeding(true);
    try {
      console.log('Starting to seed templates...');

      // Seed initial templates
      const result1 = await seedTemplates({});
      console.log('Seed 1 result:', result1);

      // Seed additional templates
      const result2 = await seedAdditionalTemplates({});
      console.log('Seed 2 result:', result2);

      // Seed new science templates
      const result3 = await seedNewScienceTemplates({});
      console.log('Seed 3 result:', result3);

      // Check which new templates should exist
      const expectedNewTemplates = [
        'Daily Flossing',
        'Regular Dental Checkups',
        'Calcium Intake Tracking',
        'Bone-Strengthening Exercise',
        'Hearing Protection',
        'Safe Listening Volume',
        'Vitamin D Supplementation',
        'Preventive Health Checkups',
        'Daily Sun Protection',
        'Joint Mobility Routine',
        'Weekly Goal Review',
        'Energy Level Tracking',
        'Box Breathing',
        'Tech-Free Break',
        'Pre-Sleep Review',
        'Weekly Teaching',
        'Deep Questions',
        'Receive Feedback Gracefully',
      ];

      console.log('Expected new templates:', expectedNewTemplates);

      // Wait a moment for queries to refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check templates after refresh (will be checked on next render via allTemplates)
      const currentTemplateNames = allTemplates?.map((t) => t.name) || [];
      console.log('Current template names:', currentTemplateNames);

      const newTemplatesFound = expectedNewTemplates.filter((name) =>
        currentTemplateNames.includes(name)
      );

      setToastMessage(
        `Seeded templates! Found ${newTemplatesFound.length}/${expectedNewTemplates.length} new templates. Total: ${allTemplates?.length || 0}`
      );
      setShowToast(true);
    } catch (error) {
      console.error('Error seeding templates:', error);
      setToastMessage(
        `Error: ${error instanceof Error ? error.message : 'Failed to seed templates'}`
      );
      setShowToast(true);
    } finally {
      setIsSeeding(false);
    }
  }, [
    allTemplates,
    seedAdditionalTemplates,
    seedNewScienceTemplates,
    seedTemplates,
  ]);

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
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const categoryCounts = useMemo(() => {
    if (!allTemplates) return {} as Record<Category, number>;

    return allTemplates.reduce((acc, template) => {
      acc.all = (acc.all || 0) + 1;
      acc[template.category as Category] =
        (acc[template.category as Category] || 0) + 1;
      return acc;
    }, {} as Record<Category, number>);
  }, [allTemplates]);

  // Filter templates by category, query, and toggles
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

    const sorter: Record<
      SortOption,
      (a: Doc<'templates'>, b: Doc<'templates'>) => number
    > = {
      az: (a, b) => a.name.localeCompare(b.name),
      newest: (a, b) => b.createdAt - a.createdAt,
      popular: (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0),
    };

    return data.sort(sorter[sortOption]);
  }, [allTemplates, selectedCategory, researchOnly, searchQuery, sortOption]);

  const hasActiveFilters =
    selectedCategory !== 'all' || Boolean(searchQuery.trim()) || researchOnly;

  // Handle category filter tap
  const handleCategoryPress = useCallback(
    (category: Category) => {
      setSelectedCategory(category);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    []
  );

  // Handle template import
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
        const result = await importTemplate({
          customizations,
          templateId,
        });

        if (result.success) {
          setShowToast(true);
          setToastMessage('Imported habit successfully');
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
      listScrollMetrics.current = {
        ...listScrollMetrics.current,
        contentHeight: height,
      };
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

  useEffect(() => {
    listScrollOffset.current = 0;
    listScrollMetrics.current = {
      ...listScrollMetrics.current,
      contentHeight: 0,
    };
    setShowTopScrollShadow(false);
    setShowBottomScrollShadow(false);
  }, [selectedCategory, filteredTemplates.length]);

  // Handle category scroll to show/hide "more" indicator
  const handleCategoryScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      categoryScrollMetrics.current = {
        contentWidth: contentSize.width,
        layoutWidth: layoutMeasurement.width,
      };
      // Hide hint if scrolled more than 30px or near the end
      const isNearEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 30;
      const hasScrolled = contentOffset.x > 30;
      setShowCategoryScrollHint(!hasScrolled && !isNearEnd && contentSize.width > layoutMeasurement.width);
    },
    []
  );

  const handleCategoryContentSizeChange = useCallback(
    (width: number, _height: number) => {
      categoryScrollMetrics.current.contentWidth = width;
      // Show hint if content is wider than layout
      const hasMoreContent = width > categoryScrollMetrics.current.layoutWidth;
      setShowCategoryScrollHint(hasMoreContent);
    },
    []
  );

  const handleCategoryLayout = useCallback(
    (event: LayoutChangeEvent) => {
      categoryScrollMetrics.current.layoutWidth = event.nativeEvent.layout.width;
    },
    []
  );

  // Render category filter chip with color-coded styling
  const renderCategoryChip = useCallback(
    (category: CategoryFilter) => {
      const isSelected = selectedCategory === category.id;
      const count = categoryCounts[category.id] || 0;
      const colors = CATEGORY_COLORS[category.id] || DEFAULT_CATEGORY_COLORS;

      return (
        <Pressable
          key={category.id}
          accessible
          accessibilityLabel={`Filter by ${category.label}`}
          accessibilityRole='button'
          accessibilityState={{ selected: isSelected }}
          style={[
            styles.categoryChip,
            {
              backgroundColor: isSelected ? colors.bgSelected : colors.bg,
              borderColor: isSelected ? colors.bgSelected : colors.border,
              borderRadius: 20,
              borderWidth: 1.5,
            },
          ]}
          onPress={() => handleCategoryPress(category.id)}
        >
          {/* Color dot indicator for quick visual scan when not selected */}
          {!isSelected && (
            <View
              style={[
                styles.categoryColorDot,
                { backgroundColor: colors.bgSelected },
              ]}
            />
          )}
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              {
                color: isSelected ? '#ffffff' : colors.text,
                fontWeight: '600',
              },
            ]}
          >
            {category.label}
          </Text>
          <View
            style={[
              styles.categoryCount,
              {
                backgroundColor: isSelected
                  ? 'rgba(255,255,255,0.25)'
                  : `${colors.bgSelected}20`,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryCountText,
                { color: isSelected ? '#fff' : colors.text },
              ]}
            >
              {count}
            </Text>
          </View>
        </Pressable>
      );
    },
    [selectedCategory, theme, handleCategoryPress, categoryCounts]
  );

  // Render template card
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
        popularityScore={item.popularityScore}
        scientificLink={item.scientificLink}
        scientificReference={item.scientificReference}
        youtubeLink={item.youtubeLink}
      />
    ),
    [handleTemplateImport, importingTemplateId]
  );

  // Loading state with skeletons
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={[
              theme.custom.typography.heading1,
              { color: '#101727', fontWeight: '700' },
            ]}
          >
            Import Habits
          </Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: '#6b7280', marginTop: 4 },
            ]}
          >
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
          description='Tap the button below to load science-backed habits.'
          headline='No Habits Available'
          icon='📚'
        />
        <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <Button
            disabled={isSeeding}
            onPress={handleSeedTemplates}
            size='large'
            variant='primary'
          >
            {isSeeding ? 'Loading Habits...' : 'Load Habits'}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            theme.custom.typography.heading1,
            { color: '#101727', fontWeight: '700' },
          ]}
        >
          Import Habits
        </Text>
        <Text
          style={[
            theme.custom.typography.bodySmall,
            { color: '#6b7280', marginTop: 4 },
          ]}
        >
          Science-backed habits to get you started
        </Text>
      </View>

      {/* Search + Controls */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search color='#94a3b8' size={18} strokeWidth={2.25} />
          <TextInput
            placeholder='Search habits or science keywords'
            placeholderTextColor='#94a3b8'
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              accessibilityLabel='Clear search'
              onPress={() => setSearchQuery('')}
            >
              <X color='#94a3b8' size={18} strokeWidth={2.25} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.controlRow}>
          <View style={styles.sortButtonWrapper}>
            <Pressable
              accessibilityLabel='Open sort options'
              accessibilityRole='button'
              style={[styles.controlButton, showSortOptions && styles.controlButtonActive]}
              onPress={handleOpenSortOptions}
            >
              <SlidersHorizontal color={showSortOptions ? '#fff' : '#0f172a'} size={16} />
              <Text style={[styles.controlButtonText, showSortOptions && { color: '#fff' }]}>
                Sort: {SORT_LABELS[sortOption]}
              </Text>
              <ChevronDown
                color={showSortOptions ? '#fff' : '#0f172a'}
                size={14}
                style={{ transform: [{ rotate: showSortOptions ? '180deg' : '0deg' }] }}
              />
            </Pressable>
            {/* Inline Dropdown */}
            {showSortOptions && (
              <Animated.View
                entering={FadeIn.duration(150)}
                style={styles.sortDropdown}
              >
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortOption === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessible
                      accessibilityLabel={`Sort by ${option.label}`}
                      accessibilityRole='button'
                      accessibilityState={{ selected: isSelected }}
                      style={[
                        styles.sortDropdownOption,
                        isSelected && styles.sortDropdownOptionSelected,
                      ]}
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
                      {isSelected && (
                        <Check color='#10B981' size={16} strokeWidth={2.5} />
                      )}
                    </Pressable>
                  );
                })}
              </Animated.View>
            )}
          </View>
          <Pressable
            accessibilityLabel='Toggle research-only filter'
            accessibilityRole='button'
            style={[styles.controlButton, researchOnly && styles.controlButtonActive]}
            onPress={() => setResearchOnly((prev) => !prev)}
          >
            <Filter color={researchOnly ? '#fff' : '#0f172a'} size={16} />
            <Text
              style={[
                styles.controlButtonText,
                { color: researchOnly ? '#fff' : '#0f172a' },
              ]}
            >
              Research only
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Category Filters */}
      {categories && categories.length > 0 && (
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.categoriesContainer}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            onContentSizeChange={handleCategoryContentSizeChange}
            onLayout={handleCategoryLayout}
            onScroll={handleCategoryScroll}
          >
            {categories.map((category) => renderCategoryChip(category))}
          </ScrollView>
          {/* Subtle animated scroll hint */}
          {showCategoryScrollHint && (
            <View pointerEvents='none' style={styles.categoryScrollHintWrapper}>
              <LinearGradient
                colors={['rgba(248,247,245,0)', 'rgba(248,247,245,0.95)']}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={styles.categoryScrollGradient}
              />
              <Animated.View
                entering={FadeIn.delay(300).duration(400)}
                style={styles.categoryScrollHintChevrons}
              >
                <ChevronRight color='#9CA3AF' size={16} strokeWidth={2} style={{ marginRight: -10 }} />
                <ChevronRight color='#D1D5DB' size={16} strokeWidth={2} />
              </Animated.View>
            </View>
          )}
        </View>
      )}

      {/* Templates List */}
      <View style={styles.listWrapper}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredTemplates}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            filteredTemplates.length === 0 ? (
              <View style={styles.emptyStateWrapper}>
                <EmptyState
                  hideCTA
                  description='Try adjusting filters or search keywords to uncover more science-backed routines.'
                  headline='No habits match your filters'
                  icon='🔍'
                />
                {hasActiveFilters && (
                  <Button
                    size='medium'
                    style={{ marginTop: 16 }}
                    variant='secondary'
                    onPress={handleResetFilters}
                  >
                    Reset filters
                  </Button>
                )}
              </View>
            ) : null
          }
          ref={flatListRef}
          renderItem={renderTemplateCard}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={handleListContentSizeChange}
          onLayout={handleListLayout}
          onScroll={handleListScroll}
        />
        {showTopScrollShadow && (
          <LinearGradient
            colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0)']}
            pointerEvents='none'
            style={styles.scrollFadeTop}
          />
        )}
        {showBottomScrollShadow && (
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']}
            pointerEvents='none'
            style={styles.scrollFadeBottom}
          >
            <View
              style={[
                styles.scrollHintChip,
                { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
              ]}
            >
              <ChevronDown color='#374151' size={16} strokeWidth={2.25} />
              <Text
                style={[
                  styles.scrollHintText,
                  { color: '#374151' },
                ]}
              >
                Scroll for more habits
              </Text>
            </View>
          </LinearGradient>
        )}
      </View>

      {/* Success Toast */}
      <Toast
        duration={3000}
        message={toastMessage}
        variant={toastMessage.includes('Failed') ? 'error' : 'success'}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />

      {/* Dropdown backdrop - rendered at root level to overlay entire screen */}
      {showSortOptions && (
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={handleCloseSortOptions}
        />
      )}
    </View>
  );
}
