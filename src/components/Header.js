import React from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  NavigationActions,
  SafeAreaView,
  withNavigation
} from "react-navigation";
import { COLORS, SPACING } from "../lib/defaults";
import Divider from "./Divider";
import Icon from "./Icon";
import Text, { WEIGHTS } from "./Text";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: SPACING.NORMAL,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 40,
    position: "relative"
  },
  left: {
    position: "relative",
    alignItems: "flex-start",
    minWidth: 40,
    justifyContent: "center"
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.NORMAL,
    justifyContent: "center",
    flexDirection: "row",
    position: "relative"
  }
});

class Header extends React.Component {
  static defaultProps = {
    style: {}
  };

  render() {
    const {
      left,
      right,
      center,
      title,
      style,
      titleColor = COLORS.BLACK,
      backgroundColor,
      width,
      height
    } = this.props;
    return (
      <View style={{ position: "relative" }} pointerEvents="box-none">
        <View
          pointerEvents="box-none"
          style={[
            styles.container,
            style,
            {
              backgroundColor,
              height
            }
          ]}
        >
          <View pointerEvents="box-none" style={styles.left}>
            {left || <Divider />}
          </View>
          <View style={styles.center}>
            {center || (
              <View pointerEvents="none">
                <Text
                  align="center"
                  size={14}
                  color={titleColor}
                  weight={WEIGHTS.SEMI_BOLD}
                  casing="uppercase"
                  wrap={false}
                >
                  {title}
                </Text>
              </View>
            )}
          </View>
          <View pointerEvents="box-none" style={styles.right}>
            {right || <Divider />}
          </View>
        </View>
      </View>
    );
  }
}

Header.FIXED_HEIGHT = 48;

Header.CenterIcon = ({ children }) => {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.DARK_GRAY
      }}
    >
      {children}
    </View>
  );
};

Header.BackButton = withNavigation(({ navigation, color = COLORS.BLACK }) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        width: "100%"
      }}
      onPress={() => navigation.goBack()}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: SPACING.SMALL,
          justifyContent: "center",
          alignSelf: "flex-start"
        }}
      >
        <Icon name="arrow-left" color={color} size={14} />
      </View>
    </TouchableOpacity>
  );
});

export const DEFAULT_HEADER_HEIGHT = 55;

const headerWithColorSchemeStyles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    overflow: "hidden"
  },
  gradientContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    width: "100%"
  }
});
class HeaderWithColorScheme extends React.Component {
  static defaultProps = {
    minimizeWhileScrollingDown: true,
    height: DEFAULT_HEADER_HEIGHT,
    scrollY: new Animated.Value(0),
    minimizedHeight: getStatusBarHeight()
  };

  constructor(props) {
    super(props);

    this.lastScrollY = 0;

    this.state = {
      isMinimized: false
    };
  }

  get height() {
    return this.props.height + getStatusBarHeight();
  }

  render() {
    const {
      colorScheme,
      showGradient = true,
      children,
      style,
      ...otherProps
    } = this.props;

    return (
      <Animated.View
        style={[
          headerWithColorSchemeStyles.container,
          {
            height: this.height,
            transform: [
              {
                translateY: this.props.scrollY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -this.props.height]
                })
              }
            ]
          }
        ]}
      >
        <Animated.View
          style={{
            marginTop: getStatusBarHeight(),
            position: "relative",
            width: "100%",
            height: this.props.height,
            opacity: this.props.scrollY.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })
          }}
        >
          <Header
            style={StyleSheet.flatten([
              style,
              {
                borderBottomWidth: 0,
                height: this.props.height
              }
            ])}
            backgroundColor="transparent"
            {...otherProps}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}
Header.ColorScheme = HeaderWithColorScheme;

Header.NavigationHeader = ({
  color = "transparent",
  vibrant = false,
  borderBottomColor = COLORS.GRAY,
  HeaderComponent = Header,
  height = DEFAULT_HEADER_HEIGHT,
  ...otherProps
}) => {
  const newStyle =
    color === "transparent"
      ? {
          borderBottomColor: "transparent",
          borderBottomWidth: 0
        }
      : null;
  return (
    <SafeAreaView
      forceInset={{
        top: "always",
        bottom: "never",
        left: "never",
        right: "never"
      }}
    >
      <View
        style={{
          flex: 0,
          backgroundColor: color,
          height,
          justifyContent: "flex-end"
        }}
      >
        <HeaderComponent height={height} style={newStyle} {...otherProps} />
      </View>
    </SafeAreaView>
  );
};

Header.CloseButton = withNavigation(
  ({ onPress, shouldPopToTop, style, color = COLORS.BLACK, navigation }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
        onPress={
          onPress
            ? onPress
            : () => (shouldPopToTop ? navigation.popToTop() : navigation.pop())
        }
      >
        <View
          style={{
            ...style,
            paddingHorizontal: SPACING.SMALL
          }}
        >
          <Icon name="close" color={color} size={18} />
        </View>
      </TouchableOpacity>
    );
  }
);

Header.NavigationButton = withNavigation(
  ({ navigation, routeName, routeParams = {}, children, ...otherProps }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          width: "100%"
        }}
        onPress={() =>
          navigation.dispatch(
            NavigationActions.navigate({
              routeName,
              params: routeParams
            })
          )
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center"
          }}
        >
          <Text {...otherProps} type="link">
            {children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

Header.CustomNavigationButton = withNavigation(
  ({
    navigation,
    routeName,
    transitionStyle,
    routeParams = {},
    style,
    children,
    ...otherProps
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() =>
          navigation.dispatch(
            NavigationActions.navigate({
              routeName,
              params: routeParams,
              transitionStyle
            })
          )
        }
      >
        <View
          style={{
            ...style,
            flex: 1,
            paddingHorizontal: SPACING.SMALL,
            justifyContent: "center"
          }}
        >
          {children}
        </View>
      </TouchableOpacity>
    );
  }
);

const iconButtonStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  left: {
    justifyContent: "flex-start"
  },
  center: {
    justifyContent: "center"
  },
  right: {
    justifyContent: "flex-end"
  }
});

const SIDE_TO_STYLE = {
  left: iconButtonStyles.left,
  right: iconButtonStyles.right,
  center: iconButtonStyles.center
};

const IconButton = ({
  onPress,
  name,
  disabled,
  side = "right",
  color = COLORS.DARK_GRAY,
  size = 18,
  ...otherProps
}) => (
  <TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
    <View style={[iconButtonStyles.container, SIDE_TO_STYLE[side]]}>
      <Icon name={name} size={size} color={color} {...otherProps} />
    </View>
  </TouchableWithoutFeedback>
);

Header.IconButton = IconButton;

export default Header;
