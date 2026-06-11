import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import type {
  ScrollView as ScrollViewType,
  View as ViewType,
} from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import Modal from '../Modal';
import { CreateHabitScrollContent } from './components/CreateHabitScrollContent';
import { ModalHeader } from './components/ModalHeader';
import { useCenteredFormCallbacks } from './hooks/useCenteredFormCallbacks';
import { useCreateHabitModal } from './hooks/useCreateHabitModal';
import { useCreateHabitModalUx } from './hooks/useCreateHabitModalUx';
import type { CreateHabitModalProps } from './types';

export default function CreateHabitModalCentered(props: CreateHabitModalProps) {
  const { visible, onClose } = props;
  const { isEditMode, form, handleCreate } = useCreateHabitModal(props);
  const scrollViewRef = useRef<ScrollViewType>(null);
  const scrollContentRef = useRef<ViewType>(null);
  const reminderSectionRef = useRef<ViewType>(null);
  const { colors } = useThemeColors();
  const { showNameError, setShowNameError } = useCreateHabitModalUx(
    visible,
    isEditMode,
    scrollViewRef
  );
  const callbacks = useCenteredFormCallbacks({
    form,
    handleCreate,
    reminderSectionRef,
    scrollContentRef,
    scrollViewRef,
    setShowNameError,
  });

  return (
    <Modal
      disableBackdropClose
      disableGestureClose
      backdropOpacity={0}
      variant='fullScreen'
      visible={visible}
      onClose={onClose}
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <View className='flex-1' style={{ backgroundColor: colors.surface }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <ModalHeader
            habitName={form.habitName}
            isEditMode={isEditMode}
            onClose={onClose}
            onSave={callbacks.handleSave}
            onValidationError={callbacks.handleValidationError}
          />
          <CreateHabitScrollContent
            active={!isEditMode}
            visible={visible}
            callbacks={callbacks}
            form={form}
            reminderSectionRef={reminderSectionRef}
            scrollContentRef={scrollContentRef}
            scrollViewRef={scrollViewRef}
            showNameError={showNameError}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
