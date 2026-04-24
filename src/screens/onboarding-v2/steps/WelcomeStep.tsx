import { View } from 'react-native';

import { HeroHeader } from '../components/HeroHeader';
import { PrimaryCTA } from '../components/PrimaryCTA';
import { WelcomeChain } from '../components/WelcomeChain';
import { StepComponentProps } from '../types';

export function WelcomeStep({ onNext }: StepComponentProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ paddingTop: 32 }}>
        <WelcomeChain />
        <View style={{ marginTop: 48 }}>
          <HeroHeader
            headline="Watch a habit become you."
            sub="Each day you show up, your chain grows stronger. Copper to iron. Iron to gold."
          />
        </View>
      </View>
      <View style={{ paddingBottom: 8 }}>
        <PrimaryCTA label="Begin" onPress={onNext} variant="brand" />
      </View>
    </View>
  );
}
