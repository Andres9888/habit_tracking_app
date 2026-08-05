/** ExportStatus — inline tinted panel: spinner → ready, or error + retry */
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { typography, fontWeights } from '../../../theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { ExportStatus as Status } from '../useExportFirst';

interface Props {
  status: Status;
  onRetry: () => void;
}

export function ExportStatus({ status, onRetry }: Props) {
  const { colors: themeColors } = useThemeColors();
  if (status === 'idle') return null;

  const isError = status === 'error';
  const tint = isError
    ? themeColors.status.errorLight
    : themeColors.status.successLight;
  const accent = isError
    ? themeColors.status.error
    : themeColors.status.successText;

  return (
    <View
      className='mb-3.5 flex-row items-start gap-2.5 rounded-xl border p-3'
      style={{ backgroundColor: tint, borderColor: accent }}
    >
      {status === 'pending' ? (
        <ActivityIndicator color={accent} size='small' />
      ) : null}
      <View className='flex-1'>
        <Text style={{ ...typography.bodySmall, color: themeColors.text.primary }}>
          {status === 'pending'
            ? 'Preparing your export…'
            : isError
              ? "Export didn't finish."
              : 'Export ready — check the share sheet.'}
        </Text>
        {isError ? (
          <Pressable className='mt-2' onPress={onRetry}>
            <Text
              style={{
                ...typography.bodySmall,
                fontWeight: fontWeights.semibold,
                color: accent,
              }}
            >
              Try again
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
