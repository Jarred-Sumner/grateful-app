import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { NavigationActions, withNavigation } from "react-navigation";
import {
  BORDER_RADIUS,
  COLORS,
  SPACING,
  BACKGROUND_COLORS_FOR_COLOR_SCHEMES,
  FOREGROUND_COLORS_FOR_COLOR_SCHEMES,
  PRIMARY_COLOR_BY_SCHEME,
  COLOR_SCHEMES,
  colorSchemeBackgroundStyles
} from "../lib/defaults";
import Icon from "./Icon";
import Spinner from "./Spinner";
import Text, { WEIGHTS } from "./Text";
export const SIZES = {
  SMALL: "small",
  NORMAL: "normal",
  LARGE: "large"
};

// COLOR_SCHEMES.(.*)]: { backgroundColor: ".*" },
// COLOR_SCHEMES.$1]: { backgroundColor: PRIMARY_COLOR_BY_SCHEME.$1 },
const fillColorStyles = StyleSheet.flatten([
  colorSchemeBackgroundStyles,
  {
    [COLORS.BLACK]: {
      backgroundColor: COLORS.BLACK
    },
    [COLORS.WHITE]: {
      backgroundColor: COLORS.WHITE
    },
    [COLORS.PINK]: {
      backgroundColor: COLORS.PINK
    },
    [COLORS.ORANGE]: {
      backgroundColor: COLORS.ORANGE
    },
    [COLORS.BLUE]: {
      backgroundColor: COLORS.BLUE
    },
    [COLORS.TWITTER]: {
      backgroundColor: COLORS.TWITTER
    },
    [COLORS.FACEBOOK]: {
      backgroundColor: COLORS.FACEBOOK
    },
    [COLORS.INSTAGRAM]: {
      backgroundColor: COLORS.INSTAGRAM
    }
  }
]);

const unfillColorStyles = StyleSheet.create({
  [COLORS.BLACK]: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: COLORS.BLACK
  },
  [COLORS.BLUE]: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: COLORS.BLUE
  },
  [COLORS.WHITE]: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: COLORS.WHITE
  }
});

const containerStyles = StyleSheet.create({
  default: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flex: 0,
    alignSelf: "flex-start",
    flexDirection: "row",
    borderRadius: BORDER_RADIUS.OVAL,
    position: "relative"
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: "center"
  },
  normal: {
    paddingHorizontal: 24,
    paddingVertical: 10
  },
  small: {
    paddingHorizontal: SPACING.NORMAL,
    paddingVertical: SPACING.SMALL
  },
  disabled: { opacity: 0.65 }
});

const fillTextStyles = {
  [COLOR_SCHEMES.brand]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.blurple]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.gray]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.green]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.darkgreen]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.lavender]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.lilypad]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.pink]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.purple]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.red]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.salmon]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.silver]: { color: COLORS.WHITE },
  [COLOR_SCHEMES.slate]: { color: COLORS.WHITE },
  [COLORS.BLACK]: {
    color: COLORS.WHITE
  },
  [COLORS.WHITE]: {
    color: COLORS.DARK_GRAY
  },
  [COLORS.PINK]: {
    color: COLORS.WHITE
  },
  [COLORS.ORANGE]: {
    color: COLORS.WHITE
  },
  [COLORS.BLUE]: {
    color: COLORS.WHITE
  },
  [COLORS.TWITTER]: {
    color: COLORS.WHITE
  },
  [COLORS.FACEBOOK]: {
    color: COLORS.WHITE
  },
  [COLORS.INSTAGRAM]: {
    color: COLORS.WHITE
  }
};

const unfillTextStyles = {
  [COLORS.BLACK]: {
    color: COLORS.BLACK
  },
  [COLORS.WHITE]: {
    color: COLORS.WHITE
  },
  [COLORS.BLUE]: {
    color: COLORS.BLUE
  }
};

const TEXT_SIZE = {
  [SIZES.SMALL]: 12,
  [SIZES.NORMAL]: 14,
  [SIZES.LARGE]: 16
};

