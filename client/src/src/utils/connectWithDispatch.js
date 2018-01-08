import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from '../actions';

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export const none = () => ({});

export default (mapStateToProps, options) => (
  connect(mapStateToProps, mapDispatchToProps, null, options)
);