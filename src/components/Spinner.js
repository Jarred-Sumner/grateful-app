import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Easing,
  View,
  Animated
} from "react-native";
import { COLORS, SPACING } from "../lib/defaults";
import { Text } from "./Text";
import Divider from "./Divider";
import { LogoIcon } from "./Icon/LogoIcon";
import { defaultProps } from "recompose";
export const SIZES = {
  SMALL: "small",
  LARGE: "large"
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    flex: 1
  },
  [SIZES.SMALL]: {
    width: 32,
    height: 24
  },
  [SIZES.LARGE]: {
    width: 32,
    height: 32
  }
});

const SPIN_DIRATION = 1000;
// export class Spinner extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       animation: new Animated.Value(0)
//     };
//   }

//   componentDidMount() {
//     this.cycleAnimation();
//   }

//   cycleAnimation = () => {
//     this.state.animation.setValue(0);

//     Animated.timing(this.state.animation, {
//       toValue: 1,
//       duration: SPIN_DIRATION,
//       useNativeDriver: true,
//       easing: Easing.linear
//     }).start(animation => {
//       if (animation.finished) {
//         this.cycleAnimation();
//       }
//     });
//   };

//   render() {
//     const { size = SIZES.SMALL, color, isVisible, style } = this.props;
//     const { animation } = this.state;

//     return (
//       <Animated.View
//         style={[
//           style,
//           styles[size],
//           {
//             transform: [
//               {
//                 rotate: animation.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: ["0deg", "360deg"]
//                 })
//               }
//             ]
//           }
//         ]}
//       >
//         <LogoIcon width={SIZES[size]} height={SIZES[size]} />
//       </Animated.View>
//     );
//   }
// }

export const Spinner = ({
  size = SIZES.SMALL,
  color = COLORS.DARK_GRAY,
  isVisible,
  style
}) => {
  return (
    <ActivityIndicator size={size} hidesWhenStopped animating color={color} />
  );
};

// const Spinner = () => {};

Spinner.SIZES = SIZES;

export const LoadingListSpinner = ({
  children,
  size,
  color = COLORS.DARK_GRAY
}) => {
  if (children) {
    return (
      <View style={styles.container}>
        <Spinner size={size} color={color} />
        <Divider height={SPACING.SMALL} />
        <Text size={14} color={color}>
          {children}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Spinner size={size} color={color} />
      </View>
    );
  }
};

export const WhiteLoadingListSpinner = defaultProps({ color: COLORS.WHITE })(
  LoadingListSpinner
);

export default Spinner;
