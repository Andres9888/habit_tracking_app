/**
 * MiniCardContainer Component
 * Pressable container with animations for MiniTemplateCard
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Animated from 'react-native-reanimated';

import { CardHeader } from './CardHeader';
import { ImportButton } from './ImportButton';
import { styles } from './MiniTemplateCard.styles';
import { SUCCESS_COLOR } from './constants';
import type { MiniCardContainerProps } from './MiniCardContainer.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MiniCardContainer({
  name,
  subtitle,
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
    <View>
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
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {description && (
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        )}
      </AnimatedPressable>
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
    </View>
  );
}
