import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius } from '@/theme/spacing';

export const styles = StyleSheet.create({
  absoluteEmoji: {
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  emoji: {
    fontSize: 64,
  },
  emojiContainer: {
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.full,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
});
