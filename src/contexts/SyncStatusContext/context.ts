/**
 * SyncStatusContext Creation
 */

import { createContext } from 'react';
import type { SyncStatusContextValue } from './types';
import { defaultContextValue } from './defaults';

export const SyncStatusContext =
  createContext<SyncStatusContextValue>(defaultContextValue);
