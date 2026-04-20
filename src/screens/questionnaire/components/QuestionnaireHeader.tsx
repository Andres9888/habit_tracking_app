import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '@/theme';

import type { QuestionnaireStep } from '../QuestionnaireFlow.types';
import { QuestionnaireProgress } from './QuestionnaireProgress';

interface Props {
  step: QuestionnaireStep;
  canGoBack?: boolean;
  onBack?: () => void;
}

export function QuestionnaireHeader({ step, canGoBack, onBack }: Props) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: insets.top + 12,
      }}
    >
      {canGoBack ? (
        <Pressable
          accessibilityLabel='Go back'
          accessibilityRole='button'
          hitSlop={12}
          onPress={onBack}
        >
          <Text style={{ color: colors.text.secondary, fontSize: 17 }}>‹</Text>
        </Pressable>
      ) : null}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <QuestionnaireProgress step={step} />
      </View>
    </View>
  );
}
