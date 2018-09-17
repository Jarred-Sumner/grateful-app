import connectActionSheet from "@expo/react-native-action-sheet/connectActionSheet";
import _ from "lodash";
import React from "react";
import { Mutation } from "react-apollo";
import {
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { compose } from "recompose";
import { BORDER_RADIUS, COLORS, SPACING } from "../../lib/defaults";
import Queries from "../../lib/Queries";
import Avatar, { ProfileAvatar } from "../Avatar";
import Button from "../Button";
import PostComment from "../Comment";
import Divider from "../Divider";
// import { PhotoGallery } from "../PhotoGallery";
import ReactionBar from "../Reaction/ReactionBar";
import { ReactionGroup } from "../Reaction/ReactionGroup";
import Text, { WEIGHTS } from "../Text";
import Timestamp from "../Timestamp";
import UserContext from "../UserContext";
import Content from "./Post/Content";
import { PhotoGroup } from "./Post/PhotoGroup";

const authorStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center"
  },
  nameRow: {
    flex: 0,
    flexDirection: "row"
  },
  text: {
    flex: 1
  }
});

export class Author extends React.PureComponent {
  render() {
    const { author, publishedAt, timestampPrefix } = this.props;
    return (
      <View style={authorStyles.container}>
        <ProfileAvatar profile={author} size={40} />
        <Divider width={SPACING.NORMAL} />
        <View style={authorStyles.text}>
          <Text
            wrap={false}
            weight={WEIGHTS.SEMI_BOLD}
            lineHeight={20}
            size={14}
            color={COLORS.DARK_GRAY}
          >
            {author.name}

            <Divider height={1} inline width={SPACING.SMALL} />

            <Text
              wrap={false}
              weight={WEIGHTS.NORMAL}
              size={14}
              lineHeight={20}
              color={COLORS.FADED_TEXT}
            >
              @{author.username}
            </Text>
          </Text>

          <Timestamp prefix={timestampPrefix} timestamp={publishedAt} />
        </View>
      </View>
    );
  }
}

const postStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE
  },
  headerRow: {
    flex: 1,
    flexDirection: "row",
    height: 40,
    paddingHorizontal: SPACING.NORMAL,
    alignItems: "center"
  },
  headerEllipsisContainer: {
    alignItems: "center"
  },
  bodyRow: {
    paddingHorizontal: SPACING.NORMAL
  },
  barContainer: {
    paddingHorizontal: SPACING.NORMAL,
    flexDirection: "row"
  },
  reactions: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.NORMAL,
    flex: 1
  },
  fakeCommentInput: {
    borderRadius: BORDER_RADIUS.OVAL,
    backgroundColor: COLORS.GRAY,
    paddingHorizontal: SPACING.NORMAL,
    paddingVertical: SPACING.SMALL,
    flex: 1
  }
});

