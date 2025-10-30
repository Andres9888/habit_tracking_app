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
  label: string;
  icon: string;
}

const CATEGORIES: CategoryFilter[] = [
  { icon: '✨', id: 'all', label: 'All' },
  { icon: '🌅', id: 'morning_routine', label: 'Morning' },
  { icon: '💪', id: 'health_fitness', label: 'Health' },
  { icon: '🎯', id: 'productivity', label: 'Productivity' },
  { icon: '🧘', id: 'mindfulness', label: 'Mindfulness' },
  { icon: '🔬', id: 'andrew_huberman', label: 'Huberman' },
  { icon: '📚', id: 'learning', label: 'Learning' },
  { icon: '💬', id: 'social', label: 'Social' },
  { icon: '💰', id: 'financial', label: 'Financial' },
  { icon: '🎨', id: 'creativity', label: 'Creativity' },
  { icon: '😴', id: 'sleep', label: 'Sleep' },
];

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

  // Fetch templates
  const allTemplates = useQuery(api.templates.list, {});
  const isLoading = allTemplates === undefined;

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
              backgroundColor: isSelected
                ? theme.custom.colors.primary[500]
                : theme.custom.colors.gray[100],
              borderRadius: theme.custom.borderRadius.large,
            },
          ]}
          onPress={() => handleCategoryPress(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              {
                color: isSelected ? '#FFFFFF' : theme.custom.colors.gray[700],
                fontWeight: isSelected ? '600' : '400',
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
      <View
        style={[
          styles.container,
          { backgroundColor: theme.custom.colors.light.background },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={theme.custom.colors.primary[500]}
            size='large'
          />
          <Text
            style={[
              theme.custom.typography.bodySmall,
              { color: theme.custom.colors.gray[600], marginTop: 16 },
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
      <View
        style={[
          styles.container,
          { backgroundColor: theme.custom.colors.light.background },
        ]}
      >
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
    <View
      style={[
        styles.container,
        { backgroundColor: theme.custom.colors.light.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            theme.custom.typography.heading1,
            { color: theme.custom.colors.gray[900] },
          ]}
        >
          Templates
        </Text>
        <Text
          style={[
            theme.custom.typography.bodySmall,
            { color: theme.custom.colors.gray[600], marginTop: 4 },
          ]}
        >
          Science-backed habits to get you started
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        contentContainerStyle={styles.categoriesContainer}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map((category) => renderCategoryChip(category))}
      </ScrollView>

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
                { backgroundColor: `${theme.custom.colors.gray[100]}CC` },
              ]}
            >
              <ChevronDown color={theme.custom.colors.gray[700]} size={16} />
              <Text
                style={[
                  styles.scrollHintText,
                  { color: theme.custom.colors.gray[700] },
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
                  { color: theme.custom.colors.gray[900], marginTop: 16 },
                ]}
              >
                {previewTemplate.name}
              </Text>
            </View>

            {/* Template Description */}
            <Text
              style={[
                theme.custom.typography.body,
                { color: theme.custom.colors.gray[700], marginTop: 16 },
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
                    { color: theme.custom.colors.gray[600], fontWeight: '600' },
                  ]}
                >
                  Scientific Backing
                </Text>
                <Text
                  style={[
                    theme.custom.typography.bodySmall,
                    { color: theme.custom.colors.secondary[600], marginTop: 4 },
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
    paddingHorizontal: 16,
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
    paddingVertical: 8,
  },
  categoryIcon: {
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 48,
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
  },
  scrollHintText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
});
