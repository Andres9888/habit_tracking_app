/**
 * Templates Screen
 * Based on UX Specification Section 2.1 (Templates Tab) & Section 9.2
 *
 * Purpose: Browse and import science-backed habit templates
 * Features: Category filtering, template cards, import flow, search (future)
 * Categories: Morning Routine, Health & Fitness, Productivity, Mindfulness
 */

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Linking,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  SlideInRight,
} from 'react-native-reanimated';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { useAppTheme } from '../theme';
import TemplateCard from '../components/TemplateCard';
import Modal from '../components/Modal';
import Button from '../components/Button/Button';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronDown,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react-native';

const REMINDER_OPTIONS = ['7:30 AM', '12:00 PM', '9:00 PM'];
const ICON_COLOR_OPTIONS = ['#0EA5E9', '#10B981', '#F97316', '#A855F7', '#F43F5E'];

type Category =
  | 'all'
  | 'morning_routine'
  | 'health_fitness'
  | 'productivity'
  | 'mindfulness'
  | 'andrew_huberman'
  | 'learning'
  | 'social'
  | 'financial'
  | 'creativity'
  | 'sleep'
  | 'longevity'
  | 'mental_health'
  | 'recovery'
  | 'breathing';

interface CategoryFilter {
  id: Category;
  icon: string;
  label: string;
}

// Category color mapping for visual differentiation
const CATEGORY_COLORS: Record<string, { bg: string; bgSelected: string; border: string; text: string }> = {
  all: { bg: '#EEF2FF', bgSelected: '#6366F1', border: '#C7D2FE', text: '#4338CA' },
  andrew_huberman: { bg: '#ECFDF5', bgSelected: '#059669', border: '#A7F3D0', text: '#047857' },
  breathing: { bg: '#E0F2FE', bgSelected: '#0284C7', border: '#BAE6FD', text: '#0369A1' },
  creativity: { bg: '#FDF2F8', bgSelected: '#EC4899', border: '#FBCFE8', text: '#BE185D' },
  financial: { bg: '#ECFDF5', bgSelected: '#10B981', border: '#A7F3D0', text: '#059669' },
  health_fitness: { bg: '#D1FAE5', bgSelected: '#10B981', border: '#6EE7B7', text: '#047857' },
  learning: { bg: '#F3E8FF', bgSelected: '#8B5CF6', border: '#DDD6FE', text: '#7C3AED' },
  longevity: { bg: '#FEF3C7', bgSelected: '#D97706', border: '#FDE68A', text: '#B45309' },
  mental_health: { bg: '#E0E7FF', bgSelected: '#6366F1', border: '#C7D2FE', text: '#4F46E5' },
  mindfulness: { bg: '#F5F3FF', bgSelected: '#8B5CF6', border: '#E9D5FF', text: '#7C3AED' },
  morning_routine: { bg: '#FEF3C7', bgSelected: '#F59E0B', border: '#FDE68A', text: '#D97706' },
  productivity: { bg: '#DBEAFE', bgSelected: '#3B82F6', border: '#BFDBFE', text: '#2563EB' },
  recovery: { bg: '#FCE7F3', bgSelected: '#EC4899', border: '#FBCFE8', text: '#DB2777' },
  sleep: { bg: '#E0E7FF', bgSelected: '#1E3A8A', border: '#C7D2FE', text: '#1E40AF' },
  social: { bg: '#FFE4E6', bgSelected: '#F43F5E', border: '#FECDD3', text: '#E11D48' },
};

const DEFAULT_CATEGORY_COLORS = { bg: '#F3F4F6', bgSelected: '#374151', border: '#E5E7EB', text: '#374151' };