class Post extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      galleryIndex: -1
    };
  }

  handlePressEllipsis = () => {
    const {
      post,
      showActionSheetWithOptions,
      onDelete,
      currentUser
    } = this.props;
    const POSSIBLE_OPTIONS = {
      edit_post: "Edit",
      delete_post: "Delete post",
      copy_link: "Copy share link",
      comment: "Add comment",
      report: "Report",
      cancel: "Cancel"
    };

    const options = [];

    if (post.url) {
      options.push(POSSIBLE_OPTIONS.copy_link);
    }

    if (currentUser.id === post.user.id) {
      options.push(POSSIBLE_OPTIONS.edit_post);
      options.push(POSSIBLE_OPTIONS.delete_post);
    }

    options.push(POSSIBLE_OPTIONS.comment);

    if (this.props.onReport) {
      options.push(POSSIBLE_OPTIONS.report);
    }

    options.push(POSSIBLE_OPTIONS.cancel);

    const destructiveButtonIndex =
      options.indexOf(POSSIBLE_OPTIONS.delete_post) > -1
        ? options.indexOf(POSSIBLE_OPTIONS.delete_post)
        : options.indexOf(POSSIBLE_OPTIONS.report);

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex: options.indexOf(POSSIBLE_OPTIONS.cancel)
      },
      buttonIndex => {
        const option =
          POSSIBLE_OPTIONS[_.invert(POSSIBLE_OPTIONS)[options[buttonIndex]]];

        if (option === POSSIBLE_OPTIONS.edit_post) {
          this.props.onEditPost(this.props.post);
        } else if (option === POSSIBLE_OPTIONS.delete_post) {
          onDelete(post.id);
        } else if (option === POSSIBLE_OPTIONS.report) {
          this.props.onReport(this.props.post.id);
        } else if (option === POSSIBLE_OPTIONS.comment) {
          this.handleViewPost(true);
        } else if (option === POSSIBLE_OPTIONS.copy_link) {
          Clipboard.setString(post.url);
        }
      }
    );
  };

  handleReact = emoji => {
    return this.props.onPressLike({
      variables: { postID: this.props.post.id, emoji }
    });
  };

  handleCloseGallery = () => this.setState({ galleryIndex: -1 });
  handleShowGallery = photo =>
    this.setState({ galleryIndex: this.props.post.photos.indexOf(photo) });

  handleViewPost = autoFocus => {
    if (this.props.onViewPost) {
      this.props.onViewPost(this.props.post, autoFocus);
    }
  };

  render() {
    const { post, currentUser, colorScheme } = this.props;
    const {
      user,
      published_at: publishedAt,
      body,
      comment_preview: commentPreview,
      comments_count: commentsCount,
      likes_count: likesCount,
      liked,
      commented,
      emoji_likes_count_names,
      emoji_likes_count_values,
      emoji_liked,
      title,
      photos
    } = post;

    console.count("Render Post");

    return (
      <View style={postStyles.container}>
        <Divider height={SPACING.NORMAL} />
        <View style={postStyles.headerRow}>
          <Author publishedAt={publishedAt} author={user} />

          <View style={postStyles.headerEllipsisContainer}>
            <Button.Ellipsis
              onPress={this.handlePressEllipsis}
              color={COLORS.MEDIUM_GRAY}
            />
          </View>
        </View>

        {!!title || !!body ? (
          <React.Fragment>
            <Divider height={SPACING.NORMAL} />
            <TouchableWithoutFeedback onPress={this.handleViewPost}>
              <View style={postStyles.bodyRow}>
                <Content prefix="I'm grateful for" body={body} title={title} />
              </View>
            </TouchableWithoutFeedback>
          </React.Fragment>
        ) : null}

        {!!photos && (
          <React.Fragment>
            <Divider height={SPACING.NORMAL} />
            <PhotoGroup photos={photos} onPressPhoto={this.handleShowGallery} />
          </React.Fragment>
        )}

        {/* <Divider height={1} width={"100%"} border={COLORS.GRAY} /> */}
        <View style={postStyles.barContainer}>
          {emoji_likes_count_names.length > 0 && (
            <ReactionGroup
              keys={emoji_likes_count_names}
              counts={emoji_likes_count_values}
              selectedKeys={emoji_liked}
              onReact={this.handleReact}
              colorScheme={colorScheme}
              rowStyle={postStyles.reactions}
            />
          )}

          <ReactionBar
            onReact={this.handleReact}
            id={post.id}
            object={post}
            type="Post"
            onPressComment={this.handleViewPost}
            colorScheme={colorScheme}
            commented={commented}
            commentsCount={commentsCount}
          />

        </View>
        <Divider height={ SPACING.NORMAL } />
        <Divider height={1} width={"100%"} border={COLORS.GRAY} />
        {!!commentPreview && (
          <React.Fragment>
            <TouchableWithoutFeedback onPress={this.handleViewPost}>
              <View>
                <Divider height={SPACING.NORMAL} />

                <PostComment maxLength={150} comment={commentPreview} />
                <Divider height={SPACING.MEDIUM} />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => this.handleViewPost(true)}>
              <View>
                <View style={postStyles.commentInputContainer}>
                  <Avatar
                    url={currentUser.profile_photo}
                    name={currentUser.name}
                    size={24}
                  />

                  <Divider width={SPACING.NORMAL} />

                  <View style={postStyles.fakeCommentInput}>
                    <Text size={12} lineHeight={18} color={COLORS.MEDIUM_GRAY}>
                      Write a comment...
                    </Text>
                  </View>
                </View>

                <Divider height={SPACING.NORMAL} />
              </View>
            </TouchableWithoutFeedback>
          </React.Fragment>
        )}

        {/* <PhotoGallery
          photos={photos}
          colorScheme={colorScheme}
          initialIndex={this.state.galleryIndex}
          visible={this.state.galleryIndex > -1}
          onClose={this.handleCloseGallery}
        /> */}
      </View>
    );
  }
}

const PostWithActionSheet = compose(connectActionSheet)(Post);

export default props => (
  <UserContext>
    {({ currentUser, colorScheme }) => (
      <Mutation mutation={Queries.ToggleLikePost}>
        {onPressLike => (
          <PostWithActionSheet
            onPressLike={onPressLike}
            {...props}
            currentUser={currentUser}
            colorScheme={colorScheme}
          />
        )}
      </Mutation>
    )}
  </UserContext>
);
