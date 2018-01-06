import 'react';
import styled, {css} from 'styled-components';

const FormButton = styled.a`
  display: inline-block;
  border-radius: 4px;
  margin-top: 20px;
  margin-right: 12px;
  padding: 4px 12px;
  background: transparent;
  color: #eeeeee;
  border: 2px solid #eeeeee;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    background-color: #2f2f2f;
    color: #efefef;
  }

  ${props => props.primary && css`
    background: #eeeeee;
    color: #202020;
    
    &:hover {
      background-color: #ccc;
      border-color: #ccc;
      color: #202020;
    }
  `}
`;

export default FormButton;