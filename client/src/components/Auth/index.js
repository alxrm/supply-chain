import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Fade} from 'react-bootstrap';

import connectWithDispatch from '../../utils/connectWithDispatch';

import CenteringContainer from '../Layout/CenteringContainer';
import AuthForm from './AuthForm';
import FormTitle from './FormTitle';
import FormButton from './FormButton';
import FormCaption from './FormCaption';
import FormButtonContainer from './FormButtonContainer';
import {ACCENT_COLOR} from '../../constants/configs';
import Brand from "./Brand";
import BoldInput from "../Layout/BoldInput";


const Login = ({ login, logout, changeFormField, error, publicKey, secretKey }) => (
  <CenteringContainer bgColor={ACCENT_COLOR}>
    <Brand>supply.ch</Brand>
    <AuthForm>
      <FormTitle>Вход</FormTitle>
      <Fade in={error}>
        <FormCaption error>Неверная пара ключей</FormCaption>
      </Fade>
      <BoldInput
        type="text"
        id="publicKey"
        placeholder="Публичный ключ"
        onChange={changeFormField}
        value={publicKey}
      />
      <BoldInput
        type="text"
        id="secretKey"
        placeholder="Секретный ключ"
        onChange={changeFormField}
        value={secretKey}
      />
      <FormButtonContainer>
        <FormButton
          onClick={() => login(publicKey, secretKey)}
          color={ACCENT_COLOR}
          borderColor="#eee"
          fontSize="18px"
        >
          Войти
        </FormButton>
        <LinkContainer to="/signup">
          <FormButton
            onClick={logout}
            color={ACCENT_COLOR}
            borderColor="#eee"
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