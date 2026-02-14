import { Linking, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

const TERMS_URL = 'https://andres9888.github.io/chainday-landing/terms.html';
const PRIVACY_URL = 'https://andres9888.github.io/chainday-landing/privacy.html';

const openTerms = () => void Linking.openURL(TERMS_URL);
const openPrivacy = () => void Linking.openURL(PRIVACY_URL);

export function LegalFooter() {
  return (
    <View className='flex-row items-center justify-center'>
      <AnimatedPressable
        accessibilityLabel='Terms of Service'
        accessibilityRole='link'
        onPress={openTerms}
      >
        <Text className='text-xs text-stone-600'>Terms</Text>
      </AnimatedPressable>
      <Text className='mx-2 text-xs text-stone-600'>·</Text>
      <AnimatedPressable
        accessibilityLabel='Privacy Policy'
        accessibilityRole='link'
        onPress={openPrivacy}
      >
        <Text className='text-xs text-stone-600'>Privacy</Text>
      </AnimatedPressable>
    </View>
  );
}
