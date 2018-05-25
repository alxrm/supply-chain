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
import FormButtonContainer from './FormButtonContainer';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

const renderNoKeysButtons = (signup, name) => (
  <FormButtonContainer>
    <FormButton
      onClick={() => signup(name)}
      color={ACCENT_DARK}
      fontSize="18px"
    >
      Создать ключи
    </FormButton>
    <LinkContainer to="/login">
      <FormButton
        color={ACCENT_DARK}
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
      color={ACCENT_DARK}
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
      <AuthInput
        type="text"
        value={publicKey}
        placeholder="Публичный ключ"
        readOnly
      />
      <AuthInput
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
    return <span>Name is required</span>
  }

  return <span>Server error occurred</span>
};

const renderSuccessMessage = () => (
  <span>Please keep these keys safe</span>
);

const Signup = ({ login, signup, error, name, publicKey, secretKey, changeFormField, isKeyPairCreated }) => (
  <CenteringContainer bgColor={ACCENT_DARK}>
    <AuthForm>
      <FormTitle>Регистрация</FormTitle>
      <Fade in={isKeyPairCreated || error}>
        <FormCaption success={isKeyPairCreated} error={error}>
          {error ? renderErrorMessage(name) : renderSuccessMessage()}
        </FormCaption>
      </Fade>
      <AuthInput
        type="text"
        id="name"
        value={name}
        placeholder="Имя"
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