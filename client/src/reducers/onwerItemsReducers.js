import {handleActions} from 'redux-actions';

export const ownerItems = handleActions({
  ownerItemsByKey(state, action) {
    return { data: {} };
  }
}, { data: {} });

export default ownerItems;