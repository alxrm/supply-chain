import React from 'react';
import styled from 'styled-components';
import {FormControl} from 'react-bootstrap';

const AuthInput = styled(FormControl)`
  margin: 20px 0 4px !important;
  background-color: #202020 !important;
  border: 1px solid #333333 !important;
  color: #ccc !important;
`;

export default ({ onChange, ...rest }) =>
  <AuthInput
    onChange={e => onChange(e.target.id, e.target.value)}
    {...rest}
  />;