/**
 * Onboarding Layout - Shared layout wrapper for all onboarding screens
 */

import { View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressDots } from './ProgressDots';
import { CTAButton } from './CTAButton';
import type { OnboardingStep } from '../types';
import { ONBOARDING_COLORS } from '../constants';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: OnboardingStep;
  ctaTitle: string;
  onCtaPress: () => void;
  ctaDisabled?: boolean;
  style?: ViewStyle;
}

export function OnboardingLayout({
  children,
  currentStep,
  ctaTitle,
  onCtaPress,
  ctaDisabled,
  style,
}: OnboardingLayoutProps) {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[ONBOARDING_COLORS.background.start, ONBOARDING_COLORS.background.end]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <View style={[{ flex: 1, paddingHorizontal: 24 }, style]}>
            {/* Main content */}
            <View style={{ flex: 1, paddingTop: 36 }}>
              {children}
            </View>

            {/* Footer with progress and CTA */}
            <View style={{ paddingBottom: 24, gap: 16 }}>
              <ProgressDots currentStep={currentStep} />
              <CTAButton
                title={ctaTitle}
                onPress={onCtaPress}
                disabled={ctaDisabled}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
