import _ from "lodash";
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { COLORS } from "../lib/defaults";
import Image from "./Image";

export const isVerticalPhoto = ({ width, height }) => height > width;
export const isHorizontalPhoto = ({ width, height }) => width > height;
export const isSquarePhoto = ({ width, height }) => width === height;

export const calculateDimensions = ({
  photo,
  maxWidth,
  maxHeight,
  totalPhotoCount,
  defaultSpacing
}) => {
  const MAX_COLUMN_COUNT = Math.min(totalPhotoCount, 3);
  const spacing = totalPhotoCount > 1 ? defaultSpacing : 0;
  let width,
    height = 0;
  if (photo.width > photo.height) {
    const MAX_SIZE = maxWidth / MAX_COLUMN_COUNT - spacing * MAX_COLUMN_COUNT;
    width = Math.min(photo.width, MAX_SIZE) - spacing;
    height = photo.height * (width / photo.width);
  } else if (photo.height > photo.width) {
    const MAX_SIZE = maxHeight / MAX_COLUMN_COUNT - spacing * MAX_COLUMN_COUNT;
    height = Math.min(photo.height, MAX_SIZE);
    width = photo.width * (height / photo.height);
  } else {
    const MAX_SIZE = maxWidth / MAX_COLUMN_COUNT - spacing * MAX_COLUMN_COUNT;
    width = Math.min(photo.height, MAX_SIZE) - spacing;
    height = Math.min(photo.height, MAX_SIZE) - spacing;
  }

  return { width, height, spacing };
};

export class Photo extends React.Component {
  handlePress = () => this.props.onPress(this.props.photo);

  render() {
    const {
      photo,
      borderRadius,
      style,
      width,
      height,
      maxHeight,
      onPress,
      x,
      y,
      ...otherProps
    } = this.props;

    const ImageView = (
      <Image
        {...otherProps}
        source={{
          uri: photo.public_url
        }}
        resizeMode="cover"
        width={width}
        height={height}
        style={{
          width: width,
          height: height,
          maxHeight
        }}
        borderRadius={borderRadius}
      />
    );

    const styleContainer =
      _.isNumber(x) && _.isNumber(y)
        ? {
            left: x,
            top: y,
            position: "absolute"
          }
        : undefined;

    return (
      <TouchableWithoutFeedback disabled={!onPress} onPress={this.handlePress}>
        <View style={styleContainer}>{ImageView}</View>
      </TouchableWithoutFeedback>
    );
  }
}
