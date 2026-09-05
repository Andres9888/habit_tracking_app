/**
 * One row of the "More to customize" panel.
 *
 * Closed = a single 60px head line; open = the same head at 36px plus an
 * animated body. `onToggle` omitted renders a non-pressable head with no
 * chevron (used by the reminder row while its Switch is off).
 *
 * Props are stable API — the reminder row builds on them.
 */
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { InlineExpandBody } from '../InlineExpandBody';
import { useInlineExpand } from '../useInlineExpand';
import { usePanelTokens, type PanelHueKey } from './panelTokens';
import { PanelRowHead } from './PanelRowHead';

export interface PanelRowProps {
  /** Colour family for the tile + value chip. */
  hue: PanelHueKey;
  icon: ReactNode;
  title: string;
  /** Single-line secondary line under the title. */
  hint: string;
  hintColor?: string;
  value?: { label: string; set: boolean } | null;
  /** Rendered between the value chip and the chevron (e.g. a Switch). */
  trailing?: ReactNode;
  open: boolean;
  /** Omitted = head is not pressable and no chevron renders. */
  onToggle?: () => void;
  divided?: boolean;
  showChevron?: boolean;
  accessibilityLabel?: string;
  /** The open body. */
  children?: ReactNode;
  testID?: string;
}

export function PanelRow({
  hue,
  icon,
  title,
  hint,
  hintColor,
  value,
  trailing,
  open,
  onToggle,
  divided = true,
  showChevron = true,
  accessibilityLabel,
  children,
  testID,
}: PanelRowProps) {
  const t = usePanelTokens();
  const expand = useInlineExpand(open);
  const head = (
    <PanelRowHead
      chevronStyle={expand.chevronAnimatedStyle}
      hint={hint}
      hintColor={hintColor}
      hueTokens={t.hues[hue]}
      icon={icon}
      open={open}
      showChevron={showChevron && Boolean(onToggle)}
      title={title}
      trailing={trailing}
      value={value}
    />
  );

  return (
    <View
      style={{
        ...(divided
          ? { borderTopWidth: 1, borderTopColor: t.panelBorder }
          : null),
        paddingTop: 12,
        paddingBottom: open ? 16 : 12,
      }}
      testID={testID}
    >
      {onToggle ? (
        <Pressable
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityRole='button'
          accessibilityState={{ expanded: open }}
          onPress={onToggle}
        >
          {head}
        </Pressable>
      ) : (
        head
      )}
      {children ? (
        <InlineExpandBody expand={expand} open={open}>
          <View style={{ paddingTop: 12 }}>{children}</View>
        </InlineExpandBody>
      ) : null}
    </View>
  );
}
