/**
 * GoalPathBody — Workflow V3 path layout for goal drills.
 * One recommended first habit ("Start here"), then the rest of the
 * goal's habits as minimal one-tap rows ("Then build on it").
 */

import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { FeaturedPickCard } from '../components/FeaturedPickCard';
import { MinimalTemplateRow } from '../components/MinimalTemplateRow';
import { SectionOverline } from '../components/SectionOverline';
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';

const PATH_FOOTNOTE =
  'You can add any of these later — paths are a sequence, not a bundle.';

interface GoalPathBodyProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function GoalPathBody(p: GoalPathBodyProps) {
  const { colors } = useThemeColors();

  const ordered = useMemo(() => {
    const byPopularity = [...p.templates].sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
    );
    return sortTemplatesByImportState(byPopularity, p.importedTemplateIds);
  }, [p.importedTemplateIds, p.templates]);

  const recommended = ordered[0] ?? null;
  const rest = ordered.slice(1);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.content}
    >
      {recommended ? (
        <>
          <SectionOverline title='Start here' />
          <FeaturedPickCard
            isImported={p.importedTemplateIds.has(recommended._id)}
            isImporting={p.importingTemplateId === recommended._id}
            label='Most popular first step'
            template={recommended}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        </>
      ) : null}
      {rest.length > 0 ? (
        <>
          <SectionOverline title='Then build on it' />
          {rest.map((item) => (
            <MinimalTemplateRow
              key={item._id}
              isImported={p.importedTemplateIds.has(item._id)}
              isImporting={p.importingTemplateId === item._id}
              item={item}
              onImport={p.onImport}
              onPreview={p.onPreview}
            />
          ))}
        </>
      ) : null}
      <Text style={[s.footnote, { color: colors.text.secondary }]}>
        {PATH_FOOTNOTE}
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  content: {
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.xs,
  },
  footnote: {
    ...typography.caption,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    textAlign: 'center',
  },
});
