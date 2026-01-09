/**
 * Browse mode main view - categories tab and view all tab
 */

import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Toast from '../../../components/Toast';
import { styles } from '../../templates/templatesScreenStyles';
import { BrowseHeader, SearchBar, TabBar, TemplateModals } from '../components';
import { BrowseAllTab } from './BrowseAllTab';
import { BrowseCategoriesTab } from './BrowseCategoriesTab';
import type { BrowseViewProps } from './BrowseView.types';

export function BrowseView(props: BrowseViewProps) {
  const {
    animations,
    browseTab,
    categories,
    expandedCategories,
    filteredTemplates,
    handlers,
    importedTemplateIds,
    importingTemplateId,
    onCloseSortOptions,
    onTabPress,
    previewTemplate,
    researchOnly,
    scienceCountsByCategory,
    scrollViewRef,
    searchQuery,
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
    tabIndicator,
    templatesByCategory,
    toastMessage,
    totalCount,
  } = props;

  return (
    <View style={styles.container}>
      <BrowseHeader animatedStyle={animations.headerAnimatedStyle} />
      <Animated.View
        style={[styles.searchSection, animations.searchAnimatedStyle]}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </Animated.View>
      <TabBar
        activeTab={browseTab}
        allCount={totalCount}
        categoriesCount={categories?.filter((c) => c.id !== 'all').length || 0}
        tabBarAnimatedStyle={animations.tabBarAnimatedStyle}
        tabIndicatorStyle={tabIndicator.tabIndicatorStyle}
        onLayout={tabIndicator.handleTabBarLayout}
        onTabPress={onTabPress}
      />
      {browseTab === 'categories' && (
        <BrowseCategoriesTab
          categories={categories}
          contentAnimatedStyle={animations.contentAnimatedStyle}
          expandedCategories={expandedCategories}
          handleTemplateImport={handlers.handleTemplateImport}
          handleTemplatePreview={handlers.handleTemplatePreview}
          handleToggleCategory={handlers.handleToggleCategory}
          importingTemplateId={importingTemplateId}
          scienceCountsByCategory={scienceCountsByCategory}
          scrollViewRef={scrollViewRef}
          templatesByCategory={templatesByCategory}
        />
      )}
      {browseTab === 'all' && (
        <BrowseAllTab
          contentAnimatedStyle={animations.contentAnimatedStyle}
          filteredTemplates={filteredTemplates}
          handleSelectSortOption={handlers.handleSelectSortOption}
          handleTemplateImport={handlers.handleTemplateImport}
          handleTemplatePreview={handlers.handleTemplatePreview}
          importingTemplateId={importingTemplateId}
          researchOnly={researchOnly}
          setResearchOnly={setResearchOnly}
          setShowSortOptions={setShowSortOptions}
          showSortOptions={showSortOptions}
          sortOption={sortOption}
          onCloseSortOptions={onCloseSortOptions}
        />
      )}
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
    </View>
  );
}
