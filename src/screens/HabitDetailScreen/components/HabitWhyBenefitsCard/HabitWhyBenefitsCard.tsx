/**
 * HabitWhyBenefitsCard — Unified "why this habit matters" surface on the
 * Goal tab. Composes the user's personal motivation (why / identity / wish),
 * a bulleted benefits list, and a science note. Collapsible. Replaces the
 * older single-source GoalWhyAnchor.
 */
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '../../../../theme/animations';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';
import { BenefitsList } from './BenefitsList';
import { EmptyStateCTA } from './EmptyStateCTA';
import { PersonalBlock } from './PersonalBlock';
import { ScienceNoteBlock } from './ScienceNoteBlock';
import {
  useCardContentFlags,
  useCollapsibleState,
  useNonEmptyBenefits,
  useResolveAllPersonal,
  useScienceNote,
} from './HabitWhyBenefitsCard.hooks';
import type { HabitWhyBenefitsCardProps } from './HabitWhyBenefitsCard.types';

export function HabitWhyBenefitsCard({ habit }: HabitWhyBenefitsCardProps) {
  const personal = useResolveAllPersonal(habit);
  const benefits = useNonEmptyBenefits(habit);
  const scienceNote = useScienceNote(habit);
  const flags = useCardContentFlags(personal, benefits, scienceNote);
  const { isExpanded, toggle } = useCollapsibleState(true);

  if (!flags.hasAnyContent) return <View className='mb-3'><EmptyStateCTA /></View>;

  return (
    <Animated.View
      accessibilityLabel='Why and benefits'
      className='mx-0 mb-3 rounded-2xl px-4 py-3'
      entering={FadeInDown.duration(durations.enter).easing(Easing.out(Easing.cubic))}
      style={{
        backgroundColor: colors.parchment.bg,
        borderColor: colors.parchment.border,
        borderWidth: 1,
      }}
    >
      <Pressable
        accessibilityHint={isExpanded ? 'Collapse section' : 'Expand section'}
        accessibilityRole='button'
        className='flex-row items-center justify-between'
        onPress={toggle}
      >
        <View className='flex-1 flex-row items-center gap-2 pr-2'>
          <Text style={{ fontSize: 18 }}>💭</Text>
          <View className='flex-1'>
            <Text
              style={{
                ...typography.caption,
                color: colors.parchment.text,
                fontWeight: fontWeights.bold,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Why &amp; Benefits
            </Text>
            {isExpanded || flags.summaryText.length === 0 ? null : (
              <Text
                className='mt-0.5'
                style={{
                  ...typography.caption,
                  color: colors.parchment.textStrong,
                  lineHeight: 16,
                }}
              >
                {flags.summaryText}
              </Text>
            )}
          </View>
        </View>
        {isExpanded ? (
          <ChevronDown color={colors.parchment.text} size={18} />
        ) : (
          <ChevronRight color={colors.parchment.text} size={18} />
        )}
      </Pressable>

      {isExpanded ? (
        <View className='mt-2'>
          {personal.map((data, index) => (
            <PersonalBlock
              key={data.source}
              data={data}
              isLast={index === personal.length - 1 && !flags.hasBenefits && !flags.hasScience}
            />
          ))}
          {flags.hasBenefits ? <BenefitsList benefits={benefits} /> : null}
          {flags.hasScience && scienceNote !== null ? (
            <ScienceNoteBlock note={scienceNote} />
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
}
