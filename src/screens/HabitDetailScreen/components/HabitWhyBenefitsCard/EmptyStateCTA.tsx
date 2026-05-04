import { Pressable, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

interface EmptyStateCTAProps {
  onPress: () => void;
}

export function EmptyStateCTA({ onPress }: EmptyStateCTAProps) {
  return (
    <Pressable
      accessibilityHint='Opens editor for why, identity, benefits, and science note'
      accessibilityLabel='Add your why and benefits'
      accessibilityRole='button'
      className='flex-row items-start gap-3 rounded-xl px-4 py-3.5'
      style={{
        backgroundColor: '#FAF8F5',
        borderColor: '#DDD8D2',
        borderStyle: 'dashed',
        borderWidth: 1,
      }}
      onPress={onPress}
    >
      <View
        className='h-9 w-9 items-center justify-center rounded-lg'
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <Text style={{ color: colors.parchment.text, fontSize: 18 }}>+</Text>
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.parchment.textStrong,
            fontWeight: fontWeights.semibold,
          }}
        >
          Add your why &amp; benefits
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.caption,
            color: colors.parchment.text,
            lineHeight: 18,
          }}
        >
          Write down what this habit does for you and why it matters.
        </Text>
      </View>
    </Pressable>
  );
}
