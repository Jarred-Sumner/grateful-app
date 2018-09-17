import Divider from "./Divider";
import Icon from "./Icon";
import Text from "./Text";
import React from "react";
import { Platform, View } from "react-native";
import { SHARE_DOMAIN } from "react-native-dotenv";
import TextInputRow from "./TextInputRow";
import { COLORS, SPACING } from "../lib/defaults";

export default class UsernameInputRow extends React.Component {
  render() {
    const { value, onChange, ...otherProps } = this.props;
    return (
      <TextInputRow
        {...otherProps}
        label="username"
        value={value}
        iconContainerStyle={{ marginRight: 0 }}
        icon={
          <View
            style={{
              flexDirection: "row",
              marginLeft: SPACING.MEDIUM,
              alignItems: "center"
            }}
          >
            <Text size={14} lineHeight={19} color={COLORS.MEDIUM_GRAY}>
              @
            </Text>
          </View>
        }
        keyboardType={Platform.select({
          ios: "ascii-capable",
          android: "default"
        })}
        placeholder="username"
        inputStyle={{
          width: "100%",
          paddingLeft: 0,
          marginLeft: 0,
          paddingHorizontal: 0,
          paddingRight: SPACING.NORMAL
        }}
        autoCorrect={false}
        autoCapitalize="none"
        onChange={onChange}
      />
    );
  }
}
