import { AsyncStorage } from "react-native";

const SUPER_STORE = `@rewove`;
const IS_CACHING_CONTACTS_ENABLED = true;

const KEYS = {
  DISMISSED_PUSH_NOTIFICATION_MODAL: "DISMISSED_PUSH_NOTIFICATION_MODAL",
  DISMISSED_WELCOME_MODAL: "DISMISSED_WELCOME_MODAL",
  JWT: "JWT",
  CURRENT_USER_ID: "CURRENT_USER_ID",
  CACHED_CONTACTS: "ListCacheContacts"
};

var _memoizedContacts;
var _cachedJWT;

export default class Storage {
  static formatKey = key => {
    return `${SUPER_STORE}:${key}`;
  };

  static async hasDismissedPushNotificationModal() {
    const result = await Storage.getItem(
      KEYS.DISMISSED_PUSH_NOTIFICATION_MODAL
    );
    return result === "true";
  }

  static setDismissedPushNotificationModal(value) {
    return Storage.setItem(
      KEYS.DISMISSED_PUSH_NOTIFICATION_MODAL,
      !!value ? "true" : "false"
    );
  }

  static async hasDismissedWelcomeModal() {
    const result = await Storage.getItem(KEYS.DISMISSED_WELCOME_MODAL);
    return result === "true";
  }

  static setCachedContacts(contacts) {
    _memoizedContacts = contacts;

    return Storage.setItem(
      KEYS.CACHED_CONTACTS,
      JSON.stringify(_memoizedContacts)
    );
  }

  static hasAlreadyLoadedContacts() {
    return !!_memoizedContacts;
  }

  static getCachedContacts() {
    if (!IS_CACHING_CONTACTS_ENABLED) {
      return Promise.resolve([]);
    }

    if (_memoizedContacts) {
      return Promise.resolve(_memoizedContacts);
    }

    return Storage.getItem(KEYS.CACHED_CONTACTS).then(contacts => {
      if (contacts) {
        try {
          return JSON.parse(contacts);
        } catch (exception) {
          if (ENVIRONMENT === "DEVELOPMENT") {
            console.error(exception);
          }

          return {
            data: [],
            total: 0
          };
        }
      } else {
        return {
          data: [],
          total: 0
        };
      }
    });
  }

  static clearCachedContacts() {
    _memoizedContacts = null;
    return Storage.removeItem(KEYS.CACHED_CONTACTS);
  }

  static removeItem(key) {
    AsyncStorage.removeItem(Storage.formatKey(key));
  }

  static setDismissedWelcomeModal(value) {
    return Storage.setItem(
      KEYS.DISMISSED_WELCOME_MODAL,
      !!value ? "true" : "false"
    );
  }

  static setJWT(value) {
    _cachedJWT = value;
    return Storage.setItem(KEYS.JWT, value);
  }

  static getCachedJWT() {
    return _cachedJWT;
  }

  static getJWT() {
    return Storage.getItem(KEYS.JWT).then(jwt => {
      if (jwt) {
        _cachedJWT = jwt;
      }

      return jwt;
    });
  }

  static setUserId(userId) {
    return Storage.setItem(KEYS.CURRENT_USER_ID, userId);
  }

  static getUserId() {
    return Storage.getItem(KEYS.CURRENT_USER_ID);
  }

  static getItem(key, value) {
    console.log(`[Storage] GET ${key}`);
    return AsyncStorage.getItem(Storage.formatKey(key));
  }

  static setItem(key, value) {
    if (value) {
      AsyncStorage.setItem(Storage.formatKey(key), value);
    } else {
      console.log(`[Storage] REMOVE ${key}`);
      AsyncStorage.removeItem(Storage.formatKey(key));
    }
  }
}
