import React from "react";
import { Modal, StatusBar, StyleSheet, View } from "react-native";
import RNEmojiInput from "react-native-emoji-selector";
import { SafeAreaView } from "react-navigation";
import { COLORS, SPACING } from "../lib/defaults";
import Divider from "./Divider";
import Header from "./Header";
import Text from "./Text";
import TextInput from "./TextInput";

const { Provider, Consumer } = React.createContext({
  showEmojiInput: () => null,
  hideEmojiInput: () => null,
  isEmojiInputVisible: false
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",

    backgroundColor: COLORS.WHITE
  }
});

class EmojiInput extends React.Component {
  static defaultProps = {
    visible: false
  };

  handleEmojiSelected = emoji => {
    this.props.onChange(emoji);
  };

  render() {
    const { children, visible } = this.props;
    return (
      <Modal
        animationType="slide"
        hardwareAccelerated
        presentationStyle="overFullScreen"
        visible={visible}
        transparent
      >
        {visible && <StatusBar animated barStyle="dark-content" />}
        <View
          pointerEvents={visible ? "auto" : "none"}
          style={[styles.container]}
        >
          <SafeAreaView
            forceInset={{
              top: "always",
              bottom: "always",
              left: "never",
              right: "never"
            }}
            style={{
              position: "relative",
              flex: 1,
              height: "100%",
              width: "100%"
            }}
          >
            <Header
              title="Pick Emoji"
              left={<Header.CloseButton onPress={this.props.onClose} />}
            />
            <Divider height={SPACING.SMALL} />
            <RNEmojiInput
              TextComponent={Text}
              TextInputComponent={TextInput}
              onEmojiSelected={this.handleEmojiSelected}
            />
          </SafeAreaView>
        </View>
      </Modal>
    );
  }
}

export class EmojiInputProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmojiInputVisible: false,
      contextValues: {
        isEmojiInputVisible: false,
        showEmojiInput: this.handleShowEmojiInput,
        hideEmojiInput: this.handleHideEmojiInput
      }
    };
  }

  handleShowEmojiInput = callback => {
    this.callback = callback;
    this.setState({
      isEmojiInputVisible: true,
      contextValues: {
        isEmojiInputVisible: true,
        showEmojiInput: this.handleShowEmojiInput,
        hideEmojiInput: this.handleHideEmojiInput
      }
    });
  };

  componentDidCatch(exception, info) {
    console.error(exception);
  }

  handleHideEmojiInput = () => {
    this.setState({
      isEmojiInputVisible: false,
      contextValues: {
        isEmojiInputVisible: false,
        showEmojiInput: this.handleShowEmojiInput,
        hideEmojiInput: this.handleHideEmojiInput
      }
    });

    // if (this.callback) {
    //   delete this.callback;
    // }
  };

  handleEmojiSelected = emoji => {
    if (this.callback) {
      this.callback(emoji);
      // delete this.callback;
    }
  };

  render() {
    return (
      <View style={{ height: "100%", width: "100%" }}>
        <EmojiInput
          visible={this.state.isEmojiInputVisible}
          onChange={this.handleEmojiSelected}
          onClose={this.handleHideEmojiInput}
        />

        <Provider value={this.state.contextValues}>
          {this.props.children}
        </Provider>
      </View>
    );
  }
}

export const EmojiInputConsumer = Consumer;
