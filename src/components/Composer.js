import _ from "lodash";
import React from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutAnimation,
  InteractionManager,
  Platform
} from "react-native";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { defaultProps } from "recompose";
// import { logEvent } from "././lib/analytics";
import { COLORS, ColorScheme, SPACING, BORDER_RADIUS } from "../lib/defaults";
import Divider from "./Divider";
import Icon from "./Icon";
import { PhotoThumbnail } from "./PhotoThumbnail";
import TextInput from "./TextInput";
import { UploadPhotoContext } from "./UploadPhoto";
import InputAccessoryView from "./InputAccessoryView";
import { PendingPhoto } from "./PendingPhoto";
import TinyColor from "tinycolor2";
import { Switch } from "./Switch";
import { Text } from "./Text";
const SCREEN_WIDTH = Dimensions.get("screen").width;

export const INITIAL_COMPOSTER_HEIGHT = 46;
export const MAX_COMPOSER_HEIGHT = 200;

const styles = StyleSheet.create({
  accessoryContainer: {
    backgroundColor: COLORS.WHITE,
    width: Dimensions.get("screen").width,
    alignSelf: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.GRAY,
    shadowRadius: 5,
    shadowOpacity: 0.04,
    shadowOffset: {
      x: 0,
      y: 10
    }
  },
  composer: {
    alignItems: "flex-end",
    paddingLeft: SPACING.XSMALL,
    flexDirection: "row"
  },
  inputContainer: {
    flex: 1,
    maxHeight: MAX_COMPOSER_HEIGHT,
    alignSelf: "flex-end",
    justifyContent: "center"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.SMALL,
    width: "100%",
    alignItems: "center"
  },
  leftActions: {
    flexDirection: "row"
  },
  input: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.NORMAL
  },
  inputPlatformStyles: Platform.select({
    ios: {
      height: "100%",
      paddingVertical: 0,
      paddingTop: SPACING.SMALL,
      paddingBottom: SPACING.SMALL
    },
    android: {
      paddingVertical: 0,
      paddingTop: SPACING.XSMALL,
      paddingBottom: SPACING.XSMALL
    }
  }),
  mediaContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.GRAY,
    flexDirection: "row",
    width: "100%",
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.NORMAL
  }
});

const composerButtonStyles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.NORMAL,
    minHeight: INITIAL_COMPOSTER_HEIGHT
  },
  content: {
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center"
  }
});

const ComposerButton = ({
  onPress,
  disabled = false,
  iconName,
  disabledColor = COLORS.MEDIUM_GRAY,
  size = 16,
  colorScheme
}) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    activeOpacity={0.75}
    style={composerButtonStyles.container}
  >
    <View style={composerButtonStyles.content}>
      <Icon
        size={size}
        name={iconName}
        color={
          disabled ? disabledColor : new ColorScheme(colorScheme).primaryColor
        }
      />
    </View>
  </TouchableOpacity>
);

const ComposerTextInput = defaultProps({
  multiLine: true,
  blurOnSubmit: false
})(TextInput);

