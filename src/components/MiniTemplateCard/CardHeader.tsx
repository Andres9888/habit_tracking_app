/**
 * Card header sub-component for MiniTemplateCard
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronRight, FlaskConical, Lock } from 'lucide-react-native';
import { styles } from './MiniTemplateCard.styles';

interface CardHeaderProps {
  icon: string;
  iconColor: string;
  hasResearch?: boolean;
  isPremium?: boolean;
  chevronStyle: object;
  scienceBadgeStyle: object;
}

export function CardHeader({
  icon,
  iconColor,
  hasResearch,
  isPremium,
  chevronStyle,
  scienceBadgeStyle,
}: CardHeaderProps) {
  return (
    <View style={styles.topRow}>
      <View style={styles.iconWrapper}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
        >
          <Text style={styles.icon}>{icon}</Text>
        </View>
        {hasResearch && (
          <Animated.View
            accessibilityLabel='Science-backed habit'
            style={[styles.scienceBadge, scienceBadgeStyle]}
          >
            <FlaskConical color='#fff' size={10} strokeWidth={2.5} />
          </Animated.View>
        )}
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Lock color='#fff' size={8} strokeWidth={3} />
          </View>
        )}
      </View>
      <Animated.View
        accessibilityLabel='View details'
        style={[styles.chevronContainer, chevronStyle]}
      >
        <ChevronRight color='#a8a29e' size={16} strokeWidth={2.5} />
      </Animated.View>
    </View>
  );
}
