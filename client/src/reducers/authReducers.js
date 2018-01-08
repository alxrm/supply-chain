import {handleActions} from 'redux-actions';

export const AUTH_INITIAL_STATE = {
  isAuthorized: false,
  error: false,
  user: {
    publicKey: '',
    secretKey: ''
  }
};

export const auth = handleActions({
  signup(state, action) {
    if (!action.payload) {
      return state;
    }

    return { ...state, error: false, user: action.payload };
  },

  login(state, action) {
    const { isAuthorized, error } = action.payload;

    return { ...state, error, isAuthorized };
  },

  changeLoginFormField(state, action) {
    const { user } = state;
    const { field, value } = action.payload;

    return { ...state, error: false, user: { ...user, [field]: value } };
  },

  restoreAuthSession(state, action) {
    return action.payload;
  },

  logout(state, action) {
    return action.payload;
  },

}, AUTH_INITIAL_STATE);

export default auth;