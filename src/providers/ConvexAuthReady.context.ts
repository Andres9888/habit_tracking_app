import { createContext, useContext } from 'react';

export const ConvexAuthReadyContext = createContext({ isConvexReady: false });

export function useConvexAuthReady(): boolean {
  return useContext(ConvexAuthReadyContext).isConvexReady;
}
