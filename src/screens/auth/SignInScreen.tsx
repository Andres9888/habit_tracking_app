import { useSignIn } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SocialLoginButtons } from '../../components/auth/SocialLoginButtons';
import {
  AnimatedLogo,
  ForgotPasswordModal,
  FormInput,
  PasswordInput,
  SubmitButton,
  SuccessOverlay,
} from './components';

/**
 * Props for the SignInScreen component
 */
interface SignInScreenProps {
  /** Callback to navigate to sign up screen */
  onNavigateToSignUp?: () => void;
  /** Whether to auto-focus the email input on mount */
  autoFocusEmail?: boolean;
}

/**
 * SignInScreen - Main authentication screen for user sign-in
 *
 * Features:
 * - Email/password authentication via Clerk
 * - Social login (Google, Apple) via SocialLoginButtons
 * - Forgot password flow via modal
 * - Form validation with error feedback
 * - Keyboard handling with auto-focus and submit
 * - Success animation on successful sign-in
 * - Screen-level shake animation on errors
 *
 * @example
 * <SignInScreen
 *   onNavigateToSignUp={() => navigation.navigate('SignUp')}
 *   autoFocusEmail={true}
 * />
 */
export default function SignInScreen({ onNavigateToSignUp, autoFocusEmail = false }: SignInScreenProps) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  // Refs for keyboard navigation
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Auto-focus email input on mount if enabled
  useEffect(() => {
    if (autoFocusEmail) {
      // Small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusEmail]);

  // Screen shake animation for invalid credentials
  const screenShake = useSharedValue(0);

  const triggerErrorShake = useCallback(() => {
    screenShake.value = withSequence(
      withTiming(10, { duration: 50 }),
      withRepeat(withTiming(-10, { duration: 50 }), 5, true),
      withTiming(0, { duration: 50 })
    );
  }, []);

  const screenShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: screenShake.value }],
  }));

  // Clear errors when user starts typing
  const handleEmailChange = useCallback((text: string) => {
    setEmailAddress(text);
    if (emailError) setEmailError(undefined);
  }, [emailError]);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(undefined);
  }, [passwordError]);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    // Dismiss keyboard before submitting
    Keyboard.dismiss();

    // Clear previous errors
    setEmailError(undefined);
    setPasswordError(undefined);
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        // Show success animation before completing
        setShowSuccess(true);
        // The session will be set after the animation completes
        setTimeout(async () => {
          await setActive({ session: signInAttempt.createdSessionId });
        }, 1500);
      } else {
        // Handle additional verification steps if needed
        triggerErrorShake();
        Alert.alert(
          'Error',
          'Sign in incomplete. Please check your credentials.'
        );
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      setIsLoading(false);

      // Trigger shake animation on error
      triggerErrorShake();

      // Parse error and set specific field errors
      const errorCode = error.errors?.[0]?.code;
      const errorMessage = error.errors?.[0]?.message || 'Failed to sign in';

      if (errorCode === 'form_identifier_not_found') {
        setEmailError('No account found with this email');
      } else if (errorCode === 'form_password_incorrect') {
        setPasswordError('Incorrect password');
      } else if (errorCode === 'form_param_format_invalid') {
        setEmailError('Please enter a valid email address');
      } else {
        // Generic error - show alert
        Alert.alert('Sign In Error', errorMessage);
      }
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <Animated.View style={[{ flex: 1 }, screenShakeStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            className='flex-1'
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 24,
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            bounces={true}
            testID='sign-in-scroll-view'
          >
            {/* Logo Section */}
            <View className='mb-8 items-center'>
              <AnimatedLogo size={80} />
              <Text className='mb-2 text-3xl font-extrabold tracking-tight text-stone-900'>
                Welcome Back! 👋
              </Text>
              <Text className='text-base text-stone-500'>
                Sign in to continue your journey
              </Text>
            </View>

            <SocialLoginButtons />

            <View className='gap-6'>
              <FormInput
                ref={emailInputRef}
                label='EMAIL'
                icon='📧'
                autoCapitalize='none'
                autoComplete='email'
                keyboardType='email-address'
                placeholder='Enter your email address'
                value={emailAddress}
                onChangeText={handleEmailChange}
                error={emailError}
                accessibilityLabel='Email input'
                accessibilityHint='Enter your email address to sign in'
                returnKeyType='next'
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
              />

              <PasswordInput
                ref={passwordInputRef}
                value={password}
                onChangeText={handlePasswordChange}
                error={passwordError}
                placeholder='Enter your password'
                returnKeyType='done'
                onSubmitEditing={onSignInPress}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                className='min-h-[44px] self-end justify-center'
                onPress={() => setShowForgotPassword(true)}
                accessibilityLabel='Forgot password?'
                accessibilityRole='button'
                accessibilityHint='Opens password reset form'
              >
                <Text className='text-sm font-semibold text-stone-900'>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <SubmitButton
                label='SIGN IN'
                loadingLabel='SIGNING IN...'
                isLoading={isLoading}
                disabled={!emailAddress || !password}
                onPress={onSignInPress}
              />
            </View>

            {/* Sign Up Prompt */}
            {onNavigateToSignUp && (
              <View className='mt-8 flex-row items-center justify-center'>
                <Text className='text-base text-stone-500'>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity
                  className='min-h-[44px] justify-center px-1'
                  onPress={onNavigateToSignUp}
                  accessibilityLabel='Sign up'
                  accessibilityRole='button'
                  accessibilityHint='Navigate to create a new account'
                >
                  <Text className='text-base font-semibold text-stone-900'>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      {/* Success Overlay */}
      <SuccessOverlay visible={showSuccess} />
    </View>
  );
}
