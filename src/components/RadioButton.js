import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { APP_COLOR_SCHEME, COLORS, ColorScheme } from "../lib/defaults";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  circle: {},
  inactiveCircle: {
    backgroundColor: COLORS.WHITE
  }
});

export class RadioButton extends React.PureComponent {
  static defaultProps = {
    size: 20,
    margin: 2,
    colorScheme: APP_COLOR_SCHEME
  };

  render() {
    const {
      colorScheme,
      size,
      selected,
      disabled,
      onPress,
      margin
    } = this.props;
    const selectedColor = new ColorScheme(colorScheme).primaryColor;

    return (
      <TouchableWithoutFeedback disabled={disabled} onPress={onPress}>
        <View
          style={StyleSheet.flatten([
            styles.container,
            {
              backgroundColor: selectedColor,
              borderRadius: size / 2,
              width: size,
              height: size
            }
          ])}
        >
          <View
            collapsable={false}
            style={[
              styles.circle,
              {
                width: size - margin * 2,
                height: size - margin * 2,
                borderRadius: (size - margin * 2) / 2
              },
              !selected
                ? styles.inactiveCircle
                : {
                    backgroundColor: selectedColor
                  }
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default RadioButton;
