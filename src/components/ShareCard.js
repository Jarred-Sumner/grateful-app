import { View, StyleSheet, Clipboard, TouchableOpacity } from "react-native";
import React from "react";
import Text, { WEIGHTS } from "./Text";
import { COLORS, BORDER_RADIUS, SPACING } from "../lib/defaults";
import SocialLink from "./SocialLink";
import Divider from "./Divider";
import Browser from "../lib/Browser";
import Button from "./Button";
import Alert from "../lib/Alert";
import { logEvent } from "../lib/analytics";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.NORMAL,
    paddingVertical: SPACING.NORMAL,
    borderRadius: BORDER_RADIUS.NORMAL,
    backgroundColor: COLORS.WHITE,
    shadowRadius: 10,
    shadowOpacity: 0.08,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.LIGHT_SHADOW,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      x: 0,
      y: 5
    }
  },
  linkList: {
    flexDirection: "row"
  },
  row: {
    paddingHorizontal: SPACING.NORMAL,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class ShareCard extends React.Component {
  handleOpenLink = () => {
    Clipboard.setString(this.props.url);
    logEvent("Copy Profile URL");
    Alert.success("Story it on Instagram or Snapchat", "Story it!");
  };

  handleCopyLink = () => {
    Clipboard.setString(this.props.url);
    logEvent("Copy Profile URL");
    Alert.success(`Story it on Instagram or Snapchat!`, "Copied");
  };

  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.row}>
            <Text align="center" size={14} wrap letterSpacing={0.13}>
              Share your link on Instagram and Snapchat to receive anonymous
              feedback from friends.
            </Text>
          </View>
          <Divider height={SPACING.NORMAL} />
          <Divider flex={1} height={1} width="100%" border={COLORS.GRAY} />
          <Divider height={SPACING.LARGE} />

          <TouchableOpacity onPress={this.handleOpenLink} style={styles.row}>
            <Text size={14} weight={WEIGHTS.SEMI_BOLD} color={COLORS.PINK}>
              {this.props.url}
            </Text>
          </TouchableOpacity>

          <Divider height={SPACING.LARGE} />

          <View style={[styles.row, styles.linkList]}>
            <Button onPress={this.handleCopyLink} color={COLORS.ORANGE}>
              Copy your link
            </Button>
          </View>
        </View>
        <Divider height={SPACING.LARGE} />
      </React.Fragment>
    );
  }
}
