import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VerificationForm } from './VerificationForm';

interface VerificationViewProps {
  emailAddress: string;
  isLoading: boolean;
  onVerify: (code: string) => Promise<void>;
}

const anim = (d: number) =>
  FadeInDown.duration(280).delay(d).springify().damping(18);

export function VerificationView({
  emailAddress,
  isLoading,
  onVerify,
}: VerificationViewProps) {
  const [code, setCode] = useState('');
  const insets = useSafeAreaInsets();

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
          className='mb-10 text-stone-500'
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
      </View>
    </View>
  );
}
