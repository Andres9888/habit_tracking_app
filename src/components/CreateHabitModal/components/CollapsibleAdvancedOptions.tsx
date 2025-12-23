import { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import useHapticFeedback from '../../../hooks/useHapticFeedback';

interface CollapsibleAdvancedOptionsProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsibleAdvancedOptions = ({
  children,
  defaultExpanded = false,
}: CollapsibleAdvancedOptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { triggerSelection } = useHapticFeedback();

  const toggleExpanded = () => {
    triggerSelection();
    setIsExpanded(!isExpanded);
  };

  return (
    <View className='mb-6'>
      <Pressable
        accessibilityRole='button'
        accessibilityLabel={isExpanded ? 'Collapse advanced options' : 'Expand advanced options'}
        className='mb-3 flex-row items-center justify-between rounded-xl bg-white p-4'
        onPress={toggleExpanded}
      >
        <View className='flex-row items-center gap-2'>
          <Text className='text-base font-semibold text-[#1a1a1a]'>⚙️ Advanced Options</Text>
          <Text className='text-xs text-[#a8a29e]'>(Optional)</Text>
        </View>
        <Animated.View
          style={{
            transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
          }}
        >
          <ChevronDown color='#78716c' size={20} />
        </Animated.View>
      </Pressable>

      {isExpanded && <View>{children}</View>}
    </View>
  );
};

export default CollapsibleAdvancedOptions;
