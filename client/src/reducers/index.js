import {combineReducers} from 'redux';
import owner from './ownerReducers';
import ownerProducts from './productsListReducers';
import auth from './authReducers';
import product from './productReducers';

export const reducers = combineReducers({
  owner, ownerProducts, auth, product
});

export default reducers;