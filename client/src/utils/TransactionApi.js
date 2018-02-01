import {randomUint64} from 'exonum-client';
import request from 'superagent';

import {SERVICE_URL} from '../constants/configs';
import {
  TxAddProduct,
  TxAttachToGroup,
  TxCreateOwner,
  TxReceiveGroup,
  TxSendGroup
} from '../constants/transactions';

const postTransaction = (transactionType, params, secret) => {
  const seeded = Object.assign(params, { seed: randomUint64() });
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
  async addProduct(productUid, name, user) {
    return await postTransaction(TxAddProduct, { owner: user.publicKey, product_uid: productUid, name }, user.secretKey);
  },

  async createOwner(name, user) {
    return await postTransaction(TxCreateOwner, { pub_key: user.publicKey, name }, user.secretKey);
  },

  async attachToGroup(productUid, group, user) {
    return await postTransaction(TxAttachToGroup, { owner: user.publicKey, product_uid: productUid, group }, user.secretKey);
  },

  async sendGroup(group, user) {
    return await postTransaction(TxSendGroup, { prev_owner: user.publicKey, group }, user.secretKey);
  },

  async receiveGroup(group, user) {
    return await postTransaction(TxReceiveGroup, { next_owner: user.publicKey, group }, user.secretKey);
  }
};

export default TransactionApi;