/**
 * FPS Subscription Hook
 * Subscribes to frame data and updates FPS state.
 */

import { useEffect } from 'react';

import type { DashboardAction, FPSData } from '../types';
import type { FrameTimingData } from '../../../lib/performance';
import { getFPSStatus } from '../statusUtils';

export function useFPSSubscription(
  onFrameData: (callback: (data: FrameTimingData) => void) => () => void,
  fpsHistoryRef: React.MutableRefObject<FPSData['history']>,
  historyLimit: number,
  dispatch: React.Dispatch<DashboardAction>
) {
  useEffect(() => {
    const unsubscribe = onFrameData((data) => {
      fpsHistoryRef.current = [
        ...fpsHistoryRef.current.slice(-(historyLimit - 1)),
        data,
      ];

      const avgFPS =
        fpsHistoryRef.current.length > 0
          ? fpsHistoryRef.current.reduce((sum, f) => sum + f.fps, 0) /
            fpsHistoryRef.current.length
          : 60;

      dispatch({
        data: {
          averageFPS: avgFPS,
          currentFPS: data.fps,
          history: fpsHistoryRef.current,
          jankFrames: data.jankFrames,
          status: getFPSStatus(data.fps),
          totalFrames: data.totalFrames,
        },
        type: 'UPDATE_FPS',
      });
    });

    return unsubscribe;
  }, [onFrameData, historyLimit, dispatch, fpsHistoryRef]);
}
