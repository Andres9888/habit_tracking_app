import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/theme';
import { ensureNotificationPermissions } from '@/utils/notifications/permissions';

import { PrimaryCTA } from '../components/PrimaryCTA';
import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

const BULLETS = [
  'One gentle nudge at your best time of day',
  'No guilt streaks or red-alert reminders',
  'Turn off any time in Settings',
];

export function NotificationPrimingStep({
  step,
  updateAnswers,
  onNext,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const [requesting, setRequesting] = useState(false);

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
            onPress={() => {
              void handleEnable();
            }}
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
      subtitle='One gentle nudge a day — you pick when.'
      title='Never miss a check-in.'
      onBack={onBack}
    >
      <View style={{ gap: 14 }}>
        {BULLETS.map((line) => (
          <View
            key={line}
            style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}
          >
            <Text style={{ color: colors.primary[600], fontSize: 18 }}>✓</Text>
            <Text
              style={{
                color: colors.text.primary,
                flex: 1,
                fontSize: 16,
                lineHeight: 22,
              }}
            >
              {line}
            </Text>
          </View>
        ))}
      </View>
    </QuestionnaireScreenFrame>
  );
}
