/* eslint-disable max-lines */
/**
 * Network Tab Component
 * API latency and network request information.
 */

import React, { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';

import type { NetworkData } from '../types';
import { StatRow } from './StatRow';
import { StatusIndicator } from './StatusIndicator';
import { networkStyles } from './NetworkTab.styles';
import { tabStyles, valueStyles } from './tabStyles';

interface NetworkTabProps {
  data: NetworkData;
}

export function NetworkTab({ data }: NetworkTabProps) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.mainMetric}>
        <View>
          <Text style={valueStyles.value}>{data.p95Latency.toFixed(0)}</Text>
          <Text style={valueStyles.label}>P95 Latency (ms)</Text>
        </View>
        <StatusIndicator size='large' status={data.status} />
      </View>

      <View style={tabStyles.stats}>
        <StatRow
          label='Avg Latency'
          value={`${data.averageLatency.toFixed(0)}ms`}
        />
        <StatRow label='Total Requests' value={data.totalRequests.toString()} />
        <StatRow
          label='Error Rate'
          value={`${(data.errorRate * 100).toFixed(1)}%`}
        />
        <StatRow label='Pending' value={data.pendingCount.toString()} />
      </View>

      <RequestsList requests={data.recentRequests} />
    </View>
  );
}

function RequestsList({
  requests,
}: {
  requests: NetworkData['recentRequests'];
}) {
  const recentRequests = requests.slice(-5).reverse();

  const renderItem = useCallback(
    ({ item }: { item: NetworkData['recentRequests'][0] }) => (
      <RequestRow request={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (_: NetworkData['recentRequests'][0], index: number) => `${index}`,
    []
  );

  return (
    <View style={networkStyles.requests}>
      <Text style={tabStyles.historyLabel}>Recent Requests</Text>
      {recentRequests.length === 0 ? (
        <Text style={tabStyles.emptyText}>No requests yet</Text>
      ) : (
        <FlatList
          nestedScrollEnabled
          data={recentRequests}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={tabStyles.scrollView}
          windowSize={3}
        />
      )}
    </View>
  );
}

function RequestRow({
  request,
}: {
  request: NetworkData['recentRequests'][0];
}) {
  return (
    <View style={networkStyles.requestRow}>
      <View style={networkStyles.requestInfo}>
        <Text style={networkStyles.requestMethod}>{request.method}</Text>
        <Text numberOfLines={1} style={networkStyles.requestUrl}>
          {getUrlPath(request.url)}
        </Text>
      </View>
      <Text
        style={[
          networkStyles.requestDuration,
          request.duration > 200 && networkStyles.slowRequest,
        ]}
      >
        {request.duration.toFixed(0)}ms
      </Text>
    </View>
  );
}

function getUrlPath(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url.slice(0, 40);
  }
}
