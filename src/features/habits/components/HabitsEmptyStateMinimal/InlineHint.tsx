import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { fontFamilies } from '@/theme/typography';
import { usePressAnimations } from './InlineHint.hooks';
import {
  accentStripeStyle,
  actionsColumnStyle,
  buildMyOwnLabelStyle,
  buildMyOwnRowStyle,
  getBuildMyOwnCardStyle,
} from './InlineHint.styles';
import { InlineHintDivider } from './InlineHintDivider';
import { TemplatesButton } from './TemplatesButton';
import { TEMPLATES_ENABLED } from '@/config/featureFlags';
import type { InlineHintProps } from './types';
import { useEmptyStateColors } from './useEmptyStateColors';

export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  const colors = useEmptyStateColors();
  const press = usePressAnimations();
  const buildMyOwnStyle = ({ pressed }: { pressed: boolean }) =>
    getBuildMyOwnCardStyle(pressed, {
      bg: colors.buildMyOwnCardBg,
      bgPressed: colors.buildMyOwnCardBgPressed,
      borderColor: colors.inputBorder,
    });

  return (
    <View style={{ alignSelf: 'stretch', marginTop: 12, width: '100%' }}>
      <InlineHintDivider />
      <View style={actionsColumnStyle} testID='inline-hint-actions'>
        {TEMPLATES_ENABLED && (
          <TemplatesButton
            animatedStyle={press.templatesAnimatedStyle}
            colors={colors}
            onPress={onBrowseTemplates}
            onPressIn={press.templatesPressIn}
            onPressOut={press.templatesPressOut}
          />
        )}
        <View style={{ width: '100%' }}>
          <Animated.View
            style={[{ width: '100%' }, press.buildMyOwnAnimatedStyle]}
          >
            <Pressable
              accessibilityHint='Opens full habit creation screen'
              accessibilityLabel='Create custom habit'
              accessibilityRole='button'
              style={buildMyOwnStyle}
              testID='inline-hint-create-custom'
              onPress={onCreateCustom}
              onPressIn={press.buildMyOwnPressIn}
              onPressOut={press.buildMyOwnPressOut}
            >
              <View style={buildMyOwnRowStyle}>
                <View
                  style={[
                    accentStripeStyle,
                    { backgroundColor: colors.accentStripeColor },
                  ]}
                  testID='inline-hint-accent-stripe'
                />
                <Text style={{ fontSize: 17 }}>✏️</Text>
                <Text
                  style={[
                    buildMyOwnLabelStyle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Build my own
                </Text>
                <Text
                  style={{
                    color: colors.textTertiary,
                    fontFamily: fontFamilies.primary.text,
                    fontSize: 13,
                  }}
                >
                  →
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
