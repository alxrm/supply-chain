import { createActions } from 'redux-actions';
import DataApi from '../utils/DataApi';

export default createActions({
  ownerItemsByKey: DataApi.ownerItems
});