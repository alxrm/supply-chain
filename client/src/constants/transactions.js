import { newMessage, String, Uint64, PublicKey } from 'exonum-client';
import { SERVICE_ID } from './configs';

export const TX_CREATE_OWNER_ID = 128;
export const TX_ADD_PRODUCT_ID = 129;
export const TX_ATTACH_TO_GROUP_ID = 130;
export const TX_SEND_GROUP = 131;
export const TX_RECEIVE_GROUP = 132;

export const TxCreateOwner = newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_CREATE_OWNER_ID,
  fields: {
    pub_key: { type: PublicKey, size: 32, from: 0, to: 32 },
    name: { type: String, size: 8, from: 32, to: 40 },
    seed: { type: Uint64, size: 8, from: 40, to: 48 }
  }
});

export const TxAddProduct = newMessage({
  size: 56,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_ADD_PRODUCT_ID,
  fields: {
    owner: { type: PublicKey, size: 32, from: 0, to: 32 },
    product_uid: { type: String, size: 8, from: 32, to: 40 },
    name: { type: String, size: 8, from: 40, to: 48 },
    seed: { type: Uint64, size: 8, from: 48, to: 56 }
  }
});

export const TxAttachToGroup = newMessage({
  size: 56,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_ATTACH_TO_GROUP_ID,
  fields: {
    owner: { type: PublicKey, size: 32, from: 0, to: 32 },
    product_uid: { type: String, size: 8, from: 32, to: 40 },
    group: { type: String, size: 8, from: 40, to: 48 },
    seed: { type: Uint64, size: 8, from: 48, to: 56 }
  }
});

export const TxSendGroup = newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_SEND_GROUP,
  fields: {
    prev_owner: { type: PublicKey, size: 32, from: 0, to: 32 },
    group: { type: String, size: 8, from: 32, to: 40 },
    seed: { type: Uint64, size: 8, from: 40, to: 48 }
  }
});

export const TxReceiveGroup = newMessage({
  size: 48,
  network_id: 1,
  protocol_version: 1,
  service_id: SERVICE_ID,
  message_id: TX_RECEIVE_GROUP,
  fields: {
    next_owner: { type: PublicKey, size: 32, from: 0, to: 32 },
    group: { type: String, size: 8, from: 32, to: 40 },
    seed: { type: Uint64, size: 8, from: 40, to: 48 }
  }
});
