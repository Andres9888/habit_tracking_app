/**
 * MainBrowseView — Habit Library landing. Renders the catalog page
 * (search, category chips, category-grouped list) as the main view.
 */

import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';
import { CatalogView } from './CatalogView';
import type { MainBrowseViewProps } from './MainBrowseView.types';

export function MainBrowseView(p: MainBrowseViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={s.body}>
        <CatalogView
          allTemplates={p.allTemplates}
          frozenImportedIds={p.frozenImportedIds}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          onBack={p.onClose}
          onImport={p.onPopularImport}
          onPreview={p.onPreview}
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
