import _ from "lodash";
// import { AMPLITUDE_API_KEY, ENVIRONMENT } from "react-native-dotenv";
// import RNAmplitude from "react-native-amplitude-analytics";
// import Firebase from "react-native-firebase";
// import { Sentry } from "react-native-sentry";
import { ENVIRONMENT } from "react-native-dotenv";
// export const Amplitude = new RNAmplitude(AMPLITUDE_API_KEY);
const IS_DEVELOPMENT = ENVIRONMENT === "development";

var lastScreen = null;

export const initializeAnalytics = user => {
  // Firebase.analytics().setAnalyticsCollectionEnabled(true);
  // if (user) {
  //   Amplitude.setUserId(user.id);
  //   Firebase.analytics().setUserId(user.id);
  //   Firebase.analytics().setUserProperty("created_at", user.created_at);
  //   Firebase.analytics().setUserProperty("email", user.email);
  //   Amplitude.setUserProperties({
  //     email: user.email,
  //     created_at: user.created_at,
  //     username: user.slug
  //   });
  //   Sentry.setUserContext({
  //     email: user.email,
  //     id: user.id
  //   });
  // }
};

export const logEvent = (name, props = {}, callback = _.noop) => {
  // const defaultProps = {
  //   screen: lastScreen
  // };
  // console.log("[event]", name, { ...defaultProps, ...props });
  // Amplitude.logEvent(name, { ...defaultProps, ...props }, callback);
  // try {
  //   Firebase.analytics().logEvent(name.replace(/ /gi, "_"), {
  //     ...defaultProps,
  //     ...props
  //   });
  // } catch (exception) {
  //   if (IS_DEVELOPMENT) {
  //     console.error(exception);
  //   }
  // }
};

export const logScreenChange = name => {
  // lastScreen = name;
  // Firebase.analytics().setCurrentScreen(name);
  // Sentry.captureBreadcrumb({
  //   message: `Navigated to ${name}`,
  //   category: "action"
  // });
};

export const logEventWithTimestamp = (
  name,
  props = {},
  timestamp,
  callback = _.noop
) => {
  console.log("[amplitude]", name, props);

  // Amplitude.logEventWithTimestamp(name, props, timestamp, callback);
};
