import React from "react";
import { NativeModules, View } from "react-native";
import { KeyboardAccessoryView } from "react-native-keyboard-input";
import { TAB_BAR_HEIGHT } from "./TabBar";
import { isIphoneX } from "react-native-iphone-x-helper";
export default class InputAccessoryView extends React.Component {
  render() {
    const {
      renderContent,
      height,
      kbInputRef,
      forwardRef,
      children,
      insideTabBar,
      inverted = false
    } = this.props;
    return (
      <KeyboardAccessoryView
        kbInputRef={kbInputRef}
        trackInteractive
        ref={forwardRef}
        requiresSameParentToManageScrollView
        manageScrollView
        scrollToFocusedInput={false}
        allowHitsOutsideBounds
        revealKeyboardInteractive={false}
        addBottomView
        renderContent={renderContent}
      />
    );
  }
}
