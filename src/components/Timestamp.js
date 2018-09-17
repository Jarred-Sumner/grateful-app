import moment from "moment";
import Text, { WEIGHTS } from "./Text";
import { COLORS } from "../lib/defaults";
import { setDisplayName } from "recompose";
import React from "react";
import _ from "lodash";

const _formatRecentTimestamp = (timestamp, alwaysShowTime = false) => {
  const _timestamp = moment(timestamp);

  const isWithin24Hours = moment().diff(_timestamp, "hour") < 24;
  if (isWithin24Hours) {
    return _timestamp.format("h:mm a");
  } else if (alwaysShowTime && moment().diff(_timestamp, "day") < 7) {
    return _timestamp.format("dddd h:mm a");
  } else if (moment().diff(_timestamp, "day") < 7) {
    return _timestamp.format("dddd");
  } else if (alwaysShowTime) {
    return _timestamp.format("MMM Do h:mm a");
  } else {
    return _timestamp.format("MMM Do");
  }
};

export const formatRecentTimestamp = timestamp => {
  return _formatRecentTimestamp(timestamp, false);
};

export const formatRecentTimestampWithTime = timestamp => {
  return _formatRecentTimestamp(timestamp, true);
};

const Timestamp = ({
  prefix,
  timestamp,
  formatter = null,
  size = 12,
  weight = WEIGHTS.NORMAL,
  align
}) => (
  <Text align={align} weight={weight} size={size} color={COLORS.FADED_TEXT}>
    {_.compact([
      prefix,
      formatter ? formatter(timestamp) : moment(timestamp).fromNow()
    ]).join(" ")}
  </Text>
);

export default setDisplayName("Timestamp")(Timestamp);
