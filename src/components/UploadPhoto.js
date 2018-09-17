import connectActionSheet from "@expo/react-native-action-sheet/connectActionSheet";
import _ from "lodash";
import React from "react";
import { compose, graphql } from "react-apollo";
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import ImagePicker from "react-native-image-crop-picker";
import { Sentry } from "react-native-sentry";
import S3Upload from "../lib/FileUpload";
import Queries from "../lib/Queries";

export const UPLOAD_STATUS = {
  pending: "pending",
  uploading: "uploading",
  failed: "failed"
};

const { Consumer, Provider } = React.createContext({
  uploadPhotoFromCamera: ({
    width,
    height,
    multiple = false,
    cropping = false,
    useFrontCamera = false
  }) => Promise.resolve(null),
  uploadPhotoFromLibrary: ({
    width,
    height,
    multiple = false,
    cropping = false
  }) => Promise.resolve(null),
  cancelUpload: () => true,
  uploadPhoto: ({
    width,
    height,
    multiple = false,
    cropping = false,
    useFrontCamera = false,
    url,
    allowDelete
  }) => Promise.resolve(null),
  uploadStatus: UPLOAD_STATUS.pending
});

class _UploadPhotoProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      pendingPhotos: []
    };
  }

  handleUploadComplete = (resolve, imageBlob, fileBlob) => ({ publicUrl }) => {
    this.props
      .mutate({
        variables: {
          url: publicUrl,
          width: imageBlob.width,
          height: imageBlob.height,
          content_type: imageBlob.mime,
          filename: imageBlob.filename
        }
      })
      .then(result => {
        return resolve(_.get(result, "data.processPhoto", null) || null);
      });

    if (fileBlob) {
      fileBlob.safeClose();
    }
  };

  handleUploadError = (reject, fileBlob) => (error, more, other) => {
    console.error(error);
    reject(error);
    alert("Uploading failed. Please try again");

    this.setState({ uploadStatus: UPLOAD_STATUS.failed });

    if (fileBlob) {
      fileBlob.safeClose();
    }
  };

  showImagePicker = ({
    width,
    height,
    cropping,
    multiple,
    mediaType = "photo"
  }) => {
    return ImagePicker.openPicker({
      width,
      height,
      cropping,
      multiple,
      mediaType
    });
  };

  showCamera = ({
    width,
    height,
    cropping,
    useFrontCamera,
    multiple,
    mediaType = "photo"
  }) => {
    return ImagePicker.openCamera({
      width,
      height,
      cropping,
      useFrontCamera,
      multiple,
      mediaType
    });
  };

  showActionSheet = ({
    width,
    height,
    cropping,
    useFrontCamera,
    multiple,
    mediaType,
    allowDelete
  }) => {
    const DELETE_PHOTO_LABEL = "Delete photo";
    const options = allowDelete
      ? ["Take a picture", "Select from gallery", DELETE_PHOTO_LABEL, "Cancel"]
      : ["Take a picture", "Select from gallery", "Cancel"];

    const DELETE_PHOTO_INDEX = options.indexOf(DELETE_PHOTO_LABEL);

    return new Promise(resolve => {
      this.props.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: DELETE_PHOTO_INDEX
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            return resolve(
              this.showImagePicker({
                width,
                height,
                cropping,
                multiple,
                mediaType
              })
            );
          } else if (buttonIndex === 0) {
            return resolve(
              this.showCamera({
                width,
                height,
                cropping,
                multiple,
                mediaType,
                useFrontCamera
              })
            );
          } else if (buttonIndex === DELETE_PHOTO_INDEX && allowDelete) {
            return resolve({ delete: true });
          }
        }
      );
    });
  };

  processImage = image => {
    if (image && !image.delete) {
      // logEvent("Upload Photo");
      return this.handleUploadPhoto(image);
    } else if (image && image.delete) {
      // logEvent("Delete Photo");
      return Promise.resolve(null);
    } else if (image === false) {
      return Promise.resolve(false);
    }
  };

  handleException = exception => {
    if (exception) {
      this.setState({ pendingPhotos: [] });
      console.error(exception);
      Sentry.captureException(exception);
      console.log("User cancelled photo upload");
    }
  };

  uploadPhoto = ({
    width,
    height,
    cropping,
    useFrontCamera,
    mediaType,
    multiple,
    allowDelete
  }) => {
    return this.showActionSheet({
      width,
      height,
      cropping,
      useFrontCamera,
      mediaType,
      multiple,
      allowDelete
    })
      .then(this.processImage)
      .catch(this.handleException);
  };

  uploadPhotoFromCamera = ({
    width,
    height,
    cropping,
    useFrontCamera,
    multiple,
    mediaType,
    allowDelete
  }) => {
    return this.showCamera({
      width,
      height,
      cropping,
      useFrontCamera,
      multiple,
      mediaType
    })
      .then(this.processImage)
      .catch(this.handleException);
  };

  uploadPhotoFromLibrary = ({
    width,
    height,
    cropping,
    multiple,
    mediaType
  }) => {
    return this.showImagePicker({
      width,
      height,
      multiple,
      cropping,
      mediaType
    })
      .then(this.processImage)
      .catch(this.handleException);
  };

  handleUploadPhoto = image => {
    const images = _.isArray(image) ? image : [image];
    this.setState({
      uploadStatus: UPLOAD_STATUS.uploading,
      pendingPhotos: [...this.state.pendingPhotos, ...images]
    });

    return Promise.map(images, img => this.startUploadingPhoto(img), {
      concurrency: 2
    }).then(images => {
      const pendingPhotos = this.state.pendingPhotos.slice();
      images.forEach(image => {
        pendingPhotos.splice(pendingPhotos.indexOf(image), 1);
      });

      this.setState({ uploadStatus: UPLOAD_STATUS.pending, pendingPhotos });
      console.log(images);
      return images;
    });
  };

  startUploadingPhoto = image => {
    const imageFile = RNFetchBlob.wrap(image.path);

    return RNFetchBlob.polyfill.Blob.build(imageFile, {
      type: `${image.mime};`
    }).then(blob => {
      const fileBlob = blob;
      fileBlob.name = `via-${Platform.OS}`;
      return new Promise((resolve, reject) => {
        new S3Upload({
          files: [blob],
          onFinishS3Put: this.handleUploadComplete(resolve, image, fileBlob),
          onError: this.handleUploadError(reject, fileBlob),
          uploadRequestHeaders: {}
        });
      });
    });
  };

  render() {
    const { children } = this.props;

    return (
      <Provider
        value={{
          uploadStatus: this.state.uploadStatus,
          uploadPhotoFromCamera: this.uploadPhotoFromCamera,
          uploadPhotoFromLibrary: this.uploadPhotoFromLibrary,
          uploadPhoto: this.uploadPhoto,
          pendingPhotos: this.state.pendingPhotos
        }}
      >
        {children}
      </Provider>
    );
  }
}

export const UploadPhotoProvider = compose(
  connectActionSheet,
  graphql(Queries.ProcessPhoto, {
    name: "mutate"
  })
)(_UploadPhotoProvider);

export const UploadPhotoContext = Consumer;
