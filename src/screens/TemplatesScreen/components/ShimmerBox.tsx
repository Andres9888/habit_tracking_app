/**
 * ShimmerBox - Re-exports SkeletonLoader for backward compatibility.
 */

import { SkeletonLoader } from '../../../components/SkeletonLoader';
import type { SkeletonWidth } from '../../../components/SkeletonLoader';

export function ShimmerBox({
  width,
  height,
  delay: _delay,
  style,
}: {
  width: SkeletonWidth;
  height: number;
  delay?: number;
  style?: object;
}) {
  return (
    <SkeletonLoader
      borderRadius={8}
      height={height}
      style={style}
      width={width}
    />
  );
}
