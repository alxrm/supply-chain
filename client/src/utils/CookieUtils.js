import Cookies from 'js-cookie';

export const CookieUtils = {
  has(key) {
    return !!Cookies.get(key);
  },

  remove(key) {
    Cookies.remove(key);
  },

  set(key, value) {
    Cookies.set(key, JSON.stringify(value));
  },

  get(key) {
    return JSON.parse(Cookies.get(key));
  }
};

export default CookieUtils;