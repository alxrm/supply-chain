import {handleActions} from 'redux-actions';

const OWNER_PAGE_INITIAL_STATE = {
  error: false,
  name: '',
  transactionsCount: 0,
};


export const owner = handleActions({
  ownerByKey(state, { payload, error }) {
    if (error) {
      return { error, owner: {} };
    }

    const { name, history_len } = payload.data;

    return { error: false, name, transactionsCount: history_len };
  }

}, OWNER_PAGE_INITIAL_STATE);

export default owner;