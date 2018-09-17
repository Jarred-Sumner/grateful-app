import React from "react";
import { Dimensions, StyleSheet, TouchableHighlight, View } from "react-native";
import { COLORS, SPACING } from "../lib/defaults";
import Avatar from "./Avatar";
import Divider from "./Divider";
import { PhotoGroup } from "./Feed/Post/PhotoGroup";
import { ReactionGroup } from "./Reaction/ReactionGroup";
import Text, { WEIGHTS } from "./Text";
import Timestamp from "./Timestamp";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    paddingHorizontal: SPACING.NORMAL
  },
  text: {
    flex: 1
  },
  headerText: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default class Comment extends React.Component {
  render() {
    const {
      maxLength,
      comment = {},
      showTimestamp = false,
      showReactions = false,
      onLongPress,
      onPressPhoto,
      onReact,
      paddingVertical = 0,
      colorScheme
    } = this.props;

    const {
      body = "",
      published_at: publishedAt,
      author,
      photos = [],
      emoji_likes_count_names = [],
      emoji_likes_count_values = [],
      emoji_liked = []
    } = comment;

    return (
      <TouchableHighlight
        onLongPress={onLongPress}
        activeOpacity={0.9}
        disabled={!onLongPress}
        underlayColor={COLORS.UNDERLAY_GRAY}
      >
        <View style={[styles.container, { paddingVertical }]}>
          <View style={styles.avatar}>
            <Avatar
              id={author.id}
              url={author.profile_photo}
              name={author.name}
              size={24}
            />
          </View>
          <Divider width={SPACING.NORMAL} />

          <View style={styles.text}>
            <View style={styles.headerText}>
              <Text size={14} weight={WEIGHTS.SEMI_BOLD} color={COLORS.BLACK}>
                {fullName(author)}
              </Text>

              {!!showTimestamp && (
                <React.Fragment>
                  <Divider width={SPACING.SMALL} />
                  <Timestamp timestamp={publishedAt} />
                </React.Fragment>
              )}
            </View>

            {!!body && (
              <React.Fragment>
                <Divider height={SPACING.SMALL} />
                <Text maxLength={maxLength} size={14} color={COLORS.BLACK}>
                  {body}
                </Text>
              </React.Fragment>
            )}

            {photos.length > 0 && (
              <React.Fragment>
                <Divider height={SPACING.NORMAL} />
                <PhotoGroup
                  photos={photos}
                  maxWidth={Dimensions.get("screen").width - 100}
                  maxHeight={200}
                  onPressPhoto={onPressPhoto}
                />
              </React.Fragment>
            )}

            {showReactions &&
              emoji_likes_count_names.length > 0 && (
                <React.Fragment>
                  <Divider height={SPACING.NORMAL} />
                  <ReactionGroup
                    onReact={onReact}
                    colorScheme={colorScheme}
                    keys={emoji_likes_count_names}
                    counts={emoji_likes_count_values}
                    selectedKeys={emoji_liked}
                  />
                </React.Fragment>
              )}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
