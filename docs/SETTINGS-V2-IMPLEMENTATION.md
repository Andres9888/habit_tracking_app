# Settings v2 — Component Implementation Plan

**Ready-to-implement code samples and patterns**

---

## 📁 File Changes Summary

| File                      | Action   | Lines |
| ------------------------- | -------- | ----- |
| `SettingsSection.tsx`     | NEW      | ~80   |
| `SettingsRow.tsx`         | REFACTOR | ~150  |
| `SettingsToggle.tsx`      | NEW      | ~70   |
| `SettingsGrid.tsx`        | NEW      | ~90   |
| `AccountCard.tsx`         | NEW      | ~100  |
| `DeleteAccountModal.tsx`  | NEW      | ~120  |
| `NotificationsScreen.tsx` | NEW      | ~200  |
| `AppearanceScreen.tsx`    | NEW      | ~180  |
| `constants.ts`            | UPDATE   | ~80   |
| `styles.ts`               | UPDATE   | ~150  |
| `types.ts`                | UPDATE   | ~60   |

**Total: ~1,280 lines of production code**

---

## 1️⃣ SettingsSection.tsx

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useReducedMotion,
} from 'react-native-reanimated';

interface SettingsSectionProps {
  title: string;
  icon?: string;
  variant?: 'default' | 'danger';
  index?: number;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  icon,
  variant = 'default',
  index = 0,
  children,
}: SettingsSectionProps) {
  const reducedMotion = useReducedMotion();
  const delay = reducedMotion ? 0 : index * 50;

  return (
    <Animated.View
      entering={
        reducedMotion ? undefined : FadeInDown.delay(delay).duration(300)
      }
      style={styles.container}
    >
      <View style={styles.header}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text
          style={[styles.title, variant === 'danger' && styles.titleDanger]}
          accessibilityRole='header'
        >
          {title}
        </Text>
      </View>
      <View style={[styles.card, variant === 'danger' && styles.cardDanger]}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 8,
  },
  icon: {
    fontSize: 16,
  },
  title: {
    color: '#8b8ba7',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  titleDanger: {
    color: '#f87171',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  cardDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
});
```

---

## 2️⃣ SettingsRow.tsx (Refactored)

```tsx
import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SettingsToggle } from './SettingsToggle';

const ICON_COLORS = {
  blue: 'rgba(59, 130, 246, 0.2)',
  green: 'rgba(34, 197, 94, 0.2)',
  purple: 'rgba(139, 92, 246, 0.2)',
  orange: 'rgba(249, 115, 22, 0.2)',
  pink: 'rgba(236, 72, 153, 0.2)',
  gray: 'rgba(107, 114, 128, 0.2)',
  red: 'rgba(239, 68, 68, 0.2)',
  yellow: 'rgba(234, 179, 8, 0.2)',
  indigo: 'rgba(99, 102, 241, 0.2)',
  cyan: 'rgba(34, 211, 238, 0.2)',
} as const;

type IconColor = keyof typeof ICON_COLORS;

interface SettingsRowBaseProps {
  icon: string;
  iconColor: IconColor;
  label: string;
  description?: string;
  badge?: 'pro' | 'new';
  disabled?: boolean;
  isFirst?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

interface SettingsRowNavigationProps extends SettingsRowBaseProps {
  type: 'navigation' | 'action';
  value?: string;
  onPress: () => void;
}

interface SettingsRowToggleProps extends SettingsRowBaseProps {
  type: 'toggle';
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

type SettingsRowProps = SettingsRowNavigationProps | SettingsRowToggleProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SettingsRow(props: SettingsRowProps) {
  const {
    icon,
    iconColor,
    label,
    description,
    badge,
    disabled = false,
    isFirst = false,
    accessibilityLabel,
    accessibilityHint,
    type,
  } = props;

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
    if (disabled) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (type === 'navigation' || type === 'action') {
      (props as SettingsRowNavigationProps).onPress();
    }
  }, [disabled, type, props]);

