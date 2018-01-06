import {createActions} from 'redux-actions';
import ExonumUtils from '../utils/ExonumUtils';

export default createActions({
  signup: ExonumUtils.generateKeyPair,

  changeFormField(field, value) {
    return { field, value };
  },

  login(publicKey, secretKey) {
    const isValid = ExonumUtils.validateKeyPair(publicKey, secretKey);

    return { error: !isValid, isAuthorized: isValid, user: { publicKey, secretKey } }
  },

  logout() {
    // TODO later here will be implemented socket session killing
  },
});