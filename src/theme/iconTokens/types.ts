/**
 * Icon accent token types.
 */

export type IconTokenKey =
  | 'ember'
  | 'sunrise'
  | 'amber'
  | 'forest'
  | 'teal'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'magenta'
  | 'slate';

export interface IconToken {
  /** Canonical accent for light mode (reads on the warm cream canvas). */
  light: string;
  /** Lifted accent for dark mode (reads on the #111827 canvas). */
  dark: string;
  /** Hue centre in degrees, used to snap legacy hex values onto the token. */
  hue: number;
}
