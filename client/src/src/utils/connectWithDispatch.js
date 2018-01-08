import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from '../actions';

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);
const none = () => ({});

export default (mapStateToProps) => (
  connect(mapStateToProps || none, mapDispatchToProps)
);