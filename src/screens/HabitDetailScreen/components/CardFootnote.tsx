/**
 * CardFootnote — the hairline-ruled sentence that closes a card and tells the
 * reader what the numbers above it mean. The design uses it on every card that
 * shows a chart or a rail.
 */
import type { ReactNode } from 'react';
import { Text } from 'react-native';
import type { InsightPalette } from '../insightPalette';
import { fontFamilies } from '../../../theme/typography';

interface CardFootnoteProps {
  children: ReactNode;
  palette: InsightPalette;
}

export function CardFootnote({ children, palette }: CardFootnoteProps) {
  return (
    <Text
      style={{
        borderTopColor: palette.divider,
        borderTopWidth: 1,
        color: palette.textSecondary,
        fontFamily: fontFamilies.primary.text,
        fontSize: 12.5,
        lineHeight: 19,
        marginTop: 14,
        paddingTop: 12,
      }}
    >
      {children}
    </Text>
  );
}
