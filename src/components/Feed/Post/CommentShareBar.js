import React from "react";
import { StyleSheet, View } from "react-native";
import BarButton from "./BarButton";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0
  }
});

export default class CommentShareBar extends React.Component {
  render() {
    const {
      shared = false,
      sharesCount = 0,
      onPressShare,
      commented = false,
      commentsCount = 0,
      onPressComment
    } = this.props;
    return (
      <View style={styles.container}>
        <BarButton
          iconName="comment"
          active={commented}
          count={commentsCount}
          onPress={onPressComment}
        >
          Write comment
        </BarButton>
      </View>
    );
  }
}
