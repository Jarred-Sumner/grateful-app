import _ from "lodash";
import React from "react";
import { compose, graphql } from "react-apollo";
import { SectionList, StatusBar, StyleSheet, View, Image } from "react-native";
import { withNavigationFocus, SafeAreaView } from "react-navigation";
import { defaultProps } from "recompose";
import Divider from "../components/Divider";
import { EmojiInputProvider } from "../components/EmojiInput";
import Post from "../components/Feed/Post";
import { WhiteLoadingListSpinner } from "../components/Spinner";
import UserContext from "../components/UserContext";
import Composer from "../components/Composer";
import { withCreateReport } from "../components/withCreateReport";
import { handleGraphQLError } from "../lib/Alert";
import {
  COLORS,
  GLOBAL_STYLES,
  SPACING,
  APP_COLOR_SCHEME,
  ColorScheme
} from "../lib/defaults";
import Queries from "../lib/Queries";
import Header from "../components/Header";
import HeaderLogoImage from "../../assets/HeaderLogo.png";
import { Icon } from "../components/Icon";

const SeparatorComponent = defaultProps({
  height: SPACING.SMALL,
  width: "100%"
})(Divider);

const ListEmptyComponent = ({ InnerComponent, colorScheme }) => () => (
  <View>
    <SeparatorComponent />
    {!!InnerComponent && <InnerComponent />}
  </View>
);

const HEADER_SIZE = 145;
// import { initializeAnalytics } from "../lib/analytics";
// import { setBadgeCount } from "../lib/BadgeCount";

const buildSections = ({ data }) => {
  const sections = [];
  const posts = _.get(data, "Posts", []) || [];

  if (posts.length > 0) {
    sections.push({
      data: posts
    });
  }

  return sections;
};

class _FeedSectionList extends React.PureComponent {
  static defaultProps = {
    ListLoadingComponent: WhiteLoadingListSpinner
  };

  state = {
    sections: []
  };

  static getDerivedStateFromProps(props, state) {
    console.log(props);
    const sections = buildSections({ data: props.data });

    return {
      sections
    };
  }

  renderSeparator = () => <SeparatorComponent />;

  keyExtractor = item => item.id;

  handleDeletePost = postID => {
    this.props
      .deletePost({
        variables: { postID },
        optimisticResponse: {
          __typename: "Mutation",
          deletePost: {
            id: postID,
            __typename: "Post"
          }
        }
      })
      .then(() => {
        console.log("Post deleted");
      }, handleGraphQLError);
  };

  renderItem = ({ item }) => {
    return (
      <Post
        post={item}
        onDelete={this.handleDeletePost}
        onViewPost={this.props.onViewPost}
        onReport={this.props.onReportPost}
      />
    );
  };

  renderEmpty = () => {
    if (this.props.data.loading) {
      return this.props.ListLoadingComponent;
    } else {
      return null;
    }
  };

  handleLoadMore = _.debounce(data => {
    return this.props.data.fetchMore({
      variables: {
        offset: this.props.data.Posts.length + 1
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        // Don't do anything if there weren't any new items
        if (!fetchMoreResult || fetchMoreResult.Posts.length === 0) {
          return previousResult;
        }
        return {
          // Append the new feed results to the old one
          Posts: _.uniqBy(
            (previousResult.Posts || []).concat(fetchMoreResult.Posts),
            "id"
          )
        };
      }
    });
  }, 200);

