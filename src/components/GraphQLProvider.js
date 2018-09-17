import { toIdValue } from "apollo-utilities";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloClient } from "apollo-client";
import { ApolloLink, concat } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import React from "react";
import { Platform, StatusBar, AsyncStorage } from "react-native";
import { BASE_HOSTNAME } from "react-native-dotenv";
import Storage from "../lib/Storage";
import { APP_VERSION, DEVICE_ID, TIMEZONE } from "../lib/api";
// import introspectionQueryResultData from "../../static/fragmentTypes.json";
import { CachePersistor } from "apollo-cache-persist";
import Alert from "../lib/Alert";

const customFetch = (uri, options) => {
  StatusBar.setNetworkActivityIndicatorVisible(true);

  return fetch(uri, options).then(response => {
    StatusBar.setNetworkActivityIndicatorVisible(false);
    return response;
  });
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
    const displayMessage = _.first(graphQLErrors).message;
    Alert.error(null, displayMessage);
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const GRAPHQL_URL = `${BASE_HOSTNAME}/graphql`;
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "X-Device-ID": DEVICE_ID,
      "X-App-Version": APP_VERSION,
      "X-Device-Timezone": TIMEZONE,
      "X-Platform-OS": Platform.OS,
      "X-Platform-Version": Platform.Version,
      authorization: Storage.getCachedJWT()
        ? `Bearer ${Storage.getCachedJWT()}`
        : null
    }
  }));

  return forward(operation);
});

console.log("Initializing Apollo –", GRAPHQL_URL);
const httpLink = new BatchHttpLink({
  uri: GRAPHQL_URL,
  fetch: customFetch
});

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData
// });

const cache = new InMemoryCache({
  // fragmentMatcher,
  dataIdFromObject: o => {
    return `${o.__typename}-${o.id}`;
  },
  cacheRedirects: {
    Post: {
      user: (_, args) => {
        console.log("GET PROFILE AUTHOR", args);
        return toIdValue(
          dataIdFromObject({ __typename: "Profile", id: args["id"] })
        );
      }
    },
    Query: {
      User: (_, args) => {
        return toIdValue(
          cache.config.dataIdFromObject({
            __typename: "User",
            id: args.id
          })
        );
      },
      Profile: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({
            __typename: "Profile",
            id: args.id
          })
        ),
      Post: (_, args) => {
        return toIdValue(
          cache.config.dataIdFromObject({
            __typename: "Post",
            id: args.id
          })
        );
      }
    }
  }
});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink, errorLink),
  cache,
  fetchPolicy: "cache-and-network"
});

// persistor.purge().then(() => {
//   console.log("Reset Apollo Cache");
// });

export default client;

export const isInitialLoading = networkStatus => networkStatus === 1;
export const isActivelyRefetching = networkStatus => networkStatus === 4;
export const isPassivelyRefetching = networkStatus =>
  networkStatus === 2 || networkStatus === 6;
export const isFetchingMore = networkStatus => networkStatus === 3;

// Error States
export const isError = networkStatus => networkStatus === 8;
