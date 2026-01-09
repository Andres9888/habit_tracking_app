/**
 * MiniCardContainer Component
 * Pressable container with animations for MiniTemplateCard
 */
import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import { CardHeader } from './CardHeader';
import { ImportButton } from './ImportButton';
import { styles } from './MiniTemplateCard.styles';
import { SUCCESS_COLOR } from './constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MiniCardContainerProps {
  name: string;
  description?: string;
  icon: string;
  iconColor: string;
  hasResearch?: boolean;
  isImporting?: boolean;
  isImported?: boolean;
  animatedCardStyle: ViewStyle;
  glowStyle: ViewStyle;
  chevronStyle: ViewStyle;
  scienceBadgeStyle: ViewStyle;
  importButtonStyle: ViewStyle;
  checkmarkStyle: ViewStyle;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onImport?: () => void;
}

export function MiniCardContainer({
  name,
  description,
  icon,
  iconColor,
  hasResearch,
  isImporting,
  isImported,
  animatedCardStyle,
  glowStyle,
  chevronStyle,
  scienceBadgeStyle,
  importButtonStyle,
  checkmarkStyle,
  onPress,
  onPressIn,
  onPressOut,
  onImport,
}: MiniCardContainerProps) {
  return (
    <AnimatedPressable
      accessible
      accessibilityLabel={`${name} template`}
      accessibilityRole='button'
      style={[
        styles.card,
        { backgroundColor: `${iconColor}08` },
        animatedCardStyle,
      ]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        pointerEvents='none'
        style={[
          styles.glowOverlay,
          { backgroundColor: SUCCESS_COLOR },
          glowStyle,
        ]}
      />
      <View
        style={[
          styles.accent,
          { backgroundColor: isImported ? SUCCESS_COLOR : iconColor },
        ]}
      />
      <CardHeader
        chevronStyle={chevronStyle}
        hasResearch={hasResearch}
        icon={icon}
        iconColor={iconColor}
        scienceBadgeStyle={scienceBadgeStyle}
      />
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
      {description && (
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      )}
      {onImport && (
        <ImportButton
          checkmarkStyle={checkmarkStyle}
          iconColor={iconColor}
          importButtonStyle={importButtonStyle}
          isImported={isImported}
          isImporting={isImporting}
          name={name}
          onImport={onImport}
        />
      )}
    </AnimatedPressable>
  );
}
