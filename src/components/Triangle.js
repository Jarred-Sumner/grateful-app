import React from "react";
import { Defs, G, Polygon, Svg } from "react-native-svg";
import { COLORS } from "../lib/defaults";

export default function Triangle({
  height = 4,
  width = 7,
  fill = COLORS.WHITE,
  ...otherProps
}) {
  return (
    <Svg {...otherProps} height={height} width={width} viewBox="0 0 7 4">
      <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <G fill={fill} transform="translate(-236.000000, -41.000000)">
          <Polygon
            points="239.5 41 243 45 236 45"
            transform="translate(239.500000, 43.000000) scale(1, -1) translate(-239.500000, -43.000000) "
          />
        </G>
      </G>
    </Svg>
  );
}
