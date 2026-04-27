import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

export function EmptyStateCTA() {
  return (
    <View
      accessibilityLabel='Why and benefits — not yet set'
      accessibilityRole='summary'
      className='flex-row items-start gap-3 rounded-2xl px-4 py-3.5'
      style={{
        backgroundColor: colors.parchment.bg,
        borderColor: colors.parchment.border,
        borderStyle: 'dashed',
        borderWidth: 1,
      }}
    >
      <View
        className='h-9 w-9 items-center justify-center rounded-lg'
        style={{ backgroundColor: colors.parchment.surface }}
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
    </View>
  );
}
