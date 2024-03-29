import {createActions} from 'redux-actions';
import DataApi from '../utils/DataApi';
import TransactionApi from '../utils/TransactionApi';
import CookieUtils from '../utils/CookieUtils';
import {KEY_LOGIN_SESSION} from "./authActions";

export default createActions({
  ownerProductsByKey: DataApi.ownerProducts,
  transferringProducts: DataApi.transferringProducts,

  async addProduct(productUid, name, secretKey) {
    const user = CookieUtils.get(KEY_LOGIN_SESSION).user;
    return await TransactionApi.addProduct(productUid, name, { publicKey: user.publicKey, secretKey })
  },

  async attachToGroup(productUid, groupUid, secretKey) {
    const user = CookieUtils.get(KEY_LOGIN_SESSION).user;
    return await TransactionApi.attachToGroup(productUid, groupUid, { publicKey: user.publicKey, secretKey })
  },

  async sendGroup(groupUid, secretKey) {
    const user = CookieUtils.get(KEY_LOGIN_SESSION).user;
    return await TransactionApi.sendGroup(groupUid, { publicKey: user.publicKey, secretKey })
  }
});