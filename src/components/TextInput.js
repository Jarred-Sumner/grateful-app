import React from "react";
import {
  StyleSheet,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { COLORS, SPACING } from "../lib/defaults";
import Text, { FONTS, WEIGHTS, getFontFamily } from "./Text";

class TextInputComponent extends React.Component {
  render() {
    const { disabled, refInput, value, ...otherProps } = this.props;

    if (disabled) {
      return (
        <Text ref={refInput} {...otherProps}>
          {value}
        </Text>
      );
    } else {
      return <RNTextInput ref={refInput} value={value} {...otherProps} />;
    }
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  iconContainer: {
    flex: 0,
    alignItems: "center",
    flexDirection: "row"
  },
  disabledInput: {
    paddingTop: SPACING.NORMAL,
    paddingBottom: SPACING.NORMAL,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  input: {
    fontFamily: getFontFamily({
      font: FONTS.SANS_SERIF,
      weight: WEIGHTS.NORMAL
    }),
    fontSize: 14,
    lineHeight: 19,
    flex: 0,
    color: COLORS.DARK_GRAY,
    paddingTop: SPACING.NORMAL,
    paddingBottom: SPACING.NORMAL
  }
});

const getContainerStylesForProps = props => {
  return StyleSheet.flatten([styles.container, props.containerStyle]);
};

const getInputStylesForProps = props => {
  if (props.disabled) {
    return StyleSheet.flatten([
      styles.input,
      props.style,
      styles.disabledInput
    ]);
  } else {
    return StyleSheet.flatten([styles.input, props.style]);
  }
};

export class TextInput extends React.PureComponent {
  getInputRef = inputRef => {
    if (this.props.inputRef) {
      this.props.inputRef(inputRef);
    }

    this.inputRef = inputRef;
  };

  handlePress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    } else if (!this.props.disabled) {
      if (this.inputRef && !this.inputRef.isFocused()) {
        this.inputRef.focus();
      }
    }
  };

  render() {
    const {
      icon,
      disabled,
      multiLine,
      onChange,
      autoFocus = false,
      placeholder,
      style,
      containerStyle,
      value,
      readOnly = false,
      autoGrow,
      autoControl,
      placeholderColor,
      returnKeyType,
      pointerEvents,
      onChangeEvent,
      CustomTextInputComponent = TextInputComponent,
      iconContainerStyle = {},
      ...otherProps
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={getContainerStylesForProps(this.props)}>
          {!!icon && (
            <View style={[styles.iconContainer, iconContainerStyle]}>
              {icon}
            </View>
          )}
          <CustomTextInputComponent
            {...otherProps}
            value={value}
            refInput={this.getInputRef}
            pointerEvents={pointerEvents}
            editable={!readOnly}
            autoFocus={autoFocus}
            underlineColorAndroid="transparent"
            onChange={onChangeEvent}
            onChangeText={onChange}
            placeholder={placeholder}
            disabled={disabled}
            placeholderColor={COLORS.GRAY}
            autoGrow={autoGrow}
            style={getInputStylesForProps(this.props)}
            returnKeyType={returnKeyType}
            multiline={multiLine}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default TextInput;
