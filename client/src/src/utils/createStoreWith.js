import {createStore} from 'redux';

export default (reducers, enhancer, transformer) => {
  const store = createStore(reducers, enhancer);
  transformer(store);
  return store;
};
