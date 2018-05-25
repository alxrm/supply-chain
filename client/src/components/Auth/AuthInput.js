import React from 'react';
import styled from 'styled-components';
import {FormControl} from 'react-bootstrap';
import {ACCENT_COLOR, ACCENT_DARK} from "../../constants/configs";

const AuthInput = styled(FormControl)`
  margin: 20px 0 4px !important;
  font-size: 18px;
  background-color: ${ACCENT_DARK} !important;
  border-bottom: 4px solid ${props => props.color || 'rgba(255, 255, 255, 0.3)'};
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
  padding-bottom: 8px !important;
  color: white !important;
  font-weight: bold;
  box-shadow: none !important;
  
  &:focus {
    border-color: white;
  }
  
  ::placeholder {
    color: rgba(255, 255, 255, 0.8) !important;
    font-weight: bold;
  }
`;

export default ({ onChange, ...rest }) =>
  <AuthInput
    onChange={e => onChange(e.target.id, e.target.value)}
    {...rest}
  />;