const Exonum = require('exonum-client');

const TX_CREATE_OWNER_ID = 128;

const TxCreateOwner = {
  size: 48,
  message_id: TX_CREATE_OWNER_ID,
  fields: {
    pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    name: { type: Exonum.PublicKey, size: 8, from: 32, to: 40 },
    seed: { type: Exonum.Uint64, size: 8, from: 40, to: 48 }
  }
};
