import Autolink from "react-native-autolink";
import React from "react";
import { Text } from "./Text";
import { defaultProps } from "recompose";
import Browser from "../lib/Browser";

export class AutolinkText extends React.Component {
  handlePress = url => {
    if (url) {
      Browser.show(url);
    }
  };

  render() {
    const { children, ...otherProps } = this.props;
    return (
      <Autolink
        onPress={this.handlePress}
        text={children}
        TextComponent={Text}
        {...otherProps}
      />
    );
  }
}

export default AutolinkText;
