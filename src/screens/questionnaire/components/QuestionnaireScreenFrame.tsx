import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, useReducedMotion } from 'react-native-reanimated';

import { useThemeColors } from '@/theme';

import type { QuestionnaireStep } from '../QuestionnaireFlow.types';
import { QuestionnaireHeader } from './QuestionnaireHeader';

interface Props {
  step: QuestionnaireStep;
  title?: string;
  subtitle?: string;
  canGoBack?: boolean;
  onBack?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function QuestionnaireScreenFrame({
  step,
  title,
  subtitle,
  canGoBack,
  onBack,
  children,
  footer,
}: Props) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <QuestionnaireHeader canGoBack={canGoBack} step={step} onBack={onBack} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: 24,
          paddingTop: 32,
        }}
        keyboardShouldPersistTaps='handled'
        style={{ flex: 1 }}
      >
        {title ? (
          <Animated.Text
            entering={reduceMotion ? undefined : FadeInUp.duration(320)}
            style={{
              color: colors.text.primary,
              fontSize: 28,
              fontWeight: '700',
              lineHeight: 34,
            }}
          >
            {title}
          </Animated.Text>
        ) : null}
        {subtitle ? (
          <Animated.Text
            entering={
              reduceMotion ? undefined : FadeInUp.delay(80).duration(320)
            }
            style={{
              color: colors.text.secondary,
              fontSize: 16,
              lineHeight: 22,
              marginTop: 12,
            }}
          >
            {subtitle}
          </Animated.Text>
        ) : null}
        <View style={{ marginTop: 28 }}>{children}</View>
      </ScrollView>
      {footer ? (
        <View
          style={{
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 24,
            paddingTop: 16,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
