import React from "react";
import { buildImgSrc } from "../lib/imgUri";
import Image from "./Image";
import UserAvatar from "react-native-user-avatar";
import { COLORS, BORDER_RADIUS } from "../lib/defaults";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import { graphql, Query } from "react-apollo";
import Queries from "../lib/Queries";
import _ from "lodash";
import { Text, WEIGHTS } from "./Text";
import Numeral from "numeral";

const PRESENCE_INDICATOR_SIZE = 10;
const BADGE_COUNT_SIZE = 21;

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    overflow: "visible"
  },
  presenceIndicatorContainer: {
    position: "absolute",
    right: 0,
    bottom: 0
  },
  presenceIndicatorWrapper: {
    overflow: "hidden",
    width: PRESENCE_INDICATOR_SIZE,
    height: PRESENCE_INDICATOR_SIZE,
    borderRadius: PRESENCE_INDICATOR_SIZE / 2
  },
  presenceIndicatorInner: {
    width: "100%",
    height: "100%",
    padding: 2,
    backgroundColor: COLORS.WHITE,
    justifyContent: "center",
    alignItems: "center"
  },
  presenceIndicator: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: PRESENCE_INDICATOR_SIZE / 2,
    backgroundColor: COLORS.GREEN,
    justifyContent: "center",
    alignItems: "center"
  },
  badgeCountWrapper: {
    overflow: "hidden",
    position: "absolute",
    right: -BADGE_COUNT_SIZE / 2,
    top: 0,
    width: BADGE_COUNT_SIZE,
    height: BADGE_COUNT_SIZE,
    borderRadius: BADGE_COUNT_SIZE / 2
  },
  badgeCountContainer: {
    overflow: "hidden",
    width: BADGE_COUNT_SIZE,
    height: BADGE_COUNT_SIZE,
    borderRadius: BADGE_COUNT_SIZE / 2
  },
  innerBadge: {
    width: "100%",
    height: "100%",
    padding: 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: BADGE_COUNT_SIZE / 2,
    justifyContent: "center",
    alignItems: "center"
  },
  badgeCount: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.RED,
    borderRadius: BADGE_COUNT_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});

export const PresenceIndicator = () => (
  <View style={styles.presenceIndicatorWrapper}>
    <View style={styles.presenceIndicatorInner}>
      <View style={styles.presenceIndicator} />
    </View>
  </View>
);

export const BadgeCount = ({ count }) => (
  <View style={styles.badgeCountContainer}>
    <View style={styles.innerBadge}>
      <View style={styles.badgeCount}>
        <Text
          align="center"
          color={COLORS.WHITE}
          size={12}
          weight={WEIGHTS.BOLD}
        >
          {Numeral(count).format("0,0")}
        </Text>
      </View>
    </View>
  </View>
);

class _Avatar extends React.PureComponent {
  static defaultProps = {
    disabled: false,
    online: false,
    anonymous: false
  };

  get isPressable() {
    return !this.props.disabled && !!this.props.id;
  }

  handlePress = () => {
    if (this.props.onPress) {
      return this.props.onPress(this.props.id);
    } else {
      this.props.navigation.navigate("ViewUserProfile", {
        id: this.props.id,
        name: this.props.name,
        profilePhoto: this.props.url
      });
    }
  };

  render() {
    const {
      disabled,
      id,
      size,
      url,
      name,
      anonymous,
      online,
      badgeCount,
      ...otherProps
    } = this.props;

    const avatar = (
      <UserAvatar
        {...otherProps}
        component={Image}
        size={size}
        colors={[
          COLORS.ORANGE,
          COLORS.BLUE,
          COLORS.PINK,
          COLORS.GREEN,
          COLORS.RED
        ]}
        name={name || "New User"}
        src={url ? buildImgSrc(url, size) : null}
        borderRadius={size / 2}
      />
    );

    const container = (
      <View style={styles.avatarContainer}>
        {avatar}
        {online && (
          <View style={styles.presenceIndicatorContainer}>
            <PresenceIndicator />
          </View>
        )}
        {_.isNumber(badgeCount) &&
          badgeCount > 0 && (
            <View style={styles.badgeCountWrapper}>
              <BadgeCount count={badgeCount} />
            </View>
          )}
      </View>
    );

    if (this.isPressable) {
      return (
        <TouchableWithoutFeedback onPress={this.handlePress}>
          {container}
        </TouchableWithoutFeedback>
      );
    } else {
      return container;
    }
  }
}

export const Avatar = withNavigation(_Avatar);

export default Avatar;

export const ProfileAvatar = ({ profile, disabled, online, ...otherProps }) => {
  if (!profile) {
    return null;
  }

  return (
    <Avatar
      {...otherProps}
      disabled={disabled}
      id={profile.id}
      online={online}
      name={profile.name}
      url={profile.profile_photo}
    />
  );
};
