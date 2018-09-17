import React from "react";
import Text, { WEIGHTS } from "../../Text";
import Divider from "../../Divider";
import { View, StyleSheet } from "react-native";
import { defaultProps, setDisplayName } from "recompose";
import {
  COLORS,
  SPACING,
  COLOR_SCHEMES,
  PRIMARY_COLOR_BY_SCHEME
} from "../../../lib/defaults";
import AutolinkText from "../../AutolinkText";
import { PhotoGroup } from "./PhotoGroup";

const BodyText = defaultProps({
  wrap: true,
  size: 18,
  color: COLORS.BLACK
})(Text);

const PrefixText = defaultProps({
  color: PRIMARY_COLOR_BY_SCHEME[COLOR_SCHEMES.lavender],
  size: 18
})(Text);

const TitleText = defaultProps({
  wrap: true,
  size: 20,
  weight: WEIGHTS.SEMI_BOLD,
  color: COLORS.BLACK
})(Text);

const Content = ({ title, body, prefix }) => {
  if (title && body) {
    return (
      <React.Fragment>
        <TitleText>{title}</TitleText>
        <Divider height={SPACING.SMALL} />
        <BodyText>{body}</BodyText>
      </React.Fragment>
    );
  } else if (body) {
    return (
      <React.Fragment>
        <BodyText>
          {prefix && (
            <PrefixText>
              {prefix}
              &nbsp;
            </PrefixText>
          )}
          {body}
        </BodyText>
      </React.Fragment>
    );
  } else if (title) {
    return (
      <React.Fragment>
        <TitleText>{title}</TitleText>
      </React.Fragment>
    );
  } else {
    return <Text>Not implimented yet!!</Text>;
  }
};

export default setDisplayName("Content")(Content);
