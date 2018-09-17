/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Bluebird from "bluebird";
import _ from "lodash";
import React from "react";
import { ApolloProvider } from "react-apollo";
import {
  AppState,
  InteractionManager,
  Platform,
  UIManager,
  Image,
  StatusBar,
  View
} from "react-native";
import "react-native-console-time-polyfill";
import { ENVIRONMENT } from "react-native-dotenv";
import OneSignal from "react-native-onesignal";
import { Sentry } from "react-native-sentry";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import apolloClient from "./components/GraphQLProvider";
import { UploadPhotoProvider } from "./components/UploadPhoto";
import { UserContextContainer } from "./components/UserContext";
import { goOffline, updateDevice } from "./lib/api";
import Storage from "./lib/Storage";
import FeedPage from "./pages/Feed";
import SplashScreen from "./pages/SplashPage";
import ViewPostPage from "./pages/ViewPost";
import SignUpPage from "./pages/SignUp";
import ViewProfilePage from "./pages/ViewProfile";
import SettingsPage from "./pages/Settings";
import WelcomePage from "./pages/Welcome";
import { ColorScheme, APP_COLOR_SCHEME } from "./lib/defaults";

// Causes crash when tapping back button inside of tabs
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(false);
}

require("react-native-console-time-polyfill");
window.Promise = Bluebird;
console.disableYellowBox = true;

if (ENVIRONMENT === "PRODUCTION") {
  Sentry.config(
    "https://5b690a9735e742779f722fe93c9218b4:863af9d1929842e3b1341f673db84840@sentry.io/1194905"
  ).install();
}

export function getCurrentRoute(
  navigationState,
  currentDepth = 0,
  maxDepth = -1
) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes && (maxDepth === -1 || currentDepth <= maxDepth)) {
    return getCurrentRoute(route, currentDepth + 1, maxDepth);
  }
  return route;
}

export function getCurrentRouteName(navigationState) {
  const currentRoute = getCurrentRoute(navigationState);

  if (currentRoute) {
    return currentRoute.routeName;
  } else {
    return null;
  }
}

export function isRouteActive(navigationState, routeName) {
  if (!navigationState) {
    return false;
  }

  const route = navigationState.routes[navigationState.index];

  if (routeName === route.routeName) {
    return true;
  } else if (route.routes) {
    return isRouteActive(
      navigationState.routes[navigationState.index],
      routeName
    );
  } else {
    return false;
  }
}

const URI_PREFIX = "grateful://grateful/";

const AppContainer = createStackNavigator(
  {
    Feed: {
      screen: FeedPage,
      path: "feed"
    },
    ViewPost: {
      screen: ViewPostPage,
      path: "feed/:postID"
    },
    ViewProfile: {
      screen: ViewProfilePage,
      path: "profiles/:id"
    },
    Settings: {
      screen: SettingsPage,
      path: "settings"
    }
  },
  {
    mode: "modal"
  }
);

const UnauthenticatedRoutes = createStackNavigator(
  {
    Welcome: {
      screen: WelcomePage,
      path: ""
    },
    SignUp: {
      screen: SignUpPage,
      path: "sign-up"
    }
  },
  {
    headerMode: "none",
    initialRouteKey: "Welcome",
    path: "welcome"
  }
);

const Routes = createSwitchNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      path: "splash"
    },
    Unauthenticated: UnauthenticatedRoutes,
    root: {
      screen: AppContainer,
      path: ""
    }
  },
  {
    initialRouteName: "SplashScreen"
  }
);

// 1 minute
const HEARTBEAT_TIME = 60000;
class RootApp extends React.Component {
  static buildInitialState = () => ({
    isLoading: true,
    appState: AppState.currentState,
    pendingNotifications: [],
    jwt: Storage.getCachedJWT()
  });
  constructor(props) {
    super(props);

    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
    OneSignal.inFocusDisplaying(0); // Hide in-app notifs

    // window.setTimeout(() => {
    //   this.onOpened({
    //     notification: {
    //       payload: {
    //         additionalData: {
    //           group_id: 1,
    //           routeName: "ChatPages",
    //           routeParams: {
    //             activeGroupId: 1
    //           }
    //         }
    //       }
    //     }
    //   });
    // }, 5000);
    this.sendDeviceUpdate = _.debounce(this.sendDeviceUpdate, 1000);

    if (!this.state) {
      this.state = RootApp.buildInitialState();
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  onReceived(notification) {
    const data = _.get(notification, "payload.additionalData") || {};
    // logEvent("Received Notification");

    console.log("Notification received: ", notification);
  }

  onIds = device => {
    console.log("Device info: ", device);
    this.sendDeviceUpdate(device);
  };

  onOpened = openResult => {
    // logEvent("Opened Notification", {
    //   focused: openResult.notification.isAppInFocus
    // });
    console.log("Opened");

    const data = _.get(openResult, "notification.payload.additionalData") || {};

    if (data.routeName) {
      if (this.setState) {
        this.setState({
          pendingNotifications: [data]
        });
      } else {
        this.state = {
          ...RootApp.buildInitialState(),
          pendingNotifications: [data]
        };
      }
    }
  };

  sendDeviceUpdate = device => {
    updateDevice({
      pushEnabled:
        typeof device.subscribed !== "undefined" ? device.subscribed : true,
      onesignalUid: device.userId,
      pushToken: device.pushToken,
      jwt: this.state.jwt
    }).then(() => console.log("Updated device"));
  };

  async componentDidMount() {
    const jwt = await Storage.getJWT();

    this.setState({
      isLoading: false,
      jwt
    });

    // OneSignal.init("aa961028-67f9-4f2a-9ebe-b3c8ce68d574", {
    //   kOSSettingsKeyAutoPrompt: false
    // });

    InteractionManager.runAfterInteractions(() => {
      OneSignal.getPermissionSubscriptionState(this.sendDeviceUpdate, err =>
        console.log(err)
      );
    });
  }

  handleUpdateJWT = jwt => this.setState({ jwt });
  handleUpdatePendingNotifications = pendingNotifications =>
    this.setState({ pendingNotifications });

  navigator = navigator => {
    if (navigator !== this.state.navigator) {
      this.setState({ navigator });
    }
  };
  render() {
    if (this.state.isLoading) {
      return <View />;
    }

    return (
      <UserContextContainer
        navigator={this.state.navigator}
        jwt={this.state.jwt}
        pendingNotifications={this.state.pendingNotifications}
        onChangePendingNotifications={this.handleUpdatePendingNotifications}
        onChangeJWT={this.handleUpdateJWT}
      >
        <UploadPhotoProvider>
          <Routes ref={this.navigator} uriPrefix={URI_PREFIX} />
        </UploadPhotoProvider>
      </UserContextContainer>
    );
  }
}

export default () => {
  return (
    <ActionSheetProvider>
      <ApolloProvider client={apolloClient}>
        <RootApp />
      </ApolloProvider>
    </ActionSheetProvider>
  );
};
