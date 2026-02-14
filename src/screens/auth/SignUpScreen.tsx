/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AuthDivider,
  AuthError,
  FormInput,
  SignInLink,
  SocialSignInButton,
  SubmitButton,
  VerificationView,
} from './components';
import { useOAuthSignIn } from './hooks/useOAuthSignIn';
import { useSignUpFlow } from './hooks/useSignUpFlow';
import { SignUpHeader } from './components/SignUpHeader';
import { useThemeColors } from '../../theme/ThemeContext';

interface SignUpScreenProps {
  onNavigateToSignIn?: () => void;
}

export default function SignUpScreen({
  onNavigateToSignIn,
}: SignUpScreenProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const {
    emailAddress,
    setEmailAddress,
    emailError,
    onEmailBlur,
    password,
    setPassword,
    passwordError,
    onPasswordBlur,
    pendingVerification,
    isLoading,
    handleSignUp,
    handleVerification,
    isFormValid,
  } = useSignUpFlow();
  const {
    signInWithGoogle,
    signInWithApple,
    isLoading: oauthLoading,
    error: oauthError,
    clearError,
  } = useOAuthSignIn();

  const isAnyLoading = isLoading || !!oauthLoading;

  if (pendingVerification) {
    return (
      <VerificationView
        emailAddress={emailAddress}
        isLoading={isLoading}
        onVerify={handleVerification}
      />
    );
  }

  const gradientColors: [string, string] = isDark
    ? [colors.background, colors.surface]
    : [colors.background, colors.surface];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 24,
              paddingTop: insets.top + 24,
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <SignUpHeader />

            {oauthError && (
              <AuthError message={oauthError} onDismiss={clearError} />
            )}

            {/* Form card with depth */}
            <Animated.View
              entering={FadeInUp.delay(100).springify().damping(18)}
              style={{
                backgroundColor: isDark ? colors.card : '#ffffff',
                borderColor: colors.cardBorder,
                borderRadius: 16,
                borderWidth: isDark ? 1 : 0,
                elevation: 4,
                padding: 24,
                shadowColor: isDark ? '#000000' : '#1c1917',
                shadowOffset: { height: 4, width: 0 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 16,
              }}
            >
              <View style={{ gap: 12 }}>
                <SocialSignInButton
                  disabled={isAnyLoading}
                  isLoading={oauthLoading === 'oauth_apple'}
                  provider='apple'
                  onPress={signInWithApple}
                />
                <SocialSignInButton
                  disabled={isAnyLoading}
                  isLoading={oauthLoading === 'oauth_google'}
                  provider='google'
                  onPress={signInWithGoogle}
                />
              </View>

              <AuthDivider />

              <View style={{ gap: 24 }}>
                <FormInput
                  autoCapitalize='none'
                  autoComplete='email'
                  editable={!isAnyLoading}
                  error={emailError}
                  keyboardType='email-address'
                  label='Email'
                  placeholder='Enter your email'
                  value={emailAddress}
                  onBlur={onEmailBlur}
                  onChangeText={setEmailAddress}
                />
                <FormInput
                  secureTextEntry
                  autoComplete='password-new'
                  editable={!isAnyLoading}
                  error={passwordError}
                  label='Password'
                  placeholder='Create a password'
                  value={password}
                  onBlur={onPasswordBlur}
                  onChangeText={setPassword}
                />
                <SubmitButton
                  disabled={
                    !emailAddress || !password || isAnyLoading || !isFormValid
                  }
                  isLoading={isLoading}
                  label='Create account'
                  loadingLabel='Creating account...'
                  onPress={handleSignUp}
                />
              </View>
            </Animated.View>

            {onNavigateToSignIn && (
              <Animated.View
                entering={FadeInUp.delay(200).springify().damping(18)}
              >
                <SignInLink
                  className='mt-6'
                  disabled={isAnyLoading}
                  onPress={onNavigateToSignIn}
                />
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
