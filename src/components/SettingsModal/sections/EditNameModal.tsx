/** EditNameModal — single-field sheet behind the Account page's Name row. */
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Modal } from '../../Modal';
import { Button } from '../../Button/Button';
import { airy } from '@/theme/airyScale';
import { MAX_SHORT_TEXT_LENGTH } from '@/constants';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { settingsSectionTitle } from '../settingsSectionTitleStyle';
import { useEditDisplayName } from '../useEditDisplayName';

interface Props {
  visible: boolean;
  currentName: string;
  onClose: () => void;
}

export function EditNameModal({ visible, currentName, onClose }: Props) {
  const { colors: themeColors } = useThemeColors();
  const { clearError, error, isSaving, saveName } = useEditDisplayName();
  const [value, setValue] = useState(currentName);

  // Reopening after a cancel should show the saved name, not the abandoned edit.
  useEffect(() => {
    if (visible) {
      setValue(currentName);
      clearError();
    }
  }, [visible, currentName, clearError]);

  const handleSave = () => {
    void saveName(value).then((ok) => {
      if (ok) onClose();
    });
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View className='px-5 pb-2 pt-1' style={{ gap: 14 }}>
        <Text style={{ ...settingsSectionTitle, color: themeColors.text.primary }}>
          Your name
        </Text>
        <TextInput
          autoFocus
          accessibilityLabel='Your name'
          maxLength={MAX_SHORT_TEXT_LENGTH}
          placeholder='Name'
          placeholderTextColor={themeColors.text.tertiary}
          returnKeyType='done'
          style={{
            ...typography.body,
            backgroundColor: themeColors.background,
            borderColor: error ? themeColors.status.error : themeColors.border,
            borderRadius: airy.buttonRadius,
            borderWidth: 1,
            color: themeColors.text.primary,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
          value={value}
          onChangeText={(next) => {
            setValue(next);
            if (error) clearError();
          }}
          onSubmitEditing={handleSave}
        />
        {error ? (
          <Text
            style={{
              ...typography.caption,
              color: themeColors.status.error,
              fontWeight: fontWeights.semibold,
            }}
          >
            {error}
          </Text>
        ) : null}
        <View className='flex-row' style={{ gap: 10 }}>
          <Button
            fullWidth
            disabled={isSaving}
            style={{ flex: 1 }}
            variant='secondary'
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            disabled={isSaving || !value.trim()}
            loading={isSaving}
            style={{ flex: 1 }}
            variant='primary'
            onPress={handleSave}
          >
            Save
          </Button>
        </View>
      </View>
    </Modal>
  );
}
