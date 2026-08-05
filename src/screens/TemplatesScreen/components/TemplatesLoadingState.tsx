/**
 * TemplatesLoadingState — cold-start placeholder for the habit library.
 *
 * Only reachable when the templates cache is genuinely empty (fresh install or
 * cleared storage); normal opens render the catalog on the first commit. The
 * real header and search bar render here so the chrome never pops in, and the
 * placeholder rows match TemplateReadRow's height so data landing swaps
 * content in place instead of reflowing the page.
 */

import { StyleSheet, View } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { useBrowserPalette } from '../browserPalette';
import { CatalogHeader } from '../views/CatalogHeader';
import { CatalogRowSkeleton } from './CatalogRowSkeleton';
import {
  ChipRailSkeleton,
  SectionHeaderSkeleton,
} from './CatalogChromeSkeleton';
import { SearchBar } from './SearchBar';

const noop = () => {};
const ROWS = [0, 1, 2];

interface TemplatesLoadingStateProps {
  onClose?: () => void;
}

export function TemplatesLoadingState({
  onClose,
}: TemplatesLoadingStateProps = {}) {
  const palette = useBrowserPalette();

  return (
    <View style={[s.container, { backgroundColor: palette.background }]}>
      <CatalogHeader onClose={onClose ?? noop} />
      {/* Inert until the catalog mounts — searching an empty cache does
          nothing, and a focusable field here would steal the keyboard. */}
      <View pointerEvents='none' style={s.searchWrap}>
        <SearchBar
          inputHint='Search habits…'
          value=''
          onChangeText={noop}
          onClear={noop}
        />
      </View>
      <ChipRailSkeleton />
      <SectionHeaderSkeleton />
      {ROWS.map((row) => (
        <CatalogRowSkeleton key={row} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: { paddingHorizontal: spacing.base, paddingTop: spacing.xs },
});
