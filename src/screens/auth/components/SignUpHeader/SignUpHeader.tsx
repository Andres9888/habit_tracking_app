import { Text, View } from 'react-native';

export function SignUpHeader() {
  return (
    <View>
      <Text className='mb-2 text-[32px] font-extrabold tracking-tight text-stone-800'>
        Create account
      </Text>
      <Text className='mb-10 text-base text-stone-500'>
        Start your habit journey today
      </Text>
    </View>
  );
}
