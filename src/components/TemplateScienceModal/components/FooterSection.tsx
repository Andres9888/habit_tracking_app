/**
 * FooterSection - Use template button and back button
 */

import React from 'react';
import { Text, Pressable } from 'react-native';

import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import type { FooterSectionProps } from '../TemplateScienceModal.types';
import Button from '../../Button/Button';
import { footerStyles } from '../styles';

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
  return (
    <LinearGradient
      colors={[
        'rgba(250, 250, 249, 0)',
        'rgba(250, 250, 249, 1)',
        'rgba(250, 250, 249, 1)',
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
          <Text style={footerStyles.backButtonText}>Back to Import Habits</Text>
        </AnimatedPressable>
      </Animated.View>
    </LinearGradient>
  );
};
