import { Text, TouchableOpacity, View } from 'react-native';

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
        accessibilityLabel='Browse curated habit templates'
        accessibilityRole='button'
        activeOpacity={0.92}
        className='rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 shadow-lg shadow-black/10'
        style={{ elevation: 4 }}
        onPress={onPress}
      >
        <Text className='text-sm font-medium text-[#374151]'>
          Prefer a ready-made routine? <Text className='font-bold text-[#111827]'>Browse curated templates</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
