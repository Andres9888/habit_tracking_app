/**
 * Shared validator for the per-stage growth emoji map.
 * Used by habits (per-habit override) and userSettings (global default).
 */
import { v } from 'convex/values';

export const progressEmojisValidator = v.object({
  starting: v.string(),
  building: v.string(),
  developing: v.string(),
  strong: v.string(),
  automatic: v.string(),
});
