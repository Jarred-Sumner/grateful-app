import React from "react";
import { View, StyleSheet } from "react-native";
import { Reaction } from "./Reaction";
import { SPACING } from "../../lib/defaults";
import Divider from "../Divider";
import _ from "lodash";

const buildRows = ({
  keys,
  counts,
  selectedKeys = [],
  rowSize = 4,
  maxRows = 5
}) => {
  const countRows = _.chunk(counts, rowSize);

  return _.chunk(keys, rowSize)
    .slice(0, maxRows)
    .map((row, rowIndex) => {
      const currentCounts = countRows[rowIndex];

      return row.map((emoji, cellIndex) => {
        return {
          emoji,
          selected: selectedKeys.includes(emoji),
          count: currentCounts[cellIndex]
        };
      });
    });
};

export class ReactionGroup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      rows: []
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      rows: buildRows(props)
    };
  }

  render() {
    const {
      rowStyle,
      spacing = SPACING.SMALL,
      colorScheme,
      onReact
    } = this.props;
    const { rows } = this.state;

    return rows.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <View style={[rowStyle, { flexDirection: "row" }]}>
          {row.map((cell, index) => (
            <React.Fragment
              key={`${cell.emoji}-${cell.selected}-${cell.count}`}
            >
              <Reaction
                colorScheme={colorScheme}
                selected={cell.selected}
                onReact={onReact}
                emoji={cell.emoji}
                count={cell.count}
              />
              <Divider width={spacing} />
            </React.Fragment>
          ))}
        </View>
        <Divider height={spacing} />
      </React.Fragment>
    ));
  }
}
