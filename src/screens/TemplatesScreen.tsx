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
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { useAppTheme } from '../theme';
import TemplateCard from '../components/TemplateCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown } from 'lucide-react-native';

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
  | 'sleep';

interface CategoryFilter {
  id: Category;
  icon: string;
  label: string;
}

export default function TemplatesScreen() {
  const theme = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [previewTemplate, setPreviewTemplate] =
    useState<Doc<'templates'> | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showTopScrollShadow, setShowTopScrollShadow] = useState(false);
  const [showBottomScrollShadow, setShowBottomScrollShadow] = useState(false);
  const listScrollOffset = useRef(0);
  const listScrollMetrics = useRef({ contentHeight: 0, layoutHeight: 0 });

  // Fetch templates and categories
  const allTemplates = useQuery(api.templates.list, {});
  const categories = useQuery(api.categories.list, {});
  const isLoading = allTemplates === undefined || categories === undefined;

  // Import template mutation
  const importTemplate = useMutation(api.templates.importTemplate);

  // Filter templates by selected category
  const filteredTemplates = useMemo(() => {
    if (!allTemplates) return [];
    if (selectedCategory === 'all') return allTemplates;
    return allTemplates.filter((t) => t.category === selectedCategory);
  }, [allTemplates, selectedCategory]);

  // Handle category filter tap
  const handleCategoryPress = useCallback((category: Category) => {
    setSelectedCategory(category);
  }, []);

  // Handle template preview
  const handleTemplatePreview = useCallback((template: Doc<'templates'>) => {
    setPreviewTemplate(template);
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

  // Compute Andrew Huberman banner props
  const hubermanBannerData = useMemo(() => {
    const hubermanTemplates = allTemplates?.filter(
      (t) => t.category === 'andrew_huberman'
    ) || [];
    
    return {
      count: hubermanTemplates.length,
      isSelected: selectedCategory === 'andrew_huberman',
      shouldShow: hubermanTemplates.length > 0,
    };
  }, [allTemplates, selectedCategory]);

  // Render category filter chip
  const renderCategoryChip = useCallback(
    (category: CategoryFilter) => {
      const isSelected = selectedCategory === category.id;

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
              backgroundColor: isSelected ? '#101828' : '#ffffff',
              borderWidth: isSelected ? 0 : 1.5,
              borderColor: isSelected ? 'transparent' : '#e5e7eb',
              borderRadius: 20,
            },
          ]}
          onPress={() => handleCategoryPress(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              {
                color: isSelected ? '#ffffff' : '#101727',
                fontWeight: isSelected ? '600' : '500',
              },
            ]}
          >
            {category.label}
          </Text>
        </Pressable>
      );
    },
    [selectedCategory, theme, handleCategoryPress]
  );

  // Render template card
  const renderTemplateCard = useCallback(
    ({ item }: { item: any }) => (
      <TemplateCard
        category={item.category}
        description={item.description}
        icon={item.icon}
        iconColor={item.iconColor}
        id={item._id}
        name={item.name}
        popularityScore={item.popularityScore}
        scientificReference={item.scientificReference}
        onImport={() => handleTemplateImport(item._id)}
        onPreview={() => handleTemplatePreview(item)}
      />
    ),
    [handleTemplateImport, handleTemplatePreview]
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={theme.custom.colors.primary[500]}
            size='large'
          />
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: '#6b7280', marginTop: 16 },
            ]}
          >
            Loading templates...
          </Text>
        </View>
      </View>
    );
  }

  // Empty state (no templates)
  if (!allTemplates || allTemplates.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          hideCTA
          description='Check back soon for science-backed habit templates.'
          headline='No Templates Available'
          icon='📚'
        />
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

      {/* Featured: Andrew Huberman Habits */}
      {hubermanBannerData.shouldShow && (
        <Pressable
          accessible
          accessibilityLabel="View all Andrew Huberman habits"
          accessibilityRole="button"
          style={[
            styles.hubermanBanner,
            {
              backgroundColor: '#0F172A',
              borderColor: hubermanBannerData.isSelected ? '#14B8A6' : '#1E293B',
              borderWidth: hubermanBannerData.isSelected ? 2 : 1.5,
            },
          ]}
          onPress={() => handleCategoryPress('andrew_huberman')}
        >
          <View style={styles.hubermanBannerContent}>
            <View style={styles.hubermanBannerLeft}>
              <Text style={styles.hubermanIcon}>🧠</Text>
              <View style={styles.hubermanTextContainer}>
                <Text style={styles.hubermanTitle}>
                  Andrew Huberman Protocols
                </Text>
                <Text style={styles.hubermanSubtitle}>
                  {hubermanBannerData.count} neuroscience-backed habits
                </Text>
              </View>
            </View>
            <Text style={styles.hubermanArrow}>→</Text>
          </View>
        </Pressable>
      )}

      {/* Category Filters */}
      {categories && categories.length > 0 && (
        <ScrollView
          horizontal
          contentContainerStyle={styles.categoriesContainer}
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => renderCategoryChip(category))}
        </ScrollView>
      )}

      {/* Templates List */}
      <View style={styles.listWrapper}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredTemplates}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <EmptyState
              hideCTA
              description='Try selecting a different category above.'
              headline='No templates in this category'
              icon='🔍'
            />
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
                  { color: '#101727', marginTop: 16, fontWeight: '700' },
                ]}
              >
                {previewTemplate.name}
              </Text>
            </View>

            {/* Template Description */}
            <Text
              style={[
                theme.custom.typography.body,
                { color: '#374151', marginTop: 16 },
              ]}
            >
              {previewTemplate.description}
            </Text>

            {/* Scientific Reference */}
            <View
              style={[
                styles.previewScienceBox,
                {
                  backgroundColor: theme.custom.colors.secondary[500] + '10',
                  borderRadius: theme.custom.borderRadius.small,
                  marginTop: 24,
                },
              ]}
            >
              <Text style={styles.scienceIcon}>🔬</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.custom.typography.caption,
                    { color: '#6b7280', fontWeight: '600' },
                  ]}
                >
                  Scientific Backing
                </Text>
                <Text
                  style={[
                    theme.custom.typography.bodySmall,
                    { color: '#374151', marginTop: 4 },
                  ]}
                >
                  {previewTemplate.scientificReference}
                </Text>
                {previewTemplate.scientificLink && (
                  <Text
                    style={[
                      theme.custom.typography.caption,
                      {
                        color: theme.custom.colors.secondary[500],
                        marginTop: 4,
                        textDecorationLine: 'underline',
                      },
                    ]}
                  >
                    View Research →
                  </Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.previewActions}>
              <Button
                fullWidth
                size='large'
                variant='primary'
                onPress={() => handleTemplateImport(previewTemplate._id)}
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
    paddingVertical: 12,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f7f5',
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  listContent: {
    paddingBottom: 24,
  },
  listWrapper: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  previewActions: {
    marginTop: 32,
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
  previewScienceBox: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  scienceIcon: {
    fontSize: 20,
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
  hubermanBanner: {
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  hubermanBannerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hubermanBannerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  hubermanIcon: {
    fontSize: 24,
  },
  hubermanTextContainer: {
    flex: 1,
  },
  hubermanTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hubermanSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  hubermanArrow: {
    color: '#14B8A6',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
});
