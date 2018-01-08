import {createActions} from 'redux-actions';
import ExonumUtils from '../utils/ExonumUtils';
import CookieUtils from '../utils/CookieUtils';

import {AUTH_INITIAL_STATE} from '../reducers/authReducers';

const KEY_LOGIN_SESSION = 'KEY_LOGIN_SESSION';

export default createActions({
  signup: ExonumUtils.generateKeyPair,

  login(publicKey, secretKey) {
    const isValid = ExonumUtils.validateKeyPair(publicKey, secretKey);
    const nextState = { error: !isValid, isAuthorized: isValid, user: { publicKey, secretKey } };

    if (isValid) {
      CookieUtils.set(KEY_LOGIN_SESSION, nextState);
    }

    return nextState;
  },

  changeLoginFormField(field, value) {
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