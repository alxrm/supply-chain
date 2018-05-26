import {keyPair, merkleProof, sign, verifySignature} from 'exonum-client';
import times from 'lodash.times';
import random from 'lodash.random';
import FileUtils from './FileUtils';
import {FILE_NAME_KEY_PAIR} from '../constants/configs';
import uuidv4 from "uuid/v4";
import {TransactionMetaData} from '../constants/transactions';

export const ExonumUtils = {
  generateKeyPair() {
    const pair = keyPair();
    FileUtils.downloadAsJson(pair, FILE_NAME_KEY_PAIR);

    return pair;
  },

  validateKeyPair(publicKey, secretKey) {
    const randomBuffer = this.randomByteBufferOfSize();
    const signature = sign(secretKey, randomBuffer);

    return verifySignature(signature, publicKey, randomBuffer);
  },

  // data, history
  unpackHistoryProof({ history_hash, history_len }, { proof }) {
    if (!history_hash) {
      return {};
    }

    return merkleProof(
      history_hash,
      parseInt(history_len, 10),
      proof,
      [0, parseInt(history_len, 10)],
      TransactionMetaData
    );
  },

  randomByteBufferOfSize(size = 32) {
    return times(size, () => random(0, 127));
  },

  generateGuid() {
    const uuid = uuidv4();
    return uuid.replace(/-/g, '');
  }
};

export default ExonumUtils;