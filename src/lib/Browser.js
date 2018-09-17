import SafariView from "react-native-safari-view";
import { Linking, Platform, StatusBar } from "react-native";

export default class Browser {
  static getBrowser() {
    if (!this._singleton) {
      this._singleton = new Browser();
    }

    return this._singleton;
  }

  static show(url, autoClose) {
    return this.getBrowser().show(url, autoClose);
  }

  static hide() {
    return this.getBrowser().hide();
  }

  show(url, fromBottom = false) {
    if (Platform.OS === "ios") {
      StatusBar.setBarStyle("dark-content");
      SafariView.show({ url, fromBottom, readerMode: false });
    } else {
      Linking.openURL(url);
    }
  }

  hide() {
    if (Platform.OS === "ios") {
      SafariView.dismiss();
    }
  }
}