class CommentComposer extends React.Component {
  static defaultProps = {
    prefix: ""
  };
  constructor(props) {
    super(props);

    this.state = {
      text: props.prefix,
      photos: [],
      isFocused: false,
      public: true,
      keyboardAccessoryHeight: INITIAL_COMPOSTER_HEIGHT
    };
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.handleFocused();
    }
  }

  handleTogglePublic = () => this.setState({ public: !this.state.public });

  get isSendEnabled() {
    return (
      _.trim(this.state.text).length > this.props.prefix.length ||
      this.state.photos.length > 0
    );
  }

  handleKeyPress = evt => {
    const {
      nativeEvent: { key }
    } = evt;

    if (
      key === "Backspace" &&
      this.state.text.length <= this.props.prefix.length
    ) {
      evt.preventDefault();
      return false;
    }
  };
  onChangeText = text => {
    if (!text.startsWith(this.props.prefix)) {
      return;
    }

    this.setState({ text });
  };

  handlePressSend = () => {
    const { text, photos = [] } = this.state;
    if (this.inputRef) {
      this.inputRef.setNativeProps({ text: this.props.prefix });
    }

    this.setState({
      text: this.props.prefix,
      public: true,
      photos: []
    });

    this.props.sendMessage({
      body: text.length > 0 ? text : undefined,
      public: this.state.public,
      photos: photos.length > 0 ? photos.slice() : undefined
    });
  };

  handleFocused = () => {
    if (this.props.onFocus) {
      this.props.onFocus();
    }

    // if (this.props.insideTabBar) {
    //   this.tabBarSpacer.setNativeProps({
    //     height: TAB_BAR_HEIGHT
    //   });
    // }

    if (this.inputRef && !this.inputRef.isFocused()) {
      this.inputRef.focus();
      this.inputRef.setNativeProps({
        selection: {
          start: this.state.text.length,
          end: this.state.text.length
        }
      });
    }

    // this.containerRef.setNativeProps({});

    // this.inputAccessoryRef.scrollToStart();

    this.setState({ isFocused: true }, () => {
      if (this.props.onFocus) {
        this.props.onFocus();
      }
    });
  };
  handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    this.setState({
      isFocused: false
    });
  };

  handleDeletePhoto = photo => {
    return evt => {
      const photos = this.state.photos.slice();

      photos.splice(photos.indexOf(photo), 1);
      this.setState({ photos });
    };
  };

  handleUploadPhotoFromCamera = () => this.handleUploadPhoto(true);
  handleUploadPhotoFromLibrary = () => this.handleUploadPhoto(false);

  handleUploadPhoto = camera => {
    const uploadPhoto = camera
      ? this.props.uploadPhotoFromCamera
      : this.props.uploadPhotoFromLibrary;
    return uploadPhoto({
      cropping: false,
      multiple: true,
      mediaType: "photo"
    }).then(photos => {
      if (photos === false) {
        return;
      }

      this.setState({
        photos: _.uniqBy([...this.state.photos, ...photos], "id")
      });
    });
  };

  handleContentSizeChange = ({
    nativeEvent: {
      contentSize: { width, height: keyboardAccessoryHeight }
    }
  }) => {
    this.setState({ keyboardAccessoryHeight });
  };

  handleInputRef = inputRef => (this.inputRef = inputRef);

  _renderContent = () => (
    <View blurType="xlight" style={[styles.accessoryContainer]}>
      {(!_.isEmpty(this.state.photos) ||
        !_.isEmpty(this.props.pendingPhotos)) && (
        <View style={styles.mediaContainer}>
          {this.state.photos.map(photo => (
            <React.Fragment key={photo.id}>
              <PhotoThumbnail
                key={photo.id}
                photo={photo}
                onDelete={this.handleDeletePhoto(photo)}
              />
              <Divider width={SPACING.NORMAL} />
            </React.Fragment>
          ))}

          {this.props.pendingPhotos.map(photo => (
            <React.Fragment key={photo.path}>
              <PendingPhoto key={photo.id} photo={photo} />
              <Divider width={SPACING.NORMAL} />
            </React.Fragment>
          ))}
        </View>
      )}
      <View style={styles.composer}>
        <View
          style={[
            styles.inputContainer,
            {
              minHeight: Math.max(
                this.state.keyboardAccessoryHeight,
                INITIAL_COMPOSTER_HEIGHT
              )
            }
          ]}
        >
          <Divider width={1} height={SPACING.XSMALL} />
          <ComposerTextInput
            onFocus={this.handleFocused}
            onPress={this.handleFocused}
            onBlur={this.handleBlur}
            style={[
              styles.input,
              styles.inputPlatformStyles,
              {
                color: new ColorScheme(this.props.colorScheme).primaryColor
              },
              Platform.select({
                android: {
                  maxHeight:
                    this.state.keyboardAccessoryHeight + SPACING.XSMALL * 2
                }
              })
            ]}
            inputRef={this.handleInputRef}
            onContentSizeChange={this.handleContentSizeChange}
            onKeyPress={this.handleKeyPress}
            selectionColor={
              new ColorScheme(this.props.colorScheme).primaryColor
            }
            onChange={this.onChangeText}
            value={this.state.text}
            autoCapitalize="sentences"
            accessibilityLabel={this.props.text || this.props.placeholder}
            {...this.props.textInputProps}
          />
          <Divider width={1} height={SPACING.XSMALL} />
        </View>

        <ComposerButton
          iconName="send"
          colorScheme={this.props.colorScheme}
          disabled={!this.isSendEnabled}
          onPress={this.handlePressSend}
        />
      </View>
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <ComposerButton
            onPress={this.handleUploadPhotoFromCamera}
            colorScheme={this.props.colorScheme}
            iconName="camera"
          />

          <ComposerButton
            onPress={this.handleUploadPhotoFromLibrary}
            colorScheme={this.props.colorScheme}
            iconName="photo"
          />
        </View>
        <View style={styles.rightActions}>
          {!this.props.hidePublic && (
            <Switch
              onChange={this.handleTogglePublic}
              value={this.state.public}
              colorScheme={this.props.colorScheme}
              label={"Public"}
            />
          )}
        </View>
      </View>
    </View>
  );

  render() {
    const { colorScheme, insideTabBar, onHeightChanged, inverted } = this.props;

    return (
      <InputAccessoryView
        insideTabBar={insideTabBar}
        kbInputRef={this.inputRef}
        inverted={inverted}
        forwardRef={inputAccessoryRef =>
          (this.inputAccessoryRef = inputAccessoryRef)
        }
        height={this.state.keyboardAccessoryHeight}
        onHeightChange={onHeightChanged}
        renderContent={this._renderContent}
      />
    );
  }
}

export default props => (
  <UploadPhotoContext>
    {uploadPhotoProps => <CommentComposer {...props} {...uploadPhotoProps} />}
  </UploadPhotoContext>
);
