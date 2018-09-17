import justifiedLayout from "justified-layout";
import _ from "lodash";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { COLORS } from "../../../lib/defaults";
import Divider from "../../Divider";
import { Photo, calculateDimensions, isSquarePhoto } from "../../Photo";
const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    position: "relative"
  },
  horizontal: {
    flexDirection: "row"
  }
});

const getMatrixValue = photos => {
  const matrix = [];
  let availableWidth = Dimensions.get("screen").width;

  _.sortBy(photos, photo => photo.width / photo.height).forEach(
    ({ width, height }) => {
      if (matrix.length > 0 && photos.length > 2) {
        if (_.last(matrix) === 1 && height > width) {
          if (availableWidth === Dimensions.get("screen").width) {
            matrix.splice(matrix.length - 1, 1, 2);
            availableWidth = Dimensions.get("screen").width / 2;
            return;
          }
        }

        matrix.push(1);
        availableWidth = Dimensions.get("screen").width;
      } else {
        matrix.push(1);
        availableWidth = Dimensions.get("screen").width;
      }
    }
  );

  return matrix;
};

const getMaxHeight = defaultMaxHeight => {
  if (defaultMaxHeight) {
    return defaultMaxHeight;
  } else {
    return Dimensions.get("screen").height;
  }
};

const getMaxWidth = defaultMaxWidth => {
  if (defaultMaxWidth) {
    return defaultMaxWidth;
  } else {
    return Dimensions.get("screen").width;
  }
};

export class PhotoGroup extends React.PureComponent {
  get maxHeight() {
    return getMaxHeight(this.props.maxHeight);
  }

  get maxWidth() {
    return getMaxWidth(this.props.maxWidth);
  }

  static estimateDimensions({
    maxHeight: defaultMaxHeight,
    maxWidth: defaultMaxWidth,
    maxRows = 2,
    photos = []
  }) {
    const maxHeight = getMaxHeight(defaultMaxHeight);
    const maxWidth = getMaxWidth(defaultMaxWidth);

    if (photos.length === 1) {
      return calculateDimensions({
        maxHeight: maxWidth,
        maxWidth,
        totalPhotoCount: 1,
        defaultSpacing: 0,
        photo: photos[0]
      });
    } else if (photos.length === 2 && _.every(photos, isSquarePhoto)) {
      return calculateDimensions({
        maxHeight: maxWidth,
        maxWidth,
        totalPhotoCount: 2,
        defaultSpacing: StyleSheet.hairlineWidth / 2,
        photo: photos[0]
      });
    } else {
      const layout = justifiedLayout(
        photos.map(({ width, height }) => width / height),
        {
          containerWidth: maxWidth,
          targetRowHeight: photos.length > 2 ? maxHeight / maxRows : maxHeight,
          showWidows: false,
          containerPadding: 0,
          maxNumRows: maxRows,
          boxSpacing: 0
        }
      );

      return {
        width: maxWidth,
        height: layout.containerHeight
      };
    }
  }

  renderCell = ({ photo, width, height }) => {
    return this.renderPhoto({ photo, width, height });
  };

  renderPhoto = ({ photo, width, height, x, y }) => (
    <Photo
      maxHeight={this.maxHeight}
      photo={photo}
      width={width}
      x={x}
      key={photo.id}
      y={y}
      onPress={this.props.onPressPhoto}
      height={height}
    />
  );

  render() {
    const { photos: allPhotos, onPressPhoto, maxRows = 2 } = this.props;
    const maxWidth = this.maxWidth;
    const maxHeight = this.maxHeight;

    const photos = allPhotos.slice(0, 5);

    if (photos.length === 1) {
      const { width, height } = PhotoGroup.estimateDimensions({
        maxHeight: maxWidth,
        maxWidth,
        photos,
        maxRows
      });

      return (
        <View
          style={[
            styles.container,
            {
              // flexWrap: "wrap",
              flex: 0,
              overflow: "hidden"
            }
          ]}
        >
          <Photo
            onPress={onPressPhoto}
            photo={photos[0]}
            width={width}
            height={height}
          />
        </View>
      );
    } else if (photos.length === 2 && _.every(photos, isSquarePhoto)) {
      const { width, height } = PhotoGroup.estimateDimensions({
        maxHeight: maxWidth,
        maxWidth,
        photos,
        maxRows
      });

      return (
        <View
          style={[
            styles.container,
            {
              // flexWrap: "wrap",
              flex: 0,
              overflow: "hidden",
              justifyContent: "space-between",
              flexDirection: "row"
            }
          ]}
        >
          <Photo
            onPress={onPressPhoto}
            photo={photos[0]}
            width={width}
            height={height}
          />

          <Divider height={StyleSheet.hairlineWidth} border={COLORS.WHITE} />

          <Photo
            onPress={onPressPhoto}
            photo={photos[1]}
            width={width}
            height={height}
          />
        </View>
      );
    } else {
      const layout = justifiedLayout(
        photos.map(({ width, height }) => width / height),
        {
          containerWidth: maxWidth,
          targetRowHeight: photos.length > 2 ? maxHeight / maxRows : maxHeight,
          showWidows: false,
          containerPadding: 0,
          maxNumRows: maxRows,
          boxSpacing: 0
        }
      );

      const {
        width: containerWidth,
        height: containerHeight
      } = PhotoGroup.estimateDimensions({
        maxHeight,
        maxWidth,
        photos,
        maxRows
      });

      return (
        <View
          style={[
            styles.container,
            {
              flexWrap: "wrap",
              flex: 0,
              height: containerHeight,
              width: containerWidth,
              justifyContent: "flex-start",
              flexDirection: "row"
            }
          ]}
        >
          {layout.boxes.map(({ width, height, top: y, left: x }, index) => {
            return this.renderCell({
              width,
              height,
              y,
              x,
              photo: photos[index]
            });
          })}
        </View>
      );
    }
  }
}
