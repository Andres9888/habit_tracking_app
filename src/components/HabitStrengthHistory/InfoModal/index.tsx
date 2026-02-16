/**
 * HabitStrengthInfoModal
 * Explains how habit strength is calculated
 */

import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { X, TrendingUp, TrendingDown, Target } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../../theme/ThemeContext';
import { InfoCard } from './InfoCard';
import { TipsSection } from './TipsSection';
import { TierLegend } from './TierLegend';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function HabitStrengthInfoModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();

  return (
    <Modal
      accessibilityViewIsModal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className='flex-1'
        style={{ paddingTop: insets.top || 16, backgroundColor: colors.background }}
      >
        <Header onClose={onClose} />
        <Content />
      </View>
    </Modal>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  const { colors } = useThemeColors();

  return (
    <View className='flex-row items-center justify-between border-b px-4 pb-4' style={{ borderColor: colors.border }}>
      <Text className='text-xl font-bold' style={{ color: colors.text.primary }}>
        How Strength Works
      </Text>
      <Pressable
        accessibilityLabel='Close'
        className='h-10 w-10 items-center justify-center rounded-full'
        style={{ backgroundColor: colors.gray[200] }}
        onPress={onClose}
      >
        <X color={colors.text.secondary} size={20} />
      </Pressable>
    </View>
  );
}

function Content() {
  const { colors, isDark } = useThemeColors();
  return (
    <ScrollView
      className='flex-1 px-4'
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 20 }}
    >
      <Text className='mb-6 text-base leading-6' style={{ color: colors.text.secondary }}>
        Habit Strength shows how ingrained your habit has become. It's based on
        the proven exponential smoothing algorithm.
      </Text>

      <TierLegend />

      <InfoCard
        bgColor={isDark ? '#064E3B' : '#ecfdf5'}
        description='Each completion increases strength by 5% of the remaining gap to 100%.'
        descriptionColor={isDark ? '#6EE7B7' : '#059669'}
        Icon={TrendingUp}
        iconColor={isDark ? '#6EE7B7' : '#059669'}
        title='When You Complete'
        titleColor={isDark ? '#A7F3D0' : '#047857'}
      />
      <InfoCard
        bgColor={isDark ? '#450A0A' : '#fef2f2'}
        description='Missing a day reduces strength by 5%. Consistent misses weaken the habit.'
        descriptionColor={isDark ? '#FCA5A5' : '#dc2626'}
        Icon={TrendingDown}
        iconColor={isDark ? '#FCA5A5' : '#dc2626'}
        title='When You Miss'
        titleColor={isDark ? '#FECACA' : '#b91c1c'}
      />
      <InfoCard
        bgColor={isDark ? '#451A03' : '#fffbeb'}
        description='With perfect consistency, it takes 60-90 days to reach near 100% strength.'
        descriptionColor={isDark ? '#FCD34D' : '#d97706'}
        Icon={Target}
        iconColor={isDark ? '#FCD34D' : '#d97706'}
        title='Building to 100%'
        titleColor={isDark ? '#FDE68A' : '#b45309'}
      />
      <TipsSection />
    </ScrollView>
  );
}

export default HabitStrengthInfoModal;
