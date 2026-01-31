import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useSignUpFlow() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (error: any) {
      if (__DEV__) {
        console.error(JSON.stringify(error, null, 2));
      }
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (code: string) => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
      } else {
        if (__DEV__) {
          console.error(JSON.stringify(attempt, null, 2));
        }
        Alert.alert('Error', 'Verification incomplete. Please try again.');
      }
    } catch (error: any) {
      if (__DEV__) {
        console.error(JSON.stringify(error, null, 2));
      }
      Alert.alert(
        'Error',
        error.errors?.[0]?.message || 'Failed to verify email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emailAddress,
    handleSignUp,
    handleVerification,
    isLoading,
    password,
    pendingVerification,
    setEmailAddress,
    setPassword,
  };
}
