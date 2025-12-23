import { useSignIn } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SocialLoginButtons } from '../../components/auth/SocialLoginButtons';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        // Handle additional verification steps if needed
        Alert.alert(
          'Error',
          'Sign in incomplete. Please check your credentials.'
        );
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-1 px-6' style={{ paddingTop: insets.top + 16 }}>
        <Text className='mb-2 text-[32px] font-extrabold tracking-tight text-stone-900'>
          Welcome Back
        </Text>
        <Text className='mb-10 text-base text-stone-500'>
          Sign in to continue tracking your habits
        </Text>

        <SocialLoginButtons />

        <View className='gap-6'>
          <View className='gap-2'>
            <Text className='text-[10px] font-medium tracking-[3px] text-stone-500'>
              EMAIL
            </Text>
            <TextInput
              autoCapitalize='none'
              autoComplete='email'
              className='rounded-3xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900'
              keyboardType='email-address'
              placeholder='Enter your email'
              placeholderTextColor='#a8a29e'
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          <View className='gap-2'>
            <Text className='text-[10px] font-medium tracking-[3px] text-stone-500'>
              PASSWORD
            </Text>
            <TextInput
              secureTextEntry
              autoComplete='password'
              className='rounded-3xl border border-stone-200 bg-white px-5 py-3.5 text-base font-medium text-stone-900'
              placeholder='Enter your password'
              placeholderTextColor='#a8a29e'
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className={`mt-4 items-center rounded-3xl border border-stone-900 bg-stone-900 py-4 ${
              isLoading || !emailAddress || !password ? 'opacity-40' : ''
            }`}
            disabled={isLoading || !emailAddress || !password}
            onPress={onSignInPress}
          >
            <Text className='text-[13px] font-bold tracking-[3px] text-white'>
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
