import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

interface SectionDividerProps {
  label: string;
}

export function SectionDivider({ label }: SectionDividerProps) {
  return (
    <View className='my-3 flex-row items-center'>
      <View
        className='flex-1'
        style={{ backgroundColor: colors.parchment.border, height: 1 }}
      />
      <Text
        className='mx-2'
        style={{
          ...typography.caption,
          color: colors.parchment.text,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View
        className='flex-1'
        style={{ backgroundColor: colors.parchment.border, height: 1 }}
      />
    </View>
  );
}
