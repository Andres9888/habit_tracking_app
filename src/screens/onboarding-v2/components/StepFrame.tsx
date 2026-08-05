import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { airy } from '@/theme/airyScale';
import { useThemeColors } from '@/theme/ThemeContext';

import { ProgressBar } from './ProgressBar';

interface StepFrameProps {
  canGoBack: boolean;
  children: ReactNode;
  currentStep: number;
  footer?: ReactNode;
  hideProgress?: boolean;
  onBack: () => void;
  totalSteps: number;
}

export function StepFrame({
  canGoBack,
  children,
  currentStep,
  footer,
  hideProgress = false,
  onBack,
  totalSteps,
}: StepFrameProps) {
  const { colors } = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {hideProgress ? (
        <View style={{ paddingTop: insets.top + 8 }} />
      ) : (
        <>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: airy.screenPadH,
              paddingTop: insets.top + 8,
            }}
          >
            <Pressable
              accessibilityLabel='Go back'
              accessibilityRole='button'
              hitSlop={12}
              onPress={onBack}
              style={{ opacity: canGoBack ? 1 : 0, padding: 8 }}
            >
              <Text style={{ color: colors.text.secondary, fontSize: 16 }}>
                ‹ Back
              </Text>
            </Pressable>
            <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
              {currentStep} / {totalSteps}
            </Text>
            <View style={{ width: 56 }} />
          </View>
          <ProgressBar current={currentStep} total={totalSteps} />
        </>
      )}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        {children}
      </View>
      {footer ? (
        <View
          style={{
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 24,
            paddingTop: 12,
          }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
