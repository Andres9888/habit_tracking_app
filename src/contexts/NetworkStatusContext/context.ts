/**
 * NetworkStatusContext - Context definition
 */

import { createContext } from 'react';
import type { NetworkStatusContextValue } from './types';
import { defaultContextValue } from './defaults';

export const NetworkStatusContext =
  createContext<NetworkStatusContextValue>(defaultContextValue);
