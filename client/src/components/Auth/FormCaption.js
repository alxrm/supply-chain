import 'react';
import styled, {css} from 'styled-components';

const FormTitle = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 200;
  margin: 0 0 24px;
  padding: 8px;
  border-radius: 8px;
  color: white;
  
  ${props => props.error && css`
    background-color: rgba(200, 0, 0, 0.8)
  `}
  
  ${props => props.success && css`
    background-color: rgba(0, 200, 78, 0.8)
  `}
`;

export default FormTitle;