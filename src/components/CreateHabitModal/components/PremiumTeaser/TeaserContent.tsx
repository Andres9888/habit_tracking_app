import { Text, View } from 'react-native';
import { Sparkles, Lock } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface TeaserContentProps {
  suggestions: string[];
}

export function TeaserContent({ suggestions }: TeaserContentProps) {
  const { colors } = useThemeColors();

  return (
    <View className='relative'>
      {/* Header */}
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Sparkles color={colors.status.premium} size={18} />
          <Text className='ml-2 text-sm font-bold' style={{ color: colors.status.premiumText }}>
            AI Suggestions
          </Text>
        </View>
        <View className='flex-row items-center rounded-full px-2 py-1' style={{ backgroundColor: colors.status.premiumLight }}>
          <Lock color={colors.status.premiumText} size={12} />
          <Text className='ml-1 text-[10px] font-bold' style={{ color: colors.status.premiumText }}>
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
            <Text className='mr-2' style={{ color: colors.status.premium }}>•</Text>
            <Text
              className='text-sm'
              style={{
                color: colors.status.premiumText,
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
      <View className='flex-row items-center justify-between rounded-xl px-3 py-2' style={{ backgroundColor: colors.status.premiumLight }}>
        <Text className='text-xs font-medium' style={{ color: colors.status.premiumText }}>
          Unlock personalized insights
        </Text>
        <Text className='text-xs font-bold' style={{ color: colors.status.premiumText }}>Try Premium →</Text>
      </View>
    </View>
  );
}
