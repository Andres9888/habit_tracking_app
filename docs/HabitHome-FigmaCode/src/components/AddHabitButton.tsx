import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface AddHabitButtonProps {
  onClick: () => void;
}

export function AddHabitButton({ onClick }: AddHabitButtonProps) {
  return (
    <div className="p-6">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow ml-auto"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
