import React from "react";
import { NativeModules } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { KeyboardAccessoryView } from "react-native-keyboard-input";
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
        requiresSameParentToManageScrollView={false}
        manageScrollView
        scrollToFocusedInput={false}
        allowHitsOutsideBounds
        iOSScrollBehavior={
          inverted
            ? NativeModules.KeyboardTrackingViewManager
                .KeyboardTrackingScrollBehaviorScrollToBottomInvertedOnly
            : undefined
        }
        revealKeyboardInteractive={false}
        addBottomView={false}
        renderContent={renderContent}
      />
    );
  }
}
