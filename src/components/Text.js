import React from "react";
import { Text as RNText, Animated, Platform, StyleSheet } from "react-native";
import { COLORS } from "../lib/defaults";
import _ from "lodash";

export const FONTS = {
  SANS_SERIF: "Open Sans"
};

const OPEN_SANS_FONT_CONSTANT = 196 / 111;

const getNumberOfLines = ({
  text,
  fontSize,
  containerWidth,
  charactersPerLine
}) => {
  if (charactersPerLine) {
    if (!text) {
      return 1;
    }

    return Math.ceil(text.length / charactersPerLine);
  }

  let _charactersPerLine = Math.floor(
    containerWidth / (fontSize / OPEN_SANS_FONT_CONSTANT)
  );
  const words = text.split(" ");
  const elements = [];
  let line = "";

  while (words.length > 0) {
    if (
      line.length + words[0].length + 1 <= _charactersPerLine ||
      (line.length === 0 && words[0].length + 1 >= _charactersPerLine)
    ) {
      let word = words.splice(0, 1);
      if (line.length === 0) {
        line = word;
      } else {
        line = line + " " + word;
      }
      if (words.length === 0) {
        elements.push(line);
      }
    } else {
      elements.push(line);
      line = "";
    }
  }
  return elements.length;
};

export const WEIGHTS = {
  THIN: "300",
  NORMAL: "normal",
  MEDIUM: "500",
  SEMI_BOLD: "600",
  EXTRA_BOLD: "800",
  BOLD: "bold"
};

const ANDROID_FONTS = {
  [FONTS.SANS_SERIF]: {
    [WEIGHTS.THIN]: "OpenSans-Light",
    [WEIGHTS.NORMAL]: "OpenSans-Regular",
    [WEIGHTS.MEDIUM]: "OpenSans-Regular",
    [WEIGHTS.SEMI_BOLD]: "OpenSans-Semibold",
    [WEIGHTS.BOLD]: "OpenSans-Bold",
    [WEIGHTS.EXTRA_BOLD]: "OpenSans-ExtraBold"
  }
};

export const getFontFamily = ({ font, weight }) => {
  if (Platform.OS === "android") {
    return ANDROID_FONTS[font][weight];
  } else {
    return font;
  }
};

export const measureText = ({
  size,
  weight = WEIGHTS.NORMAL,
  lineHeight = 19,
  charactersPerLine,
  width,
  padding = 0,
  margin = 0,
  text
}) => {
  const numberOfLines = getNumberOfLines({
    fontSize: size,
    text,
    charactersPerLine,
    containerWidth: width
  });

  return numberOfLines * lineHeight;
};
export class Text extends React.Component {
  render() {
    const {
      font = FONTS.SANS_SERIF,
      color = COLORS.DARK_GRAY,
      size = 14,
      weight = WEIGHTS.NORMAL,
      lineHeight,
      textDecoration = "none",
      letterSpacing = 0,
      align = "left",
      selectable,
      maxLength = null,
      style,
      wrap,
      numberOfLines,
      children,
      onPress,
      onLongPress,
      pointerEvents,
      animated = false
    } = this.props;

    const Component = animated ? Animated.Text : RNText;

    return (
      <Component
        onPress={onPress}
        onLongPress={onLongPress}
        pointerEvents={pointerEvents}
        selectable={selectable}
        numberOfLines={wrap === false ? 1 : numberOfLines}
        style={StyleSheet.flatten([
          {
            backgroundColor: "transparent",
            fontFamily: getFontFamily({ font, weight }),
            color,
            fontSize: size,
            lineHeight,
            letterSpacing,
            fontWeight: weight || WEIGHTS.normal,
            textAlign: align
          },
          style
        ])}
      >
        {maxLength ? _.truncate(children, { length: maxLength }) : children}
      </Component>
    );
  }
}

export default ({ type, children, ...otherProps }) => {
  if (type === "title") {
    return (
      <Text
        {...otherProps}
        font={FONTS.SANS_SERIF}
        size={30}
        lineHeight={48}
        weight={WEIGHTS.BOLD}
      >
        {children}
      </Text>
    );
  } else if (type === "subtitle") {
    return (
      <Text
        {...otherProps}
        font={FONTS.SANS_SERIF}
        size={21}
        color={COLORS.BLACK}
        lineHeight={27}
      >
        {children}
      </Text>
    );
  } else if (type === "label") {
    return (
      <Text
        {...otherProps}
        casing="uppercase"
        font={FONTS.SANS_SERIF}
        size={14}
        lineHeight={19}
        weight={WEIGHTS.BOLD}
      >
        {children.toUpperCase()}
      </Text>
    );
  } else if (type === "smalltitle") {
    return (
      <Text
        {...otherProps}
        font={FONTS.SANS_SERIF}
        size={18}
        color={COLORS.BLACK}
        weight={WEIGHTS.EXTRA_BOLD}
      >
        {children}
      </Text>
    );
  } else if (type == "hamburgerlink") {
    return (
      <Text
        {...otherProps}
        weight={WEIGHTS.EXTRA_BOLD}
        type={type}
        size="1.15em"
        letterSpacing={1}
        lineHeight={22}
        textDecoration="none"
        font={FONTS.SANS_SERIF}
        color={COLORS.BLACK}
      >
        {children}
      </Text>
    );
  } else if (type === "link") {
    return (
      <Text
        {...otherProps}
        type={type}
        size={otherProps.size || 14}
        weight={WEIGHTS.SEMI_BOLD}
        color={_.get(otherProps, "color") || COLORS.ORANGE}
      >
        {children}
      </Text>
    );
  } else if (type === "UnauthenticatedPageTitle") {
    return (
      <Text
        {...otherProps}
        size={24}
        letterSpacing={0.67}
        lineHeight={26}
        align="center"
        color={COLORS.WHITE}
      >
        {children}
      </Text>
    );
  } else if (type === "muted") {
    return (
      <Text {...otherProps} size={12} color={COLORS.MEDIUM_GRAY}>
        {children}
      </Text>
    );
  } else {
    return <Text {...otherProps}>{children}</Text>;
  }
};
