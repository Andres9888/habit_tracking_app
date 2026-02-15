import { StyleSheet, Text, View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { CtaButton } from './CtaButton';
import { ErrorMessage } from './ErrorMessage';
import { InlineHint } from './InlineHint';
import { QUICK_START_HABITS } from './constants';

interface ActionSectionProps {
  inputValue: string;
  isCreating: boolean;
  isQuickStarting?: boolean;
  errorMessage: string | null;
  isKeyboardVisible: boolean;
  secondaryLinksAnimatedStyle: AnimatedStyle;
  onCreateHabit: () => void;
  onDismissError: () => void;
  onBrowseTemplates?: () => void;
  onCreateCustom?: () => void;
  onQuickStart?: () => void;
}

const quickStartStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  container: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  habits: {
    color: '#57534E',
    fontSize: 13,
  },
  label: {
    color: '#047857',
    fontSize: 15,
    fontWeight: '600',
  },
});

export function ActionSection({
  inputValue,
  isCreating,
  isQuickStarting,
  errorMessage,
  isKeyboardVisible,
  secondaryLinksAnimatedStyle,
  onCreateHabit,
  onDismissError,
  onBrowseTemplates,
  onCreateCustom,
  onQuickStart,
}: ActionSectionProps) {
  return (
    <>
      <View style={{ maxWidth: 343, width: '100%' }}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.cta}>
          <CtaButton
            disabled={!inputValue.trim()}
            inputValue={inputValue}
            isLoading={isCreating}
            onPress={onCreateHabit}
          />
        </AnimatedEntrance>

        {/* Quick Start — pre-populate 3 common habits */}
        {onQuickStart && !isKeyboardVisible && (
          <AnimatedEntrance delay={ENTRANCE_DELAYS.cta + 80}>
            <View style={quickStartStyles.container}>
              <AnimatedPressable
                accessibilityHint='Creates Exercise, Read, and Meditate habits instantly'
                accessibilityLabel='Quick Start with 3 habits'
                accessibilityRole='button'
                disabled={isCreating || isQuickStarting}
                style={[
                  quickStartStyles.button,
                  (isCreating || isQuickStarting) && quickStartStyles.buttonDisabled,
                ]}
                onPress={onQuickStart}
              >
                <Text style={quickStartStyles.label}>
                  {isQuickStarting ? 'Setting up…' : '⚡ Quick Start'}
                </Text>
              </AnimatedPressable>
              <Text style={quickStartStyles.habits}>
                {QUICK_START_HABITS.map((h) => `${h.emoji} ${h.name}`).join('  ·  ')}
              </Text>
            </View>
          </AnimatedEntrance>
        )}
      </View>

      {errorMessage && (
        <ErrorMessage message={errorMessage} onDismiss={onDismissError} />
      )}

      <Animated.View
        accessibilityElementsHidden={isKeyboardVisible}
        importantForAccessibility={
          isKeyboardVisible ? 'no-hide-descendants' : 'auto'
        }
        style={secondaryLinksAnimatedStyle}
      >
        <AnimatedEntrance delay={ENTRANCE_DELAYS.secondaryLinks}>
          <InlineHint
            onBrowseTemplates={onBrowseTemplates ?? (() => {})}
            onCreateCustom={onCreateCustom ?? (() => {})}
          />
        </AnimatedEntrance>
      </Animated.View>
    </>
  );
}
