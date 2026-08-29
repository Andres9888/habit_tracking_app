import { useCreateHabitHandler } from './useCreateHabitHandler';
import { useEditHabitHandler } from './useEditHabitHandler';

export function useCreateHabitHandlers() {
  const handleCreate = useCreateHabitHandler();
  const handleEdit = useEditHabitHandler();
  return { handleCreate, handleEdit };
}
