import { BookOpen } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { fontWeights } from '../../../../theme/typography';

const AMBER_DEEP = '#9A5504';
const PILL_BG = '#FFF7ED';

export function SourcePill() {
  return (
    <View
      className='mb-2 flex-row items-center self-start rounded-full px-2.5 py-1'
      style={{ backgroundColor: PILL_BG, gap: 6 }}
    >
      <BookOpen color={AMBER_DEEP} size={11} />
      <Text
        style={{
          color: AMBER_DEEP,
          fontSize: 10.5,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
      >
        From Habit Library
      </Text>
    </View>
  );
}
