import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VerificationForm } from './VerificationForm';
import { colors } from "../../../../theme/colors";

interface VerificationViewProps {
  emailAddress: string;
  isLoading: boolean;
  onResend?: () => Promise<void>;
  onVerify: (code: string) => Promise<void>;
}

const RESEND_COOLDOWN_S = 60;

const anim = (d: number) =>
  FadeInDown.duration(280).delay(d).springify().damping(18);

export function VerificationView({
  emailAddress,
  isLoading,
  onResend,
  onVerify,
}: VerificationViewProps) {
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const insets = useSafeAreaInsets();

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || !onResend) return;
    await onResend();
    setCooldown(RESEND_COOLDOWN_S);
  }, [cooldown, onResend]);

  return (
    <View className='flex-1' style={{ backgroundColor: '#FAF8F5' }}>
      <View className='flex-1 px-6' style={{ paddingTop: insets.top + 24 }}>
        <Animated.View entering={anim(0)}>
          <Text
            className='mb-2 font-extrabold text-stone-900'
            style={{ fontSize: 34, letterSpacing: -1 }}
          >
            Verify Email
          </Text>
        </Animated.View>
        <Animated.Text
          className='mb-10 text-stone-600'
          entering={anim(60)}
          style={{ fontSize: 17 }}
        >
          We sent a verification code to {emailAddress}
        </Animated.Text>
        <Animated.View entering={anim(120)}>
          <VerificationForm
            code={code}
            isLoading={isLoading}
            onChangeCode={setCode}
            onVerify={onVerify}
          />
        </Animated.View>

        {/* Resend code option */}
        <Animated.View
          entering={anim(180)}
          style={{ alignItems: 'center', marginTop: 24 }}
        >
          <Text style={{ color: '#78716c', fontSize: 15 }}>
            Didn't receive the code?
          </Text>
          <Pressable
            accessibilityLabel={
              cooldown > 0
                ? `Resend code available in ${cooldown} seconds`
                : 'Resend verification code'
            }
            accessibilityRole='button'
            disabled={cooldown > 0}
            hitSlop={12}
            style={{ marginTop: 8, minHeight: 44, justifyContent: 'center' }}
            onPress={() => void handleResend()}
          >
            <Text
              style={{
                color: cooldown > 0 ? '#a8a29e' : colors.primary[700],
                fontSize: 15,
                fontWeight: '600',
              }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
