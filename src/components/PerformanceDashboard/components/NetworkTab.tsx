/**
 * Network Tab Component
 * API latency and network request information.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusIndicator } from './StatusIndicator';
import { StatRow } from './StatRow';
import { tabStyles, valueStyles } from './tabStyles';
import type { NetworkData } from '../types';

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
  return (
    <View style={styles.requests}>
      <Text style={tabStyles.historyLabel}>Recent Requests</Text>
      <ScrollView nestedScrollEnabled style={tabStyles.scrollView}>
        {requests.length === 0 ? (
          <Text style={tabStyles.emptyText}>No requests yet</Text>
        ) : (
          requests
            .slice(-5)
            .reverse()
            .map((req, i) => <RequestRow key={i} request={req} />)
        )}
      </ScrollView>
    </View>
  );
}

function RequestRow({
  request,
}: {
  request: NetworkData['recentRequests'][0];
}) {
  return (
    <View style={styles.requestRow}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestMethod}>{request.method}</Text>
        <Text numberOfLines={1} style={styles.requestUrl}>
          {getUrlPath(request.url)}
        </Text>
      </View>
      <Text
        style={[
          styles.requestDuration,
          request.duration > 200 && styles.slowRequest,
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

const styles = StyleSheet.create({
  requestDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'monospace',
    fontSize: 10,
  },
  requestInfo: { flex: 1, flexDirection: 'row', gap: 6 },
  requestMethod: {
    color: '#22c55e',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '600',
    width: 32,
  },
  requestRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  requests: { gap: 4 },
  requestUrl: { color: 'rgba(255,255,255,0.6)', flex: 1, fontSize: 10 },
  slowRequest: { color: '#f59e0b' },
});
