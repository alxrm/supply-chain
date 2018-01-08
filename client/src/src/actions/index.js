import assignIn from 'lodash.assignin';

import ownerActions from './ownerActions';
import ownerItemsActions from './ownerItemsActions';
import authActions from './authActions';

export default assignIn({}, ownerActions, ownerItemsActions, authActions);
