import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SPACING, COLORS } from "../lib/defaults";

const heightStyles = StyleSheet.create({
  1: {
    height: 1
  },
  [StyleSheet.hairlineWidth]: {
    height: StyleSheet.hairlineWidth
  },
  55: {
    height: 55
  },
  80: {
    height: 80
  },
  "100%": {
    height: "100%"
  },
  [SPACING.XSMALL]: { height: SPACING.XSMALL },
  [SPACING.SMALL]: { height: SPACING.SMALL },
  [SPACING.NORMAL]: { height: SPACING.NORMAL },
  [SPACING.MEDIUM]: { height: SPACING.MEDIUM },
  [SPACING.LARGE]: { height: SPACING.LARGE },
  [SPACING.HUGE]: { height: SPACING.HUGE }
});

const widthStyles = StyleSheet.create({
  1: {
    width: 1,
    flexDirection: "column"
  },
  "100%": {
    width: "100%"
  },
  120: {
    width: 120
  },
  [StyleSheet.hairlineWidth]: {
    width: StyleSheet.hairlineWidth
  },
  [SPACING.XSMALL]: { width: SPACING.XSMALL, flexDirection: "column" },
  [SPACING.SMALL]: { width: SPACING.SMALL, flexDirection: "column" },
  [SPACING.NORMAL]: { width: SPACING.NORMAL, flexDirection: "column" },
  [SPACING.MEDIUM]: { width: SPACING.MEDIUM, flexDirection: "column" },
  [SPACING.LARGE]: { width: SPACING.LARGE, flexDirection: "column" },
  [SPACING.HUGE]: { width: SPACING.HUGE, flexDirection: "column" }
});

const borderStyles = StyleSheet.create({
  [COLORS.WHITE]: {
    backgroundColor: COLORS.WHITE
  },
  [COLORS.GRAY]: {
    backgroundColor: COLORS.GRAY
  }
});

const getWidthStyle = width => {
  if (!width) {
    return undefined;
  }

  if (widthStyles[width]) {
    return widthStyles[width];
  } else {
    console.warn("[Performance] Missing width style for Divider", width);
    return { width };
  }
};

const getHeightStyle = height => {
  if (!height) {
    return undefined;
  }

  if (heightStyles[height]) {
    return heightStyles[height];
  } else {
    console.warn("[Performance] Missing height style for Divider", height);
    return { height };
  }
};

const getBorderStyle = border => {
  if (!border) {
    return undefined;
  }

  if (borderStyles[border]) {
    return borderStyles[border];
  } else {
    console.warn("[Performance] Missing border style for Divider", border);
    return { backgroundColor: border };
  }
};

export const Divider = ({
  size,
  inline = false,
  height,
  width,
  children,
  border,
  flex,
  style
}) => {
  const Component = inline ? Text : View;

  return (
    <Component
      collapsable={false}
      style={[
        width && getWidthStyle(width),
        height && getHeightStyle(height),
        border && getBorderStyle(border)
      ]}
    >
      {inline ? " " : children}
    </Component>
  );
};

export default Divider;
