import assignIn from 'lodash.assignin';

import ownerActions from './ownerActions';
import ownerProductsActions from './ownerProductsActions';
import authActions from './authActions';
import productActions from './productActions';

export default assignIn({}, ownerActions, ownerProductsActions, authActions, productActions);