export default function TemplatesScreen() {
  const theme = useAppTheme();
  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'popular' | 'newest' | 'az'>(
    'popular'
  );
  const [researchOnly, setResearchOnly] = useState(false);
  const [previewTemplate, setPreviewTemplate] =
    useState<Doc<'templates'> | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);
  const [importingTemplateId, setImportingTemplateId] =
    useState<Id<'templates'> | null>(null);
  const [customHabitName, setCustomHabitName] = useState('');
  const [selectedReminderTime, setSelectedReminderTime] = useState('');
  const [selectedIconColor, setSelectedIconColor] = useState('');
  const [showPreviewScrollHint, setShowPreviewScrollHint] = useState(false);
  const [showCategoryScrollHint, setShowCategoryScrollHint] = useState(true);
  const listScrollOffset = useRef(0);
  const listScrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });
  const previewScrollOffset = useRef(0);
  const categoryScrollMetrics = useRef({ contentWidth: 0, layoutWidth: 0 });
  const previewScrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });

  // Animation values for preview modal sections
  const headerProgress = useSharedValue(0);
  const descProgress = useSharedValue(0);
  const scienceProgress = useSharedValue(0);
  const customizeProgress = useSharedValue(0);
  const actionsProgress = useSharedValue(0);

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

  const handleSortToggle = useCallback(() => {
    setSortOption((current) => {
      if (current === 'popular') return 'newest';
      if (current === 'newest') return 'az';
      return 'popular';
    });
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

    const sorter: Record<typeof sortOption, (a: Doc<'templates'>, b: Doc<'templates'>) => number> = {
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

  // Handle template preview
  const handleTemplatePreview = useCallback((template: Doc<'templates'>) => {
    setPreviewTemplate(template);
    setCustomHabitName(template.name);
    setSelectedReminderTime('');
    setSelectedIconColor(template.iconColor);
    setShowPreviewModal(true);
  }, []);

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
          setToastMessage('Template imported successfully! 🎉');
          setShowPreviewModal(false);
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
    (event: any) => {
      const { contentOffset, layoutMeasurement, contentSize } =
        event.nativeEvent;
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
    (event: any) => {
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


  const previewResearchDomain = useMemo(() => {
    if (!previewTemplate?.scientificLink) return null;
    try {
      const url = new URL(previewTemplate.scientificLink);
      return url.hostname.replace('www.', '');
    } catch (error) {
      return previewTemplate.scientificLink.replace(/^https?:\/\//, '').split('/')[0];
    }
  }, [previewTemplate]);

  const handlePreviewResearchLink = useCallback(async () => {
    if (!previewTemplate?.scientificLink) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(previewTemplate.scientificLink);
      if (supported) {
        await Linking.openURL(previewTemplate.scientificLink);
      }
    } catch (error) {
      console.error('Failed to open research link', error);
    }
  }, [previewTemplate]);

  const handlePreviewYoutubeLink = useCallback(async () => {
    if (!previewTemplate?.youtubeLink) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(previewTemplate.youtubeLink);
      if (supported) {
        await Linking.openURL(previewTemplate.youtubeLink);
      }
    } catch (error) {
      console.error('Failed to open YouTube link', error);
    }
  }, [previewTemplate]);

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
    (event: { nativeEvent: { layout: { width: number } } }) => {
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
        onPreview={() => handleTemplatePreview(item)}
        popularityScore={item.popularityScore}
        scientificLink={item.scientificLink}
        scientificReference={item.scientificReference}
        youtubeLink={item.youtubeLink}
      />
    ),
    [handleTemplateImport, handleTemplatePreview, importingTemplateId]
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
            Templates
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

  // Handle seeding templates
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
        'Receive Feedback Gracefully'
      ];

      console.log('Expected new templates:', expectedNewTemplates);

      // Wait a moment for queries to refresh
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check templates after refresh (will be checked on next render via allTemplates)
      const currentTemplateNames = allTemplates?.map(t => t.name) || [];
      console.log('Current template names:', currentTemplateNames);

      const newTemplatesFound = expectedNewTemplates.filter(name =>
        currentTemplateNames.includes(name)
      );

      setToastMessage(
        `Seeded templates! Found ${newTemplatesFound.length}/${expectedNewTemplates.length} new templates. Total: ${allTemplates?.length || 0}`
      );
      setShowToast(true);
    } catch (error) {
      console.error('Error seeding templates:', error);
      setToastMessage(`Error: ${error instanceof Error ? error.message : 'Failed to seed templates'}`);
      setShowToast(true);
    } finally {
      setIsSeeding(false);
    }
  }, [seedTemplates, seedAdditionalTemplates, seedNewScienceTemplates, allTemplates]);

  // Empty state (no templates)
  if (!allTemplates || allTemplates.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          hideCTA
          description='Tap the button below to load science-backed habit templates.'
          headline='No Templates Available'
          icon='📚'
        />
        <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
          <Button
            disabled={isSeeding}
            onPress={handleSeedTemplates}
            size='large'
            variant='primary'
          >
            {isSeeding ? 'Loading Templates...' : 'Load Templates'}
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
          Templates
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
          <Pressable
            accessibilityLabel='Toggle sort order'
            accessibilityRole='button'
            style={styles.controlButton}
            onPress={handleSortToggle}
          >
            <SlidersHorizontal color='#0f172a' size={16} />
            <Text style={styles.controlButtonText}>Sort: {sortOption === 'popular' ? 'Popular' : sortOption === 'newest' ? 'Newest' : 'A-Z'}</Text>
          </Pressable>
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
                  headline='No templates match your filters'
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
                Scroll for more templates
              </Text>
            </View>
          </LinearGradient>
        )}
      </View>

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          variant='bottomSheet'
          visible={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
        >
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.previewScrollContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
              <View style={styles.previewModal}>
                {/* Template Header */}
                <View style={styles.previewHeader}>
                  <View
                    style={[
                      styles.previewIconContainer,
                      {
                        backgroundColor: previewTemplate.iconColor + '20',
                        borderRadius: theme.custom.borderRadius.medium,
                      },
                    ]}
                  >
                    <Text style={styles.previewIcon}>{previewTemplate.icon}</Text>
                  </View>
                  <Text
                    style={[
                      theme.custom.typography.heading2,
                      { color: '#101727', fontWeight: '700', marginTop: 16 },
                    ]}
                  >
                    {previewTemplate.name}
                  </Text>
                  <Text style={styles.previewCategory}>
                    {previewTemplate.category.replace('_', ' ')} ·{' '}
                    {previewTemplate.frequency === 'daily' ? 'Daily' : 'Flexible'}
                  </Text>
                </View>

                {/* Template Description */}
                <Text
                  style={[
                    theme.custom.typography.body,
                    { color: '#374151', marginTop: 20 },
                  ]}
                >
                  {previewTemplate.description}
                </Text>

                {/* Divider */}
                <View style={styles.sectionDivider} />

                {/* Scientific Reference */}
                <View>
                  <View
                    style={[
                      styles.previewScienceBox,
                      {
                        backgroundColor: '#f0fdf4',
                        borderRadius: theme.custom.borderRadius.small,
                      },
                    ]}
                  >
                    <Text style={styles.scienceIcon}>🔬</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          theme.custom.typography.caption,
                          { color: '#166534', fontWeight: '700', letterSpacing: 0.3 },
                        ]}
                      >
                        Scientific Backing
                      </Text>
                      <Text
                        style={[
                          theme.custom.typography.bodySmall,
                          { color: '#374151', lineHeight: 20, marginTop: 6 },
                        ]}
                      >
                        {previewTemplate.scientificReference}
                      </Text>
                      {previewTemplate.scientificLink && (
                        <Pressable
                          accessibilityLabel='Open research link'
                          style={styles.researchLink}
                          onPress={handlePreviewResearchLink}
                        >
                          <ExternalLink
                            color='#166534'
                            size={14}
                          />
                          <Text
                            style={[
                              theme.custom.typography.caption,
                              {
                                color: '#166534',
                                fontWeight: '600',
                                marginLeft: 6,
                                textDecorationLine: 'underline',
                              },
                            ]}
                          >
                            {previewResearchDomain || 'View research'}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>

                  {/* YouTube Video Link */}
                  {previewTemplate.youtubeLink && (
                    <Pressable
                      accessibilityLabel='Watch video on YouTube'
                      style={styles.youtubeLink}
                      onPress={handlePreviewYoutubeLink}
                    >
                      <View style={styles.youtubeIconWrapper}>
                        <Text style={styles.youtubeIcon}>▶️</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            theme.custom.typography.caption,
                            { color: '#111827', fontWeight: '700' },
                          ]}
                        >
                          Watch Video
                        </Text>
                        <Text
                          style={[
                            theme.custom.typography.bodySmall,
                            { color: '#DC2626', marginTop: 2, textDecorationLine: 'underline' },
                          ]}
                        >
                          Learn more on YouTube
                        </Text>
                      </View>
                      <ExternalLink
                        color='#DC2626'
                        size={16}
                      />
                    </Pressable>
                  )}
                </View>

                {/* Divider */}
                <View style={styles.sectionDivider} />

                {/* Customization Block */}
                <View style={styles.customizeSection}>
                  <View style={styles.customizeTitleRow}>
                    <Text style={styles.customizeTitle}>Make it yours</Text>
                    <Text style={styles.customizeSubtitle}>Optional</Text>
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Habit name</Text>
                    <TextInput
                      maxLength={50}
                      placeholder='Name your habit'
                      placeholderTextColor='#94a3b8'
                      style={styles.nameInput}
                      value={customHabitName}
                      onChangeText={setCustomHabitName}
                    />
                    <Text style={styles.charCount}>{customHabitName.length}/50</Text>
                  </View>

                  <Text style={styles.inputLabel}>Reminder</Text>
                  <View style={styles.reminderRow}>
                    {REMINDER_OPTIONS.map((option) => {
                      const isSelected = selectedReminderTime === option;
                      return (
                        <Pressable
                          key={option}
                          accessibilityLabel={`Set reminder for ${option}`}
                          accessibilityRole='button'
                          accessibilityState={{ selected: isSelected }}
                          style={[
                            styles.reminderChip,
                            isSelected && styles.reminderChipActive,
                          ]}
                          onPress={() =>
                            setSelectedReminderTime((current) =>
                              current === option ? '' : option
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.reminderChipText,
                              { color: isSelected ? '#fff' : '#334155' },
                            ]}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.inputLabel}>Accent color</Text>
                  <View style={styles.colorRow}>
                    {ICON_COLOR_OPTIONS.map((color) => {
                      const isSelected = selectedIconColor === color;
                      return (
                        <Pressable
                          key={color}
                          accessibilityLabel={`Pick ${color} accent color`}
                          accessibilityRole='button'
                          accessibilityState={{ selected: isSelected }}
                          style={[
                            styles.colorSwatch,
                            { backgroundColor: color },
                            isSelected && styles.colorSwatchActive,
                          ]}
                          onPress={() => setSelectedIconColor(color)}
                        />
                      );
                    })}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.previewActions}>
                  <Button
                    fullWidth
                    loading={importingTemplateId === previewTemplate._id}
                    size='large'
                    style={{ backgroundColor: previewTemplate.iconColor }}
                    variant='primary'
                    onPress={() =>
                      handleTemplateImport(previewTemplate._id, {
                        iconColor: selectedIconColor || previewTemplate.iconColor,
                        name: customHabitName || previewTemplate.name,
                        reminderTime: selectedReminderTime || undefined,
                      })
                    }
                  >
                    Import Template
                  </Button>
                  <Button
                    fullWidth
                    size='medium'
                    style={{ marginTop: 12 }}
                    variant='ghost'
                    onPress={() => setShowPreviewModal(false)}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </ScrollView>
        </Modal>
      )}

      {/* Success Toast */}
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

