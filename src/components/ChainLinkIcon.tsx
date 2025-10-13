import React from "react";
import { View } from "react-native";
import { Link2 } from "lucide-react-native";
import Svg, { G, Rect } from "react-native-svg";

interface ChainLinkIconProps {
  color?: string;
  size?: number;
  variant?: "stroke" | "filled";
  angleDeg?: number;
}

export const ChainLinkIcon: React.FC<ChainLinkIconProps> = ({
  color = "#ffffff",
  size = 20,
  variant = "stroke",
  angleDeg = 0,
}) => {
  if (variant === "stroke") {
    return (
      <View
        className="items-center justify-center"
        style={{ transform: [{ rotate: `${angleDeg}deg` }] }}
      >
        <Link2
          color={color}
          size={size}
          strokeWidth={3}
          // lucide already uses round caps/joins; ensure consistency
        />
      </View>
    );
  }

  const width = size;
  const height = Math.round((size * 16) / 20);

  return (
    <View
      className="items-center justify-center"
      style={{ transform: [{ rotate: `${angleDeg}deg` }] }}
    >
      <Svg width={width} height={height} viewBox="0 0 20 16" fill="none">
        <G fill={color}>
          <Rect x={1.6} y={7} width={8} height={3.2} rx={1.6} transform="rotate(-30 1.6 7)" />
          <Rect x={10.4} y={5.8} width={8} height={3.2} rx={1.6} transform="rotate(30 10.4 5.8)" />
          <Rect x={8.8} y={7.2} width={2.4} height={1.6} rx={0.8} />
        </G>
      </Svg>
    </View>
  );
};
