/**
 * Onboarding Layout - Shared layout wrapper for all onboarding screens
 */

import { useState } from 'react';
import { View, Text, Pressable, Modal, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
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
  onBack?: () => void;
  onSkip?: () => void;
  style?: ViewStyle;
}

export function OnboardingLayout({
  children,
  currentStep,
  ctaTitle,
  onCtaPress,
  ctaDisabled,
  onBack,
  onSkip,
  style,
}: OnboardingLayoutProps) {
  const [showSkipModal, setShowSkipModal] = useState(false);

  const handleSkipConfirm = () => {
    setShowSkipModal(false);
    onSkip?.();
  };

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
            {/* Header with Back and Skip buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, height: 44 }}>
              {/* Back Button */}
              {onBack ? (
                <Pressable
                  onPress={onBack}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 20, color: ONBOARDING_COLORS.text.primary }}>←</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: ONBOARDING_COLORS.text.primary,
                      fontWeight: '500',
                    }}
                  >
                    Back
                  </Text>
                </Pressable>
              ) : (
                <View />
              )}

              {/* Skip Button */}
              {onSkip && (
                <Pressable
                  onPress={() => setShowSkipModal(true)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: ONBOARDING_COLORS.text.secondary,
                      fontWeight: '500',
                    }}
                  >
                    Skip
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Main content */}
            <View style={{ flex: 1, paddingTop: 20 }}>
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

      {/* Skip Confirmation Modal */}
      <Modal
        visible={showSkipModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSkipModal(false)}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: 24 }}>
          <Animated.View
            entering={FadeIn.duration(200)}
            style={{
              width: '100%',
              backgroundColor: ONBOARDING_COLORS.background.end,
              borderRadius: 24,
              padding: 24,
            }}
          >
            {/* Modal Icon */}
            <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>⏭️</Text>

            {/* Modal Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: ONBOARDING_COLORS.text.primary,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Skip Setup?
            </Text>

            {/* Modal Message */}
            <Text
              style={{
                fontSize: 15,
                color: ONBOARDING_COLORS.text.secondary,
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 22,
              }}
            >
              You can customize your habits and reminders later in settings.
            </Text>

            {/* Modal Actions */}
            <View style={{ gap: 12 }}>
              <Pressable
                onPress={handleSkipConfirm}
                style={{
                  backgroundColor: ONBOARDING_COLORS.accent.primary,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: ONBOARDING_COLORS.text.primary,
                  }}
                >
                  Yes, Skip Setup
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowSkipModal(false)}
                style={{
                  backgroundColor: ONBOARDING_COLORS.surface.default,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: ONBOARDING_COLORS.text.secondary,
                  }}
                >
                  Continue Setup
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
