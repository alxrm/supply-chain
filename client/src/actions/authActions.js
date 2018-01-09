import {createActions} from 'redux-actions';
import ExonumUtils from '../utils/ExonumUtils';
import CookieUtils from '../utils/CookieUtils';
import DataApi from '../utils/DataApi';
import TransactionApi from '../utils/TransactionApi';

import {AUTH_INITIAL_STATE} from '../reducers/authReducers';

const KEY_LOGIN_SESSION = 'KEY_LOGIN_SESSION';

export default createActions({
  async signup(name) {
    if (!name) {
      throw new Error("Name field is required");
    }

    const keyPair = ExonumUtils.generateKeyPair();
    await TransactionApi.createOwner(name, keyPair);

    return { ...keyPair, name } ;
  },

  async login(publicKey, secretKey) {
    const isValid = await ExonumUtils.validateKeyPair(publicKey, secretKey);
    const { data } = await DataApi.owner(publicKey);
    const nextState = { isAuthorized: isValid, user: { publicKey, secretKey, name: data.name } };

    if (isValid && !!data.name) {
      CookieUtils.set(KEY_LOGIN_SESSION, nextState);
    }

    return nextState;
  },

  changeFormField(field, value) {
    return { field, value };
  },

  restoreAuthSession() {
    if (CookieUtils.has(KEY_LOGIN_SESSION)) {
      return CookieUtils.get(KEY_LOGIN_SESSION);
    }

    return AUTH_INITIAL_STATE;
  },

  logout() {
    CookieUtils.remove(KEY_LOGIN_SESSION);

    return AUTH_INITIAL_STATE;
  },
});