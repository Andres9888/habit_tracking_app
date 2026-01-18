export const useDateSelectorLogic = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() === today.getTime();
  };

  const isFuture = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate.getTime() > today.getTime();
  };

  return {
    isFuture,
    isToday,
  };
};
