import React from "react";
import PropTypes from "prop-types";

import { SectionList } from "react-native";

import KeyboardAwareBase from "react-native-keyboard-aware-scrollview/src/KeyboardAwareBase";

export default class KeyboardAwareSectionList extends KeyboardAwareBase {
  render() {
    const initialOpacity = this.props.startScrolledToBottom ? 0 : 1;
    alert("RENDER");
    return (
      <SectionList
        {...this.props}
        {...this.style}
        opacity={initialOpacity}
        contentInset={{ bottom: this.state.keyboardHeight }}
        ref={r => {
          this._keyboardAwareView = r;
        }}
        onLayout={layoutEvent => {
          this._onKeyboardAwareViewLayout(layoutEvent.nativeEvent.layout);
        }}
        onScroll={event => {
          this._onKeyboardAwareViewScroll(event.nativeEvent.contentOffset);
          if (this.props.onScroll) {
            this.props.onScroll(event);
          }
        }}
        onContentSizeChange={() => {
          this._updateKeyboardAwareViewContentSize();
        }}
        scrollEventThrottle={200}
      />
    );
  }
}

KeyboardAwareSectionList.propTypes = {
  onScroll: PropTypes.func
};

KeyboardAwareSectionList.defaultProps = {
  ...KeyboardAwareBase.defaultProps
};
