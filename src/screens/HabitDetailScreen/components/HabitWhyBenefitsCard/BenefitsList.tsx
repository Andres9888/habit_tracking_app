import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { SectionDivider } from './SectionDivider';

interface BenefitsListProps {
  benefits: string[];
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  return (
    <View>
      <SectionDivider label='Benefits' />
      {benefits.map((benefit, index) => (
        <View key={index} className='mb-1.5 flex-row items-start'>
          <Text
            className='mr-2'
            style={{
              color: colors.warning,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            •
          </Text>
          <Text
            className='flex-1'
            style={{
              ...typography.bodySmall,
              color: colors.parchment.textStrong,
              lineHeight: 20,
            }}
          >
            {benefit}
          </Text>
        </View>
      ))}
    </View>
  );
}
