import Text, { WEIGHTS } from "./Text";
import { COLORS, SPACING } from "../lib/defaults";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableHighlight
} from "react-native";
import Icon from "./Icon";
import Switch from "./Switch";
import Row from "./Row";

const styles = StyleSheet.create({
  container: {},
  pickerContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MEDIUM
  },
  chevron: {},
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.NORMAL,
    flex: 1
  }
});

export const PickerRowItem = ({
  children,
  onPressRow,
  onPress,
  value,
  colorScheme,
  right,
  topDivider = false
}) => (
  <TouchableHighlight
    activeOpacity={0.75}
    onPress={onPressRow}
    underlayColor={COLORS.UNDERLAY_GRAY}
    style={[
      styles.pickerContainer,
      topDivider
        ? {
            borderTopWidth: 1,
            borderTopColor: COLORS.GRAY
          }
        : {}
    ]}
  >
    <View style={styles.content}>
      {children}

      <View style={styles.chevron}>
        {right || (
          <Switch colorScheme={colorScheme} value={value} onChange={onPress} />
        )}
      </View>
    </View>
  </TouchableHighlight>
);

export default class PickerRow extends React.Component {
  render() {
    const {
      onPress,
      rowItemProps,
      children,
      renderFooter,
      ...otherProps
    } = this.props;

    return (
      <Row {...otherProps}>
        <PickerRowItem {...rowItemProps} onPress={onPress}>
          {children}
        </PickerRowItem>
        {!!renderFooter && renderFooter()}
      </Row>
    );
  }
}
