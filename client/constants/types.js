const Exonum = require('exonum-client');

const Owner = Exonum.newType({
  size: 80,
  fields: {
    pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    name: { type: Exonum.String, size: 8, from: 32, to: 40 },
    history_len: { type: Exonum.Uint64, size: 8, from: 40, to: 48 },
    history_hash: { type: Exonum.Hash, size: 32, from: 48, to: 80 }
  }
});

const Item = Exonum.newType({
  size: 97,
  fields: {
    owner_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    name: { type: Exonum.String, size: 8, from: 32, to: 40 },
    uid: { type: Exonum.String, size: 8, from: 40, to: 48 },
    group_id: { type: Exonum.String, size: 8, from: 48, to: 56 },
    transferring: { type: Exonum.String, size: 1, from: 56, to: 57 },
    history_len: { type: Exonum.Uint64, size: 8, from: 57, to: 65 },
    history_hash: { type: Exonum.Hash, size: 32, from: 65, to: 97 }
  }
});

module.exports = {
  Owner, Item
};