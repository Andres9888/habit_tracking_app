export interface PainPointOption {
  id: string;
  emoji: string;
  label: string;
}

export const PAIN_POINT_OPTIONS: PainPointOption[] = [
  { id: 'forget', emoji: '🧠', label: 'I forget about it' },
  {
    id: 'motivation',
    emoji: '⚡',
    label: 'I lose motivation after a few days',
  },
  {
    id: 'progress',
    emoji: '📉',
    label: "I can't tell if I'm making progress",
  },
  { id: 'chore', emoji: '😮\u200d💨', label: 'Apps start to feel like a chore' },
  { id: 'busy', emoji: '🗓️', label: 'Life gets busy and I skip days' },
  { id: 'overcommit', emoji: '🎢', label: 'I start too many things at once' },
  { id: 'start', emoji: '🤔', label: "I don't know where to start" },
];
