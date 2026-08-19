import { api } from '../../../../convex/_generated/api';
import {
  DEFAULT_SETTINGS,
  type ConnectorStyle,
} from '../../../../convex/settings/types';
import { useCachedQuery } from '../../../lib/queryCache';

export function useCalendarAppearance(): {
  connectorStyle: ConnectorStyle;
  dayShape: 'circle' | 'square';
} {
  const settings = useCachedQuery(api.settings.get, {}, {
    entryName: 'settings.get',
  });

  return {
    connectorStyle: settings?.connectorStyle ?? DEFAULT_SETTINGS.connectorStyle,
    dayShape: settings?.dayShape ?? DEFAULT_SETTINGS.dayShape,
  };
}
