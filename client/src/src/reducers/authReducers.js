import {handleActions} from 'redux-actions';

const initial = {
  isAuthorized: false,
  error: false,
  user: {
    publicKey: '',
    secretKey: ''
  }
};

export const auth = handleActions({

  changeFormField(state, action) {
    const { user } = state;
    const { field, value } = action.payload;

    return { ...state, error: false, user: { ...user, [field]: value } };
  },

  login(state, action) {
    const { isAuthorized, error } = action.payload;

    return { ...state, error, isAuthorized };
  },

  logout() {
    return initial;
  },

  signup(state, action) {
    if (!action.payload) {
      return state;
    }

    return { ...state, error: false, user: action.payload };
  }
}, initial);

export default auth;