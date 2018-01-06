import {handleActions} from 'redux-actions';

const ownerItems = handleActions({
  ownerItemsByKey(state, action) {
    return { data: {} };
  }
}, { data: {} });

export default ownerItems;