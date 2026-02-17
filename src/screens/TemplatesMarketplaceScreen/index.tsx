/**
 * Templates Marketplace Screen
 * Browse and import curated habit template collections
 */

import { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import type { Doc } from '@/convex/_generated/dataModel';
import { useMarketplaceData } from './hooks/useMarketplaceData';
import { useTemplateRating, useUserTemplateRating } from './hooks/useTemplateRating';
import { useImportMarketplaceTemplate } from './hooks/useImportMarketplaceTemplate';
import type { CategoryFilter } from './types';
import {
  HorizontalSection,
  CategoryChips,
  MarketplaceSearchBar,
  TemplateDetailModal,
} from './components';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TemplatesMarketplaceScreen() {
  const colors = useThemeColors();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Doc<'templates'> | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Data hooks
  const {
    featuredTemplates,
    seasonalCollections,
    topRatedTemplates,
    fitnessTemplates,
    mindfulnessTemplates,
    productivityTemplates,
    healthTemplates,
    searchResults,
    isLoading,
  } = useMarketplaceData(searchQuery);
  
  // Rating hooks
  const { rateTemplate, isRating } = useTemplateRating();
  
  // Import hook
  const { importTemplate, isImporting, successMessage, importError } = useImportMarketplaceTemplate();

  // Get user's rating for selected template
  const userRating = useUserTemplateRating(selectedTemplate?._id || null);

  // Handle template press
  const handleTemplatePress = (template: Doc<'templates'>) => {
    setSelectedTemplate(template);
    setShowDetailModal(true);
  };

  // Handle template import
  const handleImportTemplate = async () => {
    if (!selectedTemplate) return;
    
    try {
      await importTemplate(selectedTemplate._id);
      setShowDetailModal(false);
      Alert.alert('Success!', successMessage || 'Template imported successfully');
    } catch (error) {
      Alert.alert('Error', importError || 'Failed to import template');
    }
  };

  // Handle template rating
  const handleRateTemplate = async (rating: number) => {
    if (!selectedTemplate) return;
    
    try {
      await rateTemplate(selectedTemplate._id, rating);
      Alert.alert('Thanks!', 'Your rating has been saved');
    } catch (error) {
      Alert.alert('Error', 'Failed to save rating');
    }
  };

  // Get filtered templates based on category
  const getFilteredTemplates = () => {
    const allMarketplaceTemplates = [
      ...fitnessTemplates,
      ...mindfulnessTemplates,
      ...productivityTemplates,
      ...healthTemplates,
    ].filter(t => t.isMarketplaceTemplate);

    switch (selectedCategory) {
      case 'fitness':
        return fitnessTemplates.filter(t => t.isMarketplaceTemplate);
      case 'mindfulness':
        return mindfulnessTemplates.filter(t => t.isMarketplaceTemplate);
      case 'productivity':
        return productivityTemplates.filter(t => t.isMarketplaceTemplate);
      case 'health':
        return healthTemplates.filter(t => t.isMarketplaceTemplate);
      default:
        return allMarketplaceTemplates;
    }
  };

  // Render seasonal collection sections
  const renderSeasonalSections = () => {
    if (!seasonalCollections || Object.keys(seasonalCollections).length === 0) {
      return null;
    }

    const collectionNames: Record<string, string> = {
      new_year: '🎉 New Year Resolutions',
      summer: '☀️ Summer Fitness',
      study: '📚 Study Season',
      fall: '🍂 Fall Routine',
      winter: '❄️ Winter Wellness',
    };

    return Object.entries(seasonalCollections).map(([key, templates]) => {
      if (!templates || templates.length === 0) return null;
      
      return (
        <HorizontalSection
          key={key}
          title={collectionNames[key] || key}
          templates={templates}
          onTemplatePress={handleTemplatePress}
        />
      );
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  // Search mode
  if (searchQuery.length > 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <AnimatedView entering={FadeIn.duration(280)} style={styles.header}>
          <Pressable onPress={() => {}} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Search Results
          </Text>
          <View style={styles.headerSpacer} />
        </AnimatedView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MarketplaceSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* Search Results */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {searchResults.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No templates found for "{searchQuery}"
            </Text>
          ) : (
            searchResults.map((template) => (
              <View key={template._id} style={styles.cardWrapper}>
                <HorizontalSection
                  title=""
                  templates={[template]}
                  onTemplatePress={handleTemplatePress}
                />
              </View>
            ))
          )}
        </ScrollView>

        {/* Detail Modal */}
        <TemplateDetailModal
          template={selectedTemplate}
          visible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onImport={handleImportTemplate}
          isImporting={isImporting}
          userRating={userRating}
          onRate={handleRateTemplate}
          isRating={isRating}
        />
      </View>
    );
  }

  // Main marketplace view
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <AnimatedView entering={FadeIn.duration(280)} style={styles.header}>
        <Pressable onPress={() => {}} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Templates Marketplace
        </Text>
        <View style={styles.headerSpacer} />
      </AnimatedView>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.sectionPadding}>
          <MarketplaceSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>

        {/* Category Chips */}
        <View style={styles.sectionPadding}>
          <CategoryChips
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </View>

        {/* Featured Section */}
        {selectedCategory === 'all' && featuredTemplates.length > 0 && (
          <View style={styles.sectionPadding}>
            <HorizontalSection
              title="⭐ Featured"
              templates={featuredTemplates}
              onTemplatePress={handleTemplatePress}
            />
          </View>
        )}

        {/* Seasonal Collections */}
        {selectedCategory === 'all' && renderSeasonalSections()}

        {/* Top Rated */}
        {selectedCategory === 'all' && topRatedTemplates.length > 0 && (
          <View style={styles.sectionPadding}>
            <HorizontalSection
              title="🔥 Top Rated"
              templates={topRatedTemplates}
              onTemplatePress={handleTemplatePress}
            />
          </View>
        )}

        {/* Category Sections */}
        {selectedCategory !== 'all' && (
          <View style={styles.sectionPadding}>
            <HorizontalSection
              title={
                selectedCategory === 'fitness'
                  ? '💪 Fitness'
                  : selectedCategory === 'mindfulness'
                  ? '🧘 Mindfulness'
                  : selectedCategory === 'productivity'
                  ? '🚀 Productivity'
                  : '❤️ Health'
              }
              templates={getFilteredTemplates()}
              onTemplatePress={handleTemplatePress}
            />
          </View>
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Detail Modal */}
      <TemplateDetailModal
        template={selectedTemplate}
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onImport={handleImportTemplate}
        isImporting={isImporting}
        userRating={userRating}
        onRate={handleRateTemplate}
        isRating={isRating}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 0,
  },
  emptyText: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  bottomPadding: {
    height: 20,
  },
});
