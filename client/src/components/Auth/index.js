import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import styled from 'styled-components';
import {Fade} from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';

import CenteringContainer from '../Layout/CenteringContainer';
import AuthForm from './AuthForm';
import FormTitle from './FormTitle';
import AuthInput from './AuthInput';
import FormButton from './FormButton';
import FormCaption from './FormCaption';
import FormButtonContainer from './FormButtonContainer';
import {ACCENT_COLOR, ACCENT_DARK} from '../../constants/configs';

const Login = ({ login, logout, changeFormField, error, publicKey, secretKey }) => (
  <CenteringContainer bgColor={ACCENT_DARK}>
    <AuthForm>
      <FormTitle>Вход</FormTitle>
      <Fade in={error}>
        <FormCaption error>Invalid key pair provided</FormCaption>
      </Fade>
      <AuthInput
        type="text"
        id="publicKey"
        placeholder="Публичный ключ"
        onChange={changeFormField}
        value={publicKey}
      />
      <AuthInput
        type="text"
        id="secretKey"
        placeholder="Секретный ключ"
        onChange={changeFormField}
        value={secretKey}
      />
      <FormButtonContainer>
        <FormButton
          onClick={() => login(publicKey, secretKey)}
          color={ACCENT_DARK}
          fontSize="18px"
        >
          Войти
        </FormButton>
        <LinkContainer to="/signup">
          <FormButton
            onClick={logout}
            color={ACCENT_DARK}
            fontSize="18px"
          >
            Регистрация
          </FormButton>
        </LinkContainer>
      </FormButtonContainer>
    </AuthForm>
  </CenteringContainer>
);

export default connectWithDispatch(state => ({
  publicKey: state.auth.user.publicKey,
  secretKey: state.auth.user.secretKey,
  error: state.auth.error
}))(Login);