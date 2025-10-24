/**
 * Templates Screen
 * Based on UX Specification Section 2.1 (Templates Tab) & Section 9.2
 *
 * Purpose: Browse and import science-backed habit templates
 * Features: Category filtering, template cards, import flow, search (future)
 * Categories: Morning Routine, Health & Fitness, Productivity, Mindfulness
 */

import React, { useState, useMemo, useCallback } from 'react';
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
import type { Id } from '../../convex/_generated/dataModel';
import { useAppTheme } from '../theme';
import TemplateCard from '../components/TemplateCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

type Category = 'all' | 'morning_routine' | 'health_fitness' | 'productivity' | 'mindfulness';

interface CategoryFilter {
  id: Category;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryFilter[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'morning_routine', label: 'Morning', icon: '🌅' },
  { id: 'health_fitness', label: 'Health', icon: '💪' },
  { id: 'productivity', label: 'Productivity', icon: '🎯' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
];

export default function TemplatesScreen() {
  const theme = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
  const handleTemplatePreview = useCallback((template: any) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  }, []);

  // Handle template import
  const handleTemplateImport = useCallback(
    async (templateId: Id<'templates'>, customizations?: any) => {
      try {
        const result = await importTemplate({
          templateId,
          customizations,
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

  // Render category filter chip
  const renderCategoryChip = useCallback(
    (category: CategoryFilter) => {
      const isSelected = selectedCategory === category.id;

      return (
        <Pressable
          key={category.id}
          onPress={() => handleCategoryPress(category.id)}
          style={[
            styles.categoryChip,
            {
              backgroundColor: isSelected
                ? theme.custom.colors.primary[500]
                : theme.custom.colors.gray[100],
              borderRadius: theme.custom.borderRadius.large,
            },
          ]}
          accessible={true}
          accessibilityLabel={`Filter by ${category.label}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              theme.custom.typography.bodySmall,
              {
                color: isSelected
                  ? '#FFFFFF'
                  : theme.custom.colors.gray[700],
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
        id={item._id}
        name={item.name}
        description={item.description}
        icon={item.icon}
        iconColor={item.iconColor}
        scientificReference={item.scientificReference}
        category={item.category}
        popularityScore={item.popularityScore}
        onImport={() => handleTemplateImport(item._id)}
        onPreview={() => handleTemplatePreview(item)}
      />
    ),
    [handleTemplateImport, handleTemplatePreview]
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.custom.colors.light.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.custom.colors.primary[500]} size="large" />
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
      <View style={[styles.container, { backgroundColor: theme.custom.colors.light.background }]}>
        <EmptyState
          icon="📚"
          headline="No Templates Available"
          description="Check back soon for science-backed habit templates."
          hideCTA
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.custom.colors.light.background }]}>
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
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map(renderCategoryChip)}
      </ScrollView>

      {/* Templates List */}
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplateCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            headline="No templates in this category"
            description="Try selecting a different category above."
            hideCTA
          />
        }
      />

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          visible={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          variant="bottomSheet"
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
                variant="primary"
                size="large"
                onPress={() => handleTemplateImport(previewTemplate._id)}
                fullWidth
              >
                Import Template
              </Button>
              <Button
                variant="ghost"
                size="medium"
                onPress={() => setShowPreviewModal(false)}
                fullWidth
                style={{ marginTop: 12 }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      )}

      {/* Success Toast */}
      <Toast
        visible={showToast}
        message={toastMessage}
        variant={toastMessage.includes('Failed') ? 'error' : 'success'}
        onDismiss={() => setShowToast(false)}
        duration={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    marginRight: 8,
  },
  categoryIcon: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  previewModal: {
    paddingBottom: 24,
  },
  previewHeader: {
    alignItems: 'center',
  },
  previewIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 48,
  },
  previewScienceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  scienceIcon: {
    fontSize: 20,
  },
  previewActions: {
    marginTop: 32,
  },
});
