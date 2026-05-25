/**
 * ImportSuccessView — shown after a template is imported
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { getPairingsForTemplate } from '../../data/templatePairings';
import type { ImportSuccessViewProps } from './ImportSuccessView.types';
import { FirstImportBranchCard } from './components/FirstImportBranchCard';
import { WhatsNextSection } from './components/WhatsNextSection';

export function ImportSuccessView(p: ImportSuccessViewProps) {
  const { colors } = useThemeColors();

  if (p.isFirstImport) {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}>
        <FirstImportBranchCard
          templateName={p.template.name}
          onDismiss={p.onDismiss}
          onGuide={p.onOpenGuidedPicker}
          onViewPlan={p.onCloseLibrary}
        />
      </View>
    );
  }

  const pairings = getPairingsForTemplate(p.template.name, p.allTemplates);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={[s.title, { color: colors.text.primary }]}>Habit added ✓</Text>
          <Text style={[s.subtitle, { color: colors.text.secondary }]}>
            {p.template.name} is now in your daily plan.
          </Text>
        </View>
        <WhatsNextSection
          pairings={pairings}
          onAdd={p.onAddPairing}
          onPreview={p.onPreviewPairing}
        />
        <View style={s.actions}>
          <Pressable style={[s.primaryBtn, { backgroundColor: colors.primary[600] }]} onPress={p.onCloseLibrary}>
            <Text style={s.primaryLabel}>View today's plan</Text>
          </Pressable>
          <Pressable style={s.secondaryBtn} onPress={p.onDismiss}>
            <Text style={[s.secondaryLabel, { color: colors.primary[600] }]}>Add another habit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  actions: { marginTop: 24, paddingHorizontal: 16 },
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 24 },
  primaryBtn: { borderRadius: 14, marginBottom: 10, paddingVertical: 14 },
  primaryLabel: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  scroll: { paddingBottom: 32 },
  secondaryBtn: { paddingVertical: 10 },
  secondaryLabel: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
});
