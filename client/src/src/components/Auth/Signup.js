import React from 'react';
import {connect} from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap';

import {mapDispatchToProps} from '../../actions';

import CenteringContainer from '../Layout/CenteringContainer';
import AuthForm from './AuthForm';
import FormTitle from './FormTitle';
import AuthInput from './AuthInput';
import FormButton from './FormButton';
import FormCaption from './FormCaption';

const Signup = ({ signup, publicKey, secretKey }) => (
  <CenteringContainer bgColor="#2f2f2f">
    <AuthForm>
      <FormTitle>Create new account</FormTitle>
      {publicKey.length ? <FormCaption>Please keep these keys safe</FormCaption> : <span />}
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
      <FormButton onClick={signup} primary>Generate keys</FormButton>
      <LinkContainer to="/login">
        <FormButton>Back to login</FormButton>
      </LinkContainer>
    </AuthForm>
  </CenteringContainer>
);

export default connect(state => ({
  publicKey: state.auth.user.publicKey,
  secretKey: state.auth.user.secretKey
}), mapDispatchToProps)(Signup);