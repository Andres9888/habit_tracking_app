/**
 * FooterSection - Use template button and back button
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import Button from '../../Button/Button';
import { useThemeColors } from '../../../theme/ThemeContext';
import { footerStyles, themedFooterStyles } from '../styles';
import type { FooterSectionProps } from '../TemplateScienceModal.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FooterSection = ({
  animatedStyle,
  backButtonAnimatedStyle,
  baseColor,
  onBack,
  onUseTemplate,
  pressHandlers,
  templateName,
}: FooterSectionProps) => {
  const { colors, isDark } = useThemeColors();
  const themed = themedFooterStyles(colors);
  const bgRgba = isDark ? 'rgba(17, 24, 39,' : 'rgba(250, 250, 249,';

  return (
    <LinearGradient
      colors={[
        `${bgRgba} 0)`,
        `${bgRgba} 1)`,
        `${bgRgba} 1)`,
      ]}
      style={footerStyles.footerGradient}
    >
      <Animated.View style={[footerStyles.footer, animatedStyle]}>
        <Button
          fullWidth
          accessibilityHint='Creates a new habit based on this template'
          accessibilityLabel={`Use ${templateName} template`}
          size='large'
          style={[footerStyles.useButton, { backgroundColor: baseColor }]}
          variant='primary'
          onPress={onUseTemplate}
        >
          Use This Template
        </Button>
        <AnimatedPressable
          accessibilityLabel='Go back to import habits list'
          accessibilityRole='button'
          style={[footerStyles.backButton, backButtonAnimatedStyle]}
          onPress={onBack}
          {...pressHandlers}
        >
          <Text style={[footerStyles.backButtonText, themed.backButtonText]}>Back to Import Habits</Text>
        </AnimatedPressable>
      </Animated.View>
    </LinearGradient>
  );
};
