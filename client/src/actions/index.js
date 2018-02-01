import assignIn from 'lodash.assignin';

import ownerActions from './ownerActions';
import ownerProductsActions from './ownerProductsActions';
import authActions from './authActions';

export default assignIn({}, ownerActions, ownerProductsActions, authActions);
