/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/**
 * SettingsContent Component
 *
 * Main scrollable content area for Settings v2.
 * Organizes settings into logical sections:
 * - Account (user info, subscription, sign out)
 * - Notifications (push, reminders, milestones)
 * - Appearance (theme, icons, progress bar)
 * - App (rate, share, support)
 * - Legal (privacy, terms)
 * - Data (export, archived habits)
 * - Danger Zone (delete account)
 */

import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  Alert,
  Linking,
  Platform,
  Share,
  StyleSheet,
} from 'react-native';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { usePremium } from '../../hooks/usePremium';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import * as Application from 'expo-application';
import * as Haptics from 'expo-haptics';

import { SettingsSection } from './SettingsSection';
import { SettingsRow } from './SettingsRow';
import { UserAccountCard } from './UserAccountCard';
import { DeleteAccountModal } from './DeleteAccountModal';
import {
  SETTINGS_SECTIONS,
  LEGAL_LINKS,
  APP_STORE_URL,
  SUPPORT_EMAIL,
} from './constants';
import { SETTINGS_COLORS } from './types';
import type { SettingsContentProps } from './types';

export function SettingsContent({
  dayShape,
  habitCompletionIcon,
  showWeekCompletionBar,
  onChangeDayShape,
  onChangeHabitCompletionIcon,
  onChangeShowWeekCompletionBar,
  onOpenArchivedHabits,
  onClose,
}: SettingsContentProps) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { status: subscriptionStatus, managementUrl } = usePremium();

  // State
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);

  // Get habit stats for delete modal
  const habits = useQuery(api.habits.list) ?? [];
  const habitsCount = habits.length;
  const totalDays = habits.reduce((acc, h) => acc + (h.currentStreak ?? 0), 0);

  // User info
  const userName = user?.firstName ?? user?.username ?? 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? '';
  const avatarInitial = userName.charAt(0).toUpperCase();

  // Subscription status for account card
  const getSubscriptionType = () => {
    if (subscriptionStatus === 'active') return 'pro';
    if (subscriptionStatus === 'trialing') return 'trial';
    return 'free';
  };

  // Handlers
  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { style: 'cancel', text: 'Cancel' },
      {
        onPress: () => {
          setIsSigningOut(true);
          void signOut()
            .then(() => {
              void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              onClose();
            })
            .catch(() => {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            })
            .finally(() => setIsSigningOut(false));
        },
        style: 'destructive',
        text: 'Sign Out',
      },
    ]);
  }, [signOut, onClose]);

  const handleManageSubscription = useCallback(() => {
    if (managementUrl) {
      void Linking.openURL(managementUrl);
    } else {
      // Fallback: try to open app store subscriptions
      if (Platform.OS === 'ios') {
        void Linking.openURL(
          'itms-apps://apps.apple.com/account/subscriptions'
        );
      } else {
        void Linking.openURL(
          'https://play.google.com/store/account/subscriptions'
        );
      }
    }
  }, [managementUrl]);

  const handleDeleteAccount = useCallback(async () => {
    // In a real app, this would call a Convex mutation to delete user data
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // For now, just sign out after showing the confirmation
    await signOut();
    setDeleteModalVisible(false);
    onClose();
  }, [signOut, onClose]);

  const handleRateApp = useCallback(() => {
    void (async () => {
      if (Platform.OS === 'ios') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const StoreReview = require('expo-store-review') as {
            hasAction: () => Promise<boolean>;
            requestReview: () => Promise<void>;
          };
          if (await StoreReview.hasAction()) {
            await StoreReview.requestReview();
            return;
          }
        } catch {
          // Fall through to open URL
        }
      }
      void Linking.openURL(APP_STORE_URL);
    })();
  }, []);

  const handleShare = useCallback(() => {
    void Share.share({
      message:
        'Building great habits with Chain Day! 🔗 Download it here: ' +
        APP_STORE_URL,
      title: 'Chain Day - Habit Tracker',
    });
  }, []);

  const handleSupport = useCallback(() => {
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Chain Day Support`);
  }, []);

  const handleOpenUrl = useCallback(
    (url: string) => () => {
      void Linking.openURL(url);
    },
    []
  );

  const handleToggleNotifications = useCallback((value: boolean) => {
    setNotificationsEnabled(value);
    // In a real app, this would update notification permissions
  }, []);

  const handleToggleMilestones = useCallback((value: boolean) => {
    setMilestoneAlerts(value);
    // In a real app, this would update user preferences
  }, []);

  // App version
  const appVersion = Application.nativeApplicationVersion ?? '1.0.0';
  const buildNumber = Application.nativeBuildVersion ?? '1';

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        {/* Account Section */}
        <SettingsSection {...SETTINGS_SECTIONS.account} index={0}>
          <UserAccountCard
            isSigningOut={isSigningOut}
            subscription={getSubscriptionType()}
            user={{
              avatarInitial,
              email: userEmail,
              name: userName,
            }}
            onManageSubscription={handleManageSubscription}
            onSignOut={handleSignOut}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection {...SETTINGS_SECTIONS.notifications} index={1}>
          <SettingsRow
            isFirst
            description='Daily reminders'
            icon='📱'
            iconColor='purple'
            isEnabled={notificationsEnabled}
            label='Push Notifications'
            type='toggle'
            onToggle={handleToggleNotifications}
          />
          <SettingsRow
            description='7, 30, 100 day celebrations'
            icon='🎉'
            iconColor='yellow'
            isEnabled={milestoneAlerts}
            label='Milestone Alerts'
            type='toggle'
            onToggle={handleToggleMilestones}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection {...SETTINGS_SECTIONS.appearance} index={2}>
          <SettingsRow
            isFirst
            description='Daily completion progress'
            icon='📊'
            iconColor='green'
            isEnabled={showWeekCompletionBar}
            label='Show Progress Bar'
            type='toggle'
            onToggle={(value) => void onChangeShowWeekCompletionBar(value)}
          />
          <SettingsRow
            icon='✅'
            iconColor='blue'
            label='Completion Icon'
            type='navigation'
            value={habitCompletionIcon === 'chain' ? '🔗 Chain' : '☑️ Checkbox'}
            onPress={() => {
              void onChangeHabitCompletionIcon(
                habitCompletionIcon === 'chain' ? 'checkbox' : 'chain'
              );
            }}
          />
          <SettingsRow
            icon='⬜'
            iconColor='purple'
            label='Day Shape'
            type='navigation'
            value={dayShape === 'square' ? '◼️ Square' : '⚫ Circle'}
            onPress={() => {
              void onChangeDayShape(
                dayShape === 'square' ? 'circle' : 'square'
              );
            }}
          />
        </SettingsSection>

        {/* App Section */}
        <SettingsSection {...SETTINGS_SECTIONS.app} index={3}>
          <SettingsRow
            isFirst
            description='Help others discover us'
            icon='⭐'
            iconColor='yellow'
            label='Rate Chain Day'
            type='navigation'
            onPress={handleRateApp}
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

        {/* Legal Section */}
        <SettingsSection {...SETTINGS_SECTIONS.legal} index={4}>
          <SettingsRow
            isFirst
            icon='🔒'
            iconColor='gray'
            label='Privacy Policy'
            type='navigation'
            onPress={handleOpenUrl(LEGAL_LINKS.privacy)}
          />
          <SettingsRow
            icon='📄'
            iconColor='gray'
            label='Terms of Service'
            type='navigation'
            onPress={handleOpenUrl(LEGAL_LINKS.terms)}
          />
        </SettingsSection>

        {/* Data Section */}
        <SettingsSection {...SETTINGS_SECTIONS.data} index={5}>
          <SettingsRow
            isFirst
            description='Download your habits & streaks'
            icon='📦'
            iconColor='green'
            label='Export Data'
            type='navigation'
            onPress={() => {
              Alert.alert(
                'Coming Soon',
                'Data export will be available in a future update.'
              );
            }}
          />
          <SettingsRow
            icon='📁'
            iconColor='gray'
            label='Archived Habits'
            type='navigation'
            value={String(habits.filter((h) => h.archived).length)}
            onPress={onOpenArchivedHabits}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection
          {...SETTINGS_SECTIONS.danger}
          index={6}
          variant='danger'
        >
          <SettingsRow
            isFirst
            description='Permanently remove all data'
            icon='🗑️'
            iconColor='red'
            label='Delete Account'
            type='action'
            onPress={() => setDeleteModalVisible(true)}
          />
        </SettingsSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔗 Chain Day v{appVersion} ({buildNumber})
          </Text>
        </View>
      </ScrollView>

      <DeleteAccountModal
        isVisible={deleteModalVisible}
        stats={{
          habitsCount,
          totalDays,
        }}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SETTINGS_COLORS.background,
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: SETTINGS_COLORS.cardBorder,
    borderTopWidth: 1,
    marginTop: 8,
    paddingVertical: 16,
  },
  footerText: {
    color: SETTINGS_COLORS.textTertiary,
    fontSize: 13,
  },
});
