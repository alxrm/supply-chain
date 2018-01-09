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

const renderNoKeysButtons = (signup, name) => (
  <div>
    <FormButton onClick={() => signup(name)} primary>Generate keys</FormButton>
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

const renderKeysFields = (isKeyPairCreated, publicKey, secretKey) => {
  if (!isKeyPairCreated) {
    return <span />;
  }

  return (
    <div>
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
    </div>
  );
};


const Signup = ({ login, signup, error, name, publicKey, secretKey, changeFormField, isKeyPairCreated }) => (
  <CenteringContainer>
    <AuthForm>
      <FormTitle>Create new account</FormTitle>
      <Fade in={isKeyPairCreated || error}>
        <FormCaption success={isKeyPairCreated} error={error}>
          {error ? 'Name is required' : 'Please keep these keys safe'}
        </FormCaption>
      </Fade>
      <AuthInput
        type="text"
        id="name"
        value={name}
        placeholder="Name"
        onChange={changeFormField}
        autoFocus
      />
      {renderKeysFields(isKeyPairCreated, publicKey, secretKey)}
      {
        isKeyPairCreated
          ? renderKeysReadyButtons(login, publicKey, secretKey)
          : renderNoKeysButtons(signup, name)
      }
    </AuthForm>
  </CenteringContainer>
);

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  secretKey: state.auth.user.secretKey,
  name: state.auth.user.name,
  error: state.auth.error,
  isKeyPairCreated: !!(state.auth.user.publicKey && state.auth.user.secretKey)
}))(Signup);