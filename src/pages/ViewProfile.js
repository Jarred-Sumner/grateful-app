import React from "react";
import { View } from "react-native";
import Text from "../components/Text";

export default props => (
  <View style={{ fle: 1 }}>
    <Text>View profile page {JSON.stringify(props)}</Text>
  </View>
);
