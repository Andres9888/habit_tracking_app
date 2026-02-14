import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VerificationForm } from './VerificationForm';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface VerificationViewProps {
  emailAddress: string;
  isLoading: boolean;
  onVerify: (code: string) => Promise<void>;
}

const anim = (d: number) =>
  FadeInDown.duration(280).delay(d).springify().damping(18);

export function VerificationView({
  emailAddress,
  isLoading,
  onVerify,
}: VerificationViewProps) {
  const [code, setCode] = useState('');
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <Animated.View entering={anim(0)}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Verify Email
          </Text>
        </Animated.View>
        <Animated.Text
          entering={anim(60)}
          style={[styles.subtitle, { color: colors.text.secondary }]}
        >
          We sent a verification code to {emailAddress}
        </Animated.Text>
        <Animated.View entering={anim(120)}>
          <VerificationForm
            code={code}
            isLoading={isLoading}
            onChangeCode={setCode}
            onVerify={onVerify}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
});
