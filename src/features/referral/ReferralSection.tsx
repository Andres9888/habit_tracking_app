/**
 * ReferralSection - Referral stats & sharing for Settings
 *
 * Shows the user's referral code, stats, and share button.
 * Generates a shareable referral card with deep link.
 */

import React, { useCallback, useEffect } from 'react';
import { Alert, Platform, Share, Text, View } from 'react-native';
import { Gift, Users, Crown, Copy, Share2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SettingsSection } from '../../components/SettingsModal/SettingsSection';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

const APP_STORE_URL = 'https://apps.apple.com/app/chain-day';

interface ReferralSectionProps {
  highContrastMode?: boolean;
}

export function ReferralSection({ highContrastMode = false }: ReferralSectionProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const referralCode = useQuery(api.referrals.referrals.getMyReferralCode);
  const stats = useQuery(api.referrals.referrals.getMyReferralStats);
  const createCode = useMutation(api.referrals.referrals.createMyReferralCode);

  // Auto-create referral code on first visit
  useEffect(() => {
    if (referralCode === null) {
      void createCode();
    }
  }, [referralCode, createCode]);

  const handleCopyCode = useCallback(async () => {
    if (!referralCode) return;
    await Clipboard.setStringAsync(referralCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  }, [referralCode]);

  const handleShare = useCallback(() => {
    if (!referralCode) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const referralLink = `${APP_STORE_URL}?referral=${referralCode}`;
    const message = `🔗 Join me on Chain Day and we both get 1 week of Premium FREE!\n\nUse my referral code: ${referralCode}\n\n${referralLink}`;

    void Share.share({
      message: Platform.select({
        default: message,
        ios: message,
      }),
      title: 'Share Chain Day & Get Premium Free',
      url: Platform.OS === 'ios' ? referralLink : undefined,
    });
  }, [referralCode]);

  const textColor = highContrastMode ? '#facc15' : themeColors.text.primary;
  const secondaryColor = highContrastMode ? '#a3a3a3' : themeColors.text.secondary;
  const accentColor = '#059669';

  return (
    <SettingsSection
      highContrastMode={highContrastMode}
      title='Refer a Friend'
      subtitle='Free Premium'
    >
      <View className='px-4 py-4 gap-4'>
        {/* Referral Code Display */}
        <View className='items-center gap-2'>
          <View className='flex-row items-center gap-2'>
            <Gift size={20} color={accentColor} />
            <Text
              className='text-[15px] font-semibold'
              style={{ color: textColor }}
            >
              Your Referral Code
            </Text>
          </View>

          <View
            className='flex-row items-center gap-3 rounded-xl px-5 py-3'
            style={{
              backgroundColor: isDark ? '#1a2e23' : '#ecfdf5',
              borderColor: accentColor,
              borderWidth: 1.5,
            }}
          >
            <Text
              className='text-[22px] font-bold tracking-[3px]'
              style={{ color: accentColor }}
            >
              {referralCode ?? '--------'}
            </Text>
            <AnimatedPressable onPress={handleCopyCode}>
              <Copy size={18} color={accentColor} />
            </AnimatedPressable>
          </View>

          <Text
            className='text-[12px] text-center'
            style={{ color: secondaryColor }}
          >
            Share this code — you both get 1 week of Premium free!
          </Text>
        </View>

        {/* Stats Row */}
        {stats && stats.totalReferrals > 0 && (
          <View className='flex-row gap-3'>
            <StatCard
              icon={<Users size={16} color={accentColor} />}
              label='Referrals'
              value={`${stats.completedReferrals}`}
              isDark={isDark}
              highContrast={highContrastMode}
            />
            <StatCard
              icon={<Crown size={16} color='#d97706' />}
              label='Premium Days'
              value={`${stats.activePremiumDays}`}
              isDark={isDark}
              highContrast={highContrastMode}
            />
          </View>
        )}

        {/* Active Reward Banner */}
        {stats?.hasActiveReward && (
          <View
            className='flex-row items-center gap-2 rounded-xl px-4 py-3'
            style={{ backgroundColor: isDark ? '#422006' : '#fffbeb' }}
          >
            <Crown size={16} color='#d97706' />
            <Text className='flex-1 text-[13px] font-medium' style={{ color: '#d97706' }}>
              Referral Premium active until{' '}
              {new Date(stats.rewardExpiresAt!).toLocaleDateString()}
            </Text>
          </View>
        )}

        {/* Share Button */}
        <AnimatedPressable
          onPress={handleShare}
          style={{
            backgroundColor: accentColor,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Share2 size={18} color='#ffffff' />
          <Text className='text-[15px] font-semibold' style={{ color: '#ffffff' }}>
            Share Referral Link
          </Text>
        </AnimatedPressable>
      </View>
    </SettingsSection>
  );
}

/** Small stat display card */
function StatCard({
  icon,
  label,
  value,
  isDark,
  highContrast,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDark: boolean;
  highContrast: boolean;
}) {
  return (
    <View
      className='flex-1 items-center gap-1 rounded-xl px-3 py-3'
      style={{
        backgroundColor: highContrast
          ? '#1a1a1a'
          : isDark
            ? '#1c1917'
            : '#f5f5f4',
      }}
    >
      {icon}
      <Text
        className='text-[18px] font-bold'
        style={{ color: highContrast ? '#facc15' : isDark ? '#fafaf9' : '#1c1917' }}
      >
        {value}
      </Text>
      <Text
        className='text-[11px]'
        style={{ color: highContrast ? '#a3a3a3' : isDark ? '#a8a29e' : '#78716c' }}
      >
        {label}
      </Text>
    </View>
  );
}
