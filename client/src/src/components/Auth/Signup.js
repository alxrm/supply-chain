import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Fade} from "react-bootstrap";

import connectWithDispatch from '../../utils/connectWithDispatch';

import CenteringContainer from '../Layout/CenteringContainer';
import AuthForm from './AuthForm';
import FormTitle from './FormTitle';
import AuthInput from './AuthInput';
import FormButton from './FormButton';
import FormCaption from './FormCaption';

const renderNoKeysButtons = signup => (
  <div>
    <FormButton onClick={signup} primary>Generate keys</FormButton>
    <LinkContainer to="/login">
      <FormButton>Back to login</FormButton>
    </LinkContainer>
  </div>
);

const renderKeysReadyButtons = (login, publicKey, secretKey) => (
  <div className="center-md">
    <FormButton onClick={() => login(publicKey, secretKey)} primary>Login</FormButton>
  </div>
);

const Signup = ({ login, signup, publicKey, secretKey, isKeyPairCreated }) => (
  <CenteringContainer>
    <AuthForm>
      <FormTitle>Create new account</FormTitle>
      <Fade in={isKeyPairCreated}>
        <FormCaption success>Please keep these keys safe</FormCaption>
      </Fade>
      <AuthInput
        type="text"
        value={publicKey}
        placeholder="Public key"
        readOnly
      />
      <AuthInput
        type="text"
        value={secretKey}
        placeholder="Secret key"
        readOnly
      />
      {
        isKeyPairCreated
          ? renderKeysReadyButtons(login, publicKey, secretKey)
          : renderNoKeysButtons(signup)
      }
    </AuthForm>
  </CenteringContainer>
);

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  secretKey: state.auth.user.secretKey,
  isKeyPairCreated: !!(state.auth.user.publicKey && state.auth.user.secretKey)
}))(Signup);