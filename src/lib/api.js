import request from "superagent";
import qs from "qs";
import _ from "lodash";
import { BASE_HOSTNAME } from "react-native-dotenv";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

export const DEVICE_ID = DeviceInfo.getUniqueID();
export const APP_VERSION = DeviceInfo.getVersion();
export const TIMEZONE = DeviceInfo.getTimezone();

export const buildUrl = path => `${BASE_HOSTNAME}${path}`;
const get = (path, options = {}) =>
  request
    .get(buildUrl(path), options)
    .withCredentials()
    .set("X-Platform-OS", Platform.OS)
    .set("X-Platform-Version", Platform.Version)
    .set("X-Device-ID", DEVICE_ID)
    .set("X-Device-Timezone", TIMEZONE)
    .set("X-App-Version", APP_VERSION);

const post = (path, options = {}) =>
  request
    .post(buildUrl(path), options)
    .withCredentials()
    .set("X-Platform-OS", Platform.OS)
    .set("X-Platform-Version", Platform.Version)
    .set("X-Device-ID", DEVICE_ID)
    .set("X-Device-Timezone", TIMEZONE)
    .set("X-App-Version", APP_VERSION);

const put = (path, options = {}) =>
  request
    .put(buildUrl(path), options)
    .withCredentials()
    .set("X-Platform-OS", Platform.OS)
    .set("X-Platform-Version", Platform.Version)
    .set("X-Device-ID", DEVICE_ID)
    .set("X-Device-Timezone", TIMEZONE)
    .set("X-App-Version", APP_VERSION);

const sendDelete = (path, options = {}) =>
  request
    .delete(buildUrl(path), options)
    .withCredentials()
    .set("X-Platform-OS", Platform.OS)
    .set("X-Platform-Version", Platform.Version)
    .set("X-Device-ID", DEVICE_ID)
    .set("X-Device-Timezone", TIMEZONE)
    .set("X-App-Version", APP_VERSION);

export const signUp = ({ username, name, accountId, accessToken, jwt }) => {
  return post("/register").send({
    account_id: accountId,
    access_token: accessToken,
    token: jwt,
    user: {
      username,
      name
    }
  });
};

export const login = ({
  accountId,
  appId,
  token,
  refreshIntervalSeconds,
  lastRefresh
}) => {
  return post("/login").send({
    account_id: accountId,
    app_id: appId,
    token: token,
    refresh_interval_seconds: refreshIntervalSeconds,
    last_refresh: lastRefresh
  });
};

export const updateDevice = ({ pushEnabled, onesignalUid, pushToken, jwt }) => {
  return post(`/devices`)
    .send({
      push_enabled: _.isBoolean(pushEnabled) ? String(pushEnabled) : undefined,
      onesignal_uid: onesignalUid,
      push_token: pushToken
    })
    .set("Authorization", `Bearer ${jwt}`);
};

export const uploadAddressBook = ({ contacts, jwt }) => {
  return post(`/address_book`)
    .send({
      contacts
    })
    .set("Authorization", `Bearer ${jwt}`);
};
