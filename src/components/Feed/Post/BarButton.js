import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../../Icon";
import Text from "../../Text";
import { COLORS, SPACING } from "../../../lib/defaults";
import Divider from "../../Divider";
import Numeral from "numeral";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: SPACING.NORMAL,
    paddingHorizontal: SPACING.NORMAL
  }
});

export default class BarButton extends React.Component {
  render() {
    const {
      iconName,
      active,
      activeColor = COLORS.DARK_GRAY,
      inactiveColor = COLORS.MEDIUM_GRAY,
      count,
      onPress,
      children
    } = this.props;

    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        <View style={styles.container}>
          <Icon
            name={iconName}
            color={active ? activeColor : inactiveColor}
            size={18}
            style={{ lineHeight: 20 }}
          />

          <Divider width={SPACING.SMALL} />

          <Text
            size={14}
            lineHeight={20}
            style={{ height: 20 }}
            color={active ? activeColor : inactiveColor}
          >
            {count === 0 && children ? children : Numeral(count).format("0,0")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
