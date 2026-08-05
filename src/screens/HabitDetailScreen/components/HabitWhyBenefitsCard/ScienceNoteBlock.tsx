import { ExternalLink, Microscope } from 'lucide-react-native';
import { Linking, Pressable, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { typography, fontWeights } from '../../../../theme/typography';
import { SectionDivider } from './SectionDivider';

interface ScienceNoteBlockProps {
  note: string;
  scientificLink?: string | null;
}

const AMBER_DEEP = '#B45309';
const SEAL_BG = '#FEF3C7';

export function ScienceNoteBlock({ note, scientificLink }: ScienceNoteBlockProps) {
  const hasLink = scientificLink !== null && scientificLink !== undefined && scientificLink.length > 0;

  return (
    <View>
      <SectionDivider label={hasLink ? 'Backed by research' : 'Science'} />
      <View
        className='flex-row items-start rounded-lg px-3 py-3'
        style={{ backgroundColor: '#FFFFFF', gap: 10 }}
      >
        {hasLink ? (
          <View
            className='items-center justify-center'
            style={{ backgroundColor: SEAL_BG, borderRadius: 999, height: 28, width: 28 }}
          >
            <Microscope color={AMBER_DEEP} size={14} />
          </View>
        ) : null}
        <View className='flex-1'>
          <Text
            style={{
              ...typography.bodySmall,
              color: colors.parchment.textStrong,
              lineHeight: 19,
            }}
          >
            {note}
          </Text>
          {hasLink ? (
            <Pressable
              accessibilityRole='link'
              className='mt-1.5 flex-row items-center'
              onPress={() => void Linking.openURL(scientificLink as string)}
            >
              <Text
                style={{
                  color: AMBER_DEEP,
                  fontSize: 12,
                  fontWeight: fontWeights.semibold,
                  marginRight: 4,
                  textDecorationLine: 'underline',
                }}
              >
                View study
              </Text>
              <ExternalLink color={AMBER_DEEP} size={11} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
