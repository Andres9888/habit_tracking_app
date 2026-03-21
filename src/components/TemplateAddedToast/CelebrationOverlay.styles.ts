/**
 * Styles for TemplateAddedCelebration full-screen overlay
 */

import { Dimensions, StyleSheet } from 'react-native';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

const { width: SCREEN_W } = Dimensions.get('window');

export const celebrationStyles = StyleSheet.create({
  actionSecondary: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
    borderWidth: 1.5,
    marginTop: 12,
    paddingHorizontal: 48,
    paddingVertical: 14,
    width: SCREEN_W - 96,
  },
  actionSecondaryText: {
    color: '#808098',
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    alignItems: 'center',
    marginTop: 36,
    width: '100%',
  },
  checkBadge: {
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderColor: '#1a0f30',
    borderRadius: 16,
    borderWidth: 3,
    bottom: 2,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 2,
    width: 32,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  glowRing: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  iconEmoji: {
    fontSize: 56,
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  primaryBtn: {
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 48,
    paddingVertical: 16,
    width: SCREEN_W - 96,
  },
  primaryBtnText: {
    ...typography.button,
    color: '#fff',
  },
  subtitle: {
    color: '#808098',
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    ...typography.heading2,
    color: '#fff',
    fontWeight: fontWeights.bold,
    marginTop: 28,
    textAlign: 'center',
  },
});
