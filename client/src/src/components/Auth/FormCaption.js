import 'react';
import styled, {css} from 'styled-components';

const FormTitle = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 200;
  margin: 0 0 24px;
  color: #ccc;
  
  ${props => props.error && css`
    color: #ff6a5e
  `}
`;

export default FormTitle;