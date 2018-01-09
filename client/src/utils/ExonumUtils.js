import {keyPair, sign, verifySignature} from 'exonum-client';
import times from 'lodash.times';
import random from 'lodash.random';

import FileUtils from './FileUtils';
import { FILE_NAME_KEY_PAIR } from '../constants/configs';

export const ExonumUtils = {
  generateKeyPair() {
    const pair = keyPair();
    FileUtils.downloadAsJson(pair, FILE_NAME_KEY_PAIR);

    return pair;
  },

  validateKeyPair(publicKey, secretKey) {
    const randomBuffer = this.randomByteBufferOfSize();

    try {
      const signature = sign(secretKey, randomBuffer);
      return verifySignature(signature, publicKey, randomBuffer);
    } catch (e) {
      return e;
    }
  },

  randomByteBufferOfSize(size = 32) {
    return times(size, () => random(0, 127));
  }
};

export default ExonumUtils;