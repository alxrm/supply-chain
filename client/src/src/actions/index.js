import assignIn from 'lodash.assignin';

import ownerActions from './ownerActions';
import ownerItemsActions from './ownerItemsActions';
import authActions from './authActions';

export const actions = assignIn({}, ownerActions, ownerItemsActions, authActions);

export default actions;