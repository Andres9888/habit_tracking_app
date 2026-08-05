import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ButtonSize } from '../Button/types';
import Button from '../Button/Button';
import { QUICK_START_TEMPLATES } from './constants';
import { styles } from './styles';
import { TemplateChip } from './TemplateChip';
import type { QuickStartTemplate } from './types';

interface EmptyStateActionsProps {
  ctaLabel: string;
  ctaStyle: object;
  descriptionStyle: object;
  hideCTA: boolean;
  onCTA?: () => void;
  onQuickStart?: (template: QuickStartTemplate) => void;
  showQuickStart: boolean;
  buttonSize: ButtonSize;
}

export function EmptyStateActions({
  buttonSize,
  ctaLabel,
  ctaStyle,
  descriptionStyle,
  hideCTA,
  onCTA,
  onQuickStart,
  showQuickStart,
}: EmptyStateActionsProps) {
  return (
    <>
      {showQuickStart && onQuickStart ? (
        <Animated.View style={[styles.quickStartSection, descriptionStyle]}>
          <View style={styles.templateRow}>
            {QUICK_START_TEMPLATES.map((template) => (
              <TemplateChip
                key={template.name}
                template={template}
                onPress={onQuickStart}
              />
            ))}
          </View>
        </Animated.View>
      ) : null}
      {!hideCTA && onCTA ? (
        <Animated.View style={ctaStyle}>
          <Button
            accessibilityHint={`Tap to ${ctaLabel.toLowerCase()}`}
            accessibilityLabel={ctaLabel}
            size={buttonSize}
            variant='primary'
            onPress={onCTA}
          >
            {ctaLabel}
          </Button>
        </Animated.View>
      ) : null}
    </>
  );
}
