/**
 * Generic file export using iOS Share Sheet or Android sharing
 */

import { Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { AUTO_DISMISS_DELAY_MS } from '@/constants';

/**
 * Export a string as a file via the native share sheet.
 */
export async function exportFile(
  content: string,
  filename: string,
  mimeType: string,
  format: 'csv' | 'json'
): Promise<void> {
  const fileUri = FileSystem.documentDirectory + filename;
  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const isAvailable = await Sharing.isAvailableAsync();

  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      UTI:
        format === 'csv'
          ? 'public.comma-separated-values-text'
          : 'public.json',
      dialogTitle: 'Export My Data',
      mimeType,
    });
  } else if (Platform.OS === 'ios') {
    await Share.share({ title: 'Export My Data', url: fileUri });
  } else {
    await Share.share({ message: content, title: 'Export My Data' });
  }

  // Clean up temporary file
  setTimeout(() => {
    FileSystem.deleteAsync(fileUri, { idempotent: true }).catch(() => {});
  }, AUTO_DISMISS_DELAY_MS);
}
