/**
 * Category/Search view mode - shows filtered template list
 */

import { useCallback, useRef } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import TemplateCard from '../../../components/TemplateCard';
import Toast from '../../../components/Toast';
import { styles } from '../../templates/templatesScreenStyles';
import {
  CategoryHeader,
  FilterControls,
  ResearchFilterButton,
  ScrollShadows,
  SearchBar,
  TemplateModals,
  TemplatesListEmpty,
} from '../components';
import { useScrollShadows } from '../useScrollShadows';
import type { CategorySearchViewProps } from './CategorySearchView.types';

export function CategorySearchView(props: CategorySearchViewProps) {
  const {
    categories,
    effectiveViewMode,
    filteredTemplates,
    getCategoryLabel,
    handlers,
    hasActiveFilters,
    importedTemplateIds,
    importingTemplateId,
    previewTemplate,
    researchOnly,
    searchQuery,
    selectedCategory,
    setResearchOnly,
    setSearchQuery,
    setShowCustomizeModal,
    setShowFullsizePreview,
    setShowSortOptions,
    setShowToast,
    showCustomizeModal,
    showFullsizePreview,
    showSortOptions,
    showToast,
    sortOption,
    toastMessage,
  } = props;

  const flatListRef = useRef<FlatList<Doc<'templates'>>>(null);
  const scrollShadows = useScrollShadows({
    resetDeps: [selectedCategory, filteredTemplates.length, effectiveViewMode],
  });

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
        popularityScore={item.popularityScore}
        scientificLink={item.scientificLink}
        scientificReference={item.scientificReference}
        youtubeLink={item.youtubeLink}
        onImport={() => handlers.handleTemplateImport(item._id)}
        onPreview={() => handlers.handleTemplatePreview(item)}
      />
    ),
    [handlers, importingTemplateId]
  );

  return (
    <View style={styles.container}>
      <CategoryHeader
        categories={categories}
        filteredCount={filteredTemplates.length}
        getCategoryLabel={getCategoryLabel}
        selectedCategory={selectedCategory}
        viewMode={effectiveViewMode}
        onBackPress={handlers.handleBackToBrowse}
      />
      <View style={styles.searchSection}>
        <SearchBar
          placeholder='Search habits or science keywords'
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <View style={styles.controlRow}>
          <FilterControls
            researchOnly={researchOnly}
            showSortOptions={showSortOptions}
            sortOption={sortOption}
            onResearchToggle={() => setResearchOnly((p) => !p)}
            onSelectSort={handlers.handleSelectSortOption}
            onToggleSortOptions={() => setShowSortOptions((p) => !p)}
          />
          <ResearchFilterButton
            researchOnly={researchOnly}
            onToggle={() => setResearchOnly((p) => !p)}
          />
        </View>
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          ref={flatListRef}
          contentContainerStyle={styles.listContent}
          data={filteredTemplates}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <TemplatesListEmpty
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handlers.handleResetFilters}
            />
          }
          renderItem={renderTemplateCard}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollShadows.handleContentSizeChange}
          onLayout={scrollShadows.handleLayout}
          onScroll={scrollShadows.handleScroll}
        />
        <ScrollShadows
          showBottomShadow={scrollShadows.showBottomShadow}
          showTopShadow={scrollShadows.showTopShadow}
        />
      </View>
      <TemplateModals
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        previewTemplate={previewTemplate}
        showCustomizeModal={showCustomizeModal}
        showFullsizePreview={showFullsizePreview}
        onCloseCustomize={() => setShowCustomizeModal(false)}
        onCloseFullsize={() => setShowFullsizePreview(false)}
        onCustomize={handlers.handleCustomizeFromPreview}
        onDirectImport={handlers.handleDirectImport}
        onImport={handlers.handleTemplateImport}
      />
      <Toast
        duration={3000}
        message={toastMessage}
        variant={toastMessage.includes('Failed') ? 'error' : 'success'}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
      {showSortOptions && (
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setShowSortOptions(false)}
        />
      )}
    </View>
  );
}
