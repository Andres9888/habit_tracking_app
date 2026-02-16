/**
 * Deep Link Analytics
 * 
 * Captures and tracks deep link parameters for attribution and analytics
 */

import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DeepLinkEvent } from './types';
import { trackEvent } from './service';

const STORAGE_KEY = '@analytics/deep_link_attribution';

interface DeepLinkParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrer?: string;
  [key: string]: string | undefined;
}

/**
 * Parse deep link URL and extract UTM parameters
 */
export function parseDeepLink(url: string): DeepLinkEvent {
  const parsed = Linking.parse(url);
  const params = (parsed.queryParams || {}) as DeepLinkParams;

  const event: DeepLinkEvent = {
    url,
    source: params.utm_source || params.source,
    medium: params.utm_medium || params.medium,
    campaign: params.utm_campaign || params.campaign,
    content: params.utm_content || params.content,
    term: params.utm_term || params.term,
    referrer: params.referrer || params.ref,
    timestamp: Date.now(),
    converted: false,
    params: Object.fromEntries(
      Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, value as string])
    ),
  };

  return event;
}

/**
 * Store deep link attribution data
 */
export async function storeDeepLinkAttribution(event: DeepLinkEvent): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(event));
    
    trackEvent('deep_link_captured', {
      timestamp: event.timestamp,
      sessionId: '', // Will be filled by analytics service
      category: 'engagement',
      priority: 'high',
      source: event.source,
      campaign: event.campaign,
      hasParams: Object.keys(event.params).length > 0,
    });
  } catch (error) {
    if (__DEV__) {
      console.error('[DeepLink] Failed to store attribution:', error);
    }
  }
}

/**
 * Get stored deep link attribution
 */
export async function getDeepLinkAttribution(): Promise<DeepLinkEvent | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    if (__DEV__) {
      console.error('[DeepLink] Failed to retrieve attribution:', error);
    }
    return null;
  }
}

/**
 * Mark deep link as converted (user completed desired action)
 */
export async function markDeepLinkConverted(): Promise<void> {
  try {
    const attribution = await getDeepLinkAttribution();
    if (!attribution) return;

    attribution.converted = true;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));

    trackEvent('deep_link_converted', {
      timestamp: Date.now(),
      sessionId: '', // Will be filled by analytics service
      category: 'conversion',
      priority: 'critical',
      source: attribution.source,
      campaign: attribution.campaign,
      timeSinceClick: Date.now() - attribution.timestamp,
    });
  } catch (error) {
    if (__DEV__) {
      console.error('[DeepLink] Failed to mark conversion:', error);
    }
  }
}

/**
 * Clear deep link attribution (e.g., after attribution window expires)
 */
export async function clearDeepLinkAttribution(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('[DeepLink] Failed to clear attribution:', error);
    }
  }
}

/**
 * Get attribution summary for analytics
 */
export function getAttributionSummary(event: DeepLinkEvent): {
  hasAttribution: boolean;
  attributionString: string;
  source?: string;
  campaign?: string;
} {
  const hasAttribution = !!(event.source || event.campaign || event.medium);
  
  const parts: string[] = [];
  if (event.source) parts.push(`source:${event.source}`);
  if (event.medium) parts.push(`medium:${event.medium}`);
  if (event.campaign) parts.push(`campaign:${event.campaign}`);
  
  return {
    hasAttribution,
    attributionString: parts.join(' | ') || 'organic',
    source: event.source,
    campaign: event.campaign,
  };
}
