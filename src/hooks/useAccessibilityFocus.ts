/** useAccessibilityFocus — send VoiceOver/TalkBack focus to a ref'd element on demand */
import { useRef } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

export function useAccessibilityFocus() {
  const ref = useRef<any>(null);

  const focus = () => {
    const node = findNodeHandle(ref.current);
    if (node != null) AccessibilityInfo.setAccessibilityFocus(node);
  };

  return { ref, focus };
}
