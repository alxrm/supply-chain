import 'react';
import styled from 'styled-components';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

const AuthForm = styled.div`
  flex: auto;
  max-width: 480px;
  color: #cfcfcf;
  background-color: ${ACCENT_DARK};
  //border: 12px rgb(255,255,255, 1) solid;
  border-radius: 4px;
  padding: 56px 32px;
`;

export default AuthForm;