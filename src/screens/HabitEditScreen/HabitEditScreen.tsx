/** HabitEditScreen - Matches Create modal style (bottom sheet, stagger animations) */
import { useCallback, useState } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, View } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { UpgradePrompt } from '../../features/habits/components/HabitsList/UpgradePrompt';
import { usePremium } from '../../hooks/usePremium/usePremium';
import { EditHeader } from './EditHeader';
import { NameInputSection } from './NameInputSection';
import { CustomizeSection } from './CustomizeSection';
import { DangerZone } from './DangerZone';
import { SectionLabel } from './SectionLabel';
import { useHabitEditScreen } from './useHabitEditScreen';
import type { HabitEditScreenProps } from './types';

// eslint-disable-next-line max-lines-per-function
export default function HabitEditScreen({
  visible,
  habitId,
  onClose,
}: HabitEditScreenProps) {
  const insets = useSafeAreaInsets();
  const state = useHabitEditScreen({ habitId, onClose });
  const { isPremium, monthlyPackage, purchasePackage } = usePremium();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const handlePremiumUpsell = useCallback(() => {
    setShowUpgradePrompt(true);
  }, []);

  const handleUpgradePress = useCallback(async () => {
    if (monthlyPackage) {
      await purchasePackage(monthlyPackage);
    }
    setShowUpgradePrompt(false);
  }, [monthlyPackage, purchasePackage]);
  // Modal pattern: return null when not visible — the modal simply doesn't mount
  if (!visible || !habitId) return null;

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <View className='flex-1 bg-black/50'>
          <View
            className='flex-1 overflow-hidden rounded-t-3xl shadow-2xl'
            style={{ backgroundColor: colors.light.background }}
          >
            <EditHeader
              canSave={state.habitName.trim().length >= 2}
              isSaving={state.isSaving}
              paddingTop={Math.max(insets.top + 4, 12)}
              onCancel={() => {
                state.triggerSelection();
                onClose();
              }}
              onSave={() => void state.handleSave()}
            />
            <ScrollView
              className='flex-1'
              contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator={false}
            >
              <Pressable onPress={Keyboard.dismiss}>
                <View className='pt-4'>
                  <NameInputSection
                    habitName={state.habitName}
                    onChangeText={state.setHabitName}
                  />
                </View>
                <SectionLabel delay={220} text='CUSTOMIZE' />
                <Animated.View
                  className='px-4'
                  entering={FadeInUp.delay(280).springify().damping(18)}
                >
                  <CustomizeSection
                    habitName={state.habitName}
                    isPremium={isPremium}
                    remindersEnabled={state.remindersEnabled}
                    reminderTime={state.reminderTime}
                    selectedColor={state.selectedColor}
                    selectedEmoji={state.selectedEmoji}
                    onColorSelect={state.handleColorSelect}
                    onEmojiSelect={state.handleEmojiSelect}
                    onPremiumUpsell={handlePremiumUpsell}
                    onReminderTimeChange={state.handleReminderTimeChange}
                    onReminderToggle={state.handleReminderToggle}
                  />
                </Animated.View>
                <SectionLabel delay={340} text='DANGER ZONE' variant='danger' />
                <Animated.View
                  className='mx-4 rounded-2xl bg-red-50/50 p-4'
                  entering={FadeInUp.delay(400).springify().damping(18)}
                >
                  <DangerZone
                    onArchive={state.handleArchive}
                    onDelete={state.handleDelete}
                  />
                </Animated.View>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>

      <UpgradePrompt
        visible={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgradePress={() => void handleUpgradePress()}
      />
    </Modal>
  );
}
