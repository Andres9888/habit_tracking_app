import { useState } from 'react';
import { Text, View } from 'react-native';
import { FormInput } from '../FormInput';
import { SubmitButton } from '../SubmitButton';

interface VerificationViewProps {
  emailAddress: string;
  isLoading: boolean;
  onVerify: (code: string) => Promise<void>;
}

export function VerificationView({
  emailAddress,
  isLoading,
  onVerify,
}: VerificationViewProps) {
  const [code, setCode] = useState('');

  return (
    <View className='flex-1 bg-white'>
      <View className='pt-15 flex-1 px-6'>
        <Text className='mb-2 text-[32px] font-extrabold tracking-tight text-slate-900'>
          Verify Email
        </Text>
        <Text className='mb-10 text-base text-slate-500'>
          We've sent a verification code to {emailAddress}
        </Text>

        <View className='gap-6'>
          <FormInput
            keyboardType='number-pad'
            label='VERIFICATION CODE'
            maxLength={6}
            placeholder='Enter 6-digit code'
            value={code}
            onChangeText={setCode}
          />

          <SubmitButton
            disabled={code.length !== 6}
            isLoading={isLoading}
            label='VERIFY EMAIL'
            loadingLabel='VERIFYING...'
            onPress={() => onVerify(code)}
          />
        </View>
      </View>
    </View>
  );
}
