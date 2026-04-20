import { useQuery } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { api } from '../../../../convex/_generated/api';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '@/theme';

import { DemoCardBody } from '../components/DemoCardBody';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import { SwipeCard } from '../components/SwipeCard';
import type { StepProps, TemplateId } from '../QuestionnaireFlow.types';

const TARGET_PICKS = 3;
const MAX_CARDS = 12;

function sortAndFilter(
  templates: Doc<'templates'>[],
  categories: string[]
): Doc<'templates'>[] {
  const filtered = categories.length > 0
    ? templates.filter((template) => categories.includes(template.category))
    : templates;
  return [...filtered]
    .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
    .slice(0, MAX_CARDS);
}

export function AppDemoStep({
  step,
  answers,
  selectedTemplateIds,
  setSelectedTemplateIds,
  onNext,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const templates = useQuery(api.templates.list, {});
  const deck = useMemo(
    () => (templates ? sortAndFilter(templates, answers.categories) : []),
    [answers.categories, templates]
  );
  const [cursor, setCursor] = useState(0);
  const current = deck[cursor];
  const pickedCount = selectedTemplateIds.length;

  const handlePick = useCallback(() => {
    if (!current) return;
    const id = current._id as TemplateId;
    const next = selectedTemplateIds.includes(id)
      ? selectedTemplateIds
      : [...selectedTemplateIds, id];
    setSelectedTemplateIds(next);
    if (next.length >= TARGET_PICKS) onNext();
    else setCursor((index) => index + 1);
  }, [current, onNext, selectedTemplateIds, setSelectedTemplateIds]);

  const handleSkip = useCallback(() => {
    if (cursor >= deck.length - 1) onNext();
    else setCursor((index) => index + 1);
  }, [cursor, deck.length, onNext]);

  if (!templates) {
    return (
      <QuestionnaireScreenFrame canGoBack step={step} title='Loading habits…' onBack={onBack}>
        <ActivityIndicator color={colors.primary[600]} />
      </QuestionnaireScreenFrame>
    );
  }

  return (
    <QuestionnaireScreenFrame
      canGoBack
      step={step}
      subtitle={`Picked ${pickedCount} of ${TARGET_PICKS} — swipe right to keep.`}
      title='Swipe right on habits you want.'
      onBack={onBack}
    >
      {current ? (
        <SwipeCard
          key={current._id}
          acceptLabel='Add to plan'
          dismissLabel='Skip'
          onSwipeLeft={handleSkip}
          onSwipeRight={handlePick}
        >
          <DemoCardBody
            description={current.description}
            icon={current.icon}
            name={current.name}
          />
        </SwipeCard>
      ) : (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Text
            style={{ color: colors.text.primary, fontSize: 16, textAlign: 'center' }}
          >
            {pickedCount > 0
              ? "Great — let's see your plan."
              : "No problem — we'll suggest some on the next step."}
          </Text>
        </View>
      )}
    </QuestionnaireScreenFrame>
  );
}
