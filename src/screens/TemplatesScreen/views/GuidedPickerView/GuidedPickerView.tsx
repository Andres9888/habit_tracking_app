/**
 * GuidedPickerView — 3-question progressive habit picker
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useGuidedPicker } from './GuidedPickerView.hooks';
import type { GuidedPickerViewProps } from './GuidedPickerView.types';
import { AreaOfLifeQuestion } from './components/AreaOfLifeQuestion';
import { GuidedResultsScreen } from './components/GuidedResultsScreen';
import { StyleQuestion } from './components/StyleQuestion';
import { TimePerDayQuestion } from './components/TimePerDayQuestion';

export function GuidedPickerView(p: GuidedPickerViewProps) {
  const { colors } = useThemeColors();
  const picker = useGuidedPicker(p.allTemplates);

  const handleCategorySelect = (cat: string) => {
    picker.setSelectedCategories([cat]);
  };

  const handleEditAnswers = () => {
    picker.setSelectedCategories([]);
    picker.setTimeBucket(undefined);
    picker.setStylePreference(undefined);
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <Pressable accessibilityRole='button' style={s.backBtn} onPress={p.onBack}>
        <Text style={[s.backLabel, { color: colors.primary[600] }]}>← Back</Text>
      </Pressable>
      <Text style={[s.title, { color: colors.text.primary }]}>Find your habit</Text>

      {picker.hasResults ? (
        <GuidedResultsScreen
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          results={picker.results}
          onBrowseAll={p.onBack}
          onEditAnswers={handleEditAnswers}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      ) : (
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <AreaOfLifeQuestion
            selectedCategories={picker.selectedCategories}
            onSelect={handleCategorySelect}
          />
          {picker.selectedCategories.length > 0 ? (
            <>
              <TimePerDayQuestion value={picker.timeBucket} onChange={picker.setTimeBucket} />
              <StyleQuestion value={picker.stylePreference} onChange={picker.setStylePreference} />
            </>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backLabel: { fontSize: 16, fontWeight: '500' },
  container: { flex: 1 },
  scroll: { paddingBottom: 32, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16, paddingHorizontal: 16 },
});