const styles = StyleSheet.create({
  categoriesContainer: {
    gap: 8,
    paddingHorizontal: 20,
    paddingRight: 50,
    paddingVertical: 12,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesWrapper: {
    position: 'relative',
  },
  categoryChip: {
    alignItems: 'center',
    elevation: 1,
    flexDirection: 'row',
    gap: 6,
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryColorDot: {
    borderRadius: 999,
    height: 6,
    width: 6,
  },
  categoryCount: {
    borderRadius: 999,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryScrollGradient: {
    height: '100%',
    width: 32,
  },
  categoryScrollHintChevrons: {
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.7,
  },
  categoryScrollHintWrapper: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  controlButton: {
    alignItems: 'center',
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  controlButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  controlButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  emptyStateWrapper: {
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  inputLabel: {
    color: '#475467',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
  },
  inputWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  listContent: {
    paddingBottom: 24,
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  nameInput: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewActions: {
    marginTop: 32,
  },
  previewCategory: {
    color: '#6b7280',
    marginTop: 6,
  },
  previewHeader: {
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 48,
  },
  previewIconContainer: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  previewModal: {
    paddingBottom: 24,
  },
  previewScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  previewScienceBox: {
    alignItems: 'flex-start',
    borderColor: '#bbf7d0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  sectionDivider: {
    backgroundColor: '#e5e7eb',
    height: 1,
    marginVertical: 20,
  },
  researchLink: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  scienceIcon: {
    fontSize: 16,
  },
  youtubeIcon: {
    fontSize: 18,
  },
  youtubeIconWrapper: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  youtubeLink: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    padding: 14,
  },
  reminderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  reminderChip: {
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reminderChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  reminderChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  colorSwatch: {
    borderRadius: 999,
    height: 36,
    width: 36,
  },
  colorSwatchActive: {
    borderColor: '#111827',
    borderWidth: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scrollFadeBottom: {
    left: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    height: 56,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  scrollFadeTop: {
    left: 0,
    position: 'absolute',
    height: 32,
    right: 0,
    top: 0,
  },
  scrollHintChip: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollHintText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  searchSection: {
    paddingHorizontal: 20,
  },
  skeletonBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 14,
    width: 60,
  },
  skeletonBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
  },
  skeletonIcon: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 48,
    width: 48,
  },
  skeletonLine: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 12,
    marginTop: 8,
    width: '60%',
  },
  skeletonLineLarge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 16,
    marginTop: 16,
    width: '80%',
  },
  skeletonSearch: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    height: 44,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  customizeSection: {
    marginTop: 4,
  },
  customizeSubtitle: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  customizeTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  customizeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  charCount: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});
