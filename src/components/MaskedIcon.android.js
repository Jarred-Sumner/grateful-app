import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "./Icon";
import { ColorScheme } from "../lib/defaults";

export class MaskedIcon extends React.Component {
  render() {
    const { style, name, size, width, height, colorScheme } = this.props;

    const primaryColor = new ColorScheme(colorScheme).primaryColor;

    return (
      <View
        style={StyleSheet.flatten([
          style,
          { height, width, overflow: "hidden" }
        ])}
      >
        <Icon name={name} size={size} color={primaryColor} />
      </View>
    );
  }
}
