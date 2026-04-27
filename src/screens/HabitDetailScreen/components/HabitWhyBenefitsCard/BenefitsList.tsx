import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

interface BenefitsListProps {
  benefits: string[];
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  return (
    <View>
      <Text
        className='mb-2 mt-3'
        style={{
          ...typography.caption,
          color: colors.parchment.text,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        Benefits
      </Text>
      {benefits.map((benefit, index) => (
        <View key={index} className='mb-1 flex-row items-start gap-2'>
          <Text
            style={{
              color: colors.parchment.text,
              fontWeight: fontWeights.bold,
              lineHeight: 21,
            }}
          >
            •
          </Text>
          <Text
            className='flex-1'
            style={{
              ...typography.bodySmall,
              color: colors.parchment.textStrong,
              lineHeight: 21,
            }}
          >
            {benefit}
          </Text>
        </View>
      ))}
    </View>
  );
}
