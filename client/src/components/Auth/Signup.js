import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Fade} from "react-bootstrap";

import connectWithDispatch from '../../utils/connectWithDispatch';

import CenteringContainer from '../Layout/CenteringContainer';
import AuthForm from './AuthForm';
import FormTitle from './FormTitle';
import FormButton from './FormButton';
import FormCaption from './FormCaption';
import FormButtonContainer from './FormButtonContainer';
import {ACCENT_COLOR} from "../../constants/configs";
import Brand from "./Brand";
import BoldInput from "../Layout/BoldInput";

const renderNoKeysButtons = (signup, name) => (
  <FormButtonContainer>
    <FormButton
      onClick={() => signup(name)}
      color={ACCENT_COLOR}
      borderColor="#eee"
      fontSize="18px"
    >
      Создать ключи
    </FormButton>
    <LinkContainer to="/login">
      <FormButton
        color={ACCENT_COLOR}
        borderColor="#eee"
        fontSize="18px"
      >
        Вернуться к логину
      </FormButton>
    </LinkContainer>
  </FormButtonContainer>
);

const renderKeysReadyButtons = (login, publicKey, secretKey) => (
  <FormButtonContainer>
    <FormButton
      onClick={() => login(publicKey, secretKey)}
      color={ACCENT_COLOR}
      borderColor="#eee"
      fontSize="18px"
    >
      Войти
    </FormButton>
  </FormButtonContainer>
);

const renderKeysFields = (isKeyPairCreated, publicKey, secretKey) => {
  if (!isKeyPairCreated) {
    return <span />;
  }

  return (
    <div>
      <BoldInput
        type="text"
        value={publicKey}
        placeholder="Публичный ключ"
        readOnly
      />
      <BoldInput
        type="text"
        value={secretKey}
        placeholder="Секретный ключ"
        readOnly
      />
    </div>
  );
};

const renderErrorMessage = (name) => {
  if (!name) {
    return <span>Название компании обязательно</span>
  }

  return <span>На сервере возникла ошибка, попробуйте позже</span>
};

const renderSuccessMessage = () => (
  <span>Пожалуйста храните эти ключи в сохранности</span>
);

const Signup = ({ login, signup, error, name, publicKey, secretKey, changeFormField, isKeyPairCreated }) => (
  <CenteringContainer bgColor={ACCENT_COLOR}>
    <Brand>supply.ch</Brand>
    <AuthForm>
      <FormTitle>Регистрация</FormTitle>
      <Fade in={isKeyPairCreated || error}>
        <FormCaption success={isKeyPairCreated} error={error}>
          {error ? renderErrorMessage(name) : renderSuccessMessage()}
        </FormCaption>
      </Fade>
      <BoldInput
        type="text"
        id="name"
        value={name}
        placeholder="Название компании"
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