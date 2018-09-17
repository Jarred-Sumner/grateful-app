import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
  ColorScheme,
  SPACING,
  COLORS,
  BORDER_RADIUS,
  APP_COLOR_SCHEME
} from "../../lib/defaults";
import Divider from "../Divider";
import Icon from "../Icon";
import EmojiInput, { EmojiInputConsumer } from "../EmojiInput";
import { Text } from "../Text";
import EmojiParser from "node-emoji";
import CommentShareBar from "../Feed/Post/CommentShareBar";
import { MaskedIcon } from "../MaskedIcon";

const styles = StyleSheet.create({
  addReactionButton: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.SMALL
  }
});

class ReactionBar extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePickEmoji = event => {
    this.props.showEmojiInput(emoji => {
      this.props.onReact(EmojiParser.unemojify(emoji));
      this.props.hideEmojiInput();
    });
  };

  render() {
    const {
      visibleEmoji,
      visible,
      id,
      type,
      object,
      colorScheme = new ColorScheme(APP_COLOR_SCHEME),
      ...otherProps
    } = this.props;
    const primaryColor = colorScheme.primaryColor;

    return (
      <TouchableOpacity
        onPress={this.handlePickEmoji}
        style={styles.addReactionButton}
      >
        <MaskedIcon
          name="reactji"
          colorScheme={colorScheme}
          width={22}
          height={18}
          size={18}
        />
      </TouchableOpacity>
    );
  }
}

export default props => {
  return (
    <EmojiInputConsumer>
      {({ showEmojiInput, hideEmojiInput, isEmojiInputVisible }) => (
        <ReactionBar
          {...props}
          isEmojiInputVisible={isEmojiInputVisible}
          showEmojiInput={showEmojiInput}
          hideEmojiInput={hideEmojiInput}
        />
      )}
    </EmojiInputConsumer>
  );
};
