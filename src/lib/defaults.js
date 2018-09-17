import _ from "lodash";
import TinyColor from "tinycolor2";
import { StyleSheet } from "react-native";
export const COLORS = {
  WHITE: "rgb(255, 255, 255)",
  BLUE: "rgb(0, 158, 255)",
  BLACK: "#000000",
  DARK_GRAY: "#404244",
  FADED_TEXT: "#9197A3",
  GREEN: "#0aca9b",
  GRAY: "#EFEFEF",
  RED: "#860f06",
  OFFWHITE: "#F3F3F9",
  TWITTER: "#55acee",
  MEDIUM_GRAY: "#BABABA",
  FACEBOOK: "#3b5998",
  ORANGE: "#F05522",
  INSTAGRAM: "#99389b",
  PLACEHOLDER_TEXT: "#CCD6DD",
  LIGHT_SHADOW: "#D1D6E4",
  UNDERLAY_GRAY: "#E9E7E7",
  BORDER_BLUE: "#B9BED1",
  PINK: "#F54FA0",
  BACKGROUND_COLOR: "#F7F8FB"
};

export const BACKGROUND_COLORS_FOR_COLOR_SCHEMES = _.fromPairs(
  _.toPairs(PRIMARY_COLOR_BY_SCHEME).map(pair => [
    pair[0],
    { backgroundColor: pair[1] }
  ])
);

export const FOREGROUND_COLORS_FOR_COLOR_SCHEMES = _.fromPairs(
  _.toPairs(PRIMARY_COLOR_BY_SCHEME).map(pair => [
    pair[0],
    { color: COLORS.WHITE }
  ])
);

export const GLOBAL_STYLES = StyleSheet.create({
  section_list: {
    backgroundColor: "white",
    height: "100%",
    width: "100%"
  },
  flexOne: { flex: 1 }
});

export const SPACING = {
  XSMALL: 4,
  SMALL: 7,
  NORMAL: 14,
  MEDIUM: 21,
  LARGE: 28,
  HUGE: 42
};

export const BORDER_RADIUS = {
  SMALL: 4,
  NORMAL: 8,
  OVAL: 30
};

export const COLOR_SCHEMES = {
  brand: "brand",
  blurple: "blurple",
  gray: "gray",
  green: "green",
  darkgreen: "darkgreen",
  lavender: "lavender",
  lilypad: "lilypad",
  pink: "pink",
  purple: "purple",
  red: "red",
  salmon: "salmon",
  silver: "silver",
  skate: "skate"
};

export const APP_COLOR_SCHEME = COLOR_SCHEMES.lavender;

export const PRIMARY_COLOR_BY_SCHEME = {
  [COLOR_SCHEMES.brand]: "#9A1DC6",
  [COLOR_SCHEMES.blurple]: "#3783B2",
  [COLOR_SCHEMES.gray]: "#617781",
  [COLOR_SCHEMES.green]: "#3EC6AB",
  [COLOR_SCHEMES.darkgreen]: "#276C6F",
  [COLOR_SCHEMES.lavender]: "#5F3ABB",
  [COLOR_SCHEMES.lilypad]: "#EE595E",
  [COLOR_SCHEMES.pink]: "#F95D92",
  [COLOR_SCHEMES.purple]: "#912C6C",
  [COLOR_SCHEMES.red]: "#E7204F",
  [COLOR_SCHEMES.salmon]: "#DD5370",
  [COLOR_SCHEMES.silver]: "#514E4E",
  [COLOR_SCHEMES.slate]: "#617781"
};

export const colorSchemeBackgroundStyles = StyleSheet.create({
  [COLOR_SCHEMES.brand]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.brand },
  [COLOR_SCHEMES.blurple]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.blurple },
  [COLOR_SCHEMES.gray]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.gray },
  [COLOR_SCHEMES.green]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.green },
  [COLOR_SCHEMES.darkgreen]: {
    backgroundColor: PRIMARY_COLOR_BY_SCHEME.darkgreen
  },
  [COLOR_SCHEMES.lavender]: {
    backgroundColor: PRIMARY_COLOR_BY_SCHEME.lavender
  },
  [COLOR_SCHEMES.lilypad]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.lilypad },
  [COLOR_SCHEMES.pink]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.pink },
  [COLOR_SCHEMES.purple]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.purple },
  [COLOR_SCHEMES.red]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.red },
  [COLOR_SCHEMES.salmon]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.salmon },
  [COLOR_SCHEMES.silver]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.silver },
  [COLOR_SCHEMES.slate]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.slate }
});

export class ColorScheme {
  constructor(colorScheme) {
    this.colorScheme = colorScheme;
  }

  static app() {
    return new ColorScheme(APP_COLOR_SCHEME);
  }

  get primaryColor() {
    return PRIMARY_COLOR_BY_SCHEME[this.colorScheme];
  }

  get shadowColor() {
    return TinyColor(this.primaryColor)
      .setAlpha(0.55)
      .toRgbString();
  }
}