  const handleToggle = useCallback(
    (value: boolean) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (type === 'toggle') {
        (props as SettingsRowToggleProps).onToggle(value);
      }
    },
    [type, props]
  );

  const rowAccessibilityLabel =
    accessibilityLabel ??
    (type === 'toggle'
      ? label
      : `${label}${
          (props as SettingsRowNavigationProps).value
            ? `, ${(props as SettingsRowNavigationProps).value}`
            : ''
        }`);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={type !== 'toggle' ? handlePress : undefined}
      style={[
        styles.container,
        !isFirst && styles.containerBorder,
        disabled && styles.containerDisabled,
        animatedStyle,
      ]}
      accessibilityRole={type === 'toggle' ? 'switch' : 'button'}
      accessibilityLabel={rowAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={
        type === 'toggle'
          ? { checked: (props as SettingsRowToggleProps).isEnabled }
          : undefined
      }
      disabled={disabled}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: ICON_COLORS[iconColor] },
        ]}
      >
        <Text style={styles.iconEmoji}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, disabled && styles.labelDisabled]}>
            {label}
          </Text>
          {badge && (
            <View style={[styles.badge, badge === 'pro' && styles.badgePro]}>
              <Text style={styles.badgeText}>{badge.toUpperCase()}</Text>
            </View>
          )}
        </View>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      {/* Right Side */}
      {type === 'toggle' ? (
        <SettingsToggle
          isEnabled={(props as SettingsRowToggleProps).isEnabled}
          onToggle={handleToggle}
          disabled={disabled}
        />
      ) : (
        <>
          {(props as SettingsRowNavigationProps).value && (
            <Text style={styles.value}>
              {(props as SettingsRowNavigationProps).value}
            </Text>
          )}
          <Text style={styles.chevron}>›</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    gap: 14,
  },
  containerBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  labelDisabled: {
    color: '#6b7280',
  },
  description: {
    color: '#8b8ba7',
    fontSize: 13,
    marginTop: 2,
  },
  value: {
    color: '#8b8ba7',
    fontSize: 15,
  },
  chevron: {
    color: '#6b7280',
    fontSize: 18,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePro: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  badgeText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
```

---

## 3️⃣ SettingsToggle.tsx

```tsx
import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';

interface SettingsToggleProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggle({
  isEnabled,
  onToggle,
  disabled = false,
}: SettingsToggleProps) {
  const progress = useSharedValue(isEnabled ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isEnabled ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [isEnabled, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.15)', '#6366f1']
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 20 }],
  }));

  const handlePress = useCallback(() => {
    if (!disabled) {
      onToggle(!isEnabled);
    }
  }, [disabled, isEnabled, onToggle]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole='switch'
      accessibilityState={{ checked: isEnabled, disabled }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

---

## 4️⃣ SettingsGrid.tsx

```tsx
import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface GridOption {
  id: string;
  emoji: string;
  label: string;
}

interface SettingsGridProps {
  options: GridOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  columns?: 3 | 4;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function GridOption({
  option,
  isSelected,
  onSelect,
}: {
  option: GridOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  }, [onSelect]);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[
        styles.option,
        isSelected && styles.optionSelected,
        animatedStyle,
      ]}
      accessibilityRole='radio'
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={option.label}
    >
      <Text style={styles.emoji}>{option.emoji}</Text>
      <Text style={styles.label}>{option.label}</Text>
    </AnimatedPressable>
  );
}

export function SettingsGrid({
  options,
  selectedId,
  onSelect,
  columns = 3,
}: SettingsGridProps) {
  return (
    <View
      style={[styles.grid, { flexWrap: 'wrap' }]}
      accessibilityRole='radiogroup'
    >
      {options.map((option) => (
        <View
          key={option.id}
          style={{ width: `${100 / columns}%`, padding: 4 }}
        >
          <GridOption
            option={option}
            isSelected={option.id === selectedId}
            onSelect={() => onSelect(option.id)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    padding: 12,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  label: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});
```

---

## 5️⃣ AccountCard.tsx

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SettingsRow } from './SettingsRow';

interface AccountCardProps {
  user: {
    name: string;
    email: string;
    avatarInitial: string;
  };
  subscription: 'free' | 'pro' | 'trial';
  onManageSubscription: () => void;
  onSignOut: () => void;
}

export function AccountCard({
  user,
  subscription,
  onManageSubscription,
  onSignOut,
}: AccountCardProps) {
  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.avatarInitial}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        {subscription !== 'free' && (
          <View
            style={[
              styles.subscriptionBadge,
              subscription === 'trial' && styles.subscriptionTrial,
            ]}
          >
            <Text style={styles.subscriptionIcon}>✨</Text>
            <Text style={styles.subscriptionText}>
              {subscription === 'pro' ? 'Pro' : 'Trial'}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <SettingsRow
        icon='🔑'
        iconColor='indigo'
        label='Manage Subscription'
        type='navigation'
        onPress={onManageSubscription}
      />
      <SettingsRow
        icon='🚪'
        iconColor='gray'
        label='Sign Out'
        type='navigation'
        onPress={onSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  email: {
    color: '#a5b4fc',
    fontSize: 14,
    marginTop: 2,
  },
  subscriptionBadge: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  subscriptionTrial: {
    backgroundColor: '#f59e0b',
  },
  subscriptionIcon: {
    fontSize: 12,
  },
  subscriptionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});
```

---

## 6️⃣ DeleteAccountModal.tsx

```tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface DeleteAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stats: {
    habitsCount: number;
    totalDays: number;
  };
  isLoading?: boolean;
}

export function DeleteAccountModal({
  isVisible,
  onClose,
  onConfirm,
  stats,
  isLoading = false,
}: DeleteAccountModalProps) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfirming(true);
    await onConfirm();
    setConfirming(false);
  };

  const handleCancel = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType='fade'>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          style={styles.modal}
        >
          {/* Warning Icon */}
          <Text style={styles.icon}>⚠️</Text>

          {/* Title */}
          <Text style={styles.title}>Delete Account?</Text>

          {/* Description */}
          <Text style={styles.description}>
            This will permanently delete all your habits, streaks, and progress.
            This action cannot be undone.
          </Text>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>What you'll lose:</Text>
            <Text style={styles.statItem}>
              • {stats.habitsCount} habits tracked
            </Text>
            <Text style={styles.statItem}>
              • {stats.totalDays} days of progress
            </Text>
            <Text style={styles.statItem}>• All streaks & achievements</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              onPress={handleDelete}
              disabled={isLoading || confirming}
              style={[
                styles.deleteButton,
                (isLoading || confirming) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.deleteButtonText}>
                {confirming ? 'Deleting...' : 'Delete Forever'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCancel}
              disabled={isLoading || confirming}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Keep My Account</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#1a1a3e',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  icon: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: '#f87171',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statsLabel: {
    color: '#8b8ba7',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statItem: {
    color: '#f87171',
    fontSize: 14,
    marginBottom: 6,
  },
  buttons: {
    gap: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
```

---

## 7️⃣ constants.ts (Settings Definitions)

```tsx
export const SETTINGS_SECTIONS = {
  account: {
    id: 'account',
    title: 'Account',
    icon: '👤',
  },
  notifications: {
    id: 'notifications',
    title: 'Notifications',
    icon: '🔔',
  },
  appearance: {
    id: 'appearance',
    title: 'Appearance',
    icon: '🎨',
  },
  app: {
    id: 'app',
    title: 'App',
    icon: '📱',
  },
  legal: {
    id: 'legal',
    title: 'Legal',
    icon: '📋',
  },
  data: {
    id: 'data',
    title: 'Data',
    icon: '💾',
  },
  danger: {
    id: 'danger',
    title: 'Danger Zone',
    icon: '⚠️',
    variant: 'danger',
  },
} as const;

export const THEME_OPTIONS = [
  { id: 'light', emoji: '☀️', label: 'Light' },
  { id: 'dark', emoji: '🌙', label: 'Dark' },
  { id: 'system', emoji: '📱', label: 'System' },
];

export const COMPLETION_ICON_OPTIONS = [
  { id: 'check', emoji: '✓', label: 'Check' },
  { id: 'chain', emoji: '🔗', label: 'Chain' },
  { id: 'star', emoji: '⭐', label: 'Star' },
];

export const DAY_SHAPE_OPTIONS = [
  { id: 'square', emoji: '⬜', label: 'Square' },
  { id: 'circle', emoji: '⚫', label: 'Circle' },
  { id: 'diamond', emoji: '🔷', label: 'Diamond' },
];

export const LEGAL_LINKS = {
  privacy: 'https://andres9888.github.io/chainday-landing/privacy.html',
  terms: 'https://andres9888.github.io/chainday-landing/terms.html',
};
```

---

## 8️⃣ Main SettingsScreen Implementation

```tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { usePremium } from '@/hooks/usePremium';
import { useNavigation } from '@react-navigation/native';
import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import { AccountCard } from './AccountCard';
import { DeleteAccountModal } from './DeleteAccountModal';
import { SETTINGS_SECTIONS, LEGAL_LINKS } from './constants';
import * as Application from 'expo-application';

export function SettingsScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { subscriptionStatus } = usePremium();
  const settings = useSettings();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleRateApp = () => {
    // Platform-specific store link
  };

  const handleShare = () => {
    // Share sheet
  };

  const handleSupport = () => {
    // Email composer
  };

  const handleDeleteAccount = async () => {
    // API call to delete account
    await signOut();
  };

  const appVersion = `${Application.nativeApplicationVersion} (Build ${Application.nativeBuildVersion})`;

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Account */}
        <SettingsSection {...SETTINGS_SECTIONS.account} index={0}>
          <AccountCard
            user={{
              name: user?.name ?? 'User',
              email: user?.email ?? '',
              avatarInitial: user?.name?.[0]?.toUpperCase() ?? 'U',
            }}
            subscription={subscriptionStatus}
            onManageSubscription={() => {
              /* RevenueCat sheet */
            }}
            onSignOut={signOut}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection {...SETTINGS_SECTIONS.notifications} index={1}>
          <SettingsRow
            icon='📱'
            iconColor='purple'
            label='Push Notifications'
            description='Daily reminders'
            type='toggle'
            isEnabled={settings.notificationsEnabled}
            onToggle={settings.setNotificationsEnabled}
            isFirst
          />
          <SettingsRow
            icon='⏰'
            iconColor='orange'
            label='Default Reminder Time'
            value={settings.formatReminderTime()}
            type='navigation'
            onPress={() => navigation.navigate('NotificationsSettings')}
          />
          <SettingsRow
            icon='🎉'
            iconColor='yellow'
            label='Milestone Alerts'
            description='7, 30, 100 day celebrations'
            type='toggle'
            isEnabled={settings.milestoneAlerts}
            onToggle={settings.setMilestoneAlerts}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection {...SETTINGS_SECTIONS.appearance} index={2}>
          <SettingsRow
            icon='🌙'
            iconColor='blue'
            label='Theme'
            value={settings.theme}
            type='navigation'
            onPress={() => navigation.navigate('AppearanceSettings')}
            isFirst
          />
          <SettingsRow
            icon='✅'
            iconColor='green'
            label='Completion Icon'
            value={settings.completionIconLabel}
            type='navigation'
            onPress={() => navigation.navigate('AppearanceSettings')}
          />
          <SettingsRow
            icon='📊'
            iconColor='cyan'
            label='Show Progress Bar'
            type='toggle'
            isEnabled={settings.showProgressBar}
            onToggle={settings.setShowProgressBar}
          />
        </SettingsSection>

        {/* App */}
        <SettingsSection {...SETTINGS_SECTIONS.app} index={3}>
          <SettingsRow
            icon='⭐'
            iconColor='yellow'
            label='Rate Chain Day'
            description='Help others discover us'
            type='navigation'
            onPress={handleRateApp}
            isFirst
          />
          <SettingsRow
            icon='💝'
            iconColor='pink'
            label='Share with Friends'
            type='navigation'
            onPress={handleShare}
          />
          <SettingsRow
            icon='💬'
            iconColor='blue'
            label='Contact Support'
            type='navigation'
            onPress={handleSupport}
          />
        </SettingsSection>

        {/* Legal */}
        <SettingsSection {...SETTINGS_SECTIONS.legal} index={4}>
          <SettingsRow
            icon='🔒'
            iconColor='gray'
            label='Privacy Policy'
            type='navigation'
            onPress={() => {
              /* WebView or browser */
            }}
            isFirst
          />
          <SettingsRow
            icon='📄'
            iconColor='gray'
            label='Terms of Service'
            type='navigation'
            onPress={() => {
              /* WebView or browser */
            }}
          />
        </SettingsSection>

        {/* Data */}
        <SettingsSection {...SETTINGS_SECTIONS.data} index={5}>
          <SettingsRow
            icon='📦'
            iconColor='green'
            label='Export Data'
            description='Download your habits & streaks'
            type='navigation'
            onPress={() => {
              /* Export flow */
            }}
            isFirst
          />
          <SettingsRow
            icon='📁'
            iconColor='gray'
            label='Archived Habits'
            value={String(settings.archivedCount)}
            type='navigation'
            onPress={() => navigation.navigate('ArchivedHabits')}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection
          {...SETTINGS_SECTIONS.danger}
          variant='danger'
          index={6}
        >
          <SettingsRow
            icon='🗑️'
            iconColor='red'
            label='Delete Account'
            description='Permanently remove all data'
            type='action'
            onPress={() => setDeleteModalVisible(true)}
            isFirst
          />
        </SettingsSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔗 Chain Day v{appVersion}</Text>
        </View>
      </ScrollView>

      <DeleteAccountModal
        isVisible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        stats={{
          habitsCount: settings.totalHabitsCount,
          totalDays: settings.totalDaysTracked,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: 8,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 13,
  },
});
```

---

## 🚀 Implementation Order

1. **Week 1 (Core Components)**
   - [ ] SettingsSection
   - [ ] SettingsToggle
   - [ ] SettingsRow (refactor)
   - [ ] SettingsGrid

2. **Week 1 (Account)**
   - [ ] AccountCard
   - [ ] RevenueCat subscription integration

3. **Week 2 (Screens)**
   - [ ] NotificationsScreen
   - [ ] AppearanceScreen
   - [ ] DeleteAccountModal

4. **Week 2 (Polish)**
   - [ ] Animations tuning
   - [ ] Accessibility testing
   - [ ] Manual QA

---

## 📝 PR Checklist

- [ ] All components have TypeScript types
- [ ] All interactive elements have haptic feedback
- [ ] Accessibility labels on all rows
- [ ] Unit tests for each component
- [ ] Storybook stories (optional)
- [ ] Screenshot for PR description

---

_Implementation plan by: Settings v2 Subagent_  
_Ready for development: 2026-02-04_
