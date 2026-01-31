import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export function useSignInFlow() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert(
          'Error',
          'Sign in incomplete. Please check your credentials.'
        );
      }
    } catch (error: unknown) {
      const clerkError = error as { errors?: Array<{ message?: string }> };
      if (__DEV__) {
        console.error(JSON.stringify(error, null, 2));
      }
      Alert.alert(
        'Error',
        clerkError.errors?.[0]?.message || 'Failed to sign in'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, emailAddress, password, setActive]);

  const canSubmit = !!emailAddress && !!password;

  return {
    canSubmit,
    emailAddress,
    handleSignIn,
    isLoading,
    password,
    setEmailAddress,
    setPassword,
  };
}
