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
    <SettingsSection icon={p.icon} title='Look & Feel'>
      <CalendarPreview
        compact={p.compactView}
        completionIcon={p.habitCompletionIcon}
        dayShape={p.dayShape}
        showGradientFill={p.showGradientFill}
        showStreakConnections={p.showStreakConnections}
      />
      <ThemeSettingsRow
        selected={p.darkModePreference}
        onSelect={p.onChangeDarkModePreference}
      />
      <DayMarkerShapeSettingsRow
        selected={p.dayShape}
        onSelect={p.onChangeDayShape}
      />
      <AppearanceChainRows
        showGradientFill={p.showGradientFill}
        showStreakConnections={p.showStreakConnections}
        onChangeShowGradientFill={p.onChangeShowGradientFill}
        onChangeShowStreakConnections={p.onChangeShowStreakConnections}
      />
      <CompletionIconSettingsRow
        selected={p.habitCompletionIcon}
        onSelect={p.onChangeHabitCompletionIcon}
      />
      <GrowthIconsSettingsRow />
      <AppearanceDisplayRows
        compactView={p.compactView}
        onChangeCompactView={p.onChangeCompactView}
      />
    </SettingsSection>
  );
}
