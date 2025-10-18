import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface AddHabitButtonProps {
  onClick: () => void;
}

export function AddHabitButton({ onClick }: AddHabitButtonProps) {
  return (
    <div className='p-6'>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-shadow hover:shadow-xl'
      >
        <Plus className='h-6 w-6' />
      </motion.button>
    </div>
  );
}
