import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatsOverview from './StatsOverview';
import NotesList from './NotesList';

interface StatsNotesModalProps {
  visible: boolean;
  onClose: () => void;
}

type TabType = 'stats' | 'notes';

export default function StatsNotesModal({
  visible,
  onClose,
}: StatsNotesModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        className='flex-1 bg-black/50'
        onPress={onClose}
      >
        <View className='flex-1 p-5' style={{ paddingTop: insets.top + 8 }}>
          <TouchableOpacity
            activeOpacity={1}
            className='android:elevation-5 flex-1 rounded-[20px] bg-white shadow-lg'
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <View className='flex-row items-center justify-between border-b border-slate-200 px-5 py-4'>
              <Text className='text-2xl font-bold text-slate-900'>
                Stats & Notes
              </Text>
              <TouchableOpacity
                accessibilityLabel='Close stats and notes'
                accessibilityRole='button'
                className='h-8 w-8 items-center justify-center rounded-full bg-slate-100'
                onPress={onClose}
              >
                <Text className='text-lg font-semibold text-slate-500'>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className='flex-row border-b border-slate-200'>
              <TouchableOpacity
                accessibilityLabel='Stats tab'
                accessibilityRole='tab'
                accessibilityState={{ selected: activeTab === 'stats' }}
                className={`flex-1 items-center py-3 ${
                  activeTab === 'stats' ? 'border-b-2 border-slate-900' : ''
                }`}
                onPress={() => setActiveTab('stats')}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeTab === 'stats' ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Stats
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel='Notes tab'
                accessibilityRole='tab'
                accessibilityState={{ selected: activeTab === 'notes' }}
                className={`flex-1 items-center py-3 ${
                  activeTab === 'notes' ? 'border-b-2 border-slate-900' : ''
                }`}
                onPress={() => setActiveTab('notes')}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeTab === 'notes' ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Notes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className='flex-1 p-5'>
              {activeTab === 'stats' ? <StatsOverview /> : <NotesList />}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
