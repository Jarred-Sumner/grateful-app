import _ from "lodash";
import Numeral from "numeral";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { withNavigation } from "react-navigation";
import { defaultProps } from "recompose";
import TinyColor from "tinycolor2";
import { TAB_ROUTE_NAMES } from "../../lib/Routes";
import { COLORS, ColorScheme, SPACING } from "../../lib/defaults";
import DefaultAvatar, { MemberAvatar } from "../Avatar";
import { GradientButton } from "../Button";
import Gradient from "../ColorSchemes/Gradient";
import Divider from "../Divider";
import Icon from "../Icon";
import { QRCode } from "../QRCode";
import Text, { WEIGHTS } from "../Text";
import { Can } from "../AbilitiesContext";
import { BigQRCode } from "../BigQRCode";

const AVATAR_SIZE = 27;

export const MEMBER_LIST_HEIGHT = 155;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: MEMBER_LIST_HEIGHT
  },
  qrCode: {
    position: "absolute",
    left: SPACING.NORMAL,
    top: SPACING.NORMAL
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.NORMAL,
    paddingHorizontal: SPACING.NORMAL
  },
  memberList: {
    paddingVertical: SPACING.NORMAL,
    paddingHorizontal: SPACING.NORMAL,
    backgroundColor: COLORS.WHITE,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1
  },
  ellipse: {
    position: "relative",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE
  },
  ellipseOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    right: 0,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: TinyColor(COLORS.BLACK)
      .setAlpha(0.76)
      .toRgbString(),
    transform: [
      {
        rotate: "90deg"
      }
    ]
  }
});

const MemberEllipsis = ({ member, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
    <View style={styles.ellipse}>
      <MemberAvatar size={AVATAR_SIZE} circle disabled membership={member} />
      <View style={styles.ellipseOverlay}>
        <Icon name="more" color={COLORS.WHITE} size={14} />
      </View>
    </View>
  </TouchableOpacity>
);

class _MemberList extends React.PureComponent {
  state = {
    showBigQRCode: false
  };

  handleShowBigQRCode = () => this.setState({ showBigQRCode: true });
  handleHideBigQRCode = () => this.setState({ showBigQRCode: false });
  handleShowMemberList = () => {
    this.props.navigation.navigate(TAB_ROUTE_NAMES.members, {
      id: this.props.group.id
    });
  };

  handleShowInvitePage = () => {
    this.props.navigation.navigate("InviteStack");
  };

  renderAvatars = () => {
    const { memberships } = this.props;
    if (memberships.length > 1) {
      return memberships.slice(0, memberships.length - 1).map(membership => {
        return (
          <React.Fragment key={membership.id}>
            <MemberAvatar size={AVATAR_SIZE} membership={membership} />
            <Divider width={SPACING.SMALL} />
          </React.Fragment>
        );
      });
    } else {
      return null;
    }
  };

  render() {
    const {
      memberships,
      group,
      membersCount,
      colorScheme,
      loading
    } = this.props;
    const primaryColor = new ColorScheme(colorScheme).primaryColor;

    if (!group) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View width={Dimensions.get("screen").width} height={100}>
          <View style={styles.header}>
            <Divider height={80} width={120} collapsable={false} />

            <Divider width={SPACING.NORMAL} />

            <View style={styles.textContainer}>
              <Text size={20} color={COLORS.WHITE} weight={WEIGHTS.BOLD}>
                {group.name}
              </Text>

              <Divider height={SPACING.SMALL} />

              <Text weight={WEIGHTS.SEMI_BOLD} color={COLORS.WHITE}>
                {Numeral(membersCount).format("0,0")} members
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.memberList}>
          <View style={styles.right}>
            {this.renderAvatars()}
            {!loading && (
              <MemberEllipsis
                member={_.last(memberships)}
                onPress={this.handleShowMemberList}
              />
            )}

            <Divider width={SPACING.SMALL} />

            <Can I="create" a="Invite">
              {() => (
                <GradientButton
                  colorScheme={colorScheme}
                  size={AVATAR_SIZE}
                  iconName="friend"
                  onPress={this.handleShowInvitePage}
                />
              )}
            </Can>
          </View>
        </View>

        {!!group.qr_code && (
          <View style={styles.qrCode}>
            <QRCode
              photo={group.qr_code}
              shadow
              onPress={this.handleShowBigQRCode}
            />

            <BigQRCode
              photo={group.qr_code}
              visible={this.state.showBigQRCode}
              onClose={this.handleHideBigQRCode}
            />
          </View>
        )}
      </View>
    );
  }
}

export const MemberList = withNavigation(_MemberList);
