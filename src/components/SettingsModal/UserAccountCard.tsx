/* eslint-disable max-lines */
/**
 * UserAccountCard Component
 *
 * Displays user profile information with avatar, subscription badge,
 * and quick actions for managing subscription and signing out.
 * Features a premium gradient border for visual emphasis.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SETTINGS_COLORS } from './types';
import type { UserAccountCardProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionRowProps {
  icon: string;
  label: string;
  onPress: () => void;
  isFirst?: boolean;
  isLoading?: boolean;
  variant?: 'default' | 'danger';
}

function ActionRow({
  icon,
  label,
  onPress,
  isFirst = false,
  isLoading = false,
  variant = 'default',
}: ActionRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole='button'
      disabled={isLoading}
      style={[
        styles.actionRow,
        !isFirst && styles.actionRowBorder,
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        style={[
          styles.actionIcon,
          variant === 'danger' && styles.actionIconDanger,
        ]}
      >
        <Text style={styles.actionIconText}>{icon}</Text>
      </View>
      <Text
        style={[
          styles.actionLabel,
          variant === 'danger' && styles.actionLabelDanger,
        ]}
      >
        {isLoading ? 'Loading...' : label}
      </Text>
      {isLoading ? (
        <ActivityIndicator color={SETTINGS_COLORS.textSecondary} size='small' />
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </AnimatedPressable>
  );
}

export function UserAccountCard({
  user,
  subscription,
  onManageSubscription,
  onSignOut,
  isSigningOut = false,
}: UserAccountCardProps) {
  const showBadge = subscription !== 'free';
  const badgeLabel = subscription === 'pro' ? 'Pro' : 'Trial';
  const badgeStyle =
    subscription === 'trial'
      ? styles.subscriptionTrial
      : styles.subscriptionBadge;

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.avatarInitial}</Text>
        </View>
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.name}>
            {user.name}
          </Text>
          <Text numberOfLines={1} style={styles.email}>
            {user.email}
          </Text>
        </View>
        {showBadge && (
          <View style={badgeStyle}>
            <Text style={styles.subscriptionIcon}>✨</Text>
            <Text style={styles.subscriptionText}>{badgeLabel}</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <ActionRow
        isFirst
        icon='🔑'
        label='Manage Subscription'
        onPress={onManageSubscription}
      />
      <ActionRow
        icon='🚪'
        isLoading={isSigningOut}
        label={isSigningOut ? 'Signing Out...' : 'Sign Out'}
        onPress={onSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  actionIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  actionIconText: {
    fontSize: 14,
  },
  actionLabel: {
    color: SETTINGS_COLORS.textPrimary,
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  actionLabelDanger: {
    color: SETTINGS_COLORS.textDanger,
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionRowBorder: {
    borderTopColor: SETTINGS_COLORS.cardBorder,
    borderTopWidth: 1,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: SETTINGS_COLORS.accent,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  avatarText: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '600',
  },
  chevron: {
    color: SETTINGS_COLORS.textTertiary,
    fontSize: 18,
  },
  container: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  email: {
    color: '#a5b4fc',
    fontSize: 14,
    marginTop: 2,
  },
  name: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  subscriptionBadge: {
    alignItems: 'center',
    backgroundColor: SETTINGS_COLORS.success,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subscriptionIcon: {
    fontSize: 12,
  },
  subscriptionText: {
    color: SETTINGS_COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  subscriptionTrial: {
    alignItems: 'center',
    backgroundColor: SETTINGS_COLORS.warning,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  userInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: SETTINGS_COLORS.cardBorder,
    gap: 14,
    borderBottomWidth: 1,
    padding: 16,
  },
});
