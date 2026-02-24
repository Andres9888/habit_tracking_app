import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { fontFamilies } from '@/theme/typography';
import { usePressAnimations } from './InlineHint.hooks';
import {
  accentStripeStyle,
  actionsColumnStyle,
  badgeContainerStyle,
  badgeTextStyle,
  buildMyOwnLabelStyle,
  getBuildMyOwnCardStyle,
  getTemplatesButtonStyle,
  templatesGradientStyle,
  templatesLabelStyle,
} from './InlineHint.styles';
import { InlineHintDivider } from './InlineHintDivider';
import type { InlineHintProps } from './types';
import { useEmptyStateColors } from './useEmptyStateColors';

const templatesButtonPressableStyle = ({ pressed }: { pressed: boolean }) =>
  getTemplatesButtonStyle(pressed);

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
    <View style={{ alignSelf: 'stretch', marginTop: 16, width: '100%' }}>
      <InlineHintDivider />
      <View style={actionsColumnStyle} testID='inline-hint-actions'>
        <View style={{ width: '100%' }}>
          <Animated.View style={[{ width: '100%' }, press.templatesAnimatedStyle]}>
            <Pressable
              accessibilityHint='Opens screen with pre-made habit templates'
              accessibilityLabel='Browse habit templates'
              accessibilityRole='button'
              style={templatesButtonPressableStyle}
              testID='inline-hint-browse-templates'
              onPress={onBrowseTemplates}
              onPressIn={press.templatesPressIn}
              onPressOut={press.templatesPressOut}
            >
              <LinearGradient
                colors={[...colors.gradientColors]}
                end={{ x: 1, y: 0.3 }}
                start={{ x: 0, y: 0 }}
                style={templatesGradientStyle}
              >
                <Text style={{ fontSize: 18 }}>📚</Text>
                <Text style={[templatesLabelStyle, { color: colors.ctaText }]}>
                  browse templates
                </Text>
                <View style={badgeContainerStyle} testID='inline-hint-badge'>
                  <Text style={[badgeTextStyle, { color: colors.ctaText }]}>
                    200+
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
        <View style={{ width: '100%' }}>
          <Animated.View style={[{ width: '100%' }, press.buildMyOwnAnimatedStyle]}>
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
              <View
                style={[
                  accentStripeStyle,
                  { backgroundColor: colors.accentStripeColor },
                ]}
                testID='inline-hint-accent-stripe'
              />
              <Text style={{ fontSize: 18 }}>✏️</Text>
              <Text
                style={[
                  buildMyOwnLabelStyle,
                  { color: colors.textSecondary },
                ]}
              >
                Build my own
              </Text>
              <Text style={{ color: colors.textTertiary, fontFamily: fontFamilies.primary.text, fontSize: 13 }}>
                →
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
