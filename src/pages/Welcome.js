import _ from "lodash";
import React from "react";
import { Query } from "react-apollo";
import { StatusBar, StyleSheet, View } from "react-native";
import RNAccountKit, {
  Color,
  StatusBarStyle
} from "react-native-facebook-account-kit";
import {
  NavigationActions,
  StackActions,
  withNavigation
} from "react-navigation";
import Button from "../components/Button";
// import Banner from "../components/Welcome/Banner";
import Alert, { handleApiError } from "../lib/Alert";
import Queries from "../lib/Queries";
import { login } from "../lib/api";
import { COLORS } from "../lib/defaults";
import { logEvent } from "../lib/analytics";
import UserContext from "../components/UserContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE
  },
  button: {
    flex: 0,
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  top: {
    justifyContent: "center",
    alignItems: "center"
  }
});

RNAccountKit.configure({
  theme: {
    // Background
    backgroundColor: Color.rgba(255, 255, 255, 1),
    // Button
    // buttonBackgroundColor: Color.hex(COLORS.ORANGE),
    buttonBorderColor: Color.rgba(0, 255, 0, 1),
    buttonTextColor: Color.rgba(0, 255, 0, 1),
    // Button disabled
    buttonDisabledBackgroundColor: Color.rgba(100, 153, 0, 0.5),
    buttonDisabledBorderColor: Color.rgba(100, 153, 0, 0.5),
    buttonDisabledTextColor: Color.rgba(100, 153, 0, 0.5),
    // Header
    headerBackgroundColor: Color.rgba(0, 153, 0, 1.0),
    headerButtonTextColor: Color.rgba(0, 153, 0, 0.5),
    headerTextColor: Color.rgba(0, 255, 0, 1),
    // Input
    inputBackgroundColor: Color.rgba(0, 255, 0, 1),
    inputBorderColor: Color.hex("#ccc"),
    inputTextColor: Color.hex("#0f0"),
    // Others
    iconColor: Color.rgba(0, 255, 0, 1),
    textColor: Color.hex("#0f0"),
    titleColor: Color.hex("#0f0"),
    // Header
    statusBarStyle: StatusBarStyle.LightContent // or StatusBarStyle.Default
  }
});

class WelcomePage extends React.Component {
  static navigationOptions = {
    header: _.noop
  };

  constructor(props) {
    super(props);

    this.state = {
      isPending: false
    };
  }

  handleLogin = async token => {
    if (!token) {
      logEvent("Login Cancel");
      console.log("Login cancelled");
      this.setState({ isPending: false });
      return;
    }

    const response = await login(token);

    if (!response.body.jwt) {
      logEvent("Login Error");
      Alert.error(
        "Something isn't working right. Please contact support@rewove.com for assistance."
      );
      this.setState({ isPending: false });
      return;
    }

    this.props.setJWT(response.body.jwt);

    if (response.body.signedUp) {
      logEvent("Login Success");
      this.props.refetch().then(
        ({ data: { Me: user } }) => {
          this.props.setCurrentUser(user);

          this.props.navigation.navigate("root");
        },
        error => {
          handleApiError(error);
          console.warn(error);
        }
      );
    } else {
      this.props.navigation.push("SignUp", {
        accountId: token.accountId,
        accessToken: token.token
      });
    }

    this.setState({ isPending: false });
  };

  loginWithPhone = () => {
    if (this.state.isPending) {
      return;
    }

    this.setState({ isPending: true });
    RNAccountKit.getCurrentAccessToken().then(token => {
      if (token) {
        return this.handleLogin(token).catch(() =>
          this.setState({ isPending: false })
        );
      } else {
        return RNAccountKit.loginWithPhone()
          .then(this.handleLogin)
          .then(() => this.setState({ isPending: false }));
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" animated />
        {/* <Banner /> */}

        <View style={styles.button}>
          <Button
            color={COLORS.PINK}
            pending={this.state.isPending}
            size={Button.SIZES.LARGE}
            style={{ width: 206 }}
            onPress={this.loginWithPhone}
          >
            GET STARTED
          </Button>
        </View>
      </View>
    );
  }
}

export default withNavigation(props => (
  <UserContext>
    {({ ...userProps }) => (
      <Query delay query={Queries.Me}>
        {queryProps => (
          <WelcomePage {...queryProps} {...props} {...userProps} key="same" />
        )}
      </Query>
    )}
  </UserContext>
));
