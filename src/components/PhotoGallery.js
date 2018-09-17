import React from "react";
import {
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Gallery from "react-native-image-gallery";
import { SafeAreaView } from "react-navigation";
import { COLORS, SPACING, GLOBAL_STYLES } from "../lib/defaults";
import { Icon } from "./Icon";
import Image from "./Image";
import { Text } from "./Text";

const styles = StyleSheet.create({});

export class PhotoGallery extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { photos: [], currentIndex: -1 };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      photos: props.photos.map(({ id, public_url: uri, width, height }) => ({
        source: { uri, width, height },
        dimensions: { width, height }
      }))
    };
  }

  handleFling = event => {
    console.warn(event);
  };

  handleRenderImage = props => {
    return <Image {...props} />;
  };

  render() {
    const {
      initialIndex,
      visible,
      onClose,
      colorScheme,
      hidePhotoNumber = false
    } = this.props;

    return (
      <Modal
        visible={visible}
        presentationStyle="overFullScreen"
        transparent
        onRequestClose={onClose}
        animationType="fade"
        hardwareAccelerated
      >
        <View
          style={{ flex: 1, backgroundColor: "black", position: "relative" }}
        >
          <StatusBar hidden />
          <Gallery
            initialPage={initialIndex}
            onPageSelected={currentIndex => this.setState({ currentIndex })}
            style={GLOBAL_STYLES.flexOne}
            images={this.state.photos}
          />

          <SafeAreaView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              width: "100%"
            }}
            forceInset={{
              top: "always",
              bottom: "never",
              left: "never",
              right: "never"
            }}
          >
            <View style={{ padding: SPACING.NORMAL }}>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={18} color={COLORS.WHITE} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {!hidePhotoNumber && (
            <SafeAreaView
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                width: "100%"
              }}
              forceInset={{
                top: "never",
                bottom: "always",
                left: "never",
                right: "never"
              }}
            >
              <View style={{ padding: SPACING.NORMAL }}>
                <Text align="center" size={18} color={COLORS.WHITE}>
                  {this.state.currentIndex + 1} / {this.state.photos.length}
                </Text>
              </View>
            </SafeAreaView>
          )}
        </View>
      </Modal>
    );
  }
}
