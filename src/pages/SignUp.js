import _ from "lodash";
import React from "react";
import { Query } from "react-apollo";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  InteractionManager
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions } from "react-navigation";
import Divider from "../components/Divider";
import Header from "../components/Header";
import Icon from "../components/Icon";
import UserContext from "../components/UserContext";
import Text from "../components/Text";
import TextInputRow from "../components/TextInputRow";
import UsernameInputRow from "../components/UsernameInputRow";
import Alert, { handleApiError } from "../lib/Alert";
import Browser from "../lib/Browser";
import Queries from "../lib/Queries";
import { logEvent } from "../lib/analytics";
import { signUp } from "../lib/api";
import { COLORS, SPACING } from "../lib/defaults";
import {
  buildPrivacyPolicyURL,
  buildTermsOfServiceURL
} from "../lib/routeHelpers";
import PickerRow from "../components/PickerRow";

const styles = StyleSheet.create({
  container: {
    flex: 0
  },
  scrollView: {
    backgroundColor: COLORS.GRAY,
    flex: 1
  },
  top: {
    justifyContent: "center",
    alignItems: "center"
  }
});

class RawSignUpPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.navigation.getParam("username", ""),
      name: props.navigation.getParam("name", ""),
      isOldEnough: true
    };
  }

  goNext = async () => {
    const { username, name, isOldEnough } = this.state;

    if (_.isEmpty(username)) {
      await Alert.error("", "Please enter your username");
      logEvent("Sign Up Error", {
        type: "username"
      });
      this.usernameRef && this.usernameRef.focus();
      this.scrollView.scrollIntoView(this.usernameRef);
      return;
    }

    if (_.isEmpty(username)) {
      await Alert.error("", "Please enter your username");
      logEvent("Sign Up Error", {
        type: "username"
      });

      this.usernameRef && this.usernameRef.focus();
      this.scrollView.scrollIntoView(this.usernameRef);

      return;
    }

    if (_.isEmpty(name)) {
      await Alert.error("", "Please enter your name");
      logEvent("Sign Up Error", {
        type: "name"
      });
      this.nameInputRef && this.nameInputRef.focus();
      this.scrollView.scrollIntoView(this.nameInputRef);
      return;
    }

    if (!isOldEnough) {
      await Alert.error(
        null,
        "You must be at least 13 years old to use Grateful."
      );
      if (this.scrollView) {
        this.scrollView.scrollIntoView(this.ageRow);
      }

      return;
    }

    signUp({
      username,
      name,
      jwt: this.props.jwt
    })
      .then(response => {
        const { jwt } = response.body;

        this.props.setJWT(jwt);
        return this.props.refetch();
      })
      .then(({ data }) => {
        const { Me } = data;
        const { profile } = Me;

        this.props.setCurrentUserId(Me.id);
        this.props.setCurrentUser(Me);
        logEvent("Sign Up");

        return this.props.navigation.navigate("root");
      })
      .catch(exception => {
        handleApiError(exception);
        logEvent("Sign up Error");
      });
  };

  toggleIsOldEnough = () =>
    this.setState({ isOldEnough: !this.state.isOldEnough });
  setName = name => this.setState({ name });
  setUsername = username => this.setState({ username });

  render() {
    const { name, username, isOldEnough } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" animated />
        <Header.NavigationHeader
          right={
            <TouchableOpacity
              style={{ flex: 1, width: "100%", height: "100%" }}
              onPress={this.goNext}
            >
              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  height: "100%",
                  paddingHorizontal: SPACING.SMALL
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="check"
                  color={COLORS.ORANGE}
                  size={16}
                />
              </View>
            </TouchableOpacity>
          }
          title="Sign up"
        />

        <KeyboardAwareScrollView
          style={styles.scrollView}
          ref={scrollView => (this.scrollView = scrollView)}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <UsernameInputRow
            returnKeyType="next"
            enablesReturnKeyAutomatically
            autoFocus
            inputRef={usernameRef => (this.usernameRef = usernameRef)}
            onSubmitEditing={() =>
              this.nameInputRef && this.nameInputRef.focus()
            }
            value={username}
            onChange={this.setUsername}
          />

          <TextInputRow
            label="Display name"
            returnKeyType="go"
            placeholder="Luke Miles"
            enablesReturnKeyAutomatically
            inputRef={nameInputRef => (this.nameInputRef = nameInputRef)}
            onSubmitEditing={this.goNext}
            value={name}
            onChange={this.setName}
          />

          <PickerRow
            label="Please verify you're at least 13"
            ref={ageRow => (this.ageRow = ageRow)}
            rowItemProps={{
              value: isOldEnough,
              icon: (
                <Icon
                  type="FontAwesome"
                  name={isOldEnough ? "check" : "close"}
                  color={isOldEnough ? COLORS.GREEN : COLORS.RED}
                  size={12}
                />
              )
            }}
            onPress={this.toggleIsOldEnough}
          >
            <Text>I am at least 13 years old</Text>
          </PickerRow>

          <Divider height={SPACING.MEDIUM} />

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingHorizontal: SPACING.NORMAL
            }}
          >
            <Text size={12} align="center">
              By signing up, you're agreeing to the
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => Browser.show(buildTermsOfServiceURL())}
              >
                <Text size={12} type="link">
                  Terms of Service
                </Text>
              </TouchableOpacity>
              <Text size={12} align="center">
                &nbsp;&nbsp;and&nbsp;&nbsp;
              </Text>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => Browser.show(buildPrivacyPolicyURL())}
              >
                <Text size={12} type="link">
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>

            <Text size={12} align="center">
              and that you are at least 13 years old
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const SignUpPage = props => (
  <UserContext>
    {userProps => <RawSignUpPage {...userProps} {...props} />}
  </UserContext>
);

export default props => (
  <Query delay query={Queries.Me}>
    {({ loading, refetch, data }) => (
      <SignUpPage {...props} refetch={refetch} loading={loading} data={data} />
    )}
  </Query>
);
