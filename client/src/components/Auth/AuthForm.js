import 'react';
import styled from 'styled-components';
import {ACCENT_COLOR} from "../../constants/configs";

const AuthForm = styled.div`
  flex: auto;
  max-width: 480px;
  color: #cfcfcf;
  background-color: ${ACCENT_COLOR};
  border-radius: 4px;
  padding: 56px 32px;
`;

export default AuthForm;