const ButtonText = ({ children, color, size, fill }) => {
  let styles = {
    height: "100%",
    alignItems: "center"
  };

  if (fill) {
    styles = {
      ...fillTextStyles[color]
    };
  } else {
    styles = {
      ...unfillTextStyles[color]
    };
  }

  return (
    <Text
      weight={WEIGHTS.BOLD}
      letterSpacing={0.5}
      size={TEXT_SIZE[size]}
      {...styles}
    >
      {typeof children === "string" ? children.toUpperCase() : children}
    </Text>
  );
};

const Button = withNavigation(
  ({
    children,
    icon,
    pending,
    color = COLORS.BLACK,
    fill = true,
    rightIcon,
    style,
    size = SIZES.NORMAL,
    onPress,
    href,
    navigation,
    navigate,
    hitSlop,
    disabled
  }) => {
    const containerStyle = [containerStyles.default];

    containerStyle.push(containerStyles[size]);

    if (disabled || pending) {
      containerStyle.push(containerStyles.disabled);
    }

    if (fill) {
      containerStyle.push(fillColorStyles[color]);
    } else {
      containerStyle.push(unfillColorStyles[color]);
    }

    containerStyle.push(style);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        hitSlop={hitSlop}
        onPress={
          navigate
            ? () => navigation.dispatch(NavigationActions.navigate(navigate))
            : href
              ? () => Linking.openURL(href)
              : onPress
        }
        disabled={disabled || pending}
      >
        <View style={StyleSheet.flatten(containerStyle)}>
          {!!(icon || pending) && (
            <View
              style={{
                marginRight: SPACING.SMALL,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {pending ? (
                <Spinner
                  size={Spinner.SIZES.SMALL}
                  color={COLORS.WHITE}
                  style={{ marginRight: 5 }}
                />
              ) : (
                icon
              )}
            </View>
          )}

          <ButtonText color={color} size={size} fill={fill}>
            {children}
          </ButtonText>
        </View>
      </TouchableOpacity>
    );
  }
);

const ELLIPSIS_SIZES = {
  [SIZES.SMALL]: 18,
  [SIZES.NORMAL]: 24,
  [SIZES.LARGE]: 36
};

const HITSLOP_BY_SIZE = {
  [SIZES.SMALL]: { top: 14, bottom: 14, right: 14, left: 14 },
  [SIZES.NORMAL]: { top: 24, bottom: 24, right: 24, left: 24 },
  [SIZES.LARGE]: { top: 36, bottom: 36, right: 36, left: 36 }
};

Button.Ellipsis = ({ onPress, color, size = SIZES.NORMAL }) => {
  return (
    <TouchableOpacity
      hitSlop={HITSLOP_BY_SIZE[size]}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <Icon name="more" size={ELLIPSIS_SIZES[size]} color={color} />
    </TouchableOpacity>
  );
};

Button.Ellipsis.displayName = "EllipsisButton";

Button.SIZES = SIZES;

const textButtonStyles = StyleSheet.create({
  container: {}
});
export const TextButton = ({
  children,
  color = COLORS.ORANGE,
  style,
  disabled,
  disabledOpacity = 0.65,
  onPress,
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={StyleSheet.flatten([
        {
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? disabledOpacity : 1
        },
        style
      ])}
      {...otherProps}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text weight={WEIGHTS.SEMI_BOLD} size={16} color={color}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const iconButtonStyles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});

export const IconButton = ({
  backgroundColor = COLORS.WHITE,
  iconName,
  iconType,
  iconColor = COLORS.DARK_GRAY,
  iconSize = 14,
  borderRadius,
  size = 24,
  onPress
}) => (
  <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
    <View
      style={{
        backgroundColor,
        borderRadius: borderRadius || size / 2,
        overflow: "hidden",
        width: size,
        height: size
      }}
    >
      <View style={iconButtonStyles.iconContainer}>
        <Icon
          type={iconType}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </View>
    </View>
  </TouchableOpacity>
);

export default Button;
