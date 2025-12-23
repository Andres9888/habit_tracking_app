import { Text, TouchableOpacity, View } from 'react-native';
import STRINGS from '../../../constants/strings';

interface TemplateReminderPromptProps {
  visible: boolean;
  bottomOffset: number;
  onPress: () => void;
}

export const TemplateReminderPrompt = ({
  visible,
  bottomOffset,
  onPress,
}: TemplateReminderPromptProps) => {
  if (!visible) return null;
  return (
    <View className='absolute left-6 right-6' pointerEvents='box-none' style={{ bottom: bottomOffset }}>
      <TouchableOpacity
        accessibilityLabel='Browse curated habits'
        accessibilityRole='button'
        activeOpacity={0.92}
        className='rounded-2xl border border-[#e7e5e4] bg-[#fafaf9] px-4 py-3 shadow-lg shadow-black/10'
        style={{ elevation: 4 }}
        onPress={onPress}
      >
        <Text className='text-sm font-medium text-[#374151]'>
          {STRINGS.CREATE_HABIT.templatePrompt}{' '}
          <Text className='font-bold text-[#111827]'>
            {STRINGS.CREATE_HABIT.templateCTA}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
