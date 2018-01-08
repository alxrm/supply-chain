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

  async ownerItems(publicKey) {
    return await get(`owners/${publicKey}/items`);
  },

  async group(groupId) {
    return await get(`groups/${groupId}`);
  },

  async item(itemId) {
    return await get(`items/${itemId}`);
  }
};

export default DataApi;