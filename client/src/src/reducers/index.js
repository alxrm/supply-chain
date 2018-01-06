import {combineReducers} from 'redux';
import owner from './ownerReducers';
import ownerItems from './onwerItemsReducers';

export const reducers = combineReducers({
  owner, ownerItems
});

export default reducers;