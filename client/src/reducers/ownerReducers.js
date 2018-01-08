import {handleActions} from 'redux-actions';

export const owner = handleActions({
  ownerByKey(state, action) {
    return { data: {} };
  }
}, { data: {} });

export default owner;