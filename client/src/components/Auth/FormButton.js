import 'react';
import styled, {css} from 'styled-components';

const FormButton = styled.a`
  display: inline-block;
  border-radius: 4px;
  margin-right: 12px;
  padding: 4px 12px;
  background: ${props => props.color || 'transparent'};
  color: ${props => props.textColor || '#eeeeee'} !important;
  border: 2px solid ${props => props.borderColor || props.color || '#eeeeee'};
  font-size: ${props => props.fontSize || '14px'};
  font-weight: ${props => props.fontWeight || '300'};
  cursor: pointer;
  text-align: center;
  text-decoration: none !important;
  transition: all .08s ease-in-out;
  
  &:hover {
    transform: translateY(-5%);
    background: ${props => props.color || 'transparent'};
    color: ${props => props.textColor || '#eeeeee'} !important;
    border: 2px solid ${props => props.borderColor || props.color || '#eeeeee'};
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