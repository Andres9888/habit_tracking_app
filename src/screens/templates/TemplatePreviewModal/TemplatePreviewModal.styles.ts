/**
 * Local styles for the TemplatePreviewModal bottom sheet
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';

export const localStyles = StyleSheet.create({
  dragHandle: { borderRadius: borderRadius.xs, height: 5, width: 36 },
  dragHandleRow: { alignItems: 'center', paddingBottom: 4, paddingTop: 8 },
  sheet: StyleSheet.absoluteFillObject,
});
