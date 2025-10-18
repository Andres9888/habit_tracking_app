import { Text, View } from 'react-native';
import { FormInput } from './components/FormInput';
import { SubmitButton } from './components/SubmitButton';
import { VerificationView } from './components/VerificationView';
import { useSignUpFlow } from './hooks/useSignUpFlow';

export default function SignUpScreen() {
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    pendingVerification,
    isLoading,
    handleSignUp,
    handleVerification,
  } = useSignUpFlow();

  if (pendingVerification) {
    return (
      <VerificationView
        emailAddress={emailAddress}
        isLoading={isLoading}
        onVerify={handleVerification}
      />
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <View className='pt-15 flex-1 px-6'>
        <Text className='mb-2 text-[32px] font-extrabold tracking-tight text-slate-900'>
          Create Account
        </Text>
        <Text className='mb-10 text-base text-slate-500'>
          Start tracking your habits today
        </Text>

        <View className='gap-6'>
          <FormInput
            autoCapitalize='none'
            autoComplete='email'
            keyboardType='email-address'
            label='EMAIL'
            placeholder='Enter your email'
            value={emailAddress}
            onChangeText={setEmailAddress}
          />

          <FormInput
            secureTextEntry
            autoComplete='password-new'
            label='PASSWORD'
            placeholder='Create a password'
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton
            disabled={!emailAddress || !password}
            isLoading={isLoading}
            label='CREATE ACCOUNT'
            loadingLabel='CREATING ACCOUNT...'
            onPress={handleSignUp}
          />
        </View>
      </View>
    </View>
  );
}
