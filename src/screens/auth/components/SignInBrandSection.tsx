/**
 * SignInBrandSection - Logo, app name, and welcome message
 */

import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { styles } from '../SignInScreen.styles';

interface SignInBrandSectionProps {
  logoStyle: AnimatedStyle<ViewStyle>;
  headerStyle: AnimatedStyle<ViewStyle>;
}

export function SignInBrandSection({
  logoStyle,
  headerStyle,
}: SignInBrandSectionProps) {
  return (
    <>
      <View style={styles.brandSection}>
        <Animated.View style={[styles.iconContainer, logoStyle]}>
          <Link color='#1F2937' size={40} strokeWidth={2} />
        </Animated.View>
        <Animated.View style={headerStyle}>
          <Text style={styles.appName}>Chain Day</Text>
          <Text style={styles.tagline}>Don't break the chain</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.welcomeSection, headerStyle]}>
        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>
          Your habits are waiting. Let's keep the momentum going.
        </Text>
      </Animated.View>
    </>
  );
}
