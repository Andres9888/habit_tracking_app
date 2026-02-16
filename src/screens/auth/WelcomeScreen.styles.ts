/**
 * @fileoverview WelcomeScreen styles
 * 
 * **Style organization:**
 * - container: Main view background (#FAF8F5 warm off-white)
 * - content: Flex layout with space-between (hero at top, actions at bottom)
 * - heroSection: Logo, title, subtitle (centered, gap: 12)
 * - actionSection: Buttons stack (gap: 12)
 * - backButton: Absolute positioned back button (top-left)
 * 
 * **Key styles:**
 * - title: 34px bold, -0.5 letter-spacing (display scale)
 * - subtitle: 17px body text (secondary color)
 * - iconContainer: 80x80 rounded square, subtle shadow
 * - primaryButton: Green (#047857), elevated with shadow
 * - textLink: Inline link with label + action split
 * 
 * **Design system:**
 * - Typography: 34/17/15 (title/body/small)
 * - Border radius: 16px (icon), 12px (button)
 * - Shadows: 4px offset, 16px blur, 0.08-0.2 opacity
 * - Colors: Primary green, warm neutrals (#57534e, #1c1917)
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  actionSection: {
    gap: 12,
  },
  backButton: {
    left: 16,
    position: 'absolute',
    zIndex: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  container: {
    backgroundColor: '#FAF8F5',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 16,
    elevation: 4,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 80,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    elevation: 4,
    paddingVertical: 16,
    shadowColor: colors.primary[600],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    color: '#57534e',
    fontSize: 17,
    textAlign: 'center',
  },
  textLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLinkAction: {
    color: colors.primary[700],
    fontSize: 15,
    fontWeight: '600',
  },
  textLinkLabel: {
    color: '#57534e',
    fontSize: 15,
  },
  title: {
    color: '#1c1917',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
