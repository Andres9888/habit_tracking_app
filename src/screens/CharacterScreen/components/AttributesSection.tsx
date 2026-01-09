import { View, Text } from 'react-native';
import { Heart, Dumbbell, Brain, Zap } from 'lucide-react-native';
import { AttributeCard } from './AttributeCard';
import { ATTRIBUTE_CONFIGS } from '../constants';
import type { CharacterAttributes } from '../types';

interface AttributesSectionProps {
  attributes: CharacterAttributes;
}

export function AttributesSection({ attributes }: AttributesSectionProps) {
  return (
    <View className='mb-6 flex-col gap-3'>
      <Text className='px-1 text-base font-normal leading-6 tracking-[-0.3125px] text-[#101828]'>
        Attributes
      </Text>
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.vitality.bgGradient}
        gradientColors={ATTRIBUTE_CONFIGS.vitality.gradientColors}
        icon={<Heart color={ATTRIBUTE_CONFIGS.vitality.iconColor} size={20} />}
        maxValue={100}
        name='Vitality'
        value={attributes.vitality}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.strength.bgGradient}
        gradientColors={ATTRIBUTE_CONFIGS.strength.gradientColors}
        icon={<Dumbbell color={ATTRIBUTE_CONFIGS.strength.iconColor} size={20} />}
        maxValue={100}
        name='Strength'
        value={attributes.strength}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.wisdom.bgGradient}
        gradientColors={ATTRIBUTE_CONFIGS.wisdom.gradientColors}
        icon={<Brain color={ATTRIBUTE_CONFIGS.wisdom.iconColor} size={20} />}
        maxValue={100}
        name='Wisdom'
        value={attributes.wisdom}
      />
      <AttributeCard
        bgGradient={ATTRIBUTE_CONFIGS.energy.bgGradient}
        gradientColors={ATTRIBUTE_CONFIGS.energy.gradientColors}
        icon={<Zap color={ATTRIBUTE_CONFIGS.energy.iconColor} size={20} />}
        maxValue={100}
        name='Energy'
        value={attributes.energy}
      />
    </View>
  );
}
