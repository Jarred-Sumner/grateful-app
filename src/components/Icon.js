import React from "react";
import { createIconSetFromFontello } from "react-native-vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../lib/defaults";
import fontelloConfig from "./Icon/config.json";
const _Icon = createIconSetFromFontello(fontelloConfig);

const ICON_COMPONENT_BY_TYPE = {
  Fontello: _Icon,
  FontAwesome: FontAwesome
};

export class Icon extends React.PureComponent {
  render() {
    const {
      size = 18,
      color = COLORS.BLACK,
      name,
      type = "Fontello",
      lineHeight
    } = this.props;

    const IconComponent = ICON_COMPONENT_BY_TYPE[type];

    return (
      <IconComponent
        lineHeight={lineHeight}
        name={name}
        size={size}
        color={color}
      />
    );
  }
}

export default Icon;
