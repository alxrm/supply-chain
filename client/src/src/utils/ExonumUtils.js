import {keyPair, sign, verifySignature} from 'exonum-client';
import times from 'lodash.times';
import random from 'lodash.random';
import FileUtils from './FileUtils';

export const ExonumUtils = {
  generateKeyPair() {
    const pair = keyPair();
    FileUtils.saveAsJson(pair, 'BrandchainKeyPair.json');

    return pair;
  },

  validateKeyPair(publicKey, secretKey) {
    const randomBuffer = this.randomByteBufferOfSize();

    try {
      const signature = sign(secretKey, randomBuffer);
      return verifySignature(signature, publicKey, randomBuffer);
    } catch (e) {
      return false;
    }
  },

  randomByteBufferOfSize(size = 32) {
    return times(size, () => random(0, 127));
  }
};

export default ExonumUtils;