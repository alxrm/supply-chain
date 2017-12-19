const Exonum = require('exonum-client');

const TX_CREATE_OWNER_ID = 128;
const TX_ADD_ITEM_ID = 129;
const TX_ATTACH_TO_GROUP_ID = 130;
const TX_CHANGE_GROUP_OWNER_ID = 131;

const SERVICE_ID = 0;

const TxCreateOwner = Exonum.newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_CREATE_OWNER_ID,
  fields: {
    pub_key: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    name: { type: Exonum.String, size: 8, from: 32, to: 40 },
    seed: { type: Exonum.Uint64, size: 8, from: 40, to: 48 }
  }
});

const TxAddItem = Exonum.newMessage({
  size: 56,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_ADD_ITEM_ID,
  fields: {}
});

const TxAttachToGroup = Exonum.newMessage({
  size: 56,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_ATTACH_TO_GROUP_ID,
  fields: {
    owner: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    item_uid: { type: Exonum.String, size: 8, from: 32, to: 40 },
    group: { type: Exonum.String, size: 8, from: 40, to: 48 },
    seed: { type: Exonum.Uint64, size: 8, from: 48, to: 56 }
  }
});

const TxChangeGroupOwner = Exonum.newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_CHANGE_GROUP_OWNER_ID,
  fields: {
    next_owner: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    group: { type: Exonum.String, size: 8, from: 32, to: 40 },
    seed: { type: Exonum.Uint64, size: 8, from: 40, to: 48 }
  }
});


module.exports = {
  TxCreateOwner,
  TxAddItem,
  TxAttachToGroup,
  TxChangeGroupOwner
};