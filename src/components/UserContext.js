import _ from "lodash";
import React from "react";
import { compose, graphql } from "react-apollo";
import Queries from "../lib/Queries";
import Storage from "../lib/Storage";

const { Provider, Consumer } = React.createContext({
  jwt: null,
  currentUser: null,
  currentUserId: null,
  setJWT: null,
  setCurrentUser: null
});

const POP_TO_ACTIVE_TAB_TIMEOUT = 5;
export const POP_TO_ACTIVE_TAB = "POP_TO_ACTIVE_TAB";

class _UserContextContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: !!props.jwt,
      currentUser: props.currentUser || null,
      currentUserId: _.get(props, "currentUser.id", null) || null
    };
  }

  handleSetJWT = jwt => {
    this.props.onChangeJWT(jwt);

    return Storage.setJWT(jwt);
  };

  handleSetActiveTab = activeTab => {
    this.setState({ activeTab });
  };

  buildContextValues = ({ jwt, currentUser }) => {
    return {
      jwt,
      currentUser,
      currentUserId: _.get(currentUser, "id", null),
      setJWT: this.handleSetJWT,
      setCurrentUser: this.handleSetCurrentUser
    };
  };

  handleSetCurrentUser = currentUser => {
    const currentUserId = _.get(currentUser, "id", null);
    Storage.setUserId(currentUserId);

    this.setState({
      currentUser,
      currentUserId
    });
  };

  render() {
    const { children } = this.props;

    return (
      <Provider
        value={this.buildContextValues({
          ...this.state,
          jwt: this.props.jwt
        })}
      >
        {children}
      </Provider>
    );
  }
}

export const UserContextContainer = compose(
  graphql(Queries.Me, {
    name: "userQuery",
    options: {
      fetchPolicy: "cache-only"
    }
  })
)(_UserContextContainer);

export default Consumer;
