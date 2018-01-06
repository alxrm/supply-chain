import Exonum from 'exonum-client';
import request from 'superagent';

import {SERVICE_URL} from '../constants/configs';
import {
  TxAddItem,
  TxAttachToGroup,
  TxCreateOwner,
  TxReceiveGroup,
  TxSendGroup
} from '../constants/transactions';

const postTransaction = (transactionType, params, secret) => {
  const seeded = Object.assign(params, { seed: Exonum.randomUint64() });
  const signature = transactionType.sign(secret, seeded);

  return new Promise((resolve, reject) => {
    request
      .post(`${SERVICE_URL}/transaction`)
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

export const TransactionApi = {
  async addItem(itemUid, name, user) {
    return await postTransaction(TxAddItem, { owner: user.publicKey, item_uid: itemUid, name }, user.secretKey);
  },

  async createOwner(name, user) {
    return await postTransaction(TxCreateOwner, { pub_key: user.publicKey, name }, user.secretKey);
  },

  async attachToGroup(itemUid, group, user) {
    return await postTransaction(TxAttachToGroup, { owner: user.publicKey, item_uid: itemUid, group }, user.secretKey);
  },

  async sendGroup(group, user) {
    return await postTransaction(TxSendGroup, { prev_owner: user.publicKey, group }, user.secretKey);
  },

  async receiveGroup(group, user) {
    return await postTransaction(TxReceiveGroup, { next_owner: user.publicKey, group }, user.secretKey);
  }
};
