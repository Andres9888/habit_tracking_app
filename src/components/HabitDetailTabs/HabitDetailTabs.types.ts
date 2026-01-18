/**
 * HabitDetailTabs Types
 */

export type TabType = 'progress' | 'motivation' | 'manage';

export interface TabConfig {
  id: TabType;
  label: string;
}

export interface HabitDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface TabButtonProps {
  isActive: boolean;
  label: string;
  onPress: () => void;
}

export interface TabContentProps {
  activeTab: TabType;
  children: React.ReactNode;
  contentContainerStyle?: object;
  onScroll?: (event: unknown) => void;
}

export interface TabSectionProps {
  children: React.ReactNode;
  tabId: TabType;
}

export interface TabPaneProps {
  children: React.ReactNode;
  isActive: boolean;
  tabId: TabType;
}
