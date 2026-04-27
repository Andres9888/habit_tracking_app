import { Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';

interface ScienceNoteBlockProps {
  note: string;
}

export function ScienceNoteBlock({ note }: ScienceNoteBlockProps) {
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
        Science
      </Text>
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
