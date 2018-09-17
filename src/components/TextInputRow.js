import React from "react";
import { StyleSheet } from "react-native";
import TextInput from "./TextInput";
import Row from "./Row";
import { SPACING, COLORS } from "../lib/defaults";

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MEDIUM,
    justifyContent: "flex-start",
    flex: 0,
    width: "100%"
  }
});

export default ({
  value,
  onChange,
  placeholder,
  label,
  footer,
  inputStyle,
  multiLine,
  rowStyle,
  numberOfLines,
  icon,
  ...otherProps
}) => (
  <Row
    rowStyle={{
      backgroundColor: COLORS.WHITE,
      width: "100%",
      ...rowStyle
    }}
    label={label}
    footer={footer}
  >
    <TextInput
      {...otherProps}
      value={value}
      placeholder={placeholder}
      multiLine={multiLine}
      numberOfLines={numberOfLines}
      icon={icon}
      onChange={onChange}
      style={[styles.input, inputStyle]}
    />
  </Row>
);
