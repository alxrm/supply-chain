const Exonum = require('exonum-client');
const { SERVICE_ID } = require('./config');

const TX_CREATE_OWNER_ID = 128;
const TX_ADD_ITEM_ID = 129;
const TX_ATTACH_TO_GROUP_ID = 130;
const TX_SEND_GROUP = 131;
const TX_RECEIVE_GROUP = 132;

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
  fields: {
    owner: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    item_uid: { type: Exonum.String, size: 8, from: 32, to: 40 },
    name: { type: Exonum.String, size: 8, from: 40, to: 48 },
    seed: { type: Exonum.Uint64, size: 8, from: 48, to: 56 }
  }
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

const TxSendGroup = Exonum.newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_SEND_GROUP,
  fields: {
    prev_owner: { type: Exonum.PublicKey, size: 32, from: 0, to: 32 },
    group: { type: Exonum.String, size: 8, from: 32, to: 40 },
    seed: { type: Exonum.Uint64, size: 8, from: 40, to: 48 }
  }
});

const TxReceiveGroup = Exonum.newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_RECEIVE_GROUP,
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
  TxSendGroup,
  TxReceiveGroup
};