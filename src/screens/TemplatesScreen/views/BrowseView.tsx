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

export function BrowseView(p: BrowseViewProps) {
  const { animations: a, handlers: h, tabIndicator: ti, categories: cats } = p;
  const catCount = cats?.filter((c) => c.id !== 'all').length || 0;

  return (
    <View style={styles.container}>
      <BrowseHeader animatedStyle={a.headerAnimatedStyle} />
      <Animated.View style={[styles.searchSection, a.searchAnimatedStyle]}>
        <SearchBar
          value={p.searchQuery}
          onChangeText={p.setSearchQuery}
          onClear={() => p.setSearchQuery('')}
        />
      </Animated.View>
      <TabBar
        activeTab={p.browseTab}
        allCount={p.totalCount}
        categoriesCount={catCount}
        tabBarAnimatedStyle={a.tabBarAnimatedStyle}
        tabIndicatorStyle={ti.tabIndicatorStyle}
        onLayout={ti.handleTabBarLayout}
        onTabPress={p.onTabPress}
      />
      {p.browseTab === 'categories' && (
        <BrowseCategoriesTab
          categories={cats}
          contentAnimatedStyle={a.contentAnimatedStyle}
          expandedCategories={p.expandedCategories}
          handleTemplateImport={h.handleTemplateImport}
          handleTemplatePreview={h.handleTemplatePreview}
          handleToggleCategory={h.handleToggleCategory}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          scienceCountsByCategory={p.scienceCountsByCategory}
          scrollViewRef={p.scrollViewRef}
          templatesByCategory={p.templatesByCategory}
        />
      )}
      {p.browseTab === 'all' && (
        <BrowseAllTab
          contentAnimatedStyle={a.contentAnimatedStyle}
          filteredTemplates={p.filteredTemplates}
          handleSelectSortOption={h.handleSelectSortOption}
          handleTemplateImport={h.handleTemplateImport}
          handleTemplatePreview={h.handleTemplatePreview}
          importingTemplateId={p.importingTemplateId}
          researchOnly={p.researchOnly}
          setResearchOnly={p.setResearchOnly}
          setShowSortOptions={p.setShowSortOptions}
          showSortOptions={p.showSortOptions}
          sortOption={p.sortOption}
          onCloseSortOptions={p.onCloseSortOptions}
        />
      )}
      <TemplateModals
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        previewTemplate={p.previewTemplate}
        showCustomizeModal={p.showCustomizeModal}
        showFullsizePreview={p.showFullsizePreview}
        onCloseCustomize={() => p.setShowCustomizeModal(false)}
        onCloseFullsize={() => p.setShowFullsizePreview(false)}
        onCustomize={h.handleCustomizeFromPreview}
        onDirectImport={h.handleDirectImport}
        onImport={h.handleTemplateImport}
      />
      <Toast
        duration={3000}
        message={p.toastMessage ?? ''}
        variant={
          (p.toastMessage ?? '').includes('Failed') ? 'error' : 'success'
        }
        visible={p.showToast}
        onDismiss={() => p.setShowToast(false)}
      />
    </View>
  );
}
