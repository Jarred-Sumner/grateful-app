import React from "react";
import { View, StyleSheet } from "react-native";
import { MaskedViewIOS } from "react-native";
import { Icon } from "./Icon";
import { COLORS, ColorScheme, APP_COLOR_SCHEME } from "../lib/defaults";
import invariant from "invariant";

export class MaskedIcon extends React.Component {
  render() {
    const { style, name, size, width, height, colorScheme } = this.props;
    invariant(width, "width is required");
    invariant(height, "height is required");

    return (
      <MaskedViewIOS
        style={StyleSheet.flatten([
          style,
          { height, width, overflow: "hidden" }
        ])}
        maskElement={
          <Icon
            lineHeight={height}
            name={name}
            size={size}
            color={COLORS.WHITE}
          />
        }
      >
        <View
          style={{ backgroundColor: colorScheme.primaryColor, width, height }}
        />
      </MaskedViewIOS>
    );
  }
}
