import { Check, Leaf } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

interface BenefitsListProps {
  benefits: string[];
  isFromTemplate?: boolean;
}

const AMBER_DEEP = '#B45309';
const CHECK_BORDER = '#FCD34D';

export function BenefitsList({ benefits, isFromTemplate = false }: BenefitsListProps) {
  const label = isFromTemplate ? 'Scientific Benefits' : 'Benefits';

  return (
    <View>
      <View className='my-3 flex-row items-center'>
        {isFromTemplate ? (
          <Leaf color={AMBER_DEEP} size={14} style={{ marginRight: 8 }} />
        ) : (
          <View className='flex-1' style={{ backgroundColor: '#E7E5E4', height: 1 }} />
        )}
        <Text
          className='mx-2'
          style={{
            ...typography.caption,
            color: AMBER_DEEP,
            fontSize: 11,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <View className='flex-1' style={{ backgroundColor: '#E7E5E4', height: 1 }} />
      </View>

      {benefits.map((benefit, index) => (
        <View key={index} className='flex-row items-start py-1.5'>
          <View
            className='mr-2.5 items-center justify-center'
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: CHECK_BORDER,
              borderRadius: 999,
              borderWidth: 1.5,
              height: 20,
              marginTop: 1.5,
              width: 20,
            }}
          >
            <Check color={AMBER_DEEP} size={11} strokeWidth={3} />
          </View>
          <Text
            className='flex-1'
            style={{
              ...typography.bodySmall,
              color: colors.parchment.textStrong,
              fontWeight: fontWeights.medium,
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
