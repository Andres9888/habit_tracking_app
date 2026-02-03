import { View, Text, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface ScreenHeaderProps {
  onBack?: () => void;
}

export function ScreenHeader({ onBack }: ScreenHeaderProps) {
  return (
    <View className='mb-6 flex-row items-center'>
      {onBack && (
        <Pressable
          accessibilityLabel='Go back'
          accessibilityRole='button'
          className='mr-4 h-10 w-10 items-center justify-center'
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          onPress={onBack}
        >
          <ArrowLeft color='#101828' size={24} />
        </Pressable>
      )}
      <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
        Character
      </Text>
    </View>
  );
}
