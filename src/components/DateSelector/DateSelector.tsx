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

        const accessibilityLabel = isCurrent
          ? `Today, ${weekday} ${month} ${day}`
          : `${weekday} ${month} ${day}`;

        return (
          <View
            key={index}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="text"
            className="w-10 items-center gap-1"
          >
            <Text
              className={`text-center text-xs font-semibold tracking-widest ${isCurrent ? "text-slate-900" : "text-slate-400"}`}
            >
              {month}
            </Text>
            <Text
              className={`text-center text-[30px] font-bold leading-9 ${isCurrent ? "text-slate-900" : "text-slate-400"}`}
            >
              {day}
            </Text>
            <Text
              className={`text-center text-xs font-bold tracking-wide ${isCurrent ? "text-slate-900" : "text-slate-400"}`}
            >
              {weekday}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
