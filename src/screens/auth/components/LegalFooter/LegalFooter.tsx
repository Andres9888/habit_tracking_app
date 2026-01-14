import { Linking, Text, TouchableOpacity, View } from 'react-native';

const TERMS_URL = 'https://dailyhabits.app/terms';
const PRIVACY_URL = 'https://dailyhabits.app/privacy';

const openTerms = () => void Linking.openURL(TERMS_URL);
const openPrivacy = () => void Linking.openURL(PRIVACY_URL);

export function LegalFooter() {
  return (
    <View className='flex-row items-center justify-center'>
      <TouchableOpacity
        accessibilityLabel='Terms of Service'
        accessibilityRole='link'
        onPress={openTerms}
      >
        <Text className='text-xs text-stone-500'>Terms</Text>
      </TouchableOpacity>
      <Text className='mx-2 text-xs text-stone-500'>·</Text>
      <TouchableOpacity
        accessibilityLabel='Privacy Policy'
        accessibilityRole='link'
        onPress={openPrivacy}
      >
        <Text className='text-xs text-stone-500'>Privacy</Text>
      </TouchableOpacity>
    </View>
  );
}
