/**
 * Layout styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const layoutStyles = StyleSheet.create({
  bottomSpacer: {
    height: 120,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  dismissIndicator: {
    alignItems: 'center',
    left: 0,
    paddingVertical: 8,
    position: 'absolute',
    right: 0,
    top: -50,
    zIndex: 100,
  },
  dismissPill: {
    borderRadius: 4,
    height: 5,
    marginBottom: 8,
    width: 40,
  },
});

export function themedLayoutStyles(colors: SemanticColors) {
  return {
    container: { backgroundColor: colors.background },
    dismissPill: { backgroundColor: colors.gray[400] },
  } as const;
}
