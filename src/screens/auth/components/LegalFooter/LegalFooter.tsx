import { Linking, Text, View, StyleSheet } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useThemeColors } from '@/theme/ThemeContext';

const TERMS_URL = 'https://andres9888.github.io/chainday-landing/terms.html';
const PRIVACY_URL =
  'https://andres9888.github.io/chainday-landing/privacy.html';

const openTerms = () => void Linking.openURL(TERMS_URL);
const openPrivacy = () => void Linking.openURL(PRIVACY_URL);

export function LegalFooter() {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-center'>
      <AnimatedPressable
        accessibilityHint='Open terms of service in browser'
        accessibilityLabel='Terms of Service'
        accessibilityRole='link'
        onPress={openTerms}
      >
        <Text style={[styles.text, { color: colors.text.secondary }]}>
          Terms
        </Text>
      </AnimatedPressable>
      <Text style={[styles.separator, { color: colors.text.secondary }]}>
        ·
      </Text>
      <AnimatedPressable
        accessibilityHint='Open privacy policy in browser'
        accessibilityLabel='Privacy Policy'
        accessibilityRole='link'
        onPress={openPrivacy}
      >
        <Text style={[styles.text, { color: colors.text.secondary }]}>
          Privacy
        </Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  text: {
    fontSize: 12,
  },
});
