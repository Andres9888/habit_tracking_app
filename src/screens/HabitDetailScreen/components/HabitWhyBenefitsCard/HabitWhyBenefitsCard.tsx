/**
 * HabitWhyBenefitsCard — Unified "why this habit matters" surface on the
 * Goal tab. Composes personal motivation (why / identity / wish), a
 * bulleted benefits list, and a science note. Collapsible. Edit pencil
 * opens WhyBenefitsEditModal. Replaces the older single-source
 * GoalWhyAnchor.
 */
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '../../../../theme/animations';
import { colors } from '../../../../theme/colors';
import { WhyBenefitsEditModal } from '../WhyBenefitsEditModal';
import { BenefitsList } from './BenefitsList';
import { CardHeader } from './CardHeader';
import { EmptyStateCTA } from './EmptyStateCTA';
import { PersonalBlock } from './PersonalBlock';
import { ScienceNoteBlock } from './ScienceNoteBlock';
import { SourcePill } from './SourcePill';
import {
  useCardContentFlags,
  useCollapsibleState,
  useNonEmptyBenefits,
  useResolveAllPersonal,
  useScienceNote,
  useTemplateProvenance,
} from './HabitWhyBenefitsCard.hooks';
import type { HabitWhyBenefitsCardProps } from './HabitWhyBenefitsCard.types';

export function HabitWhyBenefitsCard({ habit }: HabitWhyBenefitsCardProps) {
  const personal = useResolveAllPersonal(habit);
  const benefits = useNonEmptyBenefits(habit);
  const scienceNote = useScienceNote(habit);
  const provenance = useTemplateProvenance(habit._id);
  const isFromTemplate = provenance !== null;
  const flags = useCardContentFlags(personal, benefits, scienceNote);
  const { isExpanded, toggle } = useCollapsibleState(true);
  const [editing, setEditing] = useState(false);
  const openEditor = () => setEditing(true);
  const closeEditor = () => setEditing(false);

  if (!flags.hasAnyContent) {
    return (
      <View className='mb-3'>
        <EmptyStateCTA onPress={openEditor} />
        <WhyBenefitsEditModal habit={habit} visible={editing} onClose={closeEditor} />
      </View>
    );
  }

  return (
    <>
      <Animated.View
        accessibilityLabel='Why and benefits'
        className='mx-0 mb-3 rounded-xl px-4 py-3.5'
        entering={FadeInDown.duration(durations.enter).easing(Easing.out(Easing.cubic))}
        style={{ backgroundColor: '#FAF8F5' }}
      >
        <CardHeader
          isExpanded={isExpanded}
          summaryText={flags.summaryText}
          onEdit={openEditor}
          onToggle={toggle}
        />
        {isExpanded ? (
          <View className='mt-2'>
            {isFromTemplate ? <SourcePill /> : null}
            {personal.map((data, index) => (
              <PersonalBlock
                key={data.source}
                data={data}
                isLast={index === personal.length - 1 && !flags.hasBenefits && !flags.hasScience}
              />
            ))}
            {flags.hasBenefits ? (
              <BenefitsList benefits={benefits} isFromTemplate={isFromTemplate} />
            ) : null}
            {flags.hasScience && scienceNote !== null ? (
              <ScienceNoteBlock
                note={scienceNote}
                scientificLink={provenance?.scientificLink ?? null}
              />
            ) : null}
          </View>
        ) : null}
      </Animated.View>
      <WhyBenefitsEditModal habit={habit} visible={editing} onClose={closeEditor} />
    </>
  );
}
