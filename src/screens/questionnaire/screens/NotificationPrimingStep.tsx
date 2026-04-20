import { useQuery } from 'convex/react';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { api } from '../../../../convex/_generated/api';
import { useThemeColors } from '@/theme';
import { ensureNotificationPermissions } from '@/utils/notifications/permissions';

import { BulletList } from '../components/BulletList';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

const BULLETS = [
  'One gentle nudge at your best time of day',
  'No guilt streaks or red-alert reminders',
  'Turn off any time in Settings',
] as const;

function formatNames(names: string[]): string | null {
  if (names.length === 0) return null;
  if (names.length === 1) return names[0] ?? null;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;
}

export function NotificationPrimingStep({
  step,
  selectedTemplateIds,
  updateAnswers,
  onNext,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const [requesting, setRequesting] = useState(false);
  const templates = useQuery(api.templates.list, {});

  const habitList = useMemo(() => {
    if (!templates) return null;
    const names = templates
      .filter((template) => selectedTemplateIds.includes(template._id))
      .map((template) => template.name);
    return formatNames(names);
  }, [selectedTemplateIds, templates]);

  const handleEnable = useCallback(async () => {
    setRequesting(true);
    const granted = await ensureNotificationPermissions();
    updateAnswers({ notifPermission: granted ? 'granted' : 'denied' });
    setRequesting(false);
    onNext();
  }, [onNext, updateAnswers]);

  const handleSkip = useCallback(() => {
    updateAnswers({ notifPermission: 'skipped' });
    onNext();
  }, [onNext, updateAnswers]);

  return (
    <QuestionnaireScreenFrame
      canGoBack
      footer={
        <View style={{ gap: 12 }}>
          <PrimaryCTA
            label='Turn on reminders'
            loading={requesting}
            onPress={() => { void handleEnable(); }}
          />
          <Pressable accessibilityRole='button' onPress={handleSkip}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 15,
                textAlign: 'center',
              }}
            >
              Not now
            </Text>
          </Pressable>
        </View>
      }
      step={step}
      subtitle={
        habitList
          ? `We'll remind you about ${habitList}.`
          : 'One gentle nudge a day — you pick when.'
      }
      title='Never miss a check-in.'
      onBack={onBack}
    >
      <BulletList glyph='✓' items={BULLETS} />
    </QuestionnaireScreenFrame>
  );
}
