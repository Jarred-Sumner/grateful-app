import _ from "lodash";
import { Alert as RNAlert, AlertIOS } from "react-native";
import prompt from "react-native-prompt-android";

export const handleApiError = error => {
  console.error(error);
  if (error.response) {
    const message = _.get(error, "response.body.message");
    if (message) {
      if (typeof message === "string") {
        Alert.error(message);
      } else {
        Alert.error(_.first(message));
      }

      return;
    }
  }

  Alert.error(
    "Something went wrong. Please re-enter your information and try again"
  );
};

export default class Alert {
  static success(message, title) {
    RNAlert.alert(title || "Success", message);
  }

  static prompt(message, title, defaultValue) {
    return new Promise((resolve, reject) => {
      prompt(
        title,
        message,
        [
          { text: "Cancel", onPress: () => resolve(null), style: "cancel" },
          { text: "OK", onPress: text => resolve(text) }
        ],
        {
          type: "plain-text",
          defaultValue
        }
      );
    });
  }

  static confirm(message, title) {
    return new Promise((resolve, reject) => {
      RNAlert.alert(
        title || "Are you sure?",
        message,
        [
          { text: "Yes", onPress: () => resolve() },
          { text: "Cancel", onPress: () => reject(), style: "cancel" }
        ],
        {
          onDismiss: () => reject(),
          cancelable: true
        }
      );
    });
  }

  static error(message, title) {
    return new Promise((resolve, reject) => {
      RNAlert.alert(title || "Something went wrong", message, [
        { text: "OK", onPress: () => resolve() }
      ]);
    });
  }
}
