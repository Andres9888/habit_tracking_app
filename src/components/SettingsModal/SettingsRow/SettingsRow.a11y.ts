/** Accessibility props derived from a row's type and state.
 *  Toggle rows announce On/Off, selection rows announce their current value,
 *  expandable rows announce disclosure state, and disabled/busy reach
 *  assistive tech via accessibilityState. */
import type { AccessibilityProps } from 'react-native';
import type { SettingsRowProps } from './SettingsRow.types';

type A11yInput = Pick<
  SettingsRowProps,
  'type' | 'value' | 'label' | 'accessibilityLabel' | 'accessibilityHint'
> & {
  expanded?: boolean;
  disabled?: boolean;
  busy?: boolean;
};

function buildAccessibilityValue(
  type: SettingsRowProps['type'],
  value: SettingsRowProps['value']
): AccessibilityProps['accessibilityValue'] {
  if (type === 'toggle' && typeof value === 'boolean') {
    return { text: value ? 'On' : 'Off' };
  }
  if (typeof value === 'string' && value.length > 0) return { text: value };
  return undefined;
}

export function getSettingsRowA11y(p: A11yInput): AccessibilityProps {
  // Only rows that actually disclose something get the hint. Keying it off
  // `type === 'toggle'` handed "Shows more options" to every switch on the
  // page — Compact habit cards, Streak reminders, Sticky month header — none
  // of which reveal anything when tapped.
  const hasDisclosureHint = p.expanded !== undefined;
  const state = {
    ...(p.expanded !== undefined ? { expanded: p.expanded } : {}),
    ...(p.disabled !== undefined ? { disabled: p.disabled } : {}),
    ...(p.busy !== undefined ? { busy: p.busy } : {}),
  };

  return {
    accessibilityLabel: p.accessibilityLabel ?? p.label,
    accessibilityValue: buildAccessibilityValue(p.type, p.value),
    accessibilityHint:
      p.accessibilityHint ??
      (hasDisclosureHint ? 'Shows more options' : undefined),
    accessibilityState: Object.keys(state).length > 0 ? state : undefined,
  };
}
