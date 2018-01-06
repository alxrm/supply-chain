import {bindActionCreators} from 'redux';
import assignIn from 'lodash.assignin';

import ownerActions from './ownerActions';
import ownerItemsActions from './ownerItemsActions';
import authActions from './authActions';

export const actions = assignIn({}, ownerActions, ownerItemsActions, authActions);
export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default actions;