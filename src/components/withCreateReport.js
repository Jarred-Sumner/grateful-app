import React from "react";
import { graphql, compose } from "react-apollo";
import Queries from "../lib/Queries";
import connectActionSheet from "@expo/react-native-action-sheet/connectActionSheet";
import Alert from "../lib/Alert";
import _ from "lodash";

const REPORT_KINDS = {
  bully: "bully",
  abusive: "abusive",
  inappropriate: "inappropriate",
  spam: "spam"
};

const CANCEL_LABEL = "Cancel";

const POSSIBLE_OPTIONS = {
  [REPORT_KINDS.bully]: "Bullying",
  [REPORT_KINDS.abusive]: "Abusive or harassment",
  [REPORT_KINDS.inappropriate]: "Inappropriate",
  [REPORT_KINDS.spam]: "Spam or irrelevant",
  cancel: CANCEL_LABEL
};

export const withCreateReport = Component => {
  class ReportableContainer extends React.Component {
    getReportKind = () => {
      return new Promise((resolve, reject) => {
        const { showActionSheetWithOptions } = this.props;

        const options = [
          POSSIBLE_OPTIONS.bully,
          POSSIBLE_OPTIONS.abusive,
          POSSIBLE_OPTIONS.inappropriate,
          POSSIBLE_OPTIONS.spam,
          CANCEL_LABEL
        ];

        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: options.indexOf(CANCEL_LABEL)
          },
          buttonIndex => {
            const option =
              POSSIBLE_OPTIONS[
                _.invert(POSSIBLE_OPTIONS)[options[buttonIndex]]
              ];

            if (option === POSSIBLE_OPTIONS.bully) {
              return resolve(REPORT_KINDS.bully);
            } else if (option === POSSIBLE_OPTIONS.abusive) {
              return resolve(REPORT_KINDS.abusive);
            } else if (option === POSSIBLE_OPTIONS.inappropriate) {
              return resolve(REPORT_KINDS.inappropriate);
            } else if (option === POSSIBLE_OPTIONS.spam) {
              return resolve(REPORT_KINDS.spam);
            } else {
              return resolve(null);
            }
          }
        );
      });
    };

    handleCreateReport = async ({ id, type, groupID }) => {
      const kind = await this.getReportKind();

      if (!kind) {
        return;
      }

      this.props
        .createReport({
          variables: {
            id,
            type,
            groupID,
            kind
          }
        })
        .then(() => {
          Alert.success(null, "Reported.");
        });
    };

    render() {
      const {
        createReport,
        showActionSheetWithOptions,
        ...otherProps
      } = this.props;
      return (
        <Component createReport={this.handleCreateReport} {...otherProps} />
      );
    }
  }

  return compose(
    connectActionSheet,
    graphql(Queries.CreateReport, {
      name: "createReport"
    })
  )(ReportableContainer);
};

export default withCreateReport;
