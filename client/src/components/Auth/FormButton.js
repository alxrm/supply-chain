import 'react';
import styled, {css} from 'styled-components';

const FormButton = styled.a`
  display: inline-block;
  border-radius: 4px;
  margin-right: 12px;
  padding: 4px 12px;
  background: ${props => props.color || 'transparent'};
  color: ${props => props.textColor || '#eeeeee'};
  border: 2px solid ${props => props.color || '#eeeeee'};
  cursor: pointer;
  text-align: center;
  transition: all .08s ease-in-out;
  
  &:hover {
    transform: translateY(-5%);
    background: ${props => props.color || 'transparent'};
    color: ${props => props.textColor || '#eeeeee'};
    border: 2px solid ${props => props.color || '#eeeeee'};
  }

  ${props => props.primary && css`
    background: #eeeeee;
    color: #202020;
    
    
    &:hover {
      background: #eeeeee;
      color: #202020;
    }
  `}
`;

export default FormButton;