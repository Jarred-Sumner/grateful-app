import React from "react";
import { Linking, ScrollView, StatusBar, StyleSheet } from "react-native";
import RNAccountKit from "react-native-facebook-account-kit";
import Header from "../components/Header";
import { PickerRowItem } from "../components/PickerRow";
import Row from "../components/Row";
import Browser from "../lib/Browser";
import { COLORS, SPACING } from "../lib/defaults";
import {
  buildHomepageURL,
  buildPrivacyPolicyURL,
  buildTermsOfServiceURL
} from "../lib/routeHelpers";
import UserContext from "../components/UserContext";

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.GRAY,
    flex: 1
  },
  content: {
    paddingVertical: SPACING.NORMAL,
    flex: 0
  }
});

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    RNAccountKit.logout().then(() => {
      this.props.setJWT(null);
      this.props.setCurrentUserId(null);
      this.props.navigation.navigate("Unauthenticated");
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" animated />
        <Header.NavigationHeader
          left={<Header.BackButton navigation={this.props.navigation} />}
          title="Settings"
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <Row multiple label="Account">
            <PickerRowItem
              onPress={() => Linking.openURL(this.props.currentUser.url)}
            >
              View your page on the web
            </PickerRowItem>

            <PickerRowItem
              topDivider
              onPress={this.handleLogout}
              label="Logout"
            >
              Logout
            </PickerRowItem>
          </Row>

          <Row multiple label="Questions?">
            <PickerRowItem onPress={() => Linking.openURL("sms://19253858898")}>
              Text us: (925) 385-8898
            </PickerRowItem>
            <PickerRowItem
              topDivider
              onPress={() => Linking.openURL("mailto://founders@rewove.com")}
            >
              Email us: founders@rewove.com
            </PickerRowItem>
          </Row>

          <Row multiple label="More information">
            <PickerRowItem onPress={() => Linking.openURL(buildHomepageURL())}>
              View website
            </PickerRowItem>

            <PickerRowItem
              topDivider
              onPress={() => Browser.show(buildPrivacyPolicyURL(), false)}
            >
              Privacy Policy
            </PickerRowItem>
            <PickerRowItem
              topDivider
              onPress={() => Browser.show(buildTermsOfServiceURL(), false)}
            >
              Terms of Service
            </PickerRowItem>
          </Row>
        </ScrollView>
      </View>
    );
  }
}

export default props => (
  <UserContext>
    {userProps => <SettingsPage {...userProps} {...props} />}
  </UserContext>
);
