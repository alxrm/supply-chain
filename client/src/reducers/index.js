import {combineReducers} from 'redux';
import owner from './ownerReducers';
import productsList from './productsListReducers';
import auth from './authReducers';
import product from './productReducers';

export const reducers = combineReducers({
  owner, productsList, auth, product
});

export default reducers;