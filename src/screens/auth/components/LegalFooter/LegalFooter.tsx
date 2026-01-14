import { Linking, Text, TouchableOpacity, View } from 'react-native';

const TERMS_URL = 'https://dailyhabits.app/terms';
const PRIVACY_URL = 'https://dailyhabits.app/privacy';

const openTerms = () => void Linking.openURL(TERMS_URL);
const openPrivacy = () => void Linking.openURL(PRIVACY_URL);

export function LegalFooter() {
  return (
    <View className='flex-row items-center justify-center'>
      <TouchableOpacity onPress={openTerms}>
        <Text className='text-xs text-stone-400'>Terms</Text>
      </TouchableOpacity>
      <Text className='mx-2 text-xs text-stone-400'>·</Text>
      <TouchableOpacity onPress={openPrivacy}>
        <Text className='text-xs text-stone-400'>Privacy</Text>
      </TouchableOpacity>
    </View>
  );
}
