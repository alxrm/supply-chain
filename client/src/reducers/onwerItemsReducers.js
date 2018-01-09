import {handleActions} from 'redux-actions';

const ITEM_LIST_INITIAL_STATE = {
  error: false,
  items: {}
};

export const ownerItems = handleActions({
  ownerItemsByKey(state, { payload, error }) {
    if (error) {
      return { error, items: {} };
    }

    return { error: false, items: payload };
  }
}, ITEM_LIST_INITIAL_STATE);

export default ownerItems;
