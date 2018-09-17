import { PixelRatio } from "react-native";

const IMAGE_HOST = "https://i.applytodate.com";

const normalizeSize = size => {
  if (typeof size === "string") {
    return parseInt(size.split("px")[0], 10);
  } else {
    return size;
  }
};

export const buildImgSrc = (source, rawSize) => {
  const size = PixelRatio.getPixelSizeForLayoutSize(normalizeSize(rawSize));
  return `${IMAGE_HOST}/${normalizeSize(size)}/${source}`;
};
