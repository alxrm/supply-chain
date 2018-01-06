import {handleActions} from 'redux-actions';

const owner = handleActions({
  ownerByKey(state, action) {
    return { data: {} };
  }
}, { data: {} });

export default owner;