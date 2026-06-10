/** AppearanceSection — appearance settings with a live calendar preview */
import { CalendarPreview } from '../CalendarPreview';
import { CompletionIconSettingsRow } from '../CompletionIconSettingsRow';
import { DayMarkerShapeSettingsRow } from '../DayMarkerShapeSettingsRow';
import { GrowthIconsSettingsRow } from '../GrowthIconsSettingsRow';
import { SettingsSection } from '../SettingsSection';
import { ThemeSettingsRow } from '../ThemeSettingsRow';
import { AppearanceChainRows } from './AppearanceChainRows';
import { AppearanceDisplayRows } from './AppearanceDisplayRows';
import type { AppearanceSectionProps } from './AppearanceSection.types';

export function AppearanceSection(p: AppearanceSectionProps) {
  return (
    <SettingsSection
      collapsible
      highContrastMode={p.highContrastMode}
      icon={p.icon}
      isExpanded={p.isExpanded}
      title='Appearance'
      onToggle={p.onToggleSection}
    >
      <CalendarPreview
        compact={p.compactView}
        completionIcon={p.habitCompletionIcon}
        dayShape={p.dayShape}
        highContrastMode={p.highContrastMode}
        showGradientFill={p.showGradientFill}
        showStreakConnections={p.showStreakConnections}
      />
      <ThemeSettingsRow
        highContrastMode={p.highContrastMode}
        selected={p.darkModePreference}
        onSelect={p.onChangeDarkModePreference}
      />
      <DayMarkerShapeSettingsRow
        highContrastMode={p.highContrastMode}
        selected={p.dayShape}
        onSelect={p.onChangeDayShape}
      />
      <AppearanceChainRows
        highContrastMode={p.highContrastMode}
        showGradientFill={p.showGradientFill}
        showStreakConnections={p.showStreakConnections}
        onChangeShowGradientFill={p.onChangeShowGradientFill}
        onChangeShowStreakConnections={p.onChangeShowStreakConnections}
      />
      <CompletionIconSettingsRow
        highContrastMode={p.highContrastMode}
        selected={p.habitCompletionIcon}
        onSelect={p.onChangeHabitCompletionIcon}
      />
      <GrowthIconsSettingsRow highContrastMode={p.highContrastMode} />
      <AppearanceDisplayRows
        compactView={p.compactView}
        highContrastEnabled={p.highContrastEnabled}
        highContrastMode={p.highContrastMode}
        onChangeCompactView={p.onChangeCompactView}
        onChangeHighContrast={p.onChangeHighContrast}
      />
    </SettingsSection>
  );
}
