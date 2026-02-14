/**
 * MiniCardContainer Component
 * Pressable container with animations for MiniTemplateCard
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import Animated from 'react-native-reanimated';

import { CardHeader } from './CardHeader';
import { ImportButton } from './ImportButton';
import { styles } from './MiniTemplateCard.styles';
import { SUCCESS_COLOR } from './constants';
import type { MiniCardContainerProps } from './MiniCardContainer.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MiniCardContainer({
  name,
  description,
  icon,
  iconColor,
  hasAccess,
  hasResearch,
  isImporting,
  isImported,
  isPremium,
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
  // Determine if the card should be locked
  const isLocked = isPremium && !hasAccess;

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
          isLocked && styles.lockedCard,
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
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          {isLocked && (
            <View style={styles.lockIcon}>
              <Lock size={12} color="#6B7280" />
            </View>
          )}
        </View>
        {description && (
          <Text numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        )}
      </AnimatedPressable>
      {onImport && !isLocked && (
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
