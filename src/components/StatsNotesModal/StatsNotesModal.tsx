/**
 * StatsNotesModal Component
 * 
 * Overlay modal displaying global stats and notes across all habits.
 * 
 * **Trigger:** Stats icon in main navigation
 * 
 * **Display:**
 * - Tab switcher: Stats / Notes
 * - Stats tab: Overall completion metrics, streak stats, habit breakdown
 * - Notes tab: All notes from all habits, chronological list
 * - Card-style overlay with backdrop blur
 * - Can open VisualizationModal from notes (nested modal)
 * 
 * **Actions:**
 * - Switch between Stats/Notes tabs
 * - View detailed notes
 * - Open visualization modal (from notes)
 * - Tap backdrop or X button to close
 * 
 * **Modal Type:** React Native Modal (transparent) with custom overlay card
 * 
 * **Lifecycle:**
 * - Opens: visible=true, fades in with backdrop
 * - Closes: onClose via backdrop tap or close button
 * - Maintains tab state during session
 * 
 * **Pattern:** Custom overlay implementation (not using shared Modal component)
 * Uses Pressable backdrop with stopPropagation on content card
 * Card has shadow and rounded corners (16px)
 * OPTIMIZED: Design system typography, Pressable for performance
 */
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatsOverview from './StatsOverview';
import NotesList from './NotesList';
import { useThemeColors } from '../../theme/ThemeContext';
import { StatsNotesHeader } from './StatsNotesHeader';

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
      <Pressable
        accessibilityLabel='Close stats modal'
        accessibilityRole='button'
        className='flex-1 bg-black/50'
        onPress={onClose}
      >
        <View className='flex-1 p-5' style={{ paddingTop: insets.top + 8 }}>
          <Pressable
            accessible={false}
            className='flex-1 overflow-hidden rounded-2xl'
            importantForAccessibility='no'
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
