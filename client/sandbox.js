const Exonum = require('exonum-client');
const request = require('superagent');
const transactionTypes = require('./constants/transactions');
const TxCreateOwner = transactionTypes.TxCreateOwner;

const userParams = {
  publicKey: '54c521565c72a643dad8a58723842b11c87cf60e4833487e8ec62720698b5d5a',
  secretKey: '999845c00efd4ae90428fab284ce3891d33f33b584142b90e7ac26141a600925'
  + '54c521565c72a643dad8a58723842b11c87cf60e4833487e8ec62720698b5d5a'
};

const data = {
  pub_key: userParams.publicKey, name: "I. P. Freely", seed: Exonum.randomUint64()
};

const signature = TxCreateOwner.sign(userParams.secretKey, data);
const url = 'http://127.0.0.1:8010/api/services/supply-chain/v1/transaction';

request
    .post(url)
    .send(JSON.stringify({
      body: data,
      network_id: TxCreateOwner.network_id,
      protocol_version: TxCreateOwner.protocol_version,
      service_id: TxCreateOwner.service_id,
      message_id: TxCreateOwner.message_id,
      signature: signature
    }))
    .end((err, res) => {
      console.log(res.statusCode)
    });