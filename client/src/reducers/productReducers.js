import {handleActions} from 'redux-actions';
import ExonumUtils from "../utils/ExonumUtils";
import TransactionUtils from "../utils/TransactionUtils";

const PRODUCT_PAGE_INITIAL_STATE = {
  error: false,
  group_id: '',
  history_hash: '',
  history_len: 0,
  name: '',
  owner_key: '',
  transferring: false,
  uid: '',
  history: []
};

export const product = handleActions({
  productByUid(state, { payload, error }) {
    if (error) {
      return { error, product: {} };
    }

    const historyMeta = ExonumUtils.unpackHistoryProof(payload.data, payload.history);
    const history = TransactionUtils.defineNames(payload.history.values.map((it, i) => ({ ...it, ...historyMeta[i] })));

    return { error: false, ...payload.data, history };
  }
}, PRODUCT_PAGE_INITIAL_STATE);

export default product;
