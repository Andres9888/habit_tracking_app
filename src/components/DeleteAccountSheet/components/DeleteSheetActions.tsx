/** DeleteSheetActions — export-first, keep, ack gate, and permanent-delete buttons */
import { Pressable, Text, View } from 'react-native';
import { typography, fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AckCheckboxRow } from './AckCheckboxRow';

interface Props {
  acknowledged: boolean;
  isDeleting: boolean;
  canExport: boolean;
  onExportFirst: () => void;
  onToggleAcknowledged: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteSheetActions(p: Props) {
  const { colors: themeColors } = useThemeColors();
  const danger = p.acknowledged && !p.isDeleting;

  return (
    <>
      {p.canExport ? (
        <Pressable
          accessibilityRole='button'
          className='mb-2 w-full items-center rounded-xl border py-3.5 active:opacity-80'
          disabled={p.isDeleting}
          style={{ borderColor: themeColors.border, backgroundColor: themeColors.surface }}
          onPress={p.onExportFirst}
        >
          <Text
            className='text-base font-semibold'
            style={{ color: themeColors.text.primary }}
          >
            Export a copy first
          </Text>
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole='button'
        className='mb-3 w-full items-center py-2 active:opacity-70'
        disabled={p.isDeleting}
        onPress={p.onCancel}
      >
        <Text
          className='text-base font-semibold'
          style={{ color: themeColors.text.secondary }}
        >
          Keep my account
        </Text>
      </Pressable>
      <View
        className='border-t pt-3.5'
        style={{ borderTopColor: themeColors.border }}
      >
        <AckCheckboxRow
          checked={p.acknowledged}
          onToggle={p.onToggleAcknowledged}
        />
        <Pressable
          accessibilityRole='button'
          accessibilityState={{ disabled: !danger }}
          className='w-full items-center rounded-xl py-3.5 active:opacity-80'
          disabled={!danger}
          style={{
            backgroundColor: danger
              ? themeColors.status.error
              : themeColors.status.errorLight,
          }}
          onPress={p.onConfirm}
        >
          <Text
            className='text-base font-semibold'
            style={{
              ...typography.body,
              fontWeight: fontWeights.semibold,
              color: danger ? '#FFFFFF' : themeColors.text.tertiary,
            }}
          >
            {p.isDeleting ? 'Deleting…' : 'Delete account permanently'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
