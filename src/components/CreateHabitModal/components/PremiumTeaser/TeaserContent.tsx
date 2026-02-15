
import { Text, View } from 'react-native';

import { Sparkles, Lock } from 'lucide-react-native';

interface TeaserContentProps {
  suggestions: string[];
}

export function TeaserContent({ suggestions }: TeaserContentProps) {
  return (
    <View className='relative'>
      {/* Header */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Sparkles color='#7c3aed' size={18} />
          <Text className='ml-2 text-sm font-bold text-violet-700'>
            AI Suggestions
          </Text>
        </View>
        <View className='flex-row items-center rounded-full bg-violet-100 px-2 py-1'>
          <Lock color='#6d28d9' size={12} />
          <Text className='ml-1 text-[10px] font-bold text-violet-700'>
            PRO
          </Text>
        </View>
      </View>

      {/* Blurred suggestions preview */}
      <View className='mb-3'>
        {suggestions.map((suggestion, index) => (
          <View
            key={index}
            className='mb-1 flex-row items-center'
            style={{ opacity: 0.7 }}
          >
            <Text className='mr-2 text-violet-500'>•</Text>
            <Text
              className='text-sm text-violet-800'
              style={{
                textShadowColor: 'rgba(124, 58, 237, 0.5)',
                textShadowOffset: { height: 0, width: 0 },
                textShadowRadius: 4,
              }}
            >
              {suggestion}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View className='flex-row items-center justify-between rounded-xl bg-violet-500/20 px-3 py-2'>
        <Text className='text-xs font-medium text-violet-700'>
          Unlock personalized insights
        </Text>
        <Text className='text-xs font-bold text-violet-600'>Try Premium →</Text>
      </View>
    </View>
  );
}
