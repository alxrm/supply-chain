import {handleActions} from 'redux-actions';

const PRODUCT_LIST_INITIAL_STATE = {
  error: false,
  products: {}
};

export const ownerProducts = handleActions({
  ownerProductsByKey(state, { payload, error }) {
    if (error) {
      return { error, products: {} };
    }

    return { error: false, products: payload };
  },

  transferringProducts(state, { payload, error }) {
    if (error) {
      return { error, products: {} };
    }

    return { error: false, products: payload };
  },
}, PRODUCT_LIST_INITIAL_STATE);

export default ownerProducts;
