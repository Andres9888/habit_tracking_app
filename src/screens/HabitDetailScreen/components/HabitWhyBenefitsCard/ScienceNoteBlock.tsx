import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography } from '../../../../theme/typography';
import { SectionDivider } from './SectionDivider';

interface ScienceNoteBlockProps {
  note: string;
}

export function ScienceNoteBlock({ note }: ScienceNoteBlockProps) {
  return (
    <View>
      <SectionDivider label='Science' />
      <View
        className='rounded-xl px-3 py-2.5'
        style={{ backgroundColor: colors.parchment.surface }}
      >
        <Text
          style={{
            ...typography.bodySmall,
            color: colors.parchment.textStrong,
            lineHeight: 20,
          }}
        >
          {note}
        </Text>
      </View>
    </View>
  );
}
