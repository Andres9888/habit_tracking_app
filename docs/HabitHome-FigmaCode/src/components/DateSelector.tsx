import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DateSelectorProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
}

export function DateSelector({
  currentWeekOffset,
  onWeekChange,
}: DateSelectorProps) {
  const getDatesForWeek = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + offset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const dates = getDatesForWeek(currentWeekOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <div className='px-6 py-4'>
      <div className='mb-4 flex items-center justify-between'>
        <button
          onClick={() => onWeekChange(currentWeekOffset - 1)}
          className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        <span className='text-sm text-gray-600'>
          {dates[0].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {dates[6].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>

        <button
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          disabled={currentWeekOffset >= 0}
          className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      <motion.div
        key={currentWeekOffset}
        initial={{ opacity: 0, x: currentWeekOffset > 0 ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className='flex justify-between gap-2'
      >
        {dates.map((date, index) => {
          const isToday = date.getTime() === today.getTime();
          const dateStr = date.toISOString().split('T')[0];

          return (
            <div
              key={index}
              className='flex flex-1 flex-col items-center gap-1'
            >
              <div className='text-[11px] uppercase tracking-wide text-gray-500'>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${isToday ? 'bg-black text-white' : 'text-gray-700'} `}
              >
                <span className='text-[17px] font-medium'>
                  {date.getDate()}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
