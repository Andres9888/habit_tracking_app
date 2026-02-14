/**
 * SocialAccountabilitySection — Settings section for social sharing
 * Premium feature that allows users to share their habit progress
 * with friends via a public link.
 */

import { useState } from 'react';
import { Copy, Link2, RefreshCw, Share2, Crown } from 'lucide-react-native';
import { Alert, Clipboard, Platform, Text, View } from 'react-native';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import * as Linking from 'expo-linking';

interface SocialAccountabilitySectionProps {
  highContrastMode: boolean;
  isPremium: boolean;
  onPremiumUpsell?: () => void;
}

interface SharedDashboard {
  _id: string;
  shareToken: string;
  displayName?: string;
  isEnabled: boolean;
  enabledAt?: number;
}

export function SocialAccountabilitySection({
  highContrastMode,
  isPremium,
  onPremiumUpsell,
}: SocialAccountabilitySectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const sharedDashboard = useQuery(api.sharedDashboards.getMySharedDashboard);
  const createDashboard = useMutation(
    api.sharedDashboards.getOrCreateSharedDashboard
  );
  const toggleSharing = useMutation(api.sharedDashboards.toggleSharing);
  const regenerateToken = useMutation(
    api.sharedDashboards.regenerateShareToken
  );

  const handleCreateShareLink = async () => {
    if (!isPremium) {
      onPremiumUpsell?.();
      return;
    }

    try {
      setIsLoading(true);
      await createDashboard();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create share link'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSharing = async (enabled: boolean) => {
    if (!sharedDashboard) {
      if (enabled) {
        await handleCreateShareLink();
      }
      return;
    }

    try {
      setIsLoading(true);
      await toggleSharing({ enabled });
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to update sharing settings'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!sharedDashboard?.shareToken) return;

    const baseUrl = Linking.createURL('');
    // For web, we'd use the actual domain
    const shareUrl = `https://chainday.app/shared/${sharedDashboard.shareToken}`;
    Clipboard.setString(shareUrl);
    Alert.alert('Link Copied!', 'Share this link with your friends.');
  };

  const handleRegenerateToken = () => {
    Alert.alert(
      'Regenerate Link?',
      'This will create a new share link. The old link will stop working.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: async () => {
            try {
              setIsLoading(true);
              await regenerateToken();
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'Failed to regenerate link'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const hasDashboard = !!sharedDashboard;
  const isSharingEnabled = sharedDashboard?.isEnabled ?? false;

  // If not premium, show the upsell
  if (!isPremium) {
    return (
      <SettingsSection
        highContrastMode={highContrastMode}
        title='Social Accountability'
      >
        <SettingsRow
          highContrastMode={highContrastMode}
          icon={<Share2 color='#8b5cf6' size={16} />}
          iconBackgroundColor='#ede9fe'
          label='Share Your Progress'
          type='navigation'
          onPress={onPremiumUpsell}
        />
        <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text
            style={{
              color: '#78716c',
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            Share your habit progress with friends. Let them see your streaks
            and cheer you on!
          </Text>
        </View>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection
      highContrastMode={highContrastMode}
      title='Social Accountability'
    >
      {!hasDashboard ? (
        <>
          <SettingsRow
            highContrastMode={highContrastMode}
            icon={<Share2 color='#8b5cf6' size={16} />}
            iconBackgroundColor='#ede9fe'
            label='Create Share Link'
            type='navigation'
            onPress={handleCreateShareLink}
          />
          <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
            <Text
              style={{
                color: '#78716c',
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Share your habit progress with friends. Let them see your streaks
              and cheer you on!
            </Text>
          </View>
        </>
      ) : (
        <>
          <SettingsRow
            highContrastMode={highContrastMode}
            icon={<Link2 color='#8b5cf6' size={16} />}
            iconBackgroundColor='#ede9fe'
            label='Share Link Enabled'
            type='toggle'
            value={isSharingEnabled}
            onToggle={handleToggleSharing}
          />
          {isSharingEnabled && (
            <>
              <SettingsRow
                highContrastMode={highContrastMode}
                icon={<Copy color='#0284c7' size={16} />}
                iconBackgroundColor='#bae6fd'
                label='Copy Link'
                type='selection'
                value={`chainday.app/shared/...`}
                onPress={handleCopyLink}
              />
              <SettingsRow
                highContrastMode={highContrastMode}
                icon={<RefreshCw color='#ea580c' size={16} />}
                iconBackgroundColor='#fed7aa'
                label='Regenerate Link'
                showBorder={false}
                type='navigation'
                onPress={handleRegenerateToken}
              />
            </>
          )}
        </>
      )}
    </SettingsSection>
  );
}
