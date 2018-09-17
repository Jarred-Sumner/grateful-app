import React from "react";
import EmojiParser from "node-emoji";
import { Text } from "./Text";
import { StyleSheet } from "react-native";
import { setDisplayName } from "recompose";

const Emoji = ({ children, size, ...otherProps }) => (
  <Text size={size} {...otherProps}>
    {EmojiParser.emojify(children)}
  </Text>
);

export default setDisplayName("Emoji")(Emoji);
