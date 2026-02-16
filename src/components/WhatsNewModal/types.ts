/**
 * WhatsNewModal Types
 */

export interface ChangelogEntry {
  version: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface WhatsNewModalProps {
  visible: boolean;
  changelog: ChangelogEntry;
  onDismiss: () => void;
}
