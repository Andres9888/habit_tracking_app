/** Nudges the parent scroll view once the accordion's measured layout settles open. */
import { useEffect, useRef } from 'react';
import { durations } from '@/theme/animations';

export function useScrollOnExpand(
  expanded: boolean,
  reduceMotion: boolean,
  onExpand?: () => void
) {
  const onExpandRef = useRef(onExpand);
  useEffect(() => {
    onExpandRef.current = onExpand;
  });

  useEffect(() => {
    if (!expanded) return;
    const scroll = setTimeout(
      () => onExpandRef.current?.(),
      reduceMotion ? 0 : durations.enter
    );
    return () => clearTimeout(scroll);
  }, [expanded, reduceMotion]);
}
