import {handleActions} from 'redux-actions';

export const AUTH_INITIAL_STATE = {
  isAuthorized: false,
  error: false,
  user: {
    name: '',
    publicKey: ''
  }
};

export const auth = handleActions({
  signup(state, { payload, error }) {
    if (error) {
      return { ...state, error };
    }

    return { ...state, error: false, user: payload };
  },

  login(state, { payload, error }) {
    if (error) {
      return { ...state, error };
    }

    return { ...payload, error: false };
  },

  changeFormField(state, { payload }) {
    const { user } = state;
    const { field, value } = payload;

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