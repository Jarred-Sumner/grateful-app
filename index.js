import { AppRegistry, Platform } from "react-native";
// import codePush from "react-native-code-push";
import RawApp from "./src/App";
import { CODEPUSH_IOS_KEY, CODEPUSH_ANDROID_KEY } from "react-native-dotenv";
import { name as appName } from "./app.json";

// const codePushOptions = {
//   deploymentKey: Platform.select({
//     ios: CODEPUSH_IOS_KEY,
//     android: CODEPUSH_ANDROID_KEY
//   }),
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
// };

// const App = codePush(codePushOptions)(RawApp);

AppRegistry.registerComponent(appName, () => RawApp);
