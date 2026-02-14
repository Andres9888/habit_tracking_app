import { Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft, X } from 'lucide-react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { shadows } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';

interface ModalHeaderProps {
  insets: EdgeInsets;
  onBack: () => void;
  onClose: () => void;
}

export function ModalHeader({ insets, onBack, onClose }: ModalHeaderProps) {
  return (
    <BlurView
      intensity={20}
      style={{
        paddingBottom: 8,
        paddingHorizontal: 0,
        paddingTop: insets.top + 8,
      }}
      tint='light'
    >
      <View className='mb-2 flex-row items-center justify-between'>
        <TouchableOpacity
          accessibilityLabel='Back to settings'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-2xl bg-stone-100/80'
          style={shadows.subtle}
          onPress={onBack}
        >
          <ChevronLeft color={colors.gray[500]} size={24} strokeWidth={2} />
        </TouchableOpacity>
        <Text className='flex-1 text-center text-xl font-bold text-stone-900'>
          Recently Deleted
        </Text>
        <TouchableOpacity
          accessibilityLabel='Close'
          accessibilityRole='button'
          className='h-11 w-11 items-center justify-center rounded-2xl bg-stone-100/80'
          style={shadows.subtle}
          onPress={onClose}
        >
          <X color={colors.gray[500]} size={24} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}
