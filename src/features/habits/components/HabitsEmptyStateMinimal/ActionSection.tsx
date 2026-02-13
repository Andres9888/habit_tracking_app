import { View } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { CtaButton } from './CtaButton';
import { ErrorMessage } from './ErrorMessage';
import { InlineHint } from './InlineHint';

interface ActionSectionProps {
  inputValue: string;
  isCreating: boolean;
  errorMessage: string | null;
  isKeyboardVisible: boolean;
  secondaryLinksAnimatedStyle: AnimatedStyle;
  onCreateHabit: () => void | Promise<void>;
  onDismissError: () => void;
  onBrowseTemplates?: () => void;
  onCreateCustom?: () => void;
}

export function ActionSection({
  inputValue,
  isCreating,
  errorMessage,
  isKeyboardVisible,
  secondaryLinksAnimatedStyle,
  onCreateHabit,
  onDismissError,
  onBrowseTemplates,
  onCreateCustom,
}: ActionSectionProps) {
  return (
    <>
      <View style={{ maxWidth: 343, width: '100%' }}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.cta}>
          <CtaButton
            disabled={!inputValue.trim()}
            isLoading={isCreating}
            onPress={onCreateHabit}
          />
        </AnimatedEntrance>
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
