import {combineReducers} from 'redux';
import owner from './ownerReducers';
import ownerItems from './onwerItemsReducers';
import auth from './authReducers';

export const reducers = combineReducers({
  owner, ownerItems, auth
});

export default reducers;