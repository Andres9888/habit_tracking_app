/**
 * BrowseRowSectionList — renders the Minimal & Clean row sections
 * (overline header + single-column template rows) with stagger entrances.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { HabitTemplateCard } from '../components/HabitTemplateCard';
import { SectionOverline } from '../components/SectionOverline';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';
import { stagger } from './MainBrowseView.helpers';

interface BrowseRowSectionListProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  sections: BrowseRowSection[];
  staggerOffset: number;
}

export function BrowseRowSectionList(p: BrowseRowSectionListProps) {
  const { colors } = useThemeColors();

  return (
    <>
      {p.sections.map((section, sectionIndex) => (
        <Animated.View
          key={section.key}
          entering={stagger(p.staggerOffset + sectionIndex)}
        >
          <SectionOverline
            flush={sectionIndex === 0}
            title={section.title}
            rightSlot={
              section.key === 'popular' ? (
                <Pressable
                  accessibilityLabel='Browse all habits'
                  accessibilityRole='button'
                  hitSlop={8}
                  testID='templates-trending-see-all'
                  onPress={p.onSeeAll}
                >
                  <Text style={[s.seeAll, { color: colors.primary[600] }]}>
                    See all
                  </Text>
                </Pressable>
              ) : undefined
            }
          />
          <View>
            {section.templates.map((item, rowIndex) => (
              <HabitTemplateCard
                key={item._id}
                elevated={
                  section.key === 'popular' && rowIndex === 0 ? true : undefined
                }
                isImported={p.importedTemplateIds.has(item._id)}
                isImporting={p.importingTemplateId === item._id}
                item={item}
                onImport={p.onImport}
                onPreview={p.onPreview}
              />
            ))}
          </View>
        </Animated.View>
      ))}
    </>
  );
}

const s = StyleSheet.create({
  seeAll: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
    lineHeight: 16,
  },
});
