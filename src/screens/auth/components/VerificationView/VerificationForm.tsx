/** VerificationForm - Form card with code input and submit — dark mode aware */
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
      style={{
        backgroundColor: colors.card,
        elevation: 4,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <FormInput
        keyboardType='number-pad'
        label='Verification code'
        maxLength={6}
        placeholder='Enter the 6-digit code from your email'
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
