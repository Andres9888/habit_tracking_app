/**
 * Holds the library's selected goal in memory only.
 * No persistence — the Library starts fresh each time it opens (the modal
 * unmounts on close), so no path is ever pre-selected on return visits.
 */

import { useState } from 'react';

export function useSelectedGoal() {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  return { selectedGoalId, setSelectedGoalId };
}
