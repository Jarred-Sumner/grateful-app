import React from "react";
import { View, StyleSheet, Switch as RNSwitch } from "react-native";
import {
  APP_COLOR_SCHEME,
  ColorScheme,
  COLORS,
  SPACING
} from "../lib/defaults";
import { Text } from "./Text";
import { Divider } from "./Divider";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 22
  },
  switch: {
    height: 22,
    transform: [
      {
        scaleX: 0.73
      },
      {
        scaleY: 0.73
      }
    ]
  }
});

export class Switch extends React.Component {
  static defaultProps = {
    colorScheme: APP_COLOR_SCHEME,
    value: false
  };

  render() {
    const { colorScheme, value, onChange, label, ...otherProps } = this.props;

    if (label) {
      return (
        <View style={styles.container}>
          <Text
            lineHeight={22}
            color={new ColorScheme(colorScheme).primaryColor}
            size={14}
          >
            {label}
          </Text>
          <Divider width={SPACING.SMALL} />
          <RNSwitch
            onValueChange={onChange}
            style={styles.switch}
            {...otherProps}
            value={value}
          />
        </View>
      );
    } else {
      return (
        <RNSwitch {...otherProps} value={value} onValueChange={onChange} />
      );
    }
  }
}

export default Switch;
