/**
 * RedeemReferralCode - Input for entering a referral code
 *
 * Used during onboarding or accessible from settings.
 * Validates and redeems the code, granting premium to both users.
 */

import React, { useState, useCallback } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { Gift, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';

interface RedeemReferralCodeProps {
  onSuccess?: () => void;
}

export function RedeemReferralCode({ onSuccess }: RedeemReferralCodeProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const redeemCode = useMutation(api.referrals.referrals.redeemReferralCode);

  const handleRedeem = useCallback(async () => {
    if (!code.trim() || isRedeeming) return;
    setIsRedeeming(true);

    try {
      const result = await redeemCode({ code: code.trim() });
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setRedeemed(true);
        Alert.alert(
          '🎉 Welcome!',
          'Referral code applied! You and your friend both get 1 week of Premium free.',
          [{ text: 'Awesome!', onPress: onSuccess }]
        );
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Oops', result.error ?? 'Invalid referral code');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  }, [code, isRedeeming, redeemCode, onSuccess]);

  if (redeemed) {
    return (
      <View className='flex-row items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950'>
        <Check size={18} color='#059669' />
        <Text className='text-[14px] font-medium text-emerald-700 dark:text-emerald-300'>
          Referral code applied — enjoy Premium!
        </Text>
      </View>
    );
  }

  return (
    <View className='gap-3'>
      <View className='flex-row items-center gap-2'>
        <Gift size={16} color={themeColors.text.secondary} />
        <Text
          className='text-[13px] font-medium'
          style={{ color: themeColors.text.secondary }}
        >
          Have a referral code?
        </Text>
      </View>
      <View className='flex-row gap-2'>
        <TextInput
          className='flex-1 rounded-xl px-4 py-3 text-[15px] font-semibold tracking-[2px]'
          style={{
            backgroundColor: isDark ? '#1c1917' : '#f5f5f4',
            color: themeColors.text.primary,
            borderColor: themeColors.border,
            borderWidth: 1,
          }}
          placeholder='ENTER CODE'
          placeholderTextColor={themeColors.text.secondary}
          value={code}
          onChangeText={(t) => setCode(t.toUpperCase())}
          autoCapitalize='characters'
          maxLength={8}
        />
        <AnimatedPressable
          onPress={handleRedeem}
          disabled={!code.trim() || isRedeeming}
          style={{
            backgroundColor: code.trim() ? '#059669' : isDark ? '#374151' : '#d1d5db',
            borderRadius: 12,
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
        >
          <Text className='text-[14px] font-semibold' style={{ color: '#ffffff' }}>
            {isRedeeming ? '...' : 'Apply'}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}
