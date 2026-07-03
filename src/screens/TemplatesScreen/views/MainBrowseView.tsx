/**
 * MainBrowseView — Habit Library landing: header, category chips, search,
 * and a flat popularity-sorted list ("Two Worlds" layout).
 */

import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { LibraryLandingView } from './LibraryLandingView';
import type { MainBrowseViewProps } from './MainBrowseView.types';

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={s.body}>
        <LibraryLandingView
          allTemplates={p.allTemplates}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          searchQuery={p.searchQuery}
          totalHabitCount={p.totalHabitCount}
          onImport={p.onPopularImport}
          onPreview={p.onPreview}
          onSearchChange={p.onSearchChange}
          onSearchClear={p.onSearchClear}
          onSeeAll={p.onSeeAll}
        />
      </View>
      {p.modals}
      {p.feedbackOverlays}
    </View>
  );
}

const s = StyleSheet.create({
  body: { flex: 1 },
});
