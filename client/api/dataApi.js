const request = require('superagent');
const { SERVICE_URL } = require('../constants/config');

const readData = (method, param) => {
  return new Promise((resolve, reject) => {
    request
      .get(`${SERVICE_URL}/${method}/${param}`)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
  });
};

const DataApi = {
  owner(publicKey) {
    return readData("owner", publicKey);
  },

  group(groupId) {
    return readData("group", groupId);
  },

  item(itemId) {
    return readData("item", itemId);
  }
};

module.exports = DataApi;