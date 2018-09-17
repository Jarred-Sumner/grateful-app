import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BORDER_RADIUS, COLORS } from "../lib/defaults";
import { Icon } from "./Icon";
import Image from "./Image";
import { calculateDimensions } from "./Photo";

const CLOSE_BUTTON_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "visible"
  },
  closeButton: {
    width: CLOSE_BUTTON_SIZE,
    backgroundColor: COLORS.BLACK,
    justifyContent: "center",
    alignItems: "center",
    height: CLOSE_BUTTON_SIZE,
    borderRadius: CLOSE_BUTTON_SIZE / 2,
    position: "absolute",
    top: -CLOSE_BUTTON_SIZE / 2,
    right: -CLOSE_BUTTON_SIZE / 2,
    zIndex: 10
  }
});

const CloseButton = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    style={styles.closeButton}
    onPress={onPress}
  >
    <Icon name="close" size={10} color={COLORS.WHITE} />
  </TouchableOpacity>
);

export class PhotoThumbnail extends React.Component {
  static defaultProps = {
    maxHeight: 60,
    maxWidth: 60
  };

  get dimensions() {
    const { photo, maxWidth, maxHeight } = this.props;

    return calculateDimensions({
      photo: photo,
      maxWidth,
      maxHeight,
      totalPhotoCount: 1,
      defaultSpacing: 0
    });
  }

  render() {
    const { photo, onDelete } = this.props;
    const { width, height } = this.dimensions;
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onDelete}
        style={{ justifyContent: "flex-end" }}
      >
        <View style={[styles.container, { width, height }]}>
          <Image
            source={{
              uri: photo.public_url,
              width,
              height
            }}
            width={width}
            height={height}
            style={{ height, width, borderRadius: BORDER_RADIUS.NORMAL }}
          />
          {onDelete ? <CloseButton onPress={onDelete} /> : null}
        </View>
      </TouchableOpacity>
    );
  }
}

export default PhotoThumbnail;
