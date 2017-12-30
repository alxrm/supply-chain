import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

ReactDOM.render(
  <Title>
    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  </Title>,
  document.getElementById('root'));

registerServiceWorker();
