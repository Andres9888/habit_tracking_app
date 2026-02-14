import { View } from 'react-native';
import { Heart, Dumbbell, Brain, Zap } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AttributeCard } from './AttributeCard';
import { ATTRIBUTE_CONFIGS } from '../constants';
import type { CharacterAttributes } from '../types';

interface AttributesSectionProps {
  attributes: CharacterAttributes;
}

const STAGGER_DELAY = 60;
const BASE_DELAY = 180;

export function AttributesSection({ attributes }: AttributesSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-6 flex-col gap-3'>
      <Animated.Text
        className='px-1 font-semibold'
        entering={FadeInDown.delay(BASE_DELAY).springify().damping(18)}
        style={{
          color: colors.text.primary,
          fontSize: 17,
          letterSpacing: -0.41,
          lineHeight: 22,
        }}
      >
        Attributes
      </Animated.Text>
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.vitality.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY}
        gradientColors={ATTRIBUTE_CONFIGS.vitality.gradientColors}
        icon={<Heart color={ATTRIBUTE_CONFIGS.vitality.iconColor} size={20} />}
        maxValue={100}
        name='Vitality'
        value={attributes.vitality}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.strength.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY * 2}
        gradientColors={ATTRIBUTE_CONFIGS.strength.gradientColors}
        icon={
          <Dumbbell color={ATTRIBUTE_CONFIGS.strength.iconColor} size={20} />
        }
        maxValue={100}
        name='Strength'
        value={attributes.strength}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.wisdom.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY * 3}
        gradientColors={ATTRIBUTE_CONFIGS.wisdom.gradientColors}
        icon={<Brain color={ATTRIBUTE_CONFIGS.wisdom.iconColor} size={20} />}
        maxValue={100}
        name='Wisdom'
        value={attributes.wisdom}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.energy.bgGradient}
        delay={BASE_DELAY + STAGGER_DELAY * 4}
        gradientColors={ATTRIBUTE_CONFIGS.energy.gradientColors}
        icon={<Zap color={ATTRIBUTE_CONFIGS.energy.iconColor} size={20} />}
        maxValue={100}
        name='Energy'
        value={attributes.energy}
      />
    </View>
  );
}
