import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';
import type { PersonalBlockData } from './HabitWhyBenefitsCard.types';

interface PersonalBlockProps {
  data: PersonalBlockData;
  isLast: boolean;
}

export function PersonalBlock({ data, isLast }: PersonalBlockProps) {
  return (
    <View
      accessibilityLabel={`${data.label}: ${data.value}`}
      accessibilityRole='summary'
      className='flex-row items-start gap-3 py-2.5'
      style={
        isLast
          ? undefined
          : { borderBottomColor: colors.parchment.border, borderBottomWidth: 1 }
      }
    >
      <View
        className='h-9 w-9 items-center justify-center rounded-lg'
        style={{ backgroundColor: colors.parchment.surface }}
      >
        <Text style={{ fontSize: 18 }}>{data.icon}</Text>
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.caption,
            color: colors.parchment.text,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {data.label}
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.bodySmall,
            color: colors.parchment.textStrong,
            fontFamily: 'Literata',
            fontSize: 15,
            fontStyle: 'italic',
            lineHeight: 21,
          }}
        >
          “{data.value}”
        </Text>
      </View>
    </View>
  );
}
