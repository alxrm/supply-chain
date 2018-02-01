import {combineReducers} from 'redux';
import owner from './ownerReducers';
import ownerProducts from './onwerProductsReducers';
import auth from './authReducers';

export const reducers = combineReducers({
  owner, ownerProducts, auth
});

export default reducers;