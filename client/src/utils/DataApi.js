import request from 'superagent';
import {SERVICE_URL} from '../constants/configs';

const get = (path) => {
  return new Promise((resolve, reject) => {
    request
      .get(`${SERVICE_URL}/${path}`)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.body);
      });
  });
};

export const DataApi = {
  async owner(publicKey) {
    return await get(`owners/${publicKey}`);
  },

  async ownerProducts(publicKey) {
    return await get(`owners/${publicKey}/products`);
  },

  async group(groupId) {
    return await get(`groups/${groupId}`);
  },

  async product(productId) {
    return await get(`products/${productId}`);
  }
};

export default DataApi;