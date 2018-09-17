import Numeral from "numeral";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import TinyColor from "tinycolor2";
import {
  BORDER_RADIUS,
  COLORS,
  ColorScheme,
  SPACING,
  APP_COLOR_SCHEME
} from "../../lib/defaults";
import Divider from "../Divider";
import Emoji from "../Emoji";
import Text, { WEIGHTS } from "../Text";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    marginBottom: SPACING.NORMAL,
    paddingVertical: SPACING.XSMALL,
    paddingHorizontal: SPACING.NORMAL,
    alignSelf: "flex-start",
    borderRadius: BORDER_RADIUS.SMALL,
    alignItems: "center",
    justifyContent: "center"
  }
});

export class Reaction extends React.Component {
  render() {
    const {
      colorScheme = APP_COLOR_SCHEME,
      emoji,
      onReact,
      selected,
      count
    } = this.props;
    const primaryColor = new ColorScheme(colorScheme).primaryColor;

    return (
      <TouchableWithoutFeedback onPress={() => onReact(emoji)}>
        <View
          shouldRasterizeIOS
          renderToHardwareTextureAndroid
          style={[
            styles.container,
            selected
              ? {
                  borderColor: primaryColor,
                  backgroundColor: TinyColor(primaryColor)
                    .setAlpha(0.05)
                    .toRgbString()
                }
              : {}
          ]}
        >
          <Emoji size={14}>{emoji}</Emoji>
          <Divider width={SPACING.SMALL} />
          <Text
            weight={selected ? WEIGHTS.SEMI_BOLD : WEIGHTS.NORMAL}
            color={selected ? primaryColor : COLORS.MEDIUM_GRAY}
            size={14}
          >
            {Numeral(count).format("0,0")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default React;
