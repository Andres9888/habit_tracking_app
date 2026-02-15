/** VerificationForm - Form card with code input and submit */
import { useCallback } from 'react';
import { View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();

  return (
    <View
      className='rounded-2xl p-6'
      style={{ backgroundColor: colors.card }}
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
        value={code}
        onChangeText={onChangeCode}
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
