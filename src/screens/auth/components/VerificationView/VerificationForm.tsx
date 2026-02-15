/** VerificationForm - Form card with code input and submit */
import { useCallback } from 'react';
import { View } from 'react-native';
import { FormInput } from '../FormInput';
import { SubmitButton } from '../SubmitButton';

interface Props {
  code: string;
  isLoading: boolean;
  onChangeCode: (text: string) => void;
  onVerify: (code: string) => Promise<void>;
}

export function VerificationForm({
  code,
  isLoading,
  onChangeCode,
  onVerify,
}: Props) {
  const handleVerify = useCallback(() => void onVerify(code), [code, onVerify]);

  return (
    <View
      className='rounded-2xl bg-white p-6'
      style={{
        elevation: 4,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <FormInput
        keyboardType='number-pad'
        label='Verification code'
        maxLength={6}
        placeholder='Enter 6-digit code'
        returnKeyType='go'
        value={code}
        onChangeText={onChangeCode}
        onSubmitEditing={handleVerify}
      />
      <View className='mt-6'>
        <SubmitButton
          disabled={code.length !== 6}
          isLoading={isLoading}
          label='Verify email'
          loadingLabel='Verifying...'
          onPress={handleVerify}
        />
      </View>
    </View>
  );
}
