/**
 * WelcomeScreen - Auth landing page
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useWelcomeAnimations } from './hooks/useWelcomeAnimations';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import { styles } from './WelcomeScreen.styles';
import { WelcomeContent } from './WelcomeContent';

type AuthMode = 'welcome' | 'signin' | 'signup';

export default function WelcomeScreen() {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isLoading, error, clearError } =
    useOAuthSignIn();
  const anim = useWelcomeAnimations();

  if (mode === 'signin') {
    return (
      <View style={styles.container}>
        <SignInScreen />
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  if (mode === 'signup') {
    return (
      <View style={styles.container}>
        <SignUpScreen />
        <View style={[styles.backButton, { top: insets.top + 8 }]}>
          <BackButton onPress={() => setMode('welcome')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WelcomeContent
        buttonsStyle={anim.buttonsStyle}
        clearError={clearError}
        error={error}
        iconStyle={anim.iconStyle}
        insets={insets}
        isLoading={isLoading}
        signInWithApple={signInWithApple}
        signInWithGoogle={signInWithGoogle}
        subtitleStyle={anim.subtitleStyle}
        titleStyle={anim.titleStyle}
        onSignIn={() => setMode('signin')}
        onSignUp={() => setMode('signup')}
      />
    </View>
  );
}
