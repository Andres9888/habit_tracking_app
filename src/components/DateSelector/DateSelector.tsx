import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import { useDateSelectorLogic } from "./DateSelector.hooks";

interface DateSelectorProps {
  dates: Date[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({ dates }) => {
  const { isToday } = useDateSelectorLogic();

  return (
    <View className="h-20 flex-row justify-between px-6 py-0">
      {dates.map((date, index) => {
        const isCurrent = isToday(date);
        const month = format(date, "MMM").toUpperCase();
        const day = format(date, "d");
        const weekday = format(date, "EEE").toUpperCase();

        // Accessibility label in order: Month Day, Weekday
        const labelCore = `${month} ${day}, ${weekday}`;
        const accessibilityLabel = isCurrent
          ? `Today, ${labelCore}`
          : labelCore;

        return (
          <View
            key={index}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="text"
            className="w-10 items-center gap-1"
          >
            <Text
              className={`text-center text-xs font-semibold tracking-widest ${
                isCurrent ? "text-[#101727]" : "text-[#a0aec0]"
              }`}
            >
              {month}
            </Text>
            <Text
              className={`text-center text-[30px] font-bold leading-9 ${
                isCurrent ? "text-[#101727]" : "text-[#a0aec0]"
              }`}
            >
              {day}
            </Text>
            <Text
              className={`text-center text-xs font-bold tracking-wide ${
                isCurrent ? "text-[#101727]" : "text-[#a0aec0]"
              }`}
            >
              {weekday}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
