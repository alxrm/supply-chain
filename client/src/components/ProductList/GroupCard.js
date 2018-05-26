import React from 'react';
import {ACCENT_COLOR} from '../../constants/configs';
import styled, {css} from 'styled-components';
import {withRouter} from 'react-router-dom';

const GroupCard = withRouter(styled.div`
  width: 100%;
  background-color: rgb(2,119,189, 0.8);
  padding: 20px 30px 20px;
  margin: 12px 0 0;
  cursor: pointer;
  transition: transform .2s,box-shadow .2s;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.03),
    0 0 1px rgba(39,44,49,.09), 
    0 3px 16px rgba(39,44,49,.06);
    
    
  ${props => props.noGroup && css`
    background-color: rgba(2,119,189, 0.5);
    cursor: auto;
  `}
`);

const CheckboxContainer = styled.div`
  width: 56px;
  vertical-align: middle;
  display: table-cell;
`;

const Checkbox = styled.div`
  cursor: pointer;
  border-radius: 50%;
  border: ${props => props.checked ? `8px solid ${ACCENT_COLOR}` : '0 solid transparent'};
  width: 24px;
  height: 24px;
  background: ${props => props.checked ? 'white' : 'rgba(0, 0, 0, 0.2)'};
  transition: all .2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Info = styled.div`
  color: rgba(11, 31, 53, .95);
  letter-spacing: 0;
  display: table-cell;
  vertical-align: top;
  padding: 0;
  width: 100%;
`;

const Name = styled.h4`
  color: white;
  font-size: 24px;
  margin: 0;
  width: 100%;
`;

const Secondary = styled.div`
  color: white;
  font-size: 16px;
  margin-top: 14px;
`;

export default ({ uid, checked, onChecked }) => {
  const noGroup = uid === 'Unassigned to group';

  return (
    <GroupCard onClick={() => !noGroup && onChecked(uid, !checked)} noGroup={noGroup}>
      <Info>
        {noGroup && <div><Name>Не присвоены</Name></div>}
        {!noGroup &&
        <div>
          <Name>Партия товаров</Name>
          <Secondary>Идентификатор: {uid}</Secondary>
        </div>}
      </Info>
      {!noGroup &&
      <CheckboxContainer>
        <Checkbox checked={checked} onClick={e => {
          e.stopPropagation();
          onChecked(uid, !checked)
        }} />
      </CheckboxContainer>}
    </GroupCard>
  );
}