import React from "react";
import { Query } from "react-apollo";
import { InteractionManager, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { NavigationActions } from "react-navigation";
import UserContext from "../components/UserContext";
import Alert from "../lib/Alert";
import { initializeAnalytics } from "../lib/analytics";
import Queries from "../lib/Queries";

class RawSplashPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasRedirected: false
    };
  }

  checkUser = () => {
    const { loading, data = {} } = this.props;

    if (loading || this.state.hasRedirected) {
      return;
    }

    const { Me: user = null } = data;

    return new Promise((resolve, reject) => {
      if (user) {
        const { profile } = user;
        this.props.setCurrentUserId(user.id);
        this.props.setCurrentUser(user);
        // setBadgeCount(user.app_badge_number);

        initializeAnalytics(user);

        this.setState({ hasRedirected: true });
        resolve();
        return this.props.navigation.dispatch(
          NavigationActions.navigate({
            routeName: "App"
          })
        );
      } else {
        this.setState({ hasRedirected: true });
        resolve();
        return this.props.navigation.dispatch(
          NavigationActions.navigate({
            routeName: "Unauthenticated"
          })
        );
      }
    })
      .then(() => {
        console.log("Loaded");
        InteractionManager.runAfterInteractions(() => {
          SplashScreen.hide();
        });
      })
      .catch(exception => {
        Alert.error("An error occurred while loading Rewove");
        SplashScreen.hide();
      });
  };

  componentDidMount() {
    if (this.props.jwt && this.props.currentUserId) {
      this.checkUser();
    } else {
      this.props.navigation.dispatch(
        NavigationActions.navigate({
          routeName: "Unauthenticated"
        })
      );

      this.setState({ hasRedirected: true });
      InteractionManager.runAfterInteractions(() => {
        SplashScreen.hide();
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data !== this.props.data ||
      prevProps.loading !== this.props.loading
    ) {
      this.checkUser();
    }
  }

  render() {
    return <View />;
  }
}

export default props => (
  <UserContext>
    {userProps => (
      <Query
        skip={!(userProps.jwt && userProps.currentUserId)}
        fetchPolicy="cache-and-network"
        query={Queries.Me}
      >
        {({ refetch, data, loading }) => (
          <RawSplashPage
            {...props}
            {...userProps}
            refetch={refetch}
            data={data}
            loading={loading}
            refetch={refetch}
          />
        )}
      </Query>
    )}
  </UserContext>
);
