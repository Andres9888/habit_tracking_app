import { StyleSheet } from 'react-native';
import { airy } from '@/theme/airyScale';

export const gridStyles = StyleSheet.create({
  allTemplatesGrid: {
    gap: airy.sectionGap,
    paddingHorizontal: airy.screenPadH,
  },
  allTemplatesList: {
    paddingBottom: 16,
  },
});
