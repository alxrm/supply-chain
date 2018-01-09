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

const Login = ({ login, logout, changeFormField, error, publicKey, secretKey }) => (
  <CenteringContainer>
    <AuthForm>
      <FormTitle>Login</FormTitle>
      <Fade in={error}>
        <FormCaption error>Invalid key pair provided</FormCaption>
      </Fade>
      <AuthInput
        type="text"
        id="publicKey"
        placeholder="Public key"
        onChange={changeFormField}
        value={publicKey}
      />
      <AuthInput
        type="text"
        id="secretKey"
        placeholder="Secret key"
        onChange={changeFormField}
        value={secretKey}
      />
      <FormButton onClick={() => login(publicKey, secretKey)} primary>Login</FormButton>
      <LinkContainer to="/signup">
        <FormButton onClick={logout}>Sign up</FormButton>
      </LinkContainer>
    </AuthForm>
  </CenteringContainer>
);

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  secretKey: state.auth.user.secretKey,
  error: state.auth.error
}))(Login);