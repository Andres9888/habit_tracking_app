import React from "react";
import { View } from "react-native";
import { ChainLinkIcon } from "../ChainLinkIcon";

/**
 * ChainConnector - Visual connector between habit cards
 *
 * Displays a vertical line with a chain link icon to visually
 * connect consecutive habits in the list, creating a "chain" effect.
 *
 * Design:
 * - Height: 24px with negative margins to maintain original spacing
 * - Vertical line: 3px wide, slate-400 (#94a3b8)
 * - Chain icon: 16px, slate-600 (#475569) on white background
 * - White circle: 24px diameter with shadow
 */
export const ChainConnector: React.FC = () => {
  return (
    <View
      style={{
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: -4, // Negative margin to maintain original gap-4 spacing
      }}
    >
      {/* Vertical connecting line */}
      <View
        style={{
          position: "absolute",
          width: 3,
          height: "100%",
          backgroundColor: "#94a3b8", // slate-400
        }}
      />

      {/* Chain link icon with white circular background */}
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1, // Ensure icon appears above the line
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2, // Android shadow
        }}
      >
        <ChainLinkIcon color="#475569" size={16} variant="stroke" />
      </View>
    </View>
  );
};
