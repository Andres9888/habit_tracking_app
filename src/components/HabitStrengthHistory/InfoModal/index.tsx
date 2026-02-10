/**
 * HabitStrengthInfoModal
 * Explains how habit strength is calculated
 */

import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { X, TrendingUp, TrendingDown, Target } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfoCard } from './InfoCard';
import { TipsSection } from './TipsSection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function HabitStrengthInfoModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className='flex-1 bg-white'
        style={{ paddingTop: insets.top || 16 }}
      >
        <Header onClose={onClose} />
        <Content />
      </View>
    </Modal>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <View className='flex-row items-center justify-between border-b border-stone-100 px-4 pb-4'>
      <Text className='text-xl font-bold text-stone-900'>
        How Strength Works
      </Text>
      <Pressable
        accessibilityLabel='Close'
        className='h-10 w-10 items-center justify-center rounded-full bg-stone-100'
        onPress={onClose}
      >
        <X color='#57534e' size={20} />
      </Pressable>
    </View>
  );
}

function Content() {
  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 20 }}
    >
      <Text className='mb-6 text-base leading-6 text-stone-600'>
        Habit Strength shows how ingrained your habit has become. It's based on
        the proven exponential smoothing algorithm.
      </Text>
      <InfoCard
        bgColor='#ecfdf5'
        description='Each completion increases strength by 5% of the remaining gap to 100%.'
        descriptionColor='#059669'
        Icon={TrendingUp}
        iconColor='#059669'
        title='When You Complete'
        titleColor='#047857'
      />
      <InfoCard
        bgColor='#fef2f2'
        description='Missing a day reduces strength by 5%. Consistent misses weaken the habit.'
        descriptionColor='#dc2626'
        Icon={TrendingDown}
        iconColor='#dc2626'
        title='When You Miss'
        titleColor='#b91c1c'
      />
      <InfoCard
        bgColor='#fffbeb'
        description='With perfect consistency, it takes 60-90 days to reach near 100% strength.'
        descriptionColor='#d97706'
        Icon={Target}
        iconColor='#d97706'
        title='Building to 100%'
        titleColor='#b45309'
      />
      <TipsSection />
    </ScrollView>
  );
}

export default HabitStrengthInfoModal;
