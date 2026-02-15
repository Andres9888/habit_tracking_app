/**
 * Data Export section for Settings — GDPR Article 20 compliance
 *
 * Allows users to export ALL their data in JSON or CSV format.
 */

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Download } from 'lucide-react-native';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { useFullDataExport } from '../../../hooks/useFullDataExport';

interface Props {
  highContrast: boolean;
}

export function DataExportRow({ highContrast }: Props) {
  const { isExporting, promptExport } = useFullDataExport();

  return (
    <SettingsSection highContrastMode={highContrast} title='Your Data'>
      <SettingsRow
        highContrastMode={highContrast}
        icon={
          isExporting ? (
            <ActivityIndicator color='#059669' size='small' />
          ) : (
            <Download color='#059669' size={16} />
          )
        }
        iconBackgroundColor='#d1fae5'
        label={isExporting ? 'Exporting…' : 'Export My Data'}
        showBorder={false}
        type='navigation'
        onPress={isExporting ? undefined : promptExport}
      />
    </SettingsSection>
  );
}
