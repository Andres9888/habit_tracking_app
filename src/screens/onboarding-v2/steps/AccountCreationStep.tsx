import { useAuth, useUser } from '@clerk/expo';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { StepComponentProps } from '../types';

export function AccountCreationStep({ onNext }: StepComponentProps) {
  const { colors } = useThemeColors();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.username ?? 'you';

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <HeroHeader
          headline={isSignedIn ? 'Your chain is saved.' : 'Save your chain.'}
          sub={
            isSignedIn
              ? `Nice to meet you, ${displayName}. Your plan, 3 habits, and tier progress are tied to your account now — switch phones anytime without losing progress.`
              : "So you don't lose the plan you just built."
          }
        />
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: 14,
            borderWidth: 1,
            flexDirection: 'row',
            gap: 10,
            marginTop: 20,
            padding: 14,
          }}
        >
          <Text style={{ fontSize: 22 }}>🔒</Text>
          <Text
            style={{
              color: colors.text.secondary,
              flex: 1,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            Signed in via {user?.primaryEmailAddress?.emailAddress ?? 'your account'}. We never share your data.
          </Text>
        </View>
      </View>
      <View style={{ paddingTop: 12 }}>
        <PrimaryCTA label="Continue" onPress={onNext} />
      </View>
    </View>
  );
}
