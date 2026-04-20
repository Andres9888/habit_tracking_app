import { useQuery } from 'convex/react';
import { useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';

import { api } from '../../../../convex/_generated/api';
import { useThemeColors } from '@/theme';
import { AuthError, SocialSignInButton } from '@/screens/auth/components';
import { useOAuthSignIn } from '@/screens/auth/hooks/useOAuthSignIn';

import { QuestionnaireScreenFrame } from '../components/QuestionnaireScreenFrame';
import type { StepProps } from '../QuestionnaireFlow.types';

export function AccountCreationStep({
  step,
  selectedTemplateIds,
  onBack,
}: StepProps) {
  const { colors } = useThemeColors();
  const templates = useQuery(api.templates.list, {});
  const { signInWithApple, signInWithGoogle, isLoading, error, clearError } =
    useOAuthSignIn();

  const selectedIcons = useMemo(() => {
    if (!templates) return [];
    return templates
      .filter((template) => selectedTemplateIds.includes(template._id))
      .map((template) => template.icon);
  }, [selectedTemplateIds, templates]);

  const handleApple = useCallback(() => {
    void signInWithApple();
  }, [signInWithApple]);

  const handleGoogle = useCallback(() => {
    void signInWithGoogle();
  }, [signInWithGoogle]);

  return (
    <QuestionnaireScreenFrame
      canGoBack
      step={step}
      subtitle='Create a free account to keep your plan and start building.'
      title='Save your plan'
      onBack={onBack}
    >
      {selectedIcons.length > 0 ? (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          {selectedIcons.map((icon, index) => (
            <View
              key={`icon-${index}`}
              style={{
                alignItems: 'center',
                backgroundColor: colors.primary[100],
                borderRadius: 16,
                height: 64,
                justifyContent: 'center',
                width: 64,
              }}
            >
              <Text style={{ fontSize: 28 }}>{icon}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={{ gap: 12 }}>
        {error ? <AuthError message={error} onDismiss={clearError} /> : null}
        <SocialSignInButton
          disabled={!!isLoading}
          isLoading={isLoading === 'oauth_apple'}
          provider='apple'
          onPress={handleApple}
        />
        <SocialSignInButton
          disabled={!!isLoading}
          isLoading={isLoading === 'oauth_google'}
          provider='google'
          onPress={handleGoogle}
        />
      </View>
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 12,
          lineHeight: 17,
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        By continuing you agree to our Terms and Privacy Policy.
      </Text>
    </QuestionnaireScreenFrame>
  );
}