  render() {
    return (
      <SectionList
        sections={this.state.sections}
        keyboardDismissMode="interactive"
        directionalLockEnabled
        keyboardShouldPersistTaps="always"
        directionLockEnabled
        ref={this.props.sectionListRef}
        refreshing={this.props.data.networkStatus === 4}
        style={{ flex: 1 }}
        contentContainerStyle={
          { backgroundColor: COLORS.WHITE } // ListHeaderComponent={this.renderHeader()}
        }
        ListEmptyComponent={this.renderEmpty()}
        renderItem={this.renderItem}
        onEndReached={this.handleLoadMore}
        onRefresh={this.props.data.refetch}
        onEndReachedThreshold={0.5}
        extraData={this.props.extraData}
        removeClippedSubviews={this.props.removeClippedSubviews}
        SectionSeparatorComponent={this.renderSeparator}
        ItemSeparatorComponent={this.renderSeparator}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

export const FeedSectionList = compose(
  graphql(Queries.Posts, {
    options: props => ({
      fetchPolicy: "cache-and-network",
      variables: {
        limit: 20,
        offset: 0
      }
    })
  }),
  graphql(Queries.DeletePost, {
    name: "deletePost",
    options: props => ({
      update: (cache, { data: { deletePost } }) => {
        if (!deletePost || !deletePost.id) {
          return;
        }

        const variables = {
          offset: 0,
          limit: 20
        };

        const cacheData = cache.readQuery({
          query: Queries.Posts,
          variables
        });

        const posts = (cacheData.Posts || []).slice();
        _.remove(posts, ({ id }) => deletePost.id === id);

        cache.writeQuery({
          query: Queries.Posts,
          variables,
          data: {
            Posts: posts
          }
        });
      }
    })
  })
)(_FeedSectionList);

const styles = StyleSheet.create({
  createButtonContainer: {
    position: "absolute",
    right: SPACING.MEDIUM,
    bottom: SPACING.MEDIUM
  },
  container: {
    flex: 1
  }
});

const POST_PREFIX = "I'm grateful for ";
class RawPostComposer extends React.PureComponent {
  handleSubmitPost = ({ body, photos, public: isPublic }) => {
    this.props.mutate({
      variables: {
        body: body.substr(POST_PREFIX.length),
        photos: photos.map(({ id }) => id),
        visibility: isPublic ? "publicly_visible" : "privately_visible"
      }
    });
  };

  render() {
    return (
      <Composer
        sendMessage={this.handleSubmitPost}
        colorScheme={APP_COLOR_SCHEME}
        inverted
        isFocused={false}
        prefix={POST_PREFIX}
        insideTabBar={false}
      />
    );
  }
}

const PostComposer = graphql(Queries.CreatePost, {
  options: {
    fetchPolicy: "cache-and-network"
  }
})(RawPostComposer);

class FeedPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      headerMinimized: false
    };
  }

  componentDidMount() {
    console.log("MOUNT");
  }

  handleViewPost = (post, autoFocus) => {
    this.props.navigation.navigate("ViewPost", {
      postId: post.id,
      autoFocus: autoFocus === true
    });
  };

  handleReportPost = id => {
    return this.props.createReport({
      id,
      type: "Post"
    });
  };

  // handleSendMessage = () => {};

  render() {
    const { colorScheme, currentUser, isFocused } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colorScheme.primaryColor} />

        <FeedSectionList
          colorScheme={colorScheme}
          onViewPost={this.handleViewPost}
          onReportPost={this.handleReportPost}
          sectionListRef={this.getSectionListRef}
        />

        <PostComposer />
      </View>
    );
  }
}

const App = compose(
  withNavigationFocus,
  withCreateReport
)(props => (
  <EmojiInputProvider>
    <UserContext>
      {({ currentUser }) => {
        return (
          <FeedPage
            isFocused={props.isFocused}
            navigation={props.navigation}
            colorScheme={new ColorScheme(APP_COLOR_SCHEME)}
            createReport={props.createReport}
            currentUser={currentUser}
          />
        );
      }}
    </UserContext>
  </EmojiInputProvider>
));

App.navigationOptions = ({ navigation }) => ({
  headerStyle: { height: 60 },
  headerLeft: (
    <View
      style={{
        paddingHorizontal: SPACING.NORMAL,
        alignItems: "center",
        width: 80,
        zIndex: 10,
        flex: 1
      }}
      onPress={() => navigation.navigate("Settings")}
    >
      <Icon
        name="profile"
        color={new ColorScheme(APP_COLOR_SCHEME).primaryColor}
      />
    </View>
  ),
  headerTitle: props => (
    <SafeAreaView style={{ paddingVertical: SPACING.NORMAL }}>
      <Image source={require("../../assets/HeaderLogo.png")} />
    </SafeAreaView>
  )
});

export default App;
