import React from "react";
import { View } from "react-native";
import Text from "../components/Text";

export default props => (
  <View style={{ fle: 1 }}>
    <Text>View post page {JSON.stringify(props)}</Text>
  </View>
);
