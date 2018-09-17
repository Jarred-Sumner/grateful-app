import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import { SPACING } from "../lib/defaults";
import Text from "./Text";
import Icon from "./Icon";
// import { SPACING, Icon, Text, COLORS } from "applytodate";

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.LARGE
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%"
  },
  label: {
    paddingHorizontal: SPACING.MEDIUM,
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1,
    paddingBottom: SPACING.NORMAL
  },
  footer: {
    marginTop: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM
  }
});

export class Row extends React.Component {
  render() {
    const {
      label,
      rightLabel,
      value,
      footer,
      rowStyle,
      multiple = false,
      children,
      labelStyle,
      ...otherProps
    } = this.props;
    return (
      <View style={styles.container}>
        {!!label && (
          <View style={[styles.label, labelStyle]}>
            <Text type="label">{label}</Text>

            {rightLabel ? <Text type="label">{rightLabel}</Text> : null}
          </View>
        )}
        <View
          style={[
            styles.content,
            multiple
              ? {
                  flexDirection: "column"
                }
              : {},
            rowStyle
          ]}
        >
          {children}
        </View>
        {!!footer && (
          <View style={styles.footer}>
            <Text size={12} lineHeight={18}>
              {footer}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

export default Row;
