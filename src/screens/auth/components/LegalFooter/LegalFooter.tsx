import { Linking, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { EXTERNAL_URLS } from '@/constants';
import { useThemeColors } from '@/theme/ThemeContext';

const openTerms = () => void Linking.openURL(EXTERNAL_URLS.TERMS);
const openPrivacy = () => void Linking.openURL(EXTERNAL_URLS.PRIVACY);

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
        <Text className='text-xs' style={{ color: colors.text.secondary }}>Terms</Text>
      </AnimatedPressable>
      <Text className='mx-2 text-xs' style={{ color: colors.text.secondary }}>·</Text>
      <AnimatedPressable
        accessibilityHint='Open privacy policy in browser'
        accessibilityLabel='Privacy Policy'
        accessibilityRole='link'
        onPress={openPrivacy}
      >
        <Text className='text-xs' style={{ color: colors.text.secondary }}>Privacy</Text>
      </AnimatedPressable>
    </View>
  );
}
