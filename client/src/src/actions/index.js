import {bindActionCreators} from 'redux';
import assignIn from 'lodash.assignin';

import ownerActions from './ownerActions';
import ownerItemsActions from './ownerItemsActions';

export const actions = assignIn({}, ownerActions, ownerItemsActions);
export const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default actions;