import React from "react";
import { View } from "react-native";
import { ChainLinkIcon } from "../ChainLinkIcon";

/**
 * ChainConnector - Visual connector between habit cards
 *
 * Displays a subtle vertical line with a chain link icon to visually
 * connect consecutive habits in the list, creating a "chain" effect.
 *
 * Design:
 * - Height: 16px (h-4) to fit in gap-4 spacing
 * - Negative margin (-my-2) to maintain original 16px total gap
 * - Vertical line: 2px wide, gray-200 (#e5e7eb)
 * - Chain icon: 14px, slate-400 (#94a3b8) on white background
 */
export const ChainConnector: React.FC = () => {
  return (
    <View className="-my-2 h-4 items-center justify-center">
      {/* Vertical connecting line */}
      <View className="absolute h-full w-0.5 bg-gray-200" />

      {/* Chain link icon with white circular background */}
      <View className="h-5 w-5 items-center justify-center rounded-full bg-white">
        <ChainLinkIcon color="#94a3b8" size={14} variant="stroke" />
      </View>
    </View>
  );
};
