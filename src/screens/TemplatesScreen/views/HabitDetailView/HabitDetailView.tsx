/**
 * HabitDetailView — confidence-first template detail (replaces modal-first preview)
 */

import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useHabitDetailView } from './HabitDetailView.hooks';
import type { HabitDetailViewProps } from './HabitDetailView.types';
import { ConfidencePromiseCard } from './components/ConfidencePromiseCard';
import { FeasibilityMetaRow } from './components/FeasibilityMetaRow';
import { HowYoullDoItSection } from './components/HowYoullDoItSection';
import { IdentitySection } from './components/IdentitySection';
import { StickyAddFooter } from './components/StickyAddFooter';
import { WhyThisWorksSection } from './components/WhyThisWorksSection';

export function HabitDetailView(p: HabitDetailViewProps) {
  const { colors } = useThemeColors();
  const { content } = useHabitDetailView(p.template);

  useEffect(() => {
    p.onTrackOpen?.(p.template._id, p.sourcePath);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isImported = p.importedTemplateIds.has(p.template._id);
  const isImporting = p.importingTemplateId === p.template._id;

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <Pressable accessibilityRole='button' style={s.backBtn} onPress={p.onBack}>
        <Text style={[s.backLabel, { color: colors.primary[600] }]}>← Back</Text>
      </Pressable>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <ConfidencePromiseCard
          icon={p.template.icon}
          name={p.template.name}
          promise={content.promise}
        />
        <FeasibilityMetaRow
          estimatedMinutes={p.template.estimatedMinutes}
          growthType={p.template.growthType}
        />
        <WhyThisWorksSection
          benefits={content.benefits}
          scientificReference={p.template.scientificReference}
        />
        <HowYoullDoItSection
          cue={content.cue}
          startSmall={content.startSmall}
          tip={p.template.tips?.[0]}
        />
        <IdentitySection identity={content.identity} />
        <View style={s.spacer} />
      </ScrollView>
      <StickyAddFooter
        isImported={isImported}
        isImporting={isImporting}
        onAdd={() => p.onImport(p.template)}
        onCustomize={() => p.onCustomize(p.template)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backLabel: { fontSize: 16, fontWeight: '500' },
  container: { flex: 1 },
  scroll: { paddingBottom: 24 },
  spacer: { height: 16 },
});
