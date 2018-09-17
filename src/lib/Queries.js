import gql from "graphql-tag";

const Fragments = {
  user: gql`
    fragment UserFragment on Profile {
      id
      first_name
      last_name
      name
      profile_photo
      username
    }
  `,
  postUser: gql`
    fragment PostUserFragment on Post {
      user {
        id
        first_name
        last_name
        profile_photo
        name
        username
      }
    }
  `,
  photo: gql`
    fragment PhotoFragment on Photo {
      width
      height
      id
      public_url
    }
  `
};

export default {
  Me: gql`
    query Me {
      Me {
        id
        username
        last_name
        name
        birthday
        first_name
        profile_photo
        confirmation_status
        phone
      }
    }
  `,
  EditPost: gql`
    mutation EditPost(
      $id: ID!
      $body: String
      $title: String
      $photos: [ID]
      $link: String
    ) {
      editPost(
        id: $id
        body: $body
        title: $title
        photos: $photos
        link: $link
      ) {
        id
        body
        title
        published_at
        likes_count
        comments_count
        emoji_likes_count_names
        link
        emoji_likes_count_values
        emoji_liked
        liked
        commented

        photos {
          ...PhotoFragment
        }

        comment_preview {
          id
          body
          published_at
          user {
            ...UserFragment
          }
        }

        user {
          ...UserFragment
        }
      }
    }

    ${Fragments.photo}
    ${Fragments.user}
  `,
  CreatePost: gql`
    mutation CreatePost(
      $body: String
      $title: String
      $visibility: String
      $photos: [ID]
      $link: String
    ) {
      createPost(
        body: $body
        title: $title
        photos: $photos
        link: $link
        visibility: $visibility
      ) {
        id
        body
        title
        published_at
        likes_count
        comments_count
        emoji_likes_count_names
        link
        emoji_likes_count_values
        emoji_liked
        liked
        commented

        photos {
          ...PhotoFragment
        }

        comment_preview {
          id
          body
          published_at
          user {
            ...UserFragment
          }
        }

        user {
          ...UserFragment
        }
      }
    }

    ${Fragments.photo}
    ${Fragments.user}
  `,
  ProcessPhoto: gql`
    mutation ProcessPhoto(
      $url: String!
      $width: Int!
      $height: Int!
      $content_type: String!
      $filename: String
    ) {
      processPhoto(
        url: $url
        width: $width
        height: $height
        content_type: $content_type
        filename: $filename
      ) {
        ...PhotoFragment
      }
    }

    ${Fragments.photo}
  `,
  CreateReport: gql`
    mutation CreateReport($kind: String!, $type: String!, $id: ID!) {
      report(kind: $kind, type: $type, id: $id)
    }
  `,
  RemoveProfilePhoto: gql`
    mutation removeProfilePhoto {
      removeProfilePhoto {
        id
        profile_photo
      }
    }
  `,
  DeleteComment: gql`
    mutation DeleteComment($id: ID!) {
      deleteComment(id: $id) {
        id
      }
    }
  `,
  EditProfile: gql`
    mutation UpdateUser(
      $first_name: String
      $last_name: String
      $gender: Gender
      $birthday: DateTime
      $profile_photo: ID
      $email: String
    ) {
      updateUser(
        first_name: $first_name
        last_name: $last_name
        gender: $gender
        birthday: $birthday
        profile_photo: $profile_photo
        email: $email
      ) {
        id
        email
        username
        last_name
        gender
        birthday
        first_name
        profile_photo
        confirmation_status
        phone
      }
    }
  `,
  ViewPostUser: gql`
    query ViewPostUser($postID: ID!) {
      Post(id: $postID) {
        id
        published_at

        ...PostUserFragment
      }
    }

    ${Fragments.postUser}
  `,
  DeletePost: gql`
    mutation DeletePost($postID: ID!) {
      deletePost(id: $postID) {
        id
      }
    }
  `,
  ViewPost: gql`
    query ViewPost($postID: ID!) {
      Post(id: $postID) {
        body
        id
        title
        likes_count
        comments_count
        emoji_likes_count_names
        emoji_likes_count_values
        emoji_liked
        liked
        commented
        published_at
        photos {
          ...PhotoFragment
        }
        link
      }
    }

    ${Fragments.photo}
  `,
  CreateComment: gql`
    mutation CreateComment(
      $postID: ID!
      $body: String
      $photos: [ID]
      $link: String
    ) {
      createComment(
        postID: $postID
        body: $body
        photos: $photos
        link: $link
      ) {
        id
        body
        published_at
        likes_count
        photos {
          ...PhotoFragment
        }
        link

        emoji_likes_count_names
        emoji_likes_count_values
        emoji_liked

        user {
          ...UserFragment
        }

        post {
          id
          commented
          comments_count
        }
      }
    }

    ${Fragments.photo}
    ${Fragments.user}
  `,
  ViewComments: gql`
    query ViewComments($postID: ID!, $offset: Int, $limit: Int) {
      Comments(postID: $postID, offset: $offset, limit: $limit) {
        id
        body
        likes_count
        published_at
        emoji_likes_count_names
        emoji_likes_count_values
        emoji_liked
        link
        photos {
          ...PhotoFragment
        }

        user {
          ...UserFragment
        }
      }
    }

    ${Fragments.photo}
    ${Fragments.user}
  `,
  ToggleLikePost: gql`
    mutation ToggleLikePost($postID: ID!, $emoji: String!) {
      toggleLikePost(postID: $postID, emoji: $emoji) {
        id
        likes_count
        comments_count
        emoji_likes_count_names
        emoji_likes_count_values
        emoji_liked
        liked
      }
    }
  `,
  ToggleLikeComment: gql`
    mutation ToggleLikeComment($commentID: ID!, $emoji: String!) {
      toggleLikeComment(commentID: $commentID, emoji: $emoji) {
        id
        emoji_likes_count_names
        emoji_likes_count_values
        emoji_liked
      }
    }
  `,

  ViewProfile: gql`
    query ViewProfile($profileID: ID!) {
      Profile(id: $profileID) {
        ...UserFragment
      }
    }

    ${Fragments.user}
  `,
  Posts: gql`
    query Posts($offset: Int, $limit: Int) {
      Posts(offset: $offset, limit: $limit) {
        id
        body
        title
        published_at
        likes_count
        comments_count
        emoji_likes_count_names
        emoji_likes_count_values
        emoji_liked
        liked
        commented

        comment_preview {
          id
          body
          published_at

          photos {
            ...PhotoFragment
          }

          user {
            ...UserFragment
          }
        }

        photos {
          ...PhotoFragment
        }

        ...PostUserFragment
      }
    }

    ${Fragments.photo}
    ${Fragments.user}
    ${Fragments.postUser}
  `,
  HeartbeatMutation: gql`
    mutation Heartbeat {
      heartbeat
    }
  `
};
