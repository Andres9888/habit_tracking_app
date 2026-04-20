import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { Share, Text } from 'react-native';

import { api } from '../../../../convex/_generated/api';
import { useThemeColors } from '@/theme';

import { PlanHabitCard } from '../components/PlanHabitCard';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

export function PlanPreviewStep({
  step,
  selectedTemplateIds,
  onNext,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const templates = useQuery(api.templates.list, {});
  const selected = useMemo(() => {
    if (!templates) return [];
    return templates.filter((template) =>
      selectedTemplateIds.includes(template._id)
    );
  }, [selectedTemplateIds, templates]);

  const handleShare = () => {
    const names = selected.map((template) => template.name).join(', ');
    const message = names
      ? `I'm starting ${selected.length} habits with Chain Day — ${names}. Join me.`
      : "I'm starting my first habits with Chain Day. Join me.";
    void Share.share({ message });
  };

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={<PrimaryCTA label='Looks great' onPress={onNext} />}
      step={step}
      subtitle='Tweak, reorder, or add more once you sign in.'
      title={`Your ${Math.max(selected.length, 1)}-habit starter plan`}
      onBack={onBack}
    >
      {selected.length === 0 ? (
        <Text style={{ color: colors.text.secondary, fontSize: 15, lineHeight: 22 }}>
          We'll suggest 3 habits once you sign in — based on the focus areas you
          picked.
        </Text>
      ) : null}
      {selected.map((template) => (
        <PlanHabitCard
          key={template._id}
          description={template.description}
          icon={template.icon}
          name={template.name}
        />
      ))}
      <Text
        accessibilityRole='link'
        style={{
          color: colors.primary[600],
          fontSize: 15,
          fontWeight: '600',
          marginTop: 12,
          textAlign: 'center',
        }}
        onPress={handleShare}
      >
        Share my plan
      </Text>
    </QuestionnaireScreenFrame>
  );
}
