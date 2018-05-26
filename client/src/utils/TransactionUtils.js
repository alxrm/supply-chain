import {
  TX_ADD_PRODUCT_ID, TX_ATTACH_TO_GROUP_ID, TX_NAMES, TX_RECEIVE_GROUP,
  TX_SEND_GROUP
} from '../constants/transactions';

export const TransactionUtils = {
  ownerOf(transaction) {
    const type = transaction.message_id;

    if (type === TX_ADD_PRODUCT_ID || type === TX_ATTACH_TO_GROUP_ID) {
      return transaction.body.owner;
    }

    if (type === TX_SEND_GROUP) {
      return transaction.body.prev_owner;
    }
    
    if (type === TX_RECEIVE_GROUP) {
      return transaction.body.next_owner;
    }
  },

  defineNames(transactions) {
    return transactions.map(it => ({ ...it, name: TX_NAMES[it.message_id] }));
  }
};

export default TransactionUtils;