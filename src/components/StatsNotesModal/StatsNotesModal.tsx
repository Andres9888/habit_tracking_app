/** StatsNotesModal - OPTIMIZED: Design system, Pressable, animations */
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatsOverview from './StatsOverview';
import NotesList from './NotesList';
import { useThemeColors } from '../../theme/ThemeContext';
import { StatsNotesHeader } from './StatsNotesHeader';
import { useThemeColors } from '../../theme/ThemeContext';

interface StatsNotesModalProps {
  visible: boolean;
  onClose: () => void;
}

const cardShadow = {
  elevation: 5,
  shadowColor: '#1c1917',
  shadowOffset: { height: 4, width: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
};

export default function StatsNotesModal({
  visible,
  onClose,
}: StatsNotesModalProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'notes'>('stats');
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className='flex-1 bg-black/50' onPress={onClose}>
        <View className='flex-1 p-5' style={{ paddingTop: insets.top + 8 }}>
          <Pressable
            className='flex-1 overflow-hidden rounded-2xl'
            style={[cardShadow, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <StatsNotesHeader
              activeTab={activeTab}
              onClose={onClose}
              onTabChange={setActiveTab}
            />
            <ScrollView className='flex-1 p-5'>
              {activeTab === 'stats' ? <StatsOverview /> : <NotesList />}
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
