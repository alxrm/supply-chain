import React from 'react';
import styled from 'styled-components';
import {FormControl} from 'react-bootstrap';
import {ACCENT_COLOR} from "../../constants/configs";

const BoldInput = styled(FormControl)`
  margin: 20px 0 4px !important;
  font-size: 18px;
  background-color: ${props => props.backgroundcolor || 'transparent'} !important;
  border-bottom: 4px solid ${props => props.bordercolor || 'rgba(255, 255, 255, 0.3)'};
  border-left: none;
  border-right: none;
  border-top: none;
  border-radius: 0;
  padding-bottom: 8px !important;
  color: ${props => props.textcolor || 'white'} !important;
  font-weight: bold;
  box-shadow: none !important;
  
  &:focus {
    border-color: ${props => props.textcolor || 'white'};
  }
  
  ::placeholder {
    color: ${props => props.placeholdercolor || 'rgba(255, 255, 255, 0.8)'} !important;
    font-weight: bold;
  }
`;

export default ({ onChange, ...rest }) =>
  <BoldInput
    onChange={e => onChange(e.target.id, e.target.value)}
    {...rest}
  />;