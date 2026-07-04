import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';
import { cardStyles } from './CharacterCard.styles';
import { CharacterHeaderRow } from './CharacterCardParts/CharacterHeaderRow';
import { CharacterXpSection } from './CharacterCardParts/CharacterXpSection';
import type { CharacterCardProps } from './CharacterCard.types';

export function CharacterCard({ data }: CharacterCardProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInDown.delay(60)
        .duration(durations.enter)
        .easing(enterEasing)}
      style={[
        cardStyles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.text.primary,
        },
      ]}
    >
      <View style={cardStyles.cardInner}>
        <CharacterHeaderRow data={data} />
        <CharacterXpSection data={data} />
      </View>
    </Animated.View>
  );
}
