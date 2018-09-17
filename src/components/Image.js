import _ from "lodash";
import React from "react";
import { Image as RNImage, Platform, StyleSheet, View } from "react-native";
import { IMAGE_HOST, buildImgSrc } from "../lib/imgUri";
import { Spinner } from "./Spinner";
import { COLORS } from "../lib/defaults";
// import { CustomCachedImage } from "react-native-img-cache";
// import Image from "react-native-image-progress";
import { defaultProps, pure } from "recompose";
// import ProgressBar from "react-native-progress/Bar";

// const CachableImage = defaultProps({
//   component: Image
// })(CustomCachedImage);

const getImageDimensions = ({
  remoteWidth,
  remoteHeight,
  remoteSize,
  width,
  height,
  size
}) => {
  if (remoteSize) {
    return {
      width: remoteSize,
      height: remoteSize
    };
  } else if (remoteWidth && remoteHeight) {
    return {
      width: remoteWidth,
      height: remoteHeight
    };
  } else if (size) {
    return {
      width: size,
      height: size
    };
  } else {
    return { width, height };
  }
};

export const ImageComponent = pure(
  ({
    source,
    remoteWidth,
    remoteHeight,
    remoteSize,
    width,
    height,
    size,
    style,
    borderRadius,
    ...otherProps
  }) => {
    const dimensions = getImageDimensions({
      remoteWidth,
      remoteHeight,
      remoteSize,
      width: _.get(style, "width") || width,
      height: _.get(style, "height") || height,
      size
    });

    const isCachableImage =
      typeof source !== "number" &&
      _.get(source, "uri", "").startsWith("http") &&
      !_.get(source, "uri").includes(IMAGE_HOST) &&
      dimensions.width;

    const uri = isCachableImage
      ? buildImgSrc(source.uri, dimensions.width, dimensions.height)
      : source.uri;

    const ChosenImageComponent = RNImage;

    return (
      <View
        style={{
          width: _.get(style, "width") || width,
          height: _.get(style, "height") || height,
          borderRadius:
            style && style.borderRadius ? style.borderRadius : borderRadius,
          flex: 0,
          overflow: "hidden"
        }}
      >
        <ChosenImageComponent
          {...otherProps}
          source={
            typeof source === "number"
              ? source
              : {
                  uri,
                  cache: "force-cache"
                }
          }
          style={style || { width, height }}
        />
      </View>
    );
  }
);

export default ImageComponent;
