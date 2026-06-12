/**
 * BrowseRowSectionList — renders the Minimal & Clean row sections
 * (overline header + single-column template rows) with stagger entrances.
 */

import { View } from 'react-native';
import Animated from 'react-native-reanimated';
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
  sections: BrowseRowSection[];
  staggerOffset: number;
}

export function BrowseRowSectionList(p: BrowseRowSectionListProps) {
  return (
    <>
      {p.sections.map((section, sectionIndex) => (
        <Animated.View
          key={section.key}
          entering={stagger(p.staggerOffset + sectionIndex)}
        >
          <SectionOverline flush={sectionIndex === 0} title={section.title} />
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
