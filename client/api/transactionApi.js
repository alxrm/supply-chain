const Exonum = require('exonum-client');
const request = require('superagent');
const { TxCreateOwner, TxAddItem, TxAttachToGroup, TxSendGroup, TxReceiveGroup } = require('../constants/transactions');
const { SERVICE_URL, USER_PARAMS } = require('../constants/config');

const postTransaction = (transactionType, params, secret) => {
  const seeded = Object.assign(params, { seed: Exonum.randomUint64() });
  const signature = transactionType.sign(secret, seeded);

  return new Promise((resolve, reject) => {
    request
      .post(SERVICE_URL + '/transaction')
      .send(JSON.stringify({
        body: seeded,
        network_id: transactionType.network_id,
        protocol_version: transactionType.protocol_version,
        service_id: transactionType.service_id,
        message_id: transactionType.message_id,
        signature: signature
      }))
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
  });
};

const TransactionApi = {
  addItem(itemUid, name, user = USER_PARAMS) {
    return postTransaction(TxAddItem, { owner: user.publicKey, item_uid: itemUid, name }, user.secretKey);
  },

  createOwner(name, user = USER_PARAMS) {
    return postTransaction(TxCreateOwner, { pub_key: user.publicKey, name }, user.secretKey);
  },

  attachToGroup(itemUid, group, user = USER_PARAMS) {
    return postTransaction(TxAttachToGroup, { owner: user.publicKey, item_uid: itemUid, group }, user.secretKey);
  },

  sendGroup(group, user = USER_PARAMS) {
    return postTransaction(TxSendGroup, { prev_owner: user.publicKey, group }, user.secretKey);
  },

  receiveGroup(group, user = USER_PARAMS) {
    return postTransaction(TxReceiveGroup, { next_owner: user.publicKey, group }, user.secretKey);
  }
};


module.exports = TransactionApi;