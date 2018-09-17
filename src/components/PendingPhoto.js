import React from "react";
import { View, StyleSheet } from "react-native";
import Image from "./Image";
import { COLORS, BORDER_RADIUS } from "../lib/defaults";
import TinyColor from "tinycolor2";
import { Spinner } from "./Spinner";
import { calculateDimensions } from "./Photo";

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    borderRadius: BORDER_RADIUS.NORMAL,
    overflow: "hidden"
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    backgroundColor: TinyColor(COLORS.BLACK)
      .setAlpha(0.75)
      .toRgbString(),
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.NORMAL,
    alignItems: "center"
  }
});

export const PendingPhoto = ({
  photo,
  width: maxWidth = 60,
  height: maxHeight = 60,
  onPress
}) => {
  const { width, height } = calculateDimensions({
    photo,
    maxWidth,
    maxHeight,
    totalPhotoCount: 1,
    defaultSpacing: 0
  });

  return (
    <View style={[styles.wrapper, { width, height }]}>
      <Image
        source={{ uri: photo.path, width, height }}
        width={width}
        height={height}
      />
      <View style={styles.container}>
        <Spinner color={COLORS.WHITE} />
      </View>
    </View>
  );
};

export default PendingPhoto;
