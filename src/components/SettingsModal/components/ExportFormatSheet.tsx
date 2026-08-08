/** ExportFormatSheet — themed replacement for the native format Alert chain.
 *  The old flow fired a toast on tap, THEN asked for a format in a system
 *  Alert, then reported in a second Alert: three feedback systems, and the
 *  toast claimed an export had started even when the user hit Cancel. */
import { Text, View } from 'react-native';
import { Braces, FileSpreadsheet } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import Modal from '../../Modal';
import { fontFamilies } from '@/theme/typography';
import { useThemeColors } from '../../../theme/ThemeContext';
import { ExportFormatOption } from './ExportFormatOption';

export type ExportFormat = 'csv' | 'json';

interface ExportFormatSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (format: ExportFormat) => void;
}

export function ExportFormatSheet({
  visible,
  onClose,
  onSelect,
}: ExportFormatSheetProps) {
  const { colors: themeColors, settings } = useThemeColors();

  const handleSelect = (format: ExportFormat) => {
    onClose();
    onSelect(format);
  };

  return (
    <Modal inline variant='bottomSheet' visible={visible} onClose={onClose}>
      <View className='px-4' style={{ paddingBottom: 12, paddingTop: 4 }}>
        <Text
          style={{
            color: themeColors.text.primary,
            fontFamily: fontFamilies.serif,
            fontSize: 21,
            fontWeight: '700',
          }}
        >
          Export your data
        </Text>
        <Text
          style={{
            color: themeColors.text.secondary,
            fontSize: 13,
            marginBottom: 14,
            marginTop: 2,
          }}
        >
          Habits, streaks and daily tracking — archived habits included.
        </Text>

        <View style={{ gap: 8 }}>
          <ExportFormatOption
            icon={
              <FileSpreadsheet
                color={settings.export.icon}
                size={iconSizes.small}
              />
            }
            iconBackgroundColor={settings.export.bg}
            label='CSV'
            subtitle='Opens in Numbers or Excel'
            onPress={() => handleSelect('csv')}
          />
          <ExportFormatOption
            recommended
            icon={<Braces color={settings.user.icon} size={iconSizes.small} />}
            iconBackgroundColor={settings.user.bg}
            label='JSON'
            subtitle='Full fidelity, best for AI analysis'
            onPress={() => handleSelect('json')}
          />
        </View>
      </View>
    </Modal>
  );
}